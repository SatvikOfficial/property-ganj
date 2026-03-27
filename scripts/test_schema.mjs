import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data, error } = await supabase.from('properties').select('*').limit(3).order('created_at', { ascending: false });
  if (data && data.length > 0) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log("No data or error:", error);
  }
}

test();
