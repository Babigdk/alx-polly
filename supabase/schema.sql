-- Enable required extensions
create extension if not exists pgcrypto;

-- Helper: validate options jsonb (array of 2-10 non-empty strings, len > 2)
create or replace function public.validate_poll_options(opts jsonb)
returns boolean
language sql
immutable
as $$
  select 


  
    jsonb_typeof($1) = 'array'
    and jsonb_array_length($1) between 2 and 10
    and not exists (
      select 1
      from jsonb_array_elements_text($1) as e(elem)
      where length(btrim(elem, ' ')) <= 2
    );
$$;

-- POLLS TABLE
create table if not exists public.polls (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references auth.users(id) on delete cascade,
	question text not null check (char_length(question) between 5 and 280),
	options jsonb not null,
	created_at timestamp with time zone not null default now(),
	constraint options_valid check (public.validate_poll_options(options))
);

-- VOTES TABLE
create table if not exists public.votes (
	id uuid primary key default gen_random_uuid(),
	poll_id uuid not null references public.polls(id) on delete cascade,
	user_id uuid not null references auth.users(id) on delete cascade,
	option_index integer not null check (option_index >= 0),
	created_at timestamp with time zone not null default now(),
	constraint one_vote_per_user unique (poll_id, user_id)
);

-- Row Level Security
alter table public.polls enable row level security;
alter table public.votes enable row level security;

-- POLICIES FOR POLLS (conditional creation)
-- Only the owner can select/insert/update/delete their polls
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_policy p
		JOIN pg_class c ON c.oid = p.polrelid
		JOIN pg_namespace n ON n.oid = c.relnamespace
		WHERE n.nspname = 'public' AND c.relname = 'polls' AND p.polname = 'select own polls'
	) THEN
		CREATE POLICY "select own polls"
			ON public.polls
			FOR SELECT
			TO authenticated
			USING (user_id = auth.uid());
	END IF;
END
$$;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_policy p
		JOIN pg_class c ON c.oid = p.polrelid
		JOIN pg_namespace n ON n.oid = c.relnamespace
		WHERE n.nspname = 'public' AND c.relname = 'polls' AND p.polname = 'insert own polls'
	) THEN
		CREATE POLICY "insert own polls"
			ON public.polls
			FOR INSERT
			TO authenticated
			WITH CHECK (user_id = auth.uid());
	END IF;
END
$$;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_policy p
		JOIN pg_class c ON c.oid = p.polrelid
		JOIN pg_namespace n ON n.oid = c.relnamespace
		WHERE n.nspname = 'public' AND c.relname = 'polls' AND p.polname = 'update own polls'
	) THEN
		CREATE POLICY "update own polls"
			ON public.polls
			FOR UPDATE
			TO authenticated
			USING (user_id = auth.uid());
	END IF;
END
$$;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_policy p
		JOIN pg_class c ON c.oid = p.polrelid
		JOIN pg_namespace n ON n.oid = c.relnamespace
		WHERE n.nspname = 'public' AND c.relname = 'polls' AND p.polname = 'delete own polls'
	) THEN
		CREATE POLICY "delete own polls"
			ON public.polls
			FOR DELETE
			TO authenticated
			USING (user_id = auth.uid());
	END IF;
END
$$;

-- POLICIES FOR VOTES (conditional creation)
-- Users can insert their own vote for any poll
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_policy p
		JOIN pg_class c ON c.oid = p.polrelid
		JOIN pg_namespace n ON n.oid = c.relnamespace
		WHERE n.nspname = 'public' AND c.relname = 'votes' AND p.polname = 'insert own vote'
	) THEN
		CREATE POLICY "insert own vote"
			ON public.votes
			FOR INSERT
			TO authenticated
			WITH CHECK (user_id = auth.uid());
	END IF;
END
$$;

-- Users can see their own votes; poll owners can see votes on their polls
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_policy p
		JOIN pg_class c ON c.oid = p.polrelid
		JOIN pg_namespace n ON n.oid = c.relnamespace
		WHERE n.nspname = 'public' AND c.relname = 'votes' AND p.polname = 'select own or poll-owner votes'
	) THEN
		CREATE POLICY "select own or poll-owner votes"
			ON public.votes
			FOR SELECT
			TO authenticated
			USING (
				auth.uid() = user_id
				OR EXISTS (
					SELECT 1 FROM public.polls p2
					WHERE p2.id = votes.poll_id AND p2.user_id = auth.uid()
				)
			);
	END IF;
END
$$;

-- Users can update/delete their own votes only
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_policy p
		JOIN pg_class c ON c.oid = p.polrelid
		JOIN pg_namespace n ON n.oid = c.relnamespace
		WHERE n.nspname = 'public' AND c.relname = 'votes' AND p.polname = 'update own vote'
	) THEN
		CREATE POLICY "update own vote"
			ON public.votes
			FOR UPDATE
			TO authenticated
			USING (auth.uid() = user_id);
	END IF;
END
$$;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_policy p
		JOIN pg_class c ON c.oid = p.polrelid
		JOIN pg_namespace n ON n.oid = c.relnamespace
		WHERE n.nspname = 'public' AND c.relname = 'votes' AND p.polname = 'delete own vote'
	) THEN
		CREATE POLICY "delete own vote"
			ON public.votes
			FOR DELETE
			TO authenticated
			USING (auth.uid() = user_id);
	END IF;
END
$$;

-- OPTIONAL: Validate option_index is within bounds via trigger
-- This ensures option_index < jsonb_array_length(p.options)
create or replace function public.validate_vote_option_index()
returns trigger language plpgsql as $$
begin
	if not exists (
		select 1
		from public.polls p
		where p.id = new.poll_id
		and new.option_index < jsonb_array_length(p.options)
	) then
		raise exception 'option_index out of range for poll %', new.poll_id;
	end if;
	return new;
end; $$;

-- Ensure idempotency when applying schema multiple times
drop trigger if exists trg_validate_vote_option_index on public.votes;
create trigger trg_validate_vote_option_index
	before insert or update of option_index on public.votes
	for each row execute function public.validate_vote_option_index();
