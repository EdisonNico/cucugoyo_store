-- =====================================================================
-- Cucugoyo Store - Esquema, seguridad (RLS), Storage y Realtime
-- Ejecutar completo en Supabase > SQL Editor > New query > Run
-- =====================================================================

create extension if not exists pg_trgm;  -- búsqueda por nombre eficiente

-- ---------------------------------------------------------------------
-- 1. Administradores
-- ---------------------------------------------------------------------
create table public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- RLS activado y SIN políticas: nadie puede leer ni escribir esta tabla
-- desde la API. Solo se modifica desde el SQL Editor.
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;

-- Comprueba si quien hace la petición es administrador.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------
-- 2. Productos
-- ---------------------------------------------------------------------
create table public.products (
  id            uuid primary key default gen_random_uuid(),
  name          text not null
                  check (char_length(trim(name)) between 2 and 150),
  slug          text not null unique
                  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description   text not null default ''
                  check (char_length(description) <= 5000),
  category      text not null
                  check (category in ('carta', 'sellado')),
  price         numeric(10,2) not null
                  check (price >= 0 and price < 1000000),   -- soles (PEN)
  stock         integer not null default 0
                  check (stock >= 0),
  image_path    text,
  collection    text,
  language      text
                  check (language is null or language in
                    ('es','en','ja','ko','zh','fr','de','it','pt')),
  condition     text
                  check (condition is null or condition in
                    ('NM','LP','MP','HP','DMG')),
  rarity        text,
  card_number   text,
  product_type  text,
  contents      text,
  featured      boolean not null default false,
  published     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint card_fields_only_for_cards check (
    category = 'carta'
    or (condition is null and rarity is null and card_number is null)
  ),
  constraint pack_fields_only_for_sealed check (
    category = 'sellado'
    or (product_type is null and contents is null)
  )
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- 3. Índices
-- ---------------------------------------------------------------------
create index products_published_category_idx
  on public.products (published, category, created_at desc);
create index products_featured_idx
  on public.products (featured) where featured and published;
create index products_collection_idx on public.products (collection);
create index products_price_idx on public.products (price);
create index products_name_trgm_idx
  on public.products using gin (name gin_trgm_ops);
create index products_image_path_idx on public.products (image_path);

-- ---------------------------------------------------------------------
-- 4. Row Level Security de products
-- ---------------------------------------------------------------------
alter table public.products enable row level security;

revoke all on public.products from anon, authenticated;
grant select on public.products to anon;
grant select, insert, update, delete on public.products to authenticated;

-- Lectura: el público ve solo publicados; el admin ve todo (borradores incluidos)
create policy "products_select"
  on public.products for select
  to anon, authenticated
  using (published = true or public.is_admin());

-- Escritura: solo administradores
create policy "products_insert_admin"
  on public.products for insert
  to authenticated
  with check (public.is_admin());

create policy "products_update_admin"
  on public.products for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "products_delete_admin"
  on public.products for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------
-- 5. Storage: bucket de imágenes
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,                                   -- lectura pública por URL
  3145728,                                -- 3 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Solo administradores pueden listar, subir, reemplazar y borrar archivos
create policy "product_images_select_admin"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_insert_admin"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_update_admin"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_delete_admin"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- ---------------------------------------------------------------------
-- 6. Realtime: avisar a la tienda cuando cambian los productos.
--    Realtime respeta RLS: el público solo recibe eventos de productos publicados.
-- ---------------------------------------------------------------------
alter publication supabase_realtime add table public.products;
