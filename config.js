console.log("🔵 Chargement config.js");


const SUPABASE_URL = "https://gsnrrrupbjfgdlbghyuy.supabase.co";


const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzbnJycnVwYmpmZ2RsYmdoeXV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NDYzODksImV4cCI6MjEwMDEyMjM4OX0.fN6Ue2NP0fXP53pUCBGTEjhFHqacEJGGwD1EmvDHA24".trim();



window.supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


console.log("✅ Supabase connecté");
