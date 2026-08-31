import type {DashboardMetrics,LeadCenterCard,PipelineStage} from "@/lib/types";
export const demoStages:PipelineStage[]=[
{id:"new",code:"NEW",name:"Lead mới",color:"#69B7FF",position:1,is_closed:false,is_won:false},
{id:"contacted",code:"CONTACTED",name:"Đã liên hệ",color:"#4E7FEA",position:2,is_closed:false,is_won:false},
{id:"confirmed",code:"CONFIRMED",name:"Đã hẹn",color:"#69B7FF",position:3,is_closed:false,is_won:false},
{id:"checkin",code:"CHECK_IN",name:"Check-in",color:"#19B7A5",position:4,is_closed:false,is_won:false},
{id:"trial",code:"TRIAL",name:"Học thử",color:"#34C8B5",position:5,is_closed:false,is_won:false},
{id:"follow",code:"FOLLOW_UP",name:"Đang theo",color:"#F3B64C",position:6,is_closed:false,is_won:false},
{id:"enrolled",code:"ENROLLED",name:"Đã đăng ký",color:"#0F8F80",position:7,is_closed:true,is_won:true}
];
export const demoCards:LeadCenterCard[]=[
{id:"lc1",lead_id:"l1",guardian_name:"Nguyễn Minh Anh",student_name:"Bé Bảo",phone:"0905 123 456",center_name:"Hải Châu",related_centers:["Sơn Trà"],owner_name:"Phạm Gia Hân",stage_id:"new",stage_name:"Lead mới",expected_value:9900000,temperature:"Nóng",priority:"P1 - Gấp",next_action:"Gọi lần đầu trong 5 phút",next_follow_up_at:null},
{id:"lc2",lead_id:"l2",guardian_name:"Trần Ngọc Thảo",student_name:"Bé Kem",phone:"0935 881 299",center_name:"Sơn Trà",related_centers:["Hải Châu"],owner_name:"Võ Quốc Bảo",stage_id:"confirmed",stage_name:"Đã hẹn",expected_value:12900000,temperature:"Ấm",priority:"P2 - Cao",next_action:"Nhắc lịch Check-in 17:30",next_follow_up_at:null},
{id:"lc3",lead_id:"l3",guardian_name:"Lê Thanh Hằng",student_name:"Bé Bin",phone:"0914 662 108",center_name:"Sơn Trà",related_centers:[],owner_name:"Đặng Khánh Linh",stage_id:"checkin",stage_name:"Check-in",expected_value:18900000,temperature:"Nóng",priority:"P1 - Gấp",next_action:"Chuyển học thử",next_follow_up_at:null},
{id:"lc4",lead_id:"l4",guardian_name:"Phạm Quốc Tuấn",student_name:"Bé Tom",phone:"0901 902 881",center_name:"Hải Châu",related_centers:["Ngũ Hành Sơn"],owner_name:"Phạm Gia Hân",stage_id:"trial",stage_name:"Học thử",expected_value:9900000,temperature:"Nóng",priority:"P1 - Gấp",next_action:"Gọi sau học thử",next_follow_up_at:null},
{id:"lc5",lead_id:"l5",guardian_name:"Võ Mỹ Kim",student_name:"Bé Mia",phone:"0905 771 329",center_name:"Hải Châu",related_centers:["Sơn Trà"],owner_name:"Võ Quốc Bảo",stage_id:"follow",stage_name:"Đang theo",expected_value:15900000,temperature:"Ấm",priority:"P2 - Cao",next_action:"Gọi lại 09:00 ngày mai",next_follow_up_at:null},
{id:"lc6",lead_id:"l6",guardian_name:"Hoàng Thu Nhung",student_name:"Bé Su",phone:"0934 445 661",center_name:"Sơn Trà",related_centers:["Hải Châu"],owner_name:"Đặng Khánh Linh",stage_id:"enrolled",stage_name:"Đã đăng ký",expected_value:18900000,temperature:"Nóng",priority:"P2 - Cao",next_action:"Chăm sóc đầu khóa",next_follow_up_at:null}
];
export const demoMetrics:DashboardMetrics={newLeads:34,appointments:18,enrolled:9,collectedRevenue:128600000,overdueTasks:4,openAlerts:3};
