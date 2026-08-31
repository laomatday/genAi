"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {LayoutDashboard,Users,Columns3,ListTodo,CalendarDays,FlaskConical,GraduationCap,WalletCards,Siren,Settings} from "lucide-react";
const nav=[
 ["/dashboard","Tổng quan",LayoutDashboard],["/leads","Lead",Users],["/pipeline","Pipeline",Columns3],["/tasks","Việc cần làm",ListTodo],
 ["/appointments","Lịch hẹn",CalendarDays],["/trials","Học thử",FlaskConical],["/enrollments","Đăng ký học",GraduationCap],
 ["/payments","Thanh toán",WalletCards],["/alerts","Báo quản lý",Siren],["/settings","Cấu hình",Settings]
] as const;
export function Sidebar(){
 const pathname=usePathname();
 return <aside className="sidebar"><Link className="brand" href="/dashboard"><span className="brand-logo">g</span><span className="brand-copy"><b>genAi CRM</b><small>Education Sales OS</small></span></Link>
 <nav className="sidebar-nav">{nav.map(([href,label,Icon])=><Link key={href} href={href} className={pathname.startsWith(href)?"nav-item active":"nav-item"}><span className="nav-icon"><Icon size={19}/></span><span>{label}</span></Link>)}</nav></aside>
}
