-- FIX SCRIPT FOR ERROR 42703 (Missing ID column in foreign key)
-- Run this to insure all parent tables have 'id' and correct references.

-- 1. Ensure projects table exists and has ID
create table if not exists projects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Safely add ID if missing (unlikely but possible if schema drifted)
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'projects' and column_name = 'id') then
    alter table projects add column id uuid default uuid_generate_v4() primary key;
  end if;
end $$;

-- 2. Ensure units table exists and has ID
create table if not exists units (
  id uuid default uuid_generate_v4() primary key,
  unit_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'units' and column_name = 'id') then
    alter table units add column id uuid default uuid_generate_v4() primary key;
  end if;
end $$;

-- 3. Ensure profiles references auth.users correctly
-- Note: 'auth.users' is a system table. We reference its 'id' column.
alter table profiles 
  drop constraint if exists profiles_id_fkey;

alter table profiles
  add constraint profiles_id_fkey 
  foreign key (id) 
  references auth.users(id) 
  on delete cascade;

-- 4. Re-run properties creation safely
-- We drop constraints if they exist to re-create them robustly
alter table properties drop constraint if exists properties_project_id_fkey;
alter table properties drop constraint if exists properties_unit_id_fkey;
alter table properties drop constraint if exists properties_listed_by_fkey;

alter table properties
  add constraint properties_project_id_fkey
  foreign key (project_id) references projects(id) on delete set null;

alter table properties
  add constraint properties_unit_id_fkey
  foreign key (unit_id) references units(id) on delete set null;

alter table properties
  add constraint properties_listed_by_fkey
  foreign key (listed_by) references profiles(id) on delete cascade;

