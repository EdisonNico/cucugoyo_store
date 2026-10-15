-- Pruebas de seguridad (ejecutar después de 001). Cada bloque se ejecuta por separado.

-- A) Datos de prueba
insert into public.products (name, slug, category, price, stock, published)
values
  ('Prueba publicada', 'prueba-publicada', 'carta', 25.00, 3, true),
  ('Prueba borrador',  'prueba-borrador',  'sellado', 100.00, 1, false);

-- B) Un visitante solo debe ver "Prueba publicada"
begin;
set local role anon;
select name, published from public.products;
rollback;

-- C) Un visitante NO debe poder escribir (debe dar "permission denied")
begin;
set local role anon;
insert into public.products (name, slug, category, price) values ('Hack', 'hack', 'carta', 1);
rollback;

-- D) Limpiar
delete from public.products where slug in ('prueba-publicada', 'prueba-borrador');
