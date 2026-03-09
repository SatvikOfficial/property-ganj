-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Enums
create type user_role as enum ('admin', 'promoter', 'pga');
create type unit_status as enum ('available', 'soft_block', 'hard_block', 'sold');

-- Create Profiles Table (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  role user_role default 'pga',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Cities Table
create table cities (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  state text not null,
  image_url text, /* For city card on homepage */
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Areas Table
create table areas (
  id uuid default uuid_generate_v4() primary key,
  city_id uuid references cities(id) on delete cascade not null,
  name text not null,
  pincode text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Projects Table
create table projects (
  id uuid default uuid_generate_v4() primary key,
  city_id uuid references cities(id) on delete cascade not null,
  area_id uuid references areas(id) on delete set null,
  name text not null,
  description text,
  address text,
  builder_name text,
  rera_number text,
  image_url text, /* Main project image */
  status text default 'Under Construction',
  promoter_id uuid references profiles(id) on delete set null, /* Assigned promoter */
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Towers Table
create table towers (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  name text not null, /* e.g., "Tower A" */
  total_floors int not null,
  units_per_floor int not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Units Table
create table units (
  id uuid default uuid_generate_v4() primary key,
  tower_id uuid references towers(id) on delete cascade not null,
  project_id uuid references projects(id) on delete cascade not null, /* Denormalized for easier query */
  unit_number text not null, /* e.g., "101" */
  floor_number int not null,
  type text not null, /* e.g., "2BHK", "3BHK" */
  size_sqft int not null,
  price numeric not null,
  status unit_status default 'available',
  
  -- Soft Block Info
  soft_blocked_by uuid references profiles(id) on delete set null,
  soft_block_expiry timestamp with time zone,
  
  -- Hard Block / Sold Info
  hard_blocked_by uuid references profiles(id) on delete set null,
  sold_to_customer_name text,
  sold_at timestamp with time zone,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Block Logs Table (Audit Trail)
create table block_logs (
  id uuid default uuid_generate_v4() primary key,
  unit_id uuid references units(id) on delete cascade not null,
  action_by uuid references profiles(id) on delete set null,
  previous_status unit_status,
  new_status unit_status,
  remarks text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Advertisements Table
create table advertisements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  image_url text not null,
  redirect_url text,
  phone_number text,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  is_active boolean default true,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)

-- Profiles: Everyone can read basic info, only Admin can update roles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Cities/Areas/Projects/Towers: Readable by all, Modifiable by Admin
alter table cities enable row level security;
create policy "Cities viewable by everyone" on cities for select using (true);
create policy "Cities updates by admin" on cities for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

alter table areas enable row level security;
create policy "Areas viewable by everyone" on areas for select using (true);
create policy "Areas updates by admin" on areas for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

alter table projects enable row level security;
create policy "Projects viewable by everyone" on projects for select using (true);
create policy "Projects updates by admin" on projects for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

alter table towers enable row level security;
create policy "Towers viewable by everyone" on towers for select using (true);
create policy "Towers updates by admin" on towers for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Units: 
-- Read: Everyone
-- Update: 
--   Admin: All updates
--   Promoter: Update units in assigned projects
--   PGA: Only update status to 'soft_block' if currently 'available'
alter table units enable row level security;
create policy "Units viewable by everyone" on units for select using (true);

create policy "Admin can update all units" on units for update using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

create policy "Promoter can update assigned project units" on units for update using (
    exists (
        select 1 from projects 
        join profiles on projects.promoter_id = profiles.id
        where projects.id = units.project_id and profiles.id = auth.uid()
    )
);

create policy "PGA can soft block available units" on units for update using (
    exists (select 1 from profiles where id = auth.uid() and role in ('pga', 'admin', 'promoter'))
    and status = 'available'
);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'pga');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for performance
create index idx_units_status on units(status);
create index idx_units_project on units(project_id);
create index idx_projects_city on projects(city_id);
create index idx_profiles_role on profiles(role);
