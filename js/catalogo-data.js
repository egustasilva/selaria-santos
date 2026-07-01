/**
 * Camada de leitura do catálogo (usada por home + página de catálogo).
 * Só leitura — RLS garante que escrita exige login.
 */
import { supabase } from './supabase-client.js';

export async function fetchCategorias() {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .order('ordem', { ascending: true });
  if (error) throw error;
  return data;
}

export async function fetchProdutos(categoriaId) {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('categoria_id', categoriaId)
    .order('ordem', { ascending: true });
  if (error) throw error;
  return data;
}
