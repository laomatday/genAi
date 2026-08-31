-- Squashed baseline matching the current production CRM schema.
create extension if not exists pgcrypto;
create type public.crm_role as enum ('SM','HoEC','EC','FRONT_DESK','ACADEMIC','CS');
create type public.member_status as enum ('ACTIVE','INACTIVE','INVITED');
create type public.lead_temperature as enum ('Nóng','Ấm','Lạnh','Chăm lại');
create type public.task_status as enum ('OPEN','DONE','CANCELLED');
create type public.alert_status as enum ('OPEN','RESOLVED','CANCELLED');
create type public.payment_status as enum ('PENDING','SUCCESS','FAILED','REFUNDED');

create table public.workspaces(id uuid primary key default gen_random_uuid(),name text not null,slug text not null unique,created_at timestamptz not null default now());
create table public.profiles(id uuid primary key references auth.users(id) on delete cascade,full_name text,avatar_url text,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table public.workspace_members(id uuid primary key default gen_random_uuid(),workspace_id uuid not null references public.workspaces(id) on delete cascade,user_id uuid not null references auth.users(id) on delete cascade,role public.crm_role not null,status public.member_status not null default 'ACTIVE',manager_member_id uuid references public.workspace_members(id),created_at timestamptz not null default now(),unique(workspace_id,user_id));
create table public.centers(id uuid primary key default gen_random_uuid(),workspace_id uuid not null references public.workspaces(id) on delete cascade,name text not null,code text not null,city text,address text,active boolean not null default true,created_at timestamptz not null default now(),unique(workspace_id,code));
create table public.teams(id uuid primary key default gen_random_uuid(),workspace_id uuid not null references public.workspaces(id) on delete cascade,center_id uuid references public.centers(id) on delete set null,name text not null,hoec_member_id uuid references public.workspace_members(id),assignment_method text not null default 'WEIGHTED_ROUND_ROBIN',active boolean not null default true,created_at timestamptz not null default now());
create table public.team_members(team_id uuid not null references public.teams(id) on delete cascade,member_id uuid not null references public.workspace_members(id) on delete cascade,primary key(team_id,member_id));
create table public.pipeline_stages(id uuid primary key default gen_random_uuid(),workspace_id uuid not null references public.workspaces(id) on delete cascade,code text not null,name text not null,color text not null default '#69B7FF',position int not null,active boolean not null default true,is_closed boolean not null default false,is_won boolean not null default false,unique(workspace_id,code),unique(workspace_id,position));
create table public.customers(id uuid primary key default gen_random_uuid(),workspace_id uuid not null references public.workspaces(id) on delete cascade,guardian_name text not null,phone text,email text,preferred_channel text,do_not_contact boolean not null default false,created_at timestamptz not null default now());
create table public.students(id uuid primary key default gen_random_uuid(),workspace_id uuid not null references public.workspaces(id) on delete cascade,customer_id uuid not null references public.customers(id) on delete cascade,name text not null,birth_year int,grade text,school text,english_level text,created_at timestamptz not null default now());
create table public.leads(id uuid primary key default gen_random_uuid(),workspace_id uuid not null references public.workspaces(id) on delete cascade,customer_id uuid not null references public.customers(id) on delete restrict,student_id uuid references public.students(id) on delete set null,source text,campaign text,created_by uuid references public.workspace_members(id),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),archived_at timestamptz);
create table public.lead_centers(id uuid primary key default gen_random_uuid(),workspace_id uuid not null references public.workspaces(id) on delete cascade,lead_id uuid not null references public.leads(id) on delete cascade,center_id uuid not null references public.centers(id) on delete cascade,team_id uuid references public.teams(id) on delete set null,owner_member_id uuid references public.workspace_members(id) on delete set null,stage_id uuid not null references public.pipeline_stages(id),is_primary boolean not null default false,temperature public.lead_temperature not null default 'Ấm',priority text not null default 'P3 - Bình thường',program_interest text,expected_value numeric(14,2) not null default 0,next_action text,next_follow_up_at timestamptz,first_response_at timestamptz,sla_due_at timestamptz,fail_reason text,care_reason text,closed_at timestamptz,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),unique(lead_id,center_id));
create unique index lead_one_primary_center on public.lead_centers(lead_id) where is_primary;

