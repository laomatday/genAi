import { redirect } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { createClient } from "@/lib/supabase/server";

export default async function CrmLayout({children}:{children:React.ReactNode}){
 const configured=Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

 if(!configured){
  return <main className="login-page"><section className="login-card onboarding-card">
   <div className="brand-mark">g</div>
   <h1>CRM chưa kết nối Supabase</h1>
   <p>Deployment trên Vercel đang thiếu biến môi trường cần thiết.</p>
   <div className="onboarding-note">
    <b>Vercel → Project → Settings → Environment Variables</b><br/>
    Thêm <code>NEXT_PUBLIC_SUPABASE_URL</code> và <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> cho Production, Preview và Development, sau đó Redeploy.
   </div>
  </section></main>;
 }

 const supabase=await createClient();
 const {data:claims}=await supabase.auth.getClaims();
 if(!claims?.claims)redirect("/login");
 const {data:members}=await supabase.from("workspace_members").select("id").eq("status","ACTIVE").limit(1);
 if(!members?.length)redirect("/onboarding");
 return <div className="crm-shell"><Sidebar/><main className="crm-main"><Topbar/><div className="page-content">{children}</div></main></div>;
}
