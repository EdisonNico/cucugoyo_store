import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Solo se usa la clave PUBLICABLE. La seguridad real está en las políticas RLS de la base de datos.
export const isSupabaseConfigured = Boolean(url && key)

export const supabase = createClient(url || 'http://localhost:54321', key || 'missing-key', {
  auth: { persistSession: true, autoRefreshToken: true },
})