create table public.activities(id uuid primary key default gen_random_uuid(),workspace_id uuid not null references public.workspaces(id) on delete cascade,lead_id uuid not null references public.leads(id) on delete cascade,lead_center_id uuid references public.lead_centers(id) on delete cascade,actor_member_id uuid references public.workspace_members(id),channel text,activity_type text not null,outcome text,summary text,next_action text,happened_at timestamptz not null default now());
create table public.tasks(id uuid primary key default gen_random_uuid(),workspace_id uuid not null references public.workspaces(id) on delete cascade,lead_id uuid references public.leads(id) on delete cascade,lead_center_id uuid references public.lead_centers(id) on delete cascade,owner_member_id uuid not null references public.workspace_members(id),assigned_by_member_id uuid references public.workspace_members(id),title text not null,task_type text,due_at timestamptz,completed_at timestamptz,status public.task_status not null default 'OPEN',priority text not null default 'P3 - Bình thường',note text,created_at timestamptz not null default now());
create table public.appointments(id uuid primary key default gen_random_uuid(),workspace_id uuid not null references public.workspaces(id) on delete cascade,lead_center_id uuid not null references public.lead_centers(id) on delete cascade,student_id uuid references public.students(id),appointment_type text not null default 'CONSULTATION',scheduled_at timestamptz not null,confirmed_at timestamptz,checked_in_at timestamptz,status text not null default 'SCHEDULED',no_show_reason text,notes text,created_at timestamptz not null default now());
create table public.trials(id uuid primary key default gen_random_uuid(),workspace_id uuid not null references public.workspaces(id) on delete cascade,lead_center_id uuid not null references public.lead_centers(id) on delete cascade,appointment_id uuid references public.appointments(id) on delete set null,student_id uuid references public.students(id),teacher_member_id uuid references public.workspace_members(id),start_at timestamptz not null,end_at timestamptz,outcome text,proposed_level text,teacher_note text,result_at timestamptz,followup_due_at timestamptz,status text not null default 'SCHEDULED',created_at timestamptz not null default now());
create table public.enrollments(id uuid primary key default gen_random_uuid(),workspace_id uuid not null references public.workspaces(id) on delete cascade,lead_center_id uuid not null references public.lead_centers(id) on delete restrict,student_id uuid not null references public.students(id),program text not null,package_months int,list_price numeric(14,2) not null default 0,discount_pct numeric(6,3) not null default 0,final_value numeric(14,2) not null default 0,enrolled_at timestamptz not null default now(),start_date date,status text not null default 'PENDING_PAYMENT');
create table public.payments(id uuid primary key default gen_random_uuid(),workspace_id uuid not null references public.workspaces(id) on delete cascade,enrollment_id uuid not null references public.enrollments(id) on delete cascade,amount numeric(14,2) not null check(amount>=0),payment_type text not null,method text,reference text,status public.payment_status not null default 'PENDING',collected_by_member_id uuid references public.workspace_members(id),paid_at timestamptz,created_at timestamptz not null default now());
create table public.approvals(id uuid primary key default gen_random_uuid(),workspace_id uuid not null references public.workspaces(id) on delete cascade,lead_center_id uuid references public.lead_centers(id) on delete cascade,request_type text not null,requested_by_member_id uuid not null references public.workspace_members(id),approver_role public.crm_role not null,approver_member_id uuid references public.workspace_members(id),requested_value jsonb,decision text not null default 'PENDING',reason text,decided_at timestamptz,created_at timestamptz not null default now());
create table public.alerts(id uuid primary key default gen_random_uuid(),workspace_id uuid not null references public.workspaces(id) on delete cascade,lead_center_id uuid references public.lead_centers(id) on delete cascade,rule_code text not null,source_member_id uuid references public.workspace_members(id),target_member_id uuid references public.workspace_members(id),target_role public.crm_role,due_at timestamptz,status public.alert_status not null default 'OPEN',action_taken text,resolved_at timestamptz,created_at timestamptz not null default now());
create table public.audit_log(id bigserial primary key,workspace_id uuid not null,actor_user_id uuid,actor_member_id uuid,entity_type text not null,entity_id text not null,action text not null,changes jsonb,created_at timestamptz not null default now());

