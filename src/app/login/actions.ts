"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData:FormData){
  const email=String(formData.get("email")??"").trim();
  const password=String(formData.get("password")??"");
  const supabase=await createClient();
  const {error}=await supabase.auth.signInWithPassword({email,password});
  if(error)redirect(`/login?error=${encodeURIComponent("Email hoặc mật khẩu chưa đúng")}`);
  const {data:members}=await supabase.from("workspace_members").select("id").eq("status","ACTIVE").limit(1);
  redirect(members?.length?"/dashboard":"/onboarding");
}
