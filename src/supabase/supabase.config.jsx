import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY;

// ✅ Configuración más robusta
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
});

// ✅ Función para verificar la conexión
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('_test').select('*').limit(1);
    if (error && error.message.includes('does not exist')) {
      console.log('✅ Supabase conectado (error esperado para tabla _test)');
      return true;
    }
    console.log('✅ Supabase conectado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión Supabase:', error);
    return false;
  }
};