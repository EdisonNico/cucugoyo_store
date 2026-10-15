-- Registrar al administrador inicial.
-- 1) Crea el usuario en Supabase > Authentication > Users > Add user (Auto Confirm User).
-- 2) Copia su "User UID" y reemplázalo abajo.
-- 3) Ejecuta esto en el SQL Editor.

insert into public.admin_users (user_id)
values ('PEGA-AQUI-EL-UUID-DEL-USUARIO');

-- Para quitar a un administrador:
-- delete from public.admin_users where user_id = 'UUID';
