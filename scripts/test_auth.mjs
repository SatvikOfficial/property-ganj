import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  console.log("Testing sign up...");
  const { data, error } = await supabase.auth.signUp({
    email: `propertyganjtest${Date.now()}@gmail.com`,
    password: 'StrongPassword123!',
    options: { data: { full_name: 'Test Seed', phone: '9999999999', role: 'builder' } }
  });
  
  if (error) {
    console.error("Sign up failed:", error.message);
  } else {
    console.log("Sign up succeeded! Session active?", !!data.session);
    
    // Test inserting profile
    if (data.user) {
      console.log("Attempting to insert profile...");
      const { error: profileErr } = await supabase.from('profiles').upsert({
        user_id: data.user.id,
        full_name: 'Test Seed',
        role: 'builder'
      });
      if (profileErr) console.error("Profile insert failed:", profileErr.message)
      else console.log("Profile insert succeeded!");
      
      console.log("Attempting to insert property...");
      const { error: propErr } = await supabase.from('properties').insert([{
        title: "Test Prop",
        owner_user_id: data.user.id,
        price: 1000,
        for_sale: true,
        for_rent: false
      }]);
      if (propErr) console.error("Property insert failed:", propErr.message)
      else console.log("Property insert succeeded!");
    }
  }
}

test();
