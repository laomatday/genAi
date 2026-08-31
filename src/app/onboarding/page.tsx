import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createWorkspace } from "./actions";

export default async function Onboarding({searchParams}:{searchParams:Promise<{error?:string}>}){
 const supabase=await createClient();
 const {data:claims}=await supabase.auth.getClaims();
 if(!claims?.claims)redirect("/login");
 const {data:members}=await supabase.from("workspace_members").select("id").eq("status","ACTIVE").limit(1);
 if(members?.length)redirect("/dashboard");
 const {error}=await searchParams;
 return <main className="login-page"><section className="login-card onboarding-card">
  <div className="brand-mark">g</div><h1>Tạo workspace</h1>
  <p>Workspace là không gian CRM riêng của một đơn vị. Bên trong có thể có nhiều cơ sở, team và nhân viên.</p>
  {error?<div className="error-note">{error}</div>:null}
  <form action={createWorkspace} className="form-stack">
   <label>Tên workspace<input name="name" required defaultValue="genAi CRM" placeholder="Ví dụ: Army English"/></label>
   <label>Tên định danh<input name="slug" required defaultValue="genai-crm" pattern="[a-z0-9][a-z0-9-]{2,62}" placeholder="army-english"/></label>
   <button className="primary-btn" type="submit">Tạo workspace và vào CRM</button>
  </form>
  <div className="onboarding-note"><b>Hệ thống tự cấu hình:</b><br/>Anh/chị trở thành SM và pipeline tuyển sinh 21 trạng thái được tạo tự động. Sau đó SM thêm cơ sở, HoEC và EC.</div>
 </section></main>
}
