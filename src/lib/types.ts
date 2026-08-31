export type Role = "SM" | "HoEC" | "EC" | "FRONT_DESK" | "ACADEMIC" | "CS";
export type PipelineStage = {
  id:string; code:string; name:string; color:string; position:number; is_closed:boolean; is_won:boolean;
};
export type LeadCenterCard = {
  id:string; lead_id:string; guardian_name:string; student_name:string|null; phone:string|null;
  center_name:string; related_centers:string[]; owner_name:string|null;
  stage_id:string; stage_name:string; expected_value:number;
  temperature:"Nóng"|"Ấm"|"Lạnh"|"Chăm lại"; priority:string;
  next_action:string|null; next_follow_up_at:string|null;
};
export type DashboardMetrics = {
  newLeads:number; appointments:number; enrolled:number; collectedRevenue:number; overdueTasks:number; openAlerts:number;
};
