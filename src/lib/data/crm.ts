import {createClient} from "@/lib/supabase/server";
import {demoCards,demoMetrics,demoStages} from "./demo";
import type {DashboardMetrics,LeadCenterCard,PipelineStage} from "@/lib/types";
function configured(){return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)}
export async function getPipeline():Promise<{stages:PipelineStage[];cards:LeadCenterCard[]}>{
 if(!configured())return {stages:demoStages,cards:demoCards};
 const supabase=await createClient();
 const [{data:stages,error:stageError},{data:rows,error:cardError}]=await Promise.all([
  supabase.from("pipeline_stages").select("id,code,name,color,position,is_closed,is_won").eq("active",true).order("position"),
  supabase.from("lead_center_cards").select("*")
 ]);
 if(stageError)throw new Error(`Không tải được pipeline: ${stageError.message}`);
 if(cardError)throw new Error(`Không tải được lead: ${cardError.message}`);
 return {stages:(stages??[]) as PipelineStage[],cards:(rows??[]) as LeadCenterCard[]};
}
export async function getDashboardMetrics():Promise<DashboardMetrics>{
 if(!configured())return demoMetrics;
 const supabase=await createClient();
 const {data,error}=await supabase.rpc("dashboard_metrics");
 if(error)throw new Error(`Không tải được dashboard: ${error.message}`);
 return (data??{newLeads:0,appointments:0,enrolled:0,collectedRevenue:0,overdueTasks:0,openAlerts:0}) as DashboardMetrics;
}
