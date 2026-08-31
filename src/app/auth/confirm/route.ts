import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest,NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET(request:NextRequest){
 const {searchParams}=new URL(request.url);
 const token_hash=searchParams.get("token_hash");
 const type=searchParams.get("type") as EmailOtpType|null;
 const code=searchParams.get("code");
 const supabase=await createClient();
 let authError=null;
 if(token_hash&&type){({error:authError}=await supabase.auth.verifyOtp({type,token_hash}));}
 else if(code){({error:authError}=await supabase.auth.exchangeCodeForSession(code));}
 else authError=new Error("MISSING_AUTH_CODE");
 const redirectTo=request.nextUrl.clone();redirectTo.search="";
 if(!authError){
   const {data:members}=await supabase.from("workspace_members").select("id").eq("status","ACTIVE").limit(1);
   redirectTo.pathname=members?.length?"/dashboard":"/onboarding";
   return NextResponse.redirect(redirectTo);
 }
 redirectTo.pathname="/login";redirectTo.searchParams.set("error","Liên kết xác thực không hợp lệ hoặc đã hết hạn");
 return NextResponse.redirect(redirectTo);
}
