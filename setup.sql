begin;

-- ------------------------------------------------------------
-- Drop old policies first
-- ------------------------------------------------------------

drop policy if exists "org members can read lists" on public.lists;
drop policy if exists "org members can create lists" on public.lists;
drop policy if exists "org members can update lists" on public.lists;
drop policy if exists "org admins can delete lists" on public.lists;

drop policy if exists "org members can read items" on public.items;
drop policy if exists "org members can create items" on public.items;
drop policy if exists "org members can update items" on public.items;
drop policy if exists "org members can delete items" on public.items;

drop policy if exists "users can read own quick adds" on public.quick_add_items;
drop policy if exists "users can create own quick adds" on public.quick_add_items;
drop policy if exists "users can update own quick adds" on public.quick_add_items;
drop policy if exists "users can delete own quick adds" on public.quick_add_items;

-- ------------------------------------------------------------
-- Drop old tables
-- ------------------------------------------------------------

drop table if exists public.items cascade;
drop table if exists public.quick_add_items cascade;
drop table if exists public.lists cascade;

-- ------------------------------------------------------------
-- Drop old helper functions
-- ------------------------------------------------------------

drop function if exists public.debug_clerk_claims();
drop function if exists public.can_edit_current_org();
drop function if exists public.current_org_role();
drop function if exists public.current_org_id();
drop function if exists public.current_user_id();
drop function if exists public.is_current_org_admin();

-- ------------------------------------------------------------
-- Create tables
-- ------------------------------------------------------------

create table public.lists (
  id uuid primary key default gen_random_uuid(),

  -- Clerk organization id, for example: org_...
  org_id text not null,

  title text not null check (char_length(title) between 1 and 80),

  -- Clerk user id, for example: user_...
  created_by text not null default (auth.jwt()->>'sub'),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Needed so items can enforce that list_id + org_id match the same list
  unique (id, org_id)
);

create table public.items (
  id uuid primary key default gen_random_uuid(),

  list_id uuid not null,
  org_id text not null,

  name text not null check (char_length(name) between 1 and 50),
  name_key text not null,

  quantity int not null check (quantity >= 1 and quantity <= 99),

  category text not null check (
    category in (
      'produce',
      'dairy',
      'bakery',
      'meat',
      'frozen foods',
      'canned goods',
      'dry goods',
      'beverages',
      'snacks',
      'household',
      'other',
      'deli',
      'pharmacy',
      'bath and body'
    )
  ),

  note text not null default '' check (char_length(note) <= 120),
  completed boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Important:
  -- This prevents an item from claiming one org_id while pointing to a list from another org.
  foreign key (list_id, org_id)
    references public.lists (id, org_id)
    on delete cascade,

  unique (list_id, name_key)
);

create table public.quick_add_items (
  id uuid primary key default gen_random_uuid(),

  -- Quick adds are personal, not org-shared.
  user_id text not null default (auth.jwt()->>'sub'),

  name text not null check (char_length(name) between 1 and 50),
  name_key text not null,

  quantity int not null check (quantity >= 1 and quantity <= 99),

  category text not null check (
    category in (
      'produce',
      'dairy',
      'bakery',
      'meat',
      'frozen foods',
      'canned goods',
      'dry goods',
      'beverages',
      'snacks',
      'household',
      'other',
      'deli',
      'pharmacy',
      'bath and body'
    )
  ),

  note text not null default '' check (char_length(note) <= 120),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (user_id, name_key)
);

-- ------------------------------------------------------------
-- Helpful indexes
-- ------------------------------------------------------------

create index lists_org_id_idx
on public.lists (org_id);

create index items_org_id_idx
on public.items (org_id);

create index items_list_id_idx
on public.items (list_id);

create index items_list_id_category_name_idx
on public.items (list_id, category, name);

create index quick_add_items_user_id_idx
on public.quick_add_items (user_id);

create index quick_add_items_user_id_category_name_idx
on public.quick_add_items (user_id, category, name);

-- ------------------------------------------------------------
-- Enable RLS
-- ------------------------------------------------------------

alter table public.lists enable row level security;
alter table public.items enable row level security;
alter table public.quick_add_items enable row level security;