create schema if not exists private;revoke all on schema private from public;grant usage on schema private to authenticated;
create or replace function private.current_member(p_workspace uuid) returns table(member_id uuid,role public.crm_role) language sql security definer set search_path='' stable as $$select wm.id,wm.role from public.workspace_members wm where wm.workspace_id=p_workspace and wm.user_id=auth.uid() and wm.status='ACTIVE' limit 1$$;
revoke all on function private.current_member(uuid) from public;grant execute on function private.current_member(uuid) to authenticated;

create or replace function private.can_access_lead_center(p_id uuid) returns boolean language sql security definer set search_path='' stable as $$
with ctx as(select lc.workspace_id,lc.owner_member_id,lc.team_id from public.lead_centers lc where lc.id=p_id),
me as(select wm.id,wm.role from ctx join public.workspace_members wm on wm.workspace_id=ctx.workspace_id where wm.user_id=auth.uid() and wm.status='ACTIVE')
select exists(select 1 from ctx,me where me.role='SM' or (me.role='HoEC' and exists(select 1 from public.teams t where t.id=ctx.team_id and t.hoec_member_id=me.id)) or (me.role='EC' and ctx.owner_member_id=me.id))
$$;
revoke all on function private.can_access_lead_center(uuid) from public;grant execute on function private.can_access_lead_center(uuid) to authenticated;

-- Align an already-initialized project with the production access model.
create or replace function private.can_access_lead_center(p_id uuid) returns boolean
language sql security definer set search_path='' stable as $$
with ctx as(
  select lc.workspace_id,lc.owner_member_id,lc.team_id
  from public.lead_centers lc where lc.id=p_id
), me as(
  select wm.id,wm.role
  from ctx join public.workspace_members wm on wm.workspace_id=ctx.workspace_id
  where wm.user_id=auth.uid() and wm.status='ACTIVE'
)
select exists(
  select 1 from ctx,me
  where me.role='SM'
     or (me.role='HoEC' and exists(select 1 from public.teams t where t.id=ctx.team_id and t.hoec_member_id=me.id))
     or (me.role='EC' and ctx.owner_member_id=me.id)
)
$$;
revoke all on function private.can_access_lead_center(uuid) from public;
grant execute on function private.can_access_lead_center(uuid) to authenticated;

