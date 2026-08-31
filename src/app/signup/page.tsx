import Link from "next/link";
import { signup } from "./actions";
export default async function Signup({searchParams}:{searchParams:Promise<{error?:string}>}){
 const {error}=await searchParams;
 return <main className="login-page"><section className="login-card">
  <div className="brand-mark">g</div><h1>Tạo tài khoản</h1><p>Tạo tài khoản để vào workspace hiện có hoặc khởi tạo một workspace CRM mới.</p>
  {error?<div className="error-note">{error}</div>:null}
  <form action={signup} className="form-stack">
    <label>Họ tên<input name="fullName" required placeholder="Nguyễn Văn A"/></label>
    <label>Email<input name="email" type="email" required placeholder="email@trungtam.vn"/></label>
    <label>Mật khẩu<input name="password" type="password" minLength={8} required placeholder="Ít nhất 8 ký tự"/></label>
    <button className="primary-btn" type="submit">Tạo tài khoản</button>
  </form>
  <p className="auth-switch">Đã có tài khoản? <Link href="/login">Đăng nhập</Link></p>
 </section></main>
}
