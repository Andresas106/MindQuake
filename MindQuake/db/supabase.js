import { createClient } from '@supabase/supabase-js';

// Reemplaza con tu URL y clave anónima de Supabase
const SUPABASE_URL = 'https://qrlyeyxtbivvoaugzxvk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFybHlleXh0Yml2dm9hdWd6eHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMTQxNjEsImV4cCI6MjA1ODY5MDE2MX0.OkpJKuLJeUz4Qs4k8vEJW8vJEQakkFLBrbvI-WeASo0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
