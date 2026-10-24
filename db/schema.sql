-- Roger library: use cases, the raw posts they come from, watches, and leads.
create table if not exists use_cases (
  id text primary key,
  title text not null,
  summary text not null,
  category text not null,
  persona text not null default 'everyone',
  for_ text not null check (for_ in ('home', 'work')),
  tool text not null default '',
  handle text not null,
  author text not null default '',
  url text not null unique,
  source text not null default 'seed',
  outcome text check (outcome in ('win', 'honest-miss')),
  featured boolean not null default false,
  posted_at timestamptz,
  week_of date not null default current_date,
  created_at timestamptz not null default now(),
  search tsvector generated always as (to_tsvector('english', title || ' ' || summary || ' ' || tool || ' ' || category)) stored
);
create index if not exists use_cases_search on use_cases using gin (search);
create index if not exists use_cases_created on use_cases (created_at desc);
create index if not exists use_cases_category on use_cases (category);

create table if not exists raw_posts (
  source text not null,
  external_id text not null,
  url text not null,
  author text not null default '',
  handle text not null default '',
  text text not null,
  posted_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'error')),
  reason text,
  fetched_at timestamptz not null default now(),
  primary key (source, external_id)
);
create index if not exists raw_posts_status on raw_posts (status);

create table if not exists watches (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  query text not null,
  token text not null unique,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  last_checked_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists watches_active on watches (confirmed_at) where unsubscribed_at is null;

create table if not exists watch_hits (
  watch_id uuid not null references watches (id) on delete cascade,
  use_case_id text not null references use_cases (id) on delete cascade,
  sent_at timestamptz not null default now(),
  primary key (watch_id, use_case_id)
);

create table if not exists leads (
  id bigserial primary key,
  email text not null,
  kind text not null,          -- 'pack' (got a starter pack) or 'interest' (asked for a coming-soon persona)
  persona text not null,
  utm text not null default '',
  created_at timestamptz not null default now(),
  unique (email, kind, persona)
);

create table if not exists ingest_runs (
  id bigserial primary key,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  fetched int not null default 0,
  accepted int not null default 0,
  notes text not null default ''
);

create table if not exists settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- API keys Peter pastes into /admin. Encrypted with ADMIN_SECRET; a Vercel env var of the same name wins.
create table if not exists secrets (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- One row per post in the Lomax sheet. The sheet is the source of truth; this
-- tracks what Roger has done with each row so the hourly sync only rewrites
-- what's new or changed. state: pending (needs the AI rewrite), live (in
-- use_cases), excluded (tag or tab not for the library), hidden (deleted in
-- /admin, so not re-added), error (rewrite failed; retried next run).
create table if not exists sheet_posts (
  post_id text primary key,
  url text not null,
  tab text not null default '',
  category text,
  tag text not null default '',
  handle text not null default '',
  agent text not null default '',
  summary text not null default '',
  posted_at timestamptz,
  likes int,
  views int,
  reposts int,
  used_in_post text not null default '',
  state text not null default 'pending' check (state in ('pending', 'live', 'excluded', 'hidden', 'error')),
  use_case_id text,
  error text,
  first_seen timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists sheet_posts_state on sheet_posts (state);
