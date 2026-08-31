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

drop trigger if exists validate_lead_centers_workspace on public.lead_centers;
create trigger validate_lead_centers_workspace before insert or update on public.lead_centers
for each row execute function private.validate_workspace_consistency();
