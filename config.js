const SUPABASE_URL = "https://gsnrrrupbjfgdlbghyuy.supabase.co";

const SUPABASE_KEY = "Tsb_publishable_NbYNMTN7qdT7vQWGc2oUAA_CpF1Hl-0";

window.supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("✅ Supabase connecté");
