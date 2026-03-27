import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRid3JiZW1ybWJ3Y2NnZGRjYmJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQ0NDA0NSwiZXhwIjoyMDc4MDIwMDQ1fQ.XDVWHuUgLIoR4OcTKhu2HrMVcrN-yHYxwuLVMJdEaJY';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
  console.log("Searching for kplmdgl@gmail.com via paginated listUsers...");
  let page = 1;
  let hasNext = true;
  let targetUser = null;
  
  while (hasNext) {
    const { data: users, error } = await supabase.auth.admin.listUsers({ page, perPage: 50 });
    if (error) {
      console.error("Error listing users:", error.message);
      break;
    }
    
    if (users && users.users && users.users.length > 0) {
      targetUser = users.users.find(u => u.email === 'kplmdgl@gmail.com');
      if (targetUser) break;
      page++;
    } else {
      hasNext = false;
    }
  }

  if (targetUser) {
    console.log(`Found kplmdgl@gmail.com user ID: ${targetUser.id}`);
    const { error: upsertErr } = await supabase.from('profiles').upsert({
      user_id: targetUser.id,
      email: 'kplmdgl@gmail.com',
      role: 'admin',
      full_name: 'PropertyGanj Admin'
    });
    
    if (upsertErr) console.error("Error upserting profile:", upsertErr);
    else console.log("Profile successfully upserted and promoted to Admin!");
  } else {
    console.log("Could not find kplmdgl@gmail.com in ANY page of auth.users!");
  }

  console.log("Deleting old manual test listings...");
  // We'll delete any property that doesn't have a '#' in its title since the seed script adds '#index'
  const { data: propsToDelete, error: selErr } = await supabase.from('properties').select('id, title').not('title', 'like', '%#%');
  
  if (selErr) {
    console.error("Failed to select properties:", selErr);
  } else if (propsToDelete && propsToDelete.length > 0) {
    console.log(`Found ${propsToDelete.length} un-seeded properties. Deleting...`);
    const ids = propsToDelete.map(p => p.id);
    const { error: delErr } = await supabase.from('properties').delete().in('id', ids);
    if (delErr) console.error("Failed to delete properties:", delErr);
    else console.log("Successfully deleted old test listings!");
  } else {
    console.log("No test listings found to delete.");
  }
}

run();
