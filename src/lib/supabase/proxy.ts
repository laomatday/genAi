import { createServerClient } from "@supabase/ssr";
import { NextResponse,type NextRequest } from "next/server";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./env";

export async function updateSession(request:NextRequest){
  let response=NextResponse.next({request});
  const supabase=createServerClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{
    cookies:{
      getAll(){return request.cookies.getAll()},
      setAll(cookiesToSet){
        cookiesToSet.forEach(({name,value})=>request.cookies.set(name,value));
        response=NextResponse.next({request});
        cookiesToSet.forEach(({name,value,options})=>response.cookies.set(name,value,options));
      }
    }
  });

  const {data}=await supabase.auth.getClaims();
  const user=data?.claims;
  const path=request.nextUrl.pathname;
  const publicPath=
    path.startsWith("/login")||
    path.startsWith("/signup")||
    path.startsWith("/auth")||
    path.startsWith("/multiverse");

  if(!user&&!publicPath){
    const redirectUrl=request.nextUrl.clone();
    redirectUrl.pathname="/login";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
