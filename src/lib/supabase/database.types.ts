export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
export type Database = {
  public: {
    Tables: {
      workspaces: { Row: {id:string;name:string;slug:string;created_at:string;created_by_user_id:string|null}; Insert: {id?:string;name:string;slug:string;created_at?:string;created_by_user_id?:string|null}; Update: {name?:string;slug?:string;created_by_user_id?:string|null}; Relationships: [] };
      pipeline_stages: { Row: {id:string;workspace_id:string;code:string;name:string;color:string;position:number;active:boolean;is_closed:boolean;is_won:boolean}; Insert: never; Update: never; Relationships: [] };
      lead_centers: { Row: {id:string;workspace_id:string;lead_id:string;center_id:string;team_id:string|null;owner_member_id:string|null;stage_id:string;is_primary:boolean;temperature:"Nóng"|"Ấm"|"Lạnh"|"Chăm lại";priority:string;program_interest:string|null;expected_value:number;next_action:string|null;next_follow_up_at:string|null;first_response_at:string|null;sla_due_at:string|null;fail_reason:string|null;care_reason:string|null;closed_at:string|null;created_at:string;updated_at:string}; Insert: Record<string,unknown>; Update: Record<string,unknown>; Relationships: [] };
      tasks: { Row: {id:string;workspace_id:string;lead_id:string|null;lead_center_id:string|null;owner_member_id:string;assigned_by_member_id:string|null;title:string;task_type:string|null;due_at:string|null;completed_at:string|null;status:"OPEN"|"DONE"|"CANCELLED";priority:string;note:string|null;created_at:string}; Insert: Record<string,unknown>; Update: Record<string,unknown>; Relationships: [] };
      workspace_members: { Row: {id:string;workspace_id:string;user_id:string;role:"SM"|"HoEC"|"EC"|"FRONT_DESK"|"ACADEMIC"|"CS";status:"ACTIVE"|"INACTIVE"|"INVITED";manager_member_id:string|null;created_at:string}; Insert: Record<string,unknown>; Update: Record<string,unknown>; Relationships: [] };
    };
    Views: {
      lead_center_cards: { Row: {id:string|null;lead_id:string|null;guardian_name:string|null;student_name:string|null;phone:string|null;center_name:string|null;related_centers:string[]|null;owner_name:string|null;stage_id:string|null;stage_name:string|null;expected_value:number|null;temperature:"Nóng"|"Ấm"|"Lạnh"|"Chăm lại"|null;priority:string|null;next_action:string|null;next_follow_up_at:string|null}; Relationships: [] };
    };
    Functions: { dashboard_metrics: { Args: Record<PropertyKey, never>; Returns: Json } };
    Enums: { crm_role:"SM"|"HoEC"|"EC"|"FRONT_DESK"|"ACADEMIC"|"CS"; member_status:"ACTIVE"|"INACTIVE"|"INVITED"; lead_temperature:"Nóng"|"Ấm"|"Lạnh"|"Chăm lại"; task_status:"OPEN"|"DONE"|"CANCELLED"; alert_status:"OPEN"|"RESOLVED"|"CANCELLED"; payment_status:"PENDING"|"SUCCESS"|"FAILED"|"REFUNDED" };
    CompositeTypes: Record<string,never>;
  };
};
