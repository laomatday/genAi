import { Search,HelpCircle,Bell } from "lucide-react";
export function Topbar(){return <header className="topbar">
 <div className="command-search"><Search size={19}/><input placeholder="Tìm lead, phụ huynh, học viên, số điện thoại..."/><kbd>⌘ K</kbd></div>
 <button className="icon-btn" aria-label="Trợ giúp"><HelpCircle size={19}/></button><button className="icon-btn" aria-label="Thông báo"><Bell size={19}/></button>
 <div className="user-chip"><span className="user-avatar">NH</span><span><b>Nguyễn Hải</b><small>Sales Manager</small></span></div>
 </header>}
