-- Create watchlist table
create table public.watchlist (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  symbol text not null,
  type text check (type in ('crypto', 'stock')) not null,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create price_alerts table
create table public.price_alerts (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  symbol text not null,
  target_price decimal not null,
  direction text check (direction in ('above', 'below')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
