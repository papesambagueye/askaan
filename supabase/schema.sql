create type public.user_role as enum ('user', 'admin', 'super_admin');
create type public.campaign_status as enum ('pending', 'published', 'rejected', 'paused');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  first_name text not null default '',
  last_name text not null default '',
  phone text not null default '',
  whatsapp boolean not null default false,
  contact_email text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now()
);
create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  title text not null check (char_length(title) between 5 and 140),
  description text not null check (char_length(description) between 20 and 10000),
  category text not null,
  goal_cfa bigint not null check (goal_cfa > 0),
  image_url text,
  payment_url text not null,
  status public.campaign_status not null default 'pending',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.donations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  donor_id uuid references public.profiles(id) on delete set null,
  amount_cfa bigint not null check (amount_cfa > 0),
  payment_reference text unique,
  status text not null default 'confirmed' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);
create table public.campaign_updates (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete restrict,
  title text not null check (char_length(title) between 3 and 120),
  body text not null check (char_length(body) between 10 and 5000),
  created_at timestamptz not null default now()
);
create index campaigns_status_idx on public.campaigns(status, created_at desc);
create index donations_campaign_idx on public.donations(campaign_id, status);
create index campaign_updates_idx on public.campaign_updates(campaign_id, created_at desc);

create or replace view public.campaign_public_stats as
select c.id as campaign_id,
  coalesce(sum(d.amount_cfa) filter (where d.status = 'confirmed'), 0)::bigint as raised_cfa,
  count(distinct coalesce(d.donor_id::text, d.id::text)) filter (where d.status = 'confirmed')::integer as supporters
from public.campaigns c left join public.donations d on d.campaign_id = c.id
where c.status = 'published' group by c.id;

create or replace function public.is_admin() returns boolean language sql security definer set search_path = public as $$ select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'super_admin')); $$;
create or replace function public.is_super_admin() returns boolean language sql security definer set search_path = public as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'super_admin'); $$;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles (id, full_name, role) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), case when not exists (select 1 from public.profiles) then 'super_admin'::public.user_role else 'user'::public.user_role end); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.donations enable row level security;
alter table public.campaign_updates enable row level security;
create policy "public can read published campaigns" on public.campaigns for select using (status = 'published' or owner_id = auth.uid() or public.is_admin());
create policy "users create own campaigns" on public.campaigns for insert with check (owner_id = auth.uid());
create policy "owners update pending campaigns" on public.campaigns for update using (owner_id = auth.uid() and status = 'pending') with check (owner_id = auth.uid());
create policy "admins manage campaigns" on public.campaigns for all using (public.is_admin()) with check (public.is_admin());
create policy "users read own profile" on public.profiles for select using (id = auth.uid() or public.is_admin());
grant select on public.profiles to authenticated;
grant select on public.campaigns to anon, authenticated;
grant insert, update, delete on public.campaigns to authenticated;
grant select, insert on public.donations to authenticated;
grant select on public.campaign_updates to anon, authenticated;
create policy "admins read donations" on public.donations for select using (public.is_admin() or donor_id = auth.uid());
create policy "authenticated create donations" on public.donations for insert with check (auth.uid() is not null and (donor_id = auth.uid() or donor_id is null));
create policy "public can read published updates" on public.campaign_updates for select using (exists (select 1 from public.campaigns where id = campaign_id and status = 'published'));
create policy "admins manage campaign updates" on public.campaign_updates for all using (public.is_admin()) with check (public.is_admin());
grant select on public.campaign_public_stats to anon, authenticated;

insert into storage.buckets (id, name, public) values ('campaign-images', 'campaign-images', true) on conflict (id) do nothing;
create policy "campaign images are public" on storage.objects for select using (bucket_id = 'campaign-images');
create policy "authenticated upload campaign images" on storage.objects for insert to authenticated with check (bucket_id = 'campaign-images');

-- Execute once after creating your own account, replacing the email:
-- update public.profiles set role = 'super_admin' where id = (select id from auth.users where email = 'admin@example.com');

-- Migration for an existing database:
-- alter table public.profiles add column if not exists first_name text not null default '';
-- alter table public.profiles add column if not exists last_name text not null default '';
-- alter table public.profiles add column if not exists phone text not null default '';
-- alter table public.profiles add column if not exists whatsapp boolean not null default false;
-- alter table public.profiles add column if not exists contact_email text;
