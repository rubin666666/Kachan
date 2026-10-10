-- Run once in your Supabase project's SQL Editor.
create table if not exists public.kachan_snapshots (
 user_id uuid primary key references auth.users(id) on delete cascade,
 revision bigint not null default 1,
 payload jsonb not null check (octet_length(payload::text)<=5242880),
 updated_at timestamptz not null default now()
);
create table if not exists public.kachan_history (
 user_id uuid not null references auth.users(id) on delete cascade,
 revision bigint not null,
 payload jsonb not null check (octet_length(payload::text)<=5242880),
 updated_at timestamptz not null default now(),
 primary key(user_id,revision)
);
alter table public.kachan_snapshots enable row level security;
alter table public.kachan_history enable row level security;
drop policy if exists owner_read on public.kachan_snapshots;
create policy owner_read on public.kachan_snapshots for select to authenticated using ((select auth.uid())=user_id);
drop policy if exists owner_read on public.kachan_history;
create policy owner_read on public.kachan_history for select to authenticated using ((select auth.uid())=user_id);
-- Direct writes are blocked. The RPC enforces revision checking and owner identity.
revoke all on public.kachan_snapshots,public.kachan_history from anon,authenticated;
grant select on public.kachan_snapshots,public.kachan_history to authenticated;
create or replace function public.kachan_save(p_expected bigint,p_payload jsonb)
returns bigint language plpgsql security definer set search_path='' as $$
declare owner_id uuid:=auth.uid(); current_revision bigint; next_revision bigint;
begin
 if owner_id is null then raise exception 'Authentication required'; end if;
 if p_payload->>'app' is distinct from 'Kachan' or p_payload->>'version' is distinct from '7' or jsonb_typeof(p_payload->'data') is distinct from 'object' or octet_length(p_payload::text)>5242880 then raise exception 'Invalid payload'; end if;
 perform pg_advisory_xact_lock(hashtextextended(owner_id::text,0));
 select revision into current_revision from public.kachan_snapshots where user_id=owner_id;
 if coalesce(current_revision,0)<>p_expected or p_expected is null then raise exception 'KACHAN_CONFLICT'; end if;
 next_revision:=coalesce(current_revision,0)+1;
 insert into public.kachan_snapshots(user_id,revision,payload,updated_at) values(owner_id,next_revision,p_payload,now())
 on conflict(user_id) do update set revision=excluded.revision,payload=excluded.payload,updated_at=excluded.updated_at;
 insert into public.kachan_history(user_id,revision,payload) values(owner_id,next_revision,p_payload);
 delete from public.kachan_history where user_id=owner_id and revision<=next_revision-10;
 return next_revision;
end;$$;
revoke all on function public.kachan_save(bigint,jsonb) from public,anon;
grant execute on function public.kachan_save(bigint,jsonb) to authenticated;

notify pgrst, 'reload schema';
