-- Create Builders Table
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
  headquarters jsonb, -- { city, state, address }
  contact_email text,
  contact_phone text,
  website text,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Builders
alter table builders enable row level security;
create policy "Builders viewable by everyone" on builders for select using (true);
create policy "Builders updates by admin" on builders for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- Update Projects Table to match Mongoose Schema
alter table projects add column if not exists builder_id uuid references builders(id) on delete set null;
alter table projects add column if not exists rera_id text;
alter table projects add column if not exists category text; -- Apartment, Villa, Plot, Commercial
alter table projects add column if not exists min_price numeric;
alter table projects add column if not exists max_price numeric;
alter table projects add column if not exists total_units int;
alter table projects add column if not exists cover_image text;
alter table projects add column if not exists gallery text[];
alter table projects add column if not exists amenities text[];
alter table projects add column if not exists possession_date text;
alter table projects add column if not exists location jsonb; -- { locality, city, latitude, longitude }

-- Add indexes
create index if not exists idx_projects_builder_id on projects(builder_id);
create index if not exists idx_projects_status on projects(status);
create index if not exists idx_projects_min_price on projects(min_price);
