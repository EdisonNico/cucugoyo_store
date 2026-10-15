import { Navigate, Route, Routes } from 'react-router-dom'
import { isSupabaseConfigured } from './lib/supabase'
import PublicLayout from './components/PublicLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'
import AdminLayout from './pages/admin/AdminLayout'
import Login from './pages/admin/Login'
import AdminProducts from './pages/admin/Products'
import ProductForm from './pages/admin/ProductForm'

export default function App() {
  if (!isSupabaseConfigured) {
    return (
      <div className="page center">
        <h1>Falta configurar Supabase</h1>
        <p>
          Crea el archivo <code>.env</code> (basado en <code>.env.example</code>) con VITE_SUPABASE_URL y
          VITE_SUPABASE_PUBLISHABLE_KEY, y reinicia el servidor. En Render, agrégalas en Environment.
        </p>
      </div>
    )
  }

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="cartas" element={<Catalog category="carta" />} />
        <Route path="paquetes" element={<Catalog category="sellado" />} />
        <Route path="catalogo" element={<Catalog />} />
        <Route path="producto/:slug" element={<ProductDetail />} />
        <Route path="terminos" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="admin/login" element={<Login />} />
      <Route path="admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="productos" replace />} />
          <Route path="productos" element={<AdminProducts />} />
          <Route path="productos/nuevo" element={<ProductForm />} />
          <Route path="productos/:id" element={<ProductForm />} />
        </Route>
      </Route>
    </Routes>
  )
}
