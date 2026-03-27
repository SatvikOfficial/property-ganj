import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRid3JiZW1ybWJ3Y2NnZGRjYmJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQ0NDA0NSwiZXhwIjoyMDc4MDIwMDQ1fQ.XDVWHuUgLIoR4OcTKhu2HrMVcrN-yHYxwuLVMJdEaJY';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function check() {
  const { data: props } = await supabase.from('properties').select('id, owner_user_id').limit(10);
  console.log("Properties:", props);
  if (props && props.length) {
    const ownerIds = props.map(p => p.owner_user_id).filter(Boolean);
    console.log("Owner IDs:", ownerIds);
    if (ownerIds.length) {
       const { data: profiles } = await supabase.from('profiles').select('user_id, role, full_name').in('user_id', ownerIds);
       console.log("Matching Profiles:", profiles);
    }
  }
}
check();
