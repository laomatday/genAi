import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { createClient } from "@/lib/supabase/server";
export default async function CrmLayout({children}:{children:React.ReactNode}){
 const supabase=await createClient();
 const {data:claims}=await supabase.auth.getClaims();
 if(!claims?.claims)redirect("/login");
 const {data:members}=await supabase.from("workspace_members").select("id").eq("status","ACTIVE").limit(1);
 if(!members?.length)redirect("/onboarding");
 return <div className="crm-shell"><Sidebar/><main className="crm-main"><Topbar/><div className="page-content">{children}</div></main></div>;
}
