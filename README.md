# Cucugoyo-Store

> Tienda web de **cartas Pokémon y productos sellados** desarrollada con **React JSX + Vite** y **Supabase**, con catálogo público, panel administrativo privado y actualización en tiempo real.

![React](https://img.shields.io/badge/React-JSX-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript)
![CSS](https://img.shields.io/badge/CSS-3-1572B6?logo=css3)
![React Router](https://img.shields.io/badge/React_Router-DOM-CA4245?logo=react-router)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase)
![Render](https://img.shields.io/badge/Render-Deploy-46E3B7?logo=render)
![Git](https://img.shields.io/badge/Git-F05032?logo=git)
![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github)

---

## Sobre el proyecto

**Cucugoyo-Store** es una tienda online para coleccionistas de Pokémon TCG.
Permite mostrar cartas individuales y productos sellados (sobres, booster boxes, Elite Trainer Boxes y colecciones), con precios en soles peruanos (PEN).

Los productos se administran desde un panel privado: al crear, editar o eliminar un producto, la tienda se actualiza sola, sin modificar el código ni volver a desplegar.

---

## Funcionalidades principales

### Tienda pública

* Portada con carruseles de productos destacados, cartas y paquetes sellados.
* Catálogo de cartas, paquetes sellados y catálogo general.
* Buscador por nombre en la barra superior.
* Filtros por categoría, colección y rango de precio, con ordenamiento.
* Página de detalle de cada producto.
* Botón de consulta por WhatsApp con el producto ya escrito en el mensaje.
* Botón flotante de WhatsApp y enlace a Instagram.
* Indicador de disponibilidad (disponible, pocas unidades, agotado).
* Estados de carga, mensajes de error y avisos cuando no hay resultados.
* Diseño responsive para computadora, tablet y celular.

### Panel administrativo (`/admin/login`)

* Inicio y cierre de sesión con autenticación real.
* Lista de todos los productos, incluidos los borradores.
* Crear y editar productos.
* Publicar y despublicar.
* Eliminar con confirmación.
* Cambiar precio y stock.
* Subir y reemplazar imágenes (JPG, PNG o WebP, máximo 3 MB).
* Búsqueda por nombre y filtro por categoría.
* Mensajes de éxito y error.

### Seguridad y tiempo real

* Row Level Security (RLS) en la base de datos: los visitantes solo leen productos publicados.
* Solo los administradores registrados pueden crear, editar o eliminar productos e imágenes.
* Registro público de usuarios desactivado.
* El navegador usa únicamente la clave publicable de Supabase.
* Actualizaciones en tiempo real con Supabase Realtime y recuperación tras desconexión.

---

## Estructura del proyecto

```txt
cucugoyo-store/
├── public/
│   ├── logo.png
│   └── hero.jpg
├── src/
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── Icons.jsx
│   │   ├── Logo.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductCarousel.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── PublicLayout.jsx
│   │   ├── States.jsx
│   │   └── WhatsAppFloat.jsx
│   │
│   ├── config/
│   │   └── store.js
│   │
│   ├── hooks/
│   │   ├── useAuth.jsx
│   │   ├── useDebounce.js
│   │   └── useProducts.js
│   │
│   ├── lib/
│   │   ├── format.js
│   │   ├── realtime.js
│   │   └── supabase.js
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   └── Products.jsx
│   │   ├── Catalog.jsx
│   │   ├── Home.jsx
│   │   ├── NotFound.jsx
│   │   ├── ProductDetail.jsx
│   │   └── Terms.jsx
│   │
│   ├── services/
│   │   ├── imageService.js
│   │   ├── productService.js
│   │   └── validation.js
│   │
│   ├── styles/
│   │   └── global.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── supabase/
│   ├── 001_schema.sql
│   ├── 002_make_admin.sql
│   └── 003_tests.sql
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── render.yaml
└── vite.config.js
```

---

## Tecnologías utilizadas

| Tecnología               | Uso                                          |
| ------------------------ | -------------------------------------------- |
| **React JSX**            | Construcción de interfaces                   |
| **Vite**                 | Creación y ejecución rápida del proyecto     |
| **JavaScript**           | Lógica del frontend                          |
| **CSS**                  | Estilos personalizados y diseño responsive   |
| **React Router DOM**     | Navegación entre páginas y rutas protegidas  |
| **Supabase PostgreSQL**  | Base de datos de productos                   |
| **Supabase Auth**        | Inicio de sesión del administrador           |
| **Supabase Storage**     | Almacenamiento de imágenes                   |
| **Supabase Realtime**    | Actualización automática del catálogo        |
| **Render**               | Publicación del sitio                        |
| **Git / GitHub**         | Control de versiones y repositorio remoto    |

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/cucugoyo-store.git
cd cucugoyo-store
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar las variables de entorno

Crea un archivo `.env` en la raíz (puedes basarte en `.env.example`):

```e
