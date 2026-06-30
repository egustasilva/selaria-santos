/**
 * Inicializa o client Supabase (via CDN ESM — sem build).
 * Exporta `supabase` (ou null se ainda não configurado) e `isConfigured()`.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

const configured =
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.startsWith('COLE_AQUI') &&
  !SUPABASE_ANON_KEY.startsWith('COLE_AQUI');

export const supabase = configured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
export const isConfigured = () => supabase !== null;
