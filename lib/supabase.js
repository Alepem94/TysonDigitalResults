import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let client;
if (!supabaseUrl || !supabaseKey) {
  console.warn('Faltan variables de entorno de Supabase. Usando mock en memoria para permitir compilación')
  const createMockChain = () => {
    const chain = {
      select: () => chain,
      eq: () => chain,
      lte: () => chain,
      gte: () => chain,
      or: () => chain,
      order: () => chain,
      limit: () => chain,
      single: async () => ({ data: null }),
      upsert: () => chain,
      delete: () => chain,
      then: (resolve) => resolve({ data: [] })
    };
    return chain;
  };

  client = {
    from: () => createMockChain()
  }
} else {
  client = createClient(supabaseUrl, supabaseKey)
}

export const supabase = client
