
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase values missing in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing connection to Supabase...');
    try {
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Connection failed or table "profiles" missing:', error.message);
            if (error.code === 'PGRST204') {
                console.error('Hint: Did you run the supabase_schema.sql in your Supabase SQL Editor?');
            }
        } else {
            console.log('Connection successful! "profiles" table exists.');
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
