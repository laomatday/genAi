"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signup(formData:FormData){
  const fullName=String(formData.get("fullName")??"").trim();
  const email=String(formData.get("email")??"").trim();
  const password=String(formData.get("password")??"");
  if(fullName.length<2)redirect(`/signup?error=${encodeURIComponent("Vui lòng nhập họ tên")}`);
  if(password.length<8)redirect(`/signup?error=${encodeURIComponent("Mật khẩu cần ít nhất 8 ký tự")}`);
  const h=await headers();
  const origin=h.get("origin")??"http://localhost:3000";
  const supabase=await createClient();
  const {data,error}=await supabase.auth.signUp({
    email,password,
    options:{data:{full_name:fullName},emailRedirectTo:`${origin}/auth/confirm`}
  });
  if(error)redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  if(data.session)redirect("/onboarding");
  redirect(`/login?message=${encodeURIComponent("Đã tạo tài khoản. Kiểm tra email để xác thực rồi đăng nhập.")}`);
}
