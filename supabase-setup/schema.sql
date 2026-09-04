-- Run this once in Supabase: Project → SQL Editor → New query → paste this → Run

create table cases (
  id bigint generated always as identity primary key,
  title text not null,
  case_number text default '',
  court text default '',
  status text default 'Active',
  parties text default '',
  assigned_to text default '',
  next_hearing text default '',
  notes text default '',
  documents jsonb default '[]'::jsonb,
  hearing_history jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- A few sample cases so the live dashboard isn't empty on first look
insert into cases (title, case_number, court, status, parties, assigned_to, next_hearing, notes, hearing_history)
values
  ('Sharma vs. Metro Builders Pvt Ltd', 'CS/2026/1042', 'District Court, Faridabad', 'Active',
   'Petitioner: A. Sharma · Respondent: Metro Builders Pvt Ltd', 'Adv. R. Mehta', '2026-09-18',
   'Awaiting respondent''s written statement.',
   '[{"date":"2026-07-02","note":"Case admitted, notice issued"}]'::jsonb),
  ('State vs. Verma', 'CRL/2026/0217', 'Sessions Court, Faridabad', 'Urgent',
   'State · Accused: R. Verma', 'Adv. P. Kaur', '2026-09-09',
   'Bail application to be filed before next hearing.',
   '[{"date":"2026-08-15","note":"Charges framed"}]'::jsonb);

-- This makes the table readable/writable by your app using the anon key.
-- Fine for a small private pilot behind a private URL; add real authentication
-- before sharing the link widely (see the guide's "Add login" section).
alter table cases enable row level security;

create policy "Allow all for now"
  on cases
  for all
  using (true)
  with check (true);
