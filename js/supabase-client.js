/**
 * Inicializa o client Supabase usando a lib vendorizada (js/vendor/supabase.umd.js,
 * carregada via <script> clássico antes deste módulo). Sem CDN em runtime.
 * Exporta `supabase` (ou null se ainda não configurado) e `isConfigured()`.
 */
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

const lib = typeof window !== 'undefined' ? window.supabase : null; // global da UMD

const configured =
  !!lib &&
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.startsWith('COLE_AQUI') &&
  !SUPABASE_ANON_KEY.startsWith('COLE_AQUI');

export const supabase = configured ? lib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
export const isConfigured = () => supabase !== null;
