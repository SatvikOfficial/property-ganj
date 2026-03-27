import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role to check table schema
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRid3JiZW1ybWJ3Y2NnZGRjYmJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQ0NDA0NSwiZXhwIjoyMDc4MDIwMDQ1fQ.XDVWHuUgLIoR4OcTKhu2HrMVcrN-yHYxwuLVMJdEaJY';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function check() {
  const { data, error } = await supabase.from('likes').select('*').limit(1);
  console.log("Existing likes data:", data, "Error:", error);
  
  // Try finding a valid user and property
  const { data: props } = await supabase.from('properties').select('id').limit(1);
  const { data: users } = await supabase.auth.admin.listUsers();
  
  if (props && props.length && users && users.users.length) {
    const propertyId = props[0].id;
    const userId = users.users[0].id;
    
    // Now test with Anon key to see if RLS blocks it
    const anonSupabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    // Note: We can't easily fake a session without password, but we can see if the table requires auth
    
    // Insert with service role to see if constraints block it
    const { error: insErr } = await supabase.from('likes').insert({ property_id: propertyId, user_id: userId });
    console.log("Service Role Insert error:", insErr?.message || "Success");
  }
}
check();
