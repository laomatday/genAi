alter table public.workspaces add column if not exists created_by_user_id uuid references auth.users(id) on delete set null;
create index if not exists workspaces_created_by_user_idx on public.workspaces(created_by_user_id);

create policy workspace_bootstrap_insert on public.workspaces
for insert to authenticated
with check(
  created_by_user_id=(select auth.uid())
  and not exists(
    select 1 from public.workspace_members wm
    where wm.user_id=(select auth.uid()) and wm.status='ACTIVE'
  )
);

create or replace function private.bootstrap_new_workspace()
returns trigger
language plpgsql
security definer
set search_path=''
as $$
begin
  if new.created_by_user_id is null or new.created_by_user_id <> auth.uid() then raise exception 'WORKSPACE_OWNER_MISMATCH'; end if;
  if exists(select 1 from public.workspace_members where user_id=new.created_by_user_id and status='ACTIVE') then raise exception 'USER_ALREADY_HAS_WORKSPACE'; end if;

  insert into public.workspace_members(workspace_id,user_id,role,status)
  values(new.id,new.created_by_user_id,'SM','ACTIVE');

  insert into public.pipeline_stages(workspace_id,code,name,color,position,is_closed,is_won) values
  (new.id,'NEW','Lead mới','#69B7FF',1,false,false),
  (new.id,'ASSIGNED','Đã giao','#69B7FF',2,false,false),
  (new.id,'CONTACTING','Đang liên hệ','#4E7FEA',3,false,false),
  (new.id,'CONTACTED','Đã liên hệ','#4E7FEA',4,false,false),
  (new.id,'CONSULTED','Đã tư vấn','#4E7FEA',5,false,false),
  (new.id,'CONFIRMED','Đã hẹn','#69B7FF',6,false,false),
  (new.id,'RESCHEDULED','Dời lịch','#A8D7FF',7,false,false),
  (new.id,'CHECK_IN','Check-in','#19B7A5',8,false,false),
  (new.id,'NO_SHOW','Không đến','#D9534F',9,false,false),
  (new.id,'TRIAL','Học thử','#19B7A5',10,false,false),
  (new.id,'POST_TRIAL','Sau học thử','#5CD0C2',11,false,false),
  (new.id,'FOLLOW_UP','Đang theo','#F3B741',12,false,false),
  (new.id,'CONSIDERING','Đang cân nhắc','#F3B741',13,false,false),
  (new.id,'ENROLL_INTENT','Đồng ý đăng ký','#19B7A5',14,false,false),
  (new.id,'DEPOSIT','Đã cọc','#0F8F80',15,false,false),
  (new.id,'ENROLLED','Đã đăng ký','#0F8F80',16,true,true),
  (new.id,'CARE_ACTIVE','Đang chăm sóc','#69B7FF',17,false,false),
  (new.id,'CARE','Chăm lại','#F3B741',18,false,false),
  (new.id,'FAIL','Không chốt','#D9534F',19,true,false),
  (new.id,'CLOSED_ARCHIVE','Đã đóng','#7C8494',20,true,false),
  (new.id,'RENEWAL','Tái tục','#243C8F',21,false,false);
  return new;
end
$$;
revoke all on function private.bootstrap_new_workspace() from public;
revoke all on function private.bootstrap_new_workspace() from anon;
revoke all on function private.bootstrap_new_workspace() from authenticated;

drop trigger if exists bootstrap_new_workspace on public.workspaces;
create trigger bootstrap_new_workspace after insert on public.workspaces
for each row execute function private.bootstrap_new_workspace();

revoke all on function public.bootstrap_workspace(text,text) from public;
revoke all on function public.bootstrap_workspace(text,text) from anon;
revoke all on function public.bootstrap_workspace(text,text) from authenticated;
drop function if exists public.bootstrap_workspace(text,text);
