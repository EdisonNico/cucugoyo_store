# Cucugoyo Store

Tienda online de cartas Pokémon y productos sellados.
**React + Vite · Supabase (PostgreSQL, Auth, Storage, Realtime) · Render · un solo repositorio.**

- Tienda pública: `/`, `/cartas`, `/paquetes`, `/catalogo`, `/producto/:slug`
- Panel privado: `/admin/login` → `/admin/productos` (sin enlace público; se entra escribiendo la URL)
- Precios en soles (PEN). La compra se coordina por WhatsApp (botón con el producto ya escrito).

## Cómo funciona

```
Navegador (React) ──HTTPS──► Supabase: PostgreSQL + RLS · Auth · Storage · Realtime
        ▲
Render (sitio estático: solo sirve los archivos compilados)
```

No hay servidor propio: la seguridad está en **Row Level Security (RLS)** de la base de datos.
Los datos y las imágenes viven en Supabase, **no en Render**, así que sobreviven a cada despliegue.

---

## 1. Crear el proyecto en Supabase

1. Entra a <https://supabase.com> → **New project** (nombre `cucugoyo-store`, contraseña de base de datos fuerte guardada en tu gestor, región más cercana a Perú, por ejemplo São Paulo).
2. **SQL Editor → New query**: pega **todo** `supabase/001_schema.sql` y pulsa **Run**. Debe decir *Success*.
3. **Authentication → Sign In / Providers**: desactiva **Allow new users to sign up** (nadie debe poder registrarse). Deja activado *Email*.
4. **Authentication → Users → Add user → Create new user**: correo y contraseña del administrador, marca **Auto Confirm User**. Copia su **User UID**.
5. En el SQL Editor ejecuta (con tu UUID) lo de `supabase/002_make_admin.sql`.
6. *(Recomendado)* Ejecuta `supabase/003_tests.sql` por bloques: un visitante solo debe ver el producto publicado y no poder escribir.
7. **Project Settings → API**: copia la **Project URL** y la clave **publishable** (`sb_publishable_…`, o `anon` si es la que aparece).
   ⚠️ **Nunca uses ni copies la clave `secret` / `service_role`.**

## 2. Ejecutar en tu computadora

Requiere Node.js 18 o superior.

```bash
npm install
cp .env.example .env      # en Windows: copy .env.example .env
# edita .env con tu URL y tu clave publicable
npm run dev
```

Abre <http://localhost:5173>. El panel está en <http://localhost:5173/admin/login>.

## 3. Personalizar

- `src/config/store.js`: nombre, eslogan, **número de WhatsApp**, Instagram, teléfono.
- `public/logo.png`: tu logo (cuadrado). `public/hero.jpg`: la imagen grande de portada.
  Si no existen, se muestra un reemplazo automático.
- `src/styles/global.css`: colores (variables al inicio) y estilos.
- `src/pages/Terms.jsx`: tus términos y condiciones.

## 4. Subir a GitHub

```bash
git init
git add .
git status          # comprueba que NO aparezca ".env"
git commit -m "Cucugoyo Store"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/cucugoyo-store.git
git push -u origin main
```

`.env` ya está en `.gitignore`. Solo se sube `.env.example` (sin secretos).

## 5. Publicar en Render

1. <https://render.com> → **New → Static Site** → conecta el repositorio.
   (Alternativa: **New → Blueprint**, que lee `render.yaml`.)
2. Configuración:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
3. **Environment**: agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`.
4. **Redirects/Rewrites** (si no usaste el Blueprint): *Source* `/*` → *Destination* `/index.html` → *Action* **Rewrite**.
   Sin esto, entrar directo a `/cartas` o `/admin/login` da error 404.
5. Despliega. Si luego cambias las variables, haz **Manual Deploy → Clear build cache & deploy** (Vite las incrusta al compilar).

## 6. Comprobar que todo funciona

1. Entra a `/admin/login` con el administrador → crea un producto **publicado** con imagen.
2. Abre la tienda en otra pestaña: debe aparecer **sin recargar** (Realtime).
3. Edita precio/stock y despublica: la tienda se actualiza sola.
4. Elimina el producto: desaparece y su imagen se borra de Storage (solo si ningún otro producto la usa).
5. Haz un nuevo despliegue en Render: los productos e imágenes siguen ahí.

## Seguridad

- El navegador solo usa la clave **publicable**; el acceso real lo controlan las políticas RLS.
- Ser administrador = estar en la tabla `admin_users` (la API no puede escribirla; solo el SQL Editor).
  `is_admin()` se usa en las políticas de `products` y de Storage.
- Visitantes: solo leen productos `published = true`. No pueden insertar, editar ni borrar.
- Imágenes: bucket público para **leer**; solo administradores pueden subir/reemplazar/borrar. Solo JPG/PNG/WebP, máx. 3 MB (validado en la app y en el bucket).
- Registro público de usuarios desactivado (paso 1.3).
- Si algún día necesitas pagos en línea, correos o lógica con secretos, impleméntalo en una **Edge Function de Supabase**, nunca en el navegador.

## Problemas habituales

| Síntoma | Causa / solución |
|---|---|
| Pantalla «Falta configurar Supabase» | Falta `.env` (local) o las variables en Render; reinicia/redepliega. |
| 404 al recargar `/cartas` o `/admin/login` | Falta el rewrite `/*` → `/index.html` en Render. |
| Login correcto pero «Sin autorización» | El usuario no está en `admin_users` (paso 1.5). |
| Error `new row violates row-level security` al guardar | Sesión de un usuario que no es admin, o falta ejecutar `001_schema.sql`. |
| La imagen no se sube | Formato distinto de JPG/PNG/WebP o más de 3 MB; o falta el bucket `product-images`. |
| No se actualiza en vivo | Ejecuta la última línea de `001_schema.sql` (`alter publication supabase_realtime …`) o activa Realtime para `products` en Database → Replication. |
| `relation already exists` al repetir el SQL | Ya se ejecutó antes; no lo repitas. |

## Estructura

```
src/
  config/store.js        datos de la tienda
  lib/                   supabase.js · realtime.js (canal único) · format.js
  services/              productService · imageService · validation
  hooks/                 useAuth · useProducts · useDebounce
  components/            Navbar, Footer, ProductCard, ProductCarousel, ProtectedRoute…
  pages/                 Home, Catalog, ProductDetail, Terms, NotFound
  pages/admin/           Login, Products, ProductForm, AdminLayout
  styles/global.css
supabase/                001_schema.sql · 002_make_admin.sql · 003_tests.sql
render.yaml              configuración de Render (con rewrite SPA)
```
