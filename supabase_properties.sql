-- Create Properties Table for Individual Listings
create table properties (
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
  images text[], -- PostgreSQL array of text for image URLs
  is_featured boolean default false,
  status text default 'published',
  listed_by uuid references profiles(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  unit_id uuid references units(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Properties
alter table properties enable row level security;

create policy "Properties viewable by everyone" on properties for select using (true);

create policy "Users can insert their own properties" on properties for insert with check (
   auth.uid() = listed_by
);

create policy "Users can update their own properties" on properties for update using (
   auth.uid() = listed_by
);

create policy "Users can delete their own properties" on properties for delete using (
   auth.uid() = listed_by
);

-- Likes Table
create table likes (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references profiles(id) on delete cascade not null,
    property_id uuid references properties(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, property_id)
);

alter table likes enable row level security;
create policy "Users can manage their likes" on likes for all using (auth.uid() = user_id);
create policy "Everyone can view likes" on likes for select using (true);

-- Update Profiles with Agent Fields
alter table profiles add column if not exists specialization text;
alter table profiles add column if not exists experience int;
alter table profiles add column if not exists photo_url text;
alter table profiles add column if not exists bio text;
alter table profiles add column if not exists location text;
alter table profiles add column if not exists phone text;

-- Allow users to update their own profile details
create policy "Users can update own profile details" on profiles for update using (auth.uid() = id);