create or replace function private.validate_workspace_consistency() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if tg_table_name='students' then
    if not exists(select 1 from public.customers c where c.id=new.customer_id and c.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
  elsif tg_table_name='leads' then
    if not exists(select 1 from public.customers c where c.id=new.customer_id and c.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
    if new.student_id is not null and not exists(select 1 from public.students s where s.id=new.student_id and s.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
  elsif tg_table_name='lead_centers' then
    if not exists(select 1 from public.leads l where l.id=new.lead_id and l.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
    if not exists(select 1 from public.centers c where c.id=new.center_id and c.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
    if not exists(select 1 from public.pipeline_stages ps where ps.id=new.stage_id and ps.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
    if new.team_id is not null and not exists(select 1 from public.teams t where t.id=new.team_id and t.workspace_id=new.workspace_id and (t.center_id is null or t.center_id=new.center_id)) then raise exception 'WORKSPACE_MISMATCH'; end if;
    if new.owner_member_id is not null and not exists(select 1 from public.workspace_members wm where wm.id=new.owner_member_id and wm.workspace_id=new.workspace_id and wm.status='ACTIVE') then raise exception 'WORKSPACE_MISMATCH'; end if;
  elsif tg_table_name='activities' then
    if not exists(select 1 from public.leads l where l.id=new.lead_id and l.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
    if new.lead_center_id is not null and not exists(select 1 from public.lead_centers lc where lc.id=new.lead_center_id and lc.workspace_id=new.workspace_id and lc.lead_id=new.lead_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
  elsif tg_table_name='tasks' then
    if not exists(select 1 from public.workspace_members wm where wm.id=new.owner_member_id and wm.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
    if new.assigned_by_member_id is not null and not exists(select 1 from public.workspace_members wm where wm.id=new.assigned_by_member_id and wm.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
    if new.lead_id is not null and not exists(select 1 from public.leads l where l.id=new.lead_id and l.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
    if new.lead_center_id is not null and not exists(select 1 from public.lead_centers lc where lc.id=new.lead_center_id and lc.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
  elsif tg_table_name='appointments' then
    if not exists(select 1 from public.lead_centers lc where lc.id=new.lead_center_id and lc.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
    if new.student_id is not null and not exists(select 1 from public.students s where s.id=new.student_id and s.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
  elsif tg_table_name='trials' then
    if not exists(select 1 from public.lead_centers lc where lc.id=new.lead_center_id and lc.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
    if new.student_id is not null and not exists(select 1 from public.students s where s.id=new.student_id and s.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
    if new.teacher_member_id is not null and not exists(select 1 from public.workspace_members wm where wm.id=new.teacher_member_id and wm.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
  elsif tg_table_name='enrollments' then
    if not exists(select 1 from public.lead_centers lc where lc.id=new.lead_center_id and lc.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
    if not exists(select 1 from public.students s where s.id=new.student_id and s.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
  elsif tg_table_name='payments' then
    if not exists(select 1 from public.enrollments e where e.id=new.enrollment_id and e.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
  elsif tg_table_name='approvals' then
    if not exists(select 1 from public.workspace_members wm where wm.id=new.requested_by_member_id and wm.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
    if new.approver_member_id is not null and not exists(select 1 from public.workspace_members wm where wm.id=new.approver_member_id and wm.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
    if new.lead_center_id is not null and not exists(select 1 from public.lead_centers lc where lc.id=new.lead_center_id and lc.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
  elsif tg_table_name='alerts' then
    if new.lead_center_id is not null and not exists(select 1 from public.lead_centers lc where lc.id=new.lead_center_id and lc.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
    if new.source_member_id is not null and not exists(select 1 from public.workspace_members wm where wm.id=new.source_member_id and wm.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
    if new.target_member_id is not null and not exists(select 1 from public.workspace_members wm where wm.id=new.target_member_id and wm.workspace_id=new.workspace_id) then raise exception 'WORKSPACE_MISMATCH'; end if;
  end if;
  return new;
end$$;
revoke all on function private.validate_workspace_consistency() from public;

-- Ensure the multi-center join itself cannot cross tenant/workspace boundaries.
drop trigger if exists validate_lead_centers_workspace on public.lead_centers;
create trigger validate_lead_centers_workspace before insert or update on public.lead_centers
for each row execute function private.validate_workspace_consistency();

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path='' as $$
declare v_workspace uuid;
begin
  insert into public.profiles(id,full_name)
  values(new.id,coalesce(new.raw_user_meta_data->>'full_name',split_part(new.email,'@',1)))
  on conflict(id) do nothing;
  if not exists(select 1 from public.workspace_members) then
    select id into v_workspace from public.workspaces order by created_at,id limit 1;
    if v_workspace is not null then
      insert into public.workspace_members(workspace_id,user_id,role,status)
      values(v_workspace,new.id,'SM','ACTIVE')
      on conflict(workspace_id,user_id) do nothing;
    end if;
  end if;
  return new;
end$$;
revoke all on function public.handle_new_user() from public;

-- Workspace integrity triggers for all cross-table relationships.
drop trigger if exists validate_students_workspace on public.students;
create trigger validate_students_workspace before insert or update on public.students for each row execute function private.validate_workspace_consistency();
drop trigger if exists validate_leads_workspace on public.leads;
create trigger validate_leads_workspace before insert or update on public.leads for each row execute function private.validate_workspace_consistency();
drop trigger if exists validate_activities_workspace on public.activities;
create trigger validate_activities_workspace before insert or update on public.activities for each row execute function private.validate_workspace_consistency();
drop trigger if exists validate_tasks_workspace on public.tasks;
create trigger validate_tasks_workspace before insert or update on public.tasks for each row execute function private.validate_workspace_consistency();
drop trigger if exists validate_appointments_workspace on public.appointments;
create trigger validate_appointments_workspace before insert or update on public.appointments for each row execute function private.validate_workspace_consistency();
drop trigger if exists validate_trials_workspace on public.trials;
create trigger validate_trials_workspace before insert or update on public.trials for each row execute function private.validate_workspace_consistency();
drop trigger if exists validate_enrollments_workspace on public.enrollments;
create trigger validate_enrollments_workspace before insert or update on public.enrollments for each row execute function private.validate_workspace_consistency();
drop trigger if exists validate_payments_workspace on public.payments;
create trigger validate_payments_workspace before insert or update on public.payments for each row execute function private.validate_workspace_consistency();
drop trigger if exists validate_approvals_workspace on public.approvals;
create trigger validate_approvals_workspace before insert or update on public.approvals for each row execute function private.validate_workspace_consistency();
drop trigger if exists validate_alerts_workspace on public.alerts;
create trigger validate_alerts_workspace before insert or update on public.alerts for each row execute function private.validate_workspace_consistency();
revoke all on all tables in schema public from anon;

alter table public.workspaces enable row level security;alter table public.profiles enable row level security;alter table public.workspace_members enable row level security;alter table public.centers enable row level security;alter table public.teams enable row level security;alter table public.team_members enable row level security;alter table public.pipeline_stages enable row level security;alter table public.customers enable row level security;alter table public.students enable row level security;alter table public.leads enable row level security;alter table public.lead_centers enable row level security;alter table public.activities enable row level security;alter table public.tasks enable row level security;alter table public.appointments enable row level security;alter table public.trials enable row level security;alter table public.enrollments enable row level security;alter table public.payments enable row level security;alter table public.approvals enable row level security;alter table public.alerts enable row level security;alter table public.audit_log enable row level security;

create policy profile_self_select on public.profiles for select to authenticated using(id=(select auth.uid()));
create policy profile_self_update on public.profiles for update to authenticated using(id=(select auth.uid())) with check(id=(select auth.uid()));
create policy workspace_member_select on public.workspace_members for select to authenticated using(user_id=(select auth.uid()) or exists(select 1 from private.current_member(workspace_id) m where m.role in ('SM','HoEC')));
create policy workspace_select on public.workspaces for select to authenticated using(exists(select 1 from private.current_member(id)));
create policy centers_select on public.centers for select to authenticated using(exists(select 1 from private.current_member(workspace_id)));
create policy teams_select on public.teams for select to authenticated using(exists(select 1 from private.current_member(workspace_id)));
create policy team_members_select on public.team_members for select to authenticated using(exists(select 1 from public.teams t,private.current_member(t.workspace_id) m where t.id=team_id));
create policy stages_select on public.pipeline_stages for select to authenticated using(exists(select 1 from private.current_member(workspace_id)));
create policy customers_select on public.customers for select to authenticated using(exists(select 1 from public.leads l join public.lead_centers lc on lc.lead_id=l.id where l.customer_id=customers.id and private.can_access_lead_center(lc.id)));
create policy students_select on public.students for select to authenticated using(exists(select 1 from public.leads l join public.lead_centers lc on lc.lead_id=l.id where l.student_id=students.id and private.can_access_lead_center(lc.id)));
create policy leads_select on public.leads for select to authenticated using(exists(select 1 from public.lead_centers lc where lc.lead_id=leads.id and private.can_access_lead_center(lc.id)));
create policy lead_centers_select on public.lead_centers for select to authenticated using(private.can_access_lead_center(id));
create policy lead_centers_update on public.lead_centers for update to authenticated using(private.can_access_lead_center(id)) with check(private.can_access_lead_center(id));
create policy activities_select on public.activities for select to authenticated using(lead_center_id is not null and private.can_access_lead_center(lead_center_id));
create policy activities_insert on public.activities for insert to authenticated with check(lead_center_id is not null and private.can_access_lead_center(lead_center_id));
create policy tasks_select on public.tasks for select to authenticated using((lead_center_id is not null and private.can_access_lead_center(lead_center_id)) or owner_member_id in(select member_id from private.current_member(workspace_id)));
create policy tasks_update on public.tasks for update to authenticated using((lead_center_id is not null and private.can_access_lead_center(lead_center_id)) or owner_member_id in(select member_id from private.current_member(workspace_id))) with check((lead_center_id is not null and private.can_access_lead_center(lead_center_id)) or owner_member_id in(select member_id from private.current_member(workspace_id)));
create policy appointments_select on public.appointments for select to authenticated using(private.can_access_lead_center(lead_center_id));
create policy appointments_write on public.appointments for all to authenticated using(private.can_access_lead_center(lead_center_id)) with check(private.can_access_lead_center(lead_center_id));
create policy trials_select on public.trials for select to authenticated using(private.can_access_lead_center(lead_center_id));
create policy trials_write on public.trials for all to authenticated using(private.can_access_lead_center(lead_center_id)) with check(private.can_access_lead_center(lead_center_id));
create policy enrollments_select on public.enrollments for select to authenticated using(private.can_access_lead_center(lead_center_id));
create policy enrollments_write on public.enrollments for all to authenticated using(private.can_access_lead_center(lead_center_id)) with check(private.can_access_lead_center(lead_center_id));
create policy payments_select on public.payments for select to authenticated using(exists(select 1 from public.enrollments e where e.id=enrollment_id and private.can_access_lead_center(e.lead_center_id)));
create policy payments_write on public.payments for all to authenticated using(exists(select 1 from public.enrollments e where e.id=enrollment_id and private.can_access_lead_center(e.lead_center_id))) with check(exists(select 1 from public.enrollments e where e.id=enrollment_id and private.can_access_lead_center(e.lead_center_id)));
create policy approvals_select on public.approvals for select to authenticated using(lead_center_id is null or private.can_access_lead_center(lead_center_id));
create policy alerts_select on public.alerts for select to authenticated using(lead_center_id is null or private.can_access_lead_center(lead_center_id));

-- Write policies. UI visibility is not security; every mutation is checked by RLS.
create policy workspace_update_sm on public.workspaces for update to authenticated
using(exists(select 1 from private.current_member(id) m where m.role='SM'))
with check(exists(select 1 from private.current_member(id) m where m.role='SM'));

create policy workspace_members_insert_sm on public.workspace_members for insert to authenticated
with check(exists(select 1 from private.current_member(workspace_id) m where m.role='SM'));
create policy workspace_members_update_sm on public.workspace_members for update to authenticated
using(exists(select 1 from private.current_member(workspace_id) m where m.role='SM'))
with check(exists(select 1 from private.current_member(workspace_id) m where m.role='SM'));

create policy centers_write_sm on public.centers for all to authenticated
using(exists(select 1 from private.current_member(workspace_id) m where m.role='SM'))
with check(exists(select 1 from private.current_member(workspace_id) m where m.role='SM'));
create policy teams_write_sm on public.teams for all to authenticated
using(exists(select 1 from private.current_member(workspace_id) m where m.role='SM'))
with check(exists(select 1 from private.current_member(workspace_id) m where m.role='SM'));
create policy team_members_write_manager on public.team_members for all to authenticated
using(exists(select 1 from public.teams t join lateral private.current_member(t.workspace_id) m on true where t.id=team_id and (m.role='SM' or (m.role='HoEC' and t.hoec_member_id=m.member_id))))
with check(exists(select 1 from public.teams t join lateral private.current_member(t.workspace_id) m on true where t.id=team_id and (m.role='SM' or (m.role='HoEC' and t.hoec_member_id=m.member_id))));
create policy stages_write_sm on public.pipeline_stages for all to authenticated
using(exists(select 1 from private.current_member(workspace_id) m where m.role='SM'))
with check(exists(select 1 from private.current_member(workspace_id) m where m.role='SM'));

create policy customers_insert_member on public.customers for insert to authenticated
with check(exists(select 1 from private.current_member(workspace_id) m where m.role in ('SM','HoEC','EC')));
create policy customers_update_accessible on public.customers for update to authenticated
using(exists(select 1 from public.leads l join public.lead_centers lc on lc.lead_id=l.id where l.customer_id=customers.id and private.can_access_lead_center(lc.id)))
with check(exists(select 1 from public.leads l join public.lead_centers lc on lc.lead_id=l.id where l.customer_id=customers.id and private.can_access_lead_center(lc.id)));
create policy students_insert_member on public.students for insert to authenticated
with check(exists(select 1 from private.current_member(workspace_id) m where m.role in ('SM','HoEC','EC')));
create policy students_update_accessible on public.students for update to authenticated
using(exists(select 1 from public.leads l join public.lead_centers lc on lc.lead_id=l.id where l.student_id=students.id and private.can_access_lead_center(lc.id)))
with check(exists(select 1 from public.leads l join public.lead_centers lc on lc.lead_id=l.id where l.student_id=students.id and private.can_access_lead_center(lc.id)));

create policy leads_insert_member on public.leads for insert to authenticated
with check(exists(select 1 from private.current_member(workspace_id) m where m.role in ('SM','HoEC','EC')));
create policy leads_update_accessible on public.leads for update to authenticated
using(exists(select 1 from public.lead_centers lc where lc.lead_id=leads.id and private.can_access_lead_center(lc.id)))
with check(exists(select 1 from public.lead_centers lc where lc.lead_id=leads.id and private.can_access_lead_center(lc.id)));

create policy lead_centers_insert_member on public.lead_centers for insert to authenticated
with check(exists(
  select 1 from private.current_member(workspace_id) m
  where m.role='SM'
     or (m.role='HoEC' and exists(select 1 from public.teams t where t.id=team_id and t.hoec_member_id=m.member_id))
     or (m.role='EC' and owner_member_id=m.member_id and exists(select 1 from public.team_members tm where tm.team_id=team_id and tm.member_id=m.member_id))
));

create policy tasks_insert_accessible on public.tasks for insert to authenticated
with check(
  owner_member_id in(select member_id from private.current_member(workspace_id))
  or (lead_center_id is not null and private.can_access_lead_center(lead_center_id))
);

create policy approvals_insert_accessible on public.approvals for insert to authenticated
with check(lead_center_id is not null and private.can_access_lead_center(lead_center_id) and requested_by_member_id in(select member_id from private.current_member(workspace_id)));
create policy approvals_update_approver on public.approvals for update to authenticated
using(approver_member_id in(select member_id from private.current_member(workspace_id)) or exists(select 1 from private.current_member(workspace_id) m where m.role='SM'))
with check(approver_member_id in(select member_id from private.current_member(workspace_id)) or exists(select 1 from private.current_member(workspace_id) m where m.role='SM'));

create policy audit_log_select_sm on public.audit_log for select to authenticated
using(exists(select 1 from private.current_member(workspace_id) m where m.role='SM'));

-- Explicit Data API privileges; RLS remains the authorization boundary.
grant select,insert,update,delete on public.workspaces,public.workspace_members,public.centers,public.teams,public.team_members,public.pipeline_stages,public.customers,public.students,public.leads,public.lead_centers,public.activities,public.tasks,public.appointments,public.trials,public.enrollments,public.payments,public.approvals,public.alerts to authenticated;
grant select,update on public.profiles to authenticated;
grant select on public.audit_log to authenticated;

create view public.lead_center_cards with(security_invoker=true) as
select lc.id,lc.lead_id,c.guardian_name,s.name as student_name,c.phone,ce.name as center_name,
coalesce((select array_agg(ce2.name order by ce2.name) from public.lead_centers lc2 join public.centers ce2 on ce2.id=lc2.center_id where lc2.lead_id=lc.lead_id and lc2.id<>lc.id),array[]::text[]) as related_centers,
p.full_name as owner_name,lc.stage_id,ps.name as stage_name,lc.expected_value,lc.temperature,lc.priority,lc.next_action,lc.next_follow_up_at
from public.lead_centers lc join public.leads l on l.id=lc.lead_id join public.customers c on c.id=l.customer_id left join public.students s on s.id=l.student_id join public.centers ce on ce.id=lc.center_id join public.pipeline_stages ps on ps.id=lc.stage_id left join public.workspace_members wm on wm.id=lc.owner_member_id left join public.profiles p on p.id=wm.user_id;
grant select on public.lead_center_cards to authenticated;

create or replace function public.dashboard_metrics() returns jsonb language sql security invoker stable as $$
select jsonb_build_object(
'newLeads',(select count(*) from public.lead_centers lc join public.pipeline_stages ps on ps.id=lc.stage_id where ps.code='NEW'),
'appointments',(select count(*) from public.appointments where scheduled_at::date=current_date),
'enrolled',(select count(*) from public.enrollments where enrolled_at::date>=current_date-30),
'collectedRevenue',coalesce((select sum(amount) from public.payments where status='SUCCESS'),0),
'overdueTasks',(select count(*) from public.tasks where status='OPEN' and due_at<now()),
'openAlerts',(select count(*) from public.alerts where status='OPEN'))
$$;
grant execute on function public.dashboard_metrics() to authenticated;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
declare v_workspace uuid;
begin
  insert into public.profiles(id,full_name) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',split_part(new.email,'@',1))) on conflict(id) do nothing;
  -- Bootstrap only the very first CRM user as SM. Later users must be invited/assigned by an SM.
  if not exists(select 1 from public.workspace_members) then
    select id into v_workspace from public.workspaces order by created_at,id limit 1;
    if v_workspace is not null then
      insert into public.workspace_members(workspace_id,user_id,role,status) values(v_workspace,new.id,'SM','ACTIVE') on conflict(workspace_id,user_id) do nothing;
    end if;
  end if;
  return new;
end$$;
revoke all on function public.handle_new_user() from public;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create index lead_centers_workspace_stage_idx on public.lead_centers(workspace_id,stage_id);create index lead_centers_owner_idx on public.lead_centers(owner_member_id);create index lead_centers_team_idx on public.lead_centers(team_id);create index tasks_owner_due_idx on public.tasks(owner_member_id,status,due_at);create index appointments_scheduled_idx on public.appointments(workspace_id,scheduled_at);create index activities_lead_happened_idx on public.activities(lead_id,happened_at desc);create index payments_enrollment_idx on public.payments(enrollment_id,paid_at desc);
