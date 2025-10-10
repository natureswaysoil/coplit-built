-- Creates coupon_signups table for durable storage of coupon email signups
create table if not exists public.coupon_signups (
  id bigserial primary key,
  email text not null unique,
  coupon_code text not null,
  source text default 'coupon-form',
  created_at timestamptz not null default now()
);

create index if not exists coupon_signups_created_at_idx on public.coupon_signups (created_at desc);

-- Enable RLS with permissive placeholder policies; tighten as needed
alter table public.coupon_signups enable row level security;
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'coupon_signups' and policyname = 'allow_service_role_insert'
  ) then
    create policy allow_service_role_insert on public.coupon_signups for insert to authenticated, service_role using (true) with check (true);
  end if;
end $$;
