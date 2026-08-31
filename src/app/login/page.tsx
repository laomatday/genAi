import Link from "next/link";
import { login } from "./actions";
export default async function Login({searchParams}:{searchParams:Promise<{error?:string;message?:string}>}){
  const {error,message}=await searchParams;
  return <main className="login-page"><section className="login-card">
    <div className="brand-mark">g</div><h1>genAi CRM</h1><p>Đăng nhập để tiếp tục quản lý tuyển sinh.</p>
    {error?<div className="error-note">{error}</div>:null}
    {message?<div className="success-note">{message}</div>:null}
    <form action={login} className="form-stack">
      <label>Email<input name="email" type="email" required placeholder="email@trungtam.vn"/></label>
      <label>Mật khẩu<input name="password" type="password" required placeholder="••••••••"/></label>
      <button className="primary-btn" type="submit">Đăng nhập</button>
    </form>
    <p className="auth-switch">Chưa có tài khoản? <a href="/signup">Tạo tài khoản</a></p>
  </section></main>
}
