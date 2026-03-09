-- Database Indexing for Performance
-- Run this in Supabase SQL Editor

-- Index for Properties filtering
create index if not exists idx_properties_status on properties(status);
create index if not exists idx_properties_locality on properties(locality);
create index if not exists idx_properties_city on properties(city);
create index if not exists idx_properties_price on properties(price);
create index if not exists idx_properties_bedrooms on properties(bedrooms);
create index if not exists idx_properties_created_at on properties(created_at);

-- Compound index for locality searches (often queried together)
create index if not exists idx_properties_locality_status_price on properties(locality, status, price);

-- Full text search index for title/description if needed (using gin)
-- create extension if not exists pg_trgm;
-- create index if not exists idx_properties_title_trgm on properties using gin (title gin_trgm_ops);

-- Index for Projects
create index if not exists idx_projects_location_locality on projects((location->>'locality'));

-- Index for Lead Attribution
-- Assuming leads table exists or will be created? 
-- If not, let's create a basic leads table structure here just in case user needs it or for future reference
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

create index if not exists idx_leads_target_id on leads(target_id);
