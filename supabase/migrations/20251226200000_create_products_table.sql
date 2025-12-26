-- Create the products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  category text not null,
  price numeric not null,
  description text not null,
  images text[] default array[]::text[],
  user_id uuid references auth.users not null
);

-- Enable RLS
alter table public.products enable row level security;

-- Policies
create policy "Public products are viewable by everyone."
  on public.products for select
  using ( true );

create policy "Users can insert their own products."
  on public.products for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own products."
  on public.products for update
  using ( auth.uid() = user_id );

-- Storage bucket creation is not handled by migrations strictly speaking usually, 
-- but we can try to insert into storage schema if we have permissions, 
-- usually better to do via dashboard or specific storage creation scripts.
-- We will stick to the table creation here.
