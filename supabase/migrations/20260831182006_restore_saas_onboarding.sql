-- Restore clean SaaS onboarding after removing an orphan pre-launch workspace seed.
do $$
declare v_workspace uuid;
begin
  select id into v_workspace from public.workspaces where slug='genai-crm';
  if v_workspace is not null
     and not exists(select 1 from public.workspace_members where workspace_id=v_workspace)
     and not exists(select 1 from public.leads where workspace_id=v_workspace)
  then
    delete from public.workspaces where id=v_workspace;
  end if;
end $$;

create or replace function public.bootstrap_workspace(p_name text,p_slug text)
returns uuid
language plpgsql
security definer
set search_path=''
as $$
declare
  v_uid uuid := auth.uid();
  v_workspace uuid;
begin
  if v_uid is null then raise exception 'AUTH_REQUIRED'; end if;
  if p_name is null or length(trim(p_name))<2 then raise exception 'INVALID_WORKSPACE_NAME'; end if;
  if p_slug is null or p_slug !~ '^[a-z0-9][a-z0-9-]{2,62}$' then raise exception 'INVALID_WORKSPACE_SLUG'; end if;
  if exists(select 1 from public.workspace_members where user_id=v_uid and status='ACTIVE') then raise exception 'USER_ALREADY_HAS_WORKSPACE'; end if;

  insert into public.profiles(id,full_name)
  select u.id,coalesce(u.raw_user_meta_data->>'full_name',split_part(u.email,'@',1))
  from auth.users u where u.id=v_uid
  on conflict(id) do nothing;

  insert into public.workspaces(name,slug) values(trim(p_name),p_slug) returning id into v_workspace;
  insert into public.workspace_members(workspace_id,user_id,role,status) values(v_workspace,v_uid,'SM','ACTIVE');

  insert into public.pipeline_stages(workspace_id,code,name,color,position,is_closed,is_won) values
  (v_workspace,'NEW','Lead mới','#69B7FF',1,false,false),
  (v_workspace,'ASSIGNED','Đã giao','#69B7FF',2,false,false),
  (v_workspace,'CONTACTING','Đang liên hệ','#4E7FEA',3,false,false),
  (v_workspace,'CONTACTED','Đã liên hệ','#4E7FEA',4,false,false),
  (v_workspace,'CONSULTED','Đã tư vấn','#4E7FEA',5,false,false),
  (v_workspace,'CONFIRMED','Đã hẹn','#69B7FF',6,false,false),
  (v_workspace,'RESCHEDULED','Dời lịch','#A8D7FF',7,false,false),
  (v_workspace,'CHECK_IN','Check-in','#19B7A5',8,false,false),
  (v_workspace,'NO_SHOW','Không đến','#D9534F',9,false,false),
  (v_workspace,'TRIAL','Học thử','#19B7A5',10,false,false),
  (v_workspace,'POST_TRIAL','Sau học thử','#5CD0C2',11,false,false),
  (v_workspace,'FOLLOW_UP','Đang theo','#F3B741',12,false,false),
  (v_workspace,'CONSIDERING','Đang cân nhắc','#F3B741',13,false,false),
  (v_workspace,'ENROLL_INTENT','Đồng ý đăng ký','#19B7A5',14,false,false),
  (v_workspace,'DEPOSIT','Đã cọc','#0F8F80',15,false,false),
  (v_workspace,'ENROLLED','Đã đăng ký','#0F8F80',16,true,true),
  (v_workspace,'CARE_ACTIVE','Đang chăm sóc','#69B7FF',17,false,false),
  (v_workspace,'CARE','Chăm lại','#F3B741',18,false,false),
  (v_workspace,'FAIL','Không chốt','#D9534F',19,true,false),
  (v_workspace,'CLOSED_ARCHIVE','Đã đóng','#7C8494',20,true,false),
  (v_workspace,'RENEWAL','Tái tục','#243C8F',21,false,false);
  return v_workspace;
end
$$;
revoke all on function public.bootstrap_workspace(text,text) from public;
revoke all on function public.bootstrap_workspace(text,text) from anon;
grant execute on function public.bootstrap_workspace(text,text) to authenticated;