-- ------------------------------------------------------------
-- Clerk/Supabase helper functions
--
-- Clerk's native Supabase integration can expose organization claims
-- through the compact "o" claim:
--
-- auth.jwt()->'o'->>'id'  = org id
-- auth.jwt()->'o'->>'rol' = role, usually "admin" or "member"
--
-- These functions also support the older-looking top-level shapes
-- just in case.
-- ------------------------------------------------------------

create or replace function public.current_user_id()
returns text
language sql
stable
as $$
  select auth.jwt()->>'sub'
$$;

create or replace function public.current_org_id()
returns text
language sql
stable
as $$
  select coalesce(
    auth.jwt()->>'org_id',
    auth.jwt()->'o'->>'id'
  )
$$;

create or replace function public.current_org_role()
returns text
language sql
stable
as $$
  select coalesce(
    auth.jwt()->>'org_role',
    auth.jwt()->'o'->>'rol'
  )
$$;

create or replace function public.can_edit_current_org()
returns boolean
language sql
stable
as $$
  select public.current_org_role() in (
    'org:admin',
    'org:member',
    'admin',
    'member'
  )
$$;

create or replace function public.is_current_org_admin()
returns boolean
language sql
stable
as $$
  select public.current_org_role() in (
    'org:admin',
    'admin'
  )
$$;

-- ------------------------------------------------------------
-- Lock down anon; allow authenticated role to attempt CRUD.
-- RLS still decides which rows are visible/editable.
-- ------------------------------------------------------------

revoke all privileges
on public.lists,
   public.items,
   public.quick_add_items
from anon;

revoke all privileges
on public.lists,
   public.items,
   public.quick_add_items
from authenticated;

grant usage on schema public to authenticated;

grant select, insert, update, delete
on public.lists,
   public.items,
   public.quick_add_items
to authenticated;

grant execute on function public.current_user_id() to authenticated;
grant execute on function public.current_org_id() to authenticated;
grant execute on function public.current_org_role() to authenticated;
grant execute on function public.can_edit_current_org() to authenticated;
grant execute on function public.is_current_org_admin() to authenticated;

-- ------------------------------------------------------------
-- RLS policies: lists
-- ------------------------------------------------------------

create policy "org members can read lists"
on public.lists
for select
to authenticated
using (
  org_id = public.current_org_id()
);

create policy "org members can create lists"
on public.lists
for insert
to authenticated
with check (
  org_id = public.current_org_id()
  and public.can_edit_current_org()
);

create policy "org members can update lists"
on public.lists
for update
to authenticated
using (
  org_id = public.current_org_id()
  and public.can_edit_current_org()
)
with check (
  org_id = public.current_org_id()
  and public.can_edit_current_org()
);

create policy "org admins can delete lists"
on public.lists
for delete
to authenticated
using (
  org_id = public.current_org_id()
  and public.is_current_org_admin()
);

-- ------------------------------------------------------------
-- RLS policies: items
-- ------------------------------------------------------------

create policy "org members can read items"
on public.items
for select
to authenticated
using (
  org_id = public.current_org_id()
);

create policy "org members can create items"
on public.items
for insert
to authenticated
with check (
  org_id = public.current_org_id()
  and public.can_edit_current_org()
);

create policy "org members can update items"
on public.items
for update
to authenticated
using (
  org_id = public.current_org_id()
  and public.can_edit_current_org()
)
with check (
  org_id = public.current_org_id()
  and public.can_edit_current_org()
);

create policy "org members can delete items"
on public.items
for delete
to authenticated
using (
  org_id = public.current_org_id()
  and public.can_edit_current_org()
);

-- ------------------------------------------------------------
-- RLS policies: quick adds
-- ------------------------------------------------------------

create policy "users can read own quick adds"
on public.quick_add_items
for select
to authenticated
using (
  user_id = public.current_user_id()
);

create policy "users can create own quick adds"
on public.quick_add_items
for insert
to authenticated
with check (
  user_id = public.current_user_id()
);

create policy "users can update own quick adds"
on public.quick_add_items
for update
to authenticated
using (
  user_id = public.current_user_id()
)
with check (
  user_id = public.current_user_id()
);

create policy "users can delete own quick adds"
on public.quick_add_items
for delete
to authenticated
using (
  user_id = public.current_user_id()
);

commit;