"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createWorkspace(formData:FormData){
 const name=String(formData.get("name")??"").trim();
 const slug=String(formData.get("slug")??"").trim().toLowerCase();
 if(name.length<2)redirect(`/onboarding?error=${encodeURIComponent("Tên workspace quá ngắn")}`);
 if(!/^[a-z0-9][a-z0-9-]{2,62}$/.test(slug))redirect(`/onboarding?error=${encodeURIComponent("Tên định danh chỉ dùng chữ thường, số và dấu gạch ngang")}`);
 const supabase=await createClient();
 const {data:claims}=await supabase.auth.getClaims();
 const userId=claims?.claims?.sub;
 if(!userId)redirect("/login");
 const {data:members}=await supabase.from("workspace_members").select("id").eq("status","ACTIVE").limit(1);
 if(members?.length)redirect("/dashboard");
 const {error}=await supabase.from("workspaces").insert({name,slug,created_by_user_id:userId});
 if(error){
   const message=error.code==="23505"?"Tên định danh đã được dùng. Chọn tên khác.":"Không thể tạo workspace. Vui lòng thử lại.";
   redirect(`/onboarding?error=${encodeURIComponent(message)}`);
 }
 redirect("/dashboard");
}
