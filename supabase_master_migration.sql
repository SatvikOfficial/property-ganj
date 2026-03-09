-- MASTER MIGRATION SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR TO FIX ALL MISSING TABLE ERRORS

-- 1. Enable Extensions
create extension if not exists "uuid-ossp";

-- 2. Create Enums
do $$ begin
    create type user_role as enum ('admin', 'promoter', 'pga');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type unit_status as enum ('available', 'soft_block', 'hard_block', 'sold');
exception
    when duplicate_object then null;
end $$;

-- 3. Create Tables
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  role user_role default 'pga',
  specialization text,
  experience int,
  photo_url text,
  bio text,
  location text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists cities (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  state text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists areas (
  id uuid default uuid_generate_v4() primary key,
  city_id uuid references cities(id) on delete cascade not null,
  name text not null,
  pincode text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists builders (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  rera_id text,
  logo_url text,
  description text,
  established_year int,
  total_projects int default 0,
  ongoing_projects int default 0,
  completed_projects int default 0,
  headquarters jsonb,
  contact_email text,
  contact_phone text,
  website text,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists projects (
  id uuid default uuid_generate_v4() primary key,
  city_id uuid references cities(id) on delete set null, -- changed strictly cascade to set null for flexibility
  area_id uuid references areas(id) on delete set null,
  builder_id uuid references builders(id) on delete set null,
  name text not null,
  description text,
  address text,
  rera_number text, -- legacy field, prefer rera_id in cleanup
  rera_id text,
  image_url text,
  cover_image text,
  status text default 'Under Construction',
  category text,
  min_price numeric,
  max_price numeric,
  total_units int,
  gallery text[],
  amenities text[],
  possession_date text,
  location jsonb,
  promoter_id uuid references profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists towers (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  name text not null,
  total_floors int not null,
  units_per_floor int not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists units (
  id uuid default uuid_generate_v4() primary key,
  tower_id uuid references towers(id) on delete cascade not null,
  project_id uuid references projects(id) on delete cascade not null,
  unit_number text not null,
  floor_number int not null,
  type text not null,
  size_sqft int not null,
  price numeric not null,
  status unit_status default 'available',
  soft_blocked_by uuid references profiles(id) on delete set null,
  soft_block_expiry timestamp with time zone,
  hard_blocked_by uuid references profiles(id) on delete set null,
  sold_to_customer_name text,
  sold_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists properties (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  purpose text not null check (purpose in ('sale', 'rent')),
  property_type text not null,
  owner_type text,
  price numeric not null,
  city text,
  locality text,
  address text,
  bedrooms int,
  bathrooms int,
  carpet_area int,
  built_up_area int,
  area_unit text,
  images text[],
  is_featured boolean default false,
  status text default 'published',
  listed_by uuid references profiles(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  unit_id uuid references units(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists likes (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references profiles(id) on delete cascade not null,
    property_id uuid references properties(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, property_id)
);

create table if not exists leads (
  id uuid default uuid_generate_v4() primary key,
  name text,
  phone text,
  email text,
  type text,
  target_id text,
  target_name text,
  referrer text,
  source_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable RLS (Idempotent)
alter table profiles enable row level security;
alter table cities enable row level security;
alter table areas enable row level security;
alter table projects enable row level security;
alter table towers enable row level security;
alter table units enable row level security;
alter table builders enable row level security;
alter table properties enable row level security;
alter table likes enable row level security;
alter table leads enable row level security;

-- 5. Policies (Drop first to avoid errors if exist, or use DO block)
-- Simple "True" policies for dev speed
create policy "Public view all" on profiles for select using (true);
create policy "Public view cities" on cities for select using (true);
create policy "Public view areas" on areas for select using (true);
create policy "Public view projects" on projects for select using (true);
create policy "Public view towers" on towers for select using (true);
create policy "Public view units" on units for select using (true);
create policy "Public view builders" on builders for select using (true);
create policy "Public view properties" on properties for select using (true);
create policy "Public view likes" on likes for select using (true);

-- Insert allow policies
create policy "Auth update own profile" on profiles for update using (auth.uid() = id);
create policy "Admin manage projects" on projects for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admin manage builders" on builders for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Users manage own properties" on properties for all using (auth.uid() = listed_by);
create policy "Users manage own likes" on likes for all using (auth.uid() = user_id);
create policy "Public insert leads" on leads for insert with check (true);

-- 6. Indexes
create index if not exists idx_properties_status on properties(status);
create index if not exists idx_properties_locality on properties(locality);
create index if not exists idx_projects_builder_id on projects(builder_id);
