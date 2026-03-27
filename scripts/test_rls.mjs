import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  console.log("Testing insert into properties...");
  const { error } = await supabase.from('properties').insert([{
    title: "Test Property RLS",
    price: 1000,
    for_sale: true,
    for_rent: false
  }]);
  
  if (error) {
    console.error("Insert failed (RLS probably required):", error.message);
  } else {
    console.log("Insert succeeded anonymously!");
  }
}

test();
