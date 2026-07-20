{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 /* =====================================================\
   CONFIGURATION SUPABASE\
   Les 50 ans de Papa\
===================================================== */\
\
\
/*\
    Remplace ces deux valeurs\
    par celles de ton projet Supabase\
*/\
\
\
const SUPABASE_URL = "TON_URL_SUPABASE";\
\
\
const SUPABASE_KEY = "TA_CLE_ANON_PUBLIQUE";\
\
\
\
\
\
/*\
    Cr\'e9ation du client Supabase\
\
    Cette variable sera utilis\'e9e\
    dans script.js\
\
*/\
\
\
const supabaseClient =\
supabase.createClient(\
    SUPABASE_URL,\
    SUPABASE_KEY\
);\
\
\
\
\
\
console.log(\
"\uc0\u9989  Supabase connect\'e9"\
);}