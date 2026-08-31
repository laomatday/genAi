# genAi CRM

CRM SaaS tuyển sinh đa cơ sở theo workflow **SM → HoEC → EC**.

## Stack
- Next.js 16.3.3 / React 19.2.8 / Node 22+
- Supabase Postgres + Auth + RLS
- `@supabase/ssr` 0.12.5
- genAi: `#243C8F`, `#19B7A5`, `#69B7FF`
- Typography: Google Sans / Google Sans Text / Product Sans fallback

> Không đưa file font vào repo. App dùng Google Sans khi máy người dùng có font và fallback sang system sans khi không có.

## Mô hình Lead đa cơ sở
`leads` lưu khách hàng/nguồn chung. `lead_centers` lưu hành trình ở từng cơ sở:
- cơ sở + team
- EC phụ trách
- pipeline stage riêng
- nhiệt độ / ưu tiên
- giá trị dự kiến
- việc tiếp theo + SLA

Vì vậy cùng một phụ huynh có thể đang **Học thử ở Hải Châu** và **Đang theo ở Sơn Trà** mà không làm sai pipeline.

## Module
Dashboard, Lead đa cơ sở, Pipeline Kanban kéo-thả, Việc cần làm, Lịch hẹn & Check-in, Học thử, Đăng ký học, Thanh toán, Báo quản lý, Cấu hình, approvals, alerts và audit schema.

## Auth & onboarding
1. User đăng ký tài khoản tại `/signup` và xác thực email.
2. Nếu user chưa thuộc workspace nào, `/onboarding` cho phép tạo workspace mới.
3. Insert workspace được RLS giới hạn bằng `created_by_user_id = auth.uid()`.
4. Trigger private `bootstrap_new_workspace` tự gán người tạo thành **SM** và seed pipeline chuẩn 21 trạng thái.
5. User đã thuộc workspace không thể bootstrap thêm workspace qua luồng này.

Production không seed fake customer/lead. Một SaaS account có thể tạo workspace riêng, sau đó SM thêm nhiều cơ sở và nhân viên bên trong.

## Local
```bash
cp .env.example .env.local
npm install
npm run typecheck
npm run lint
npm run dev
```

## Supabase production
- Project ref: `mgilfojjplgmfuycsekb`
- URL: `https://mgilfojjplgmfuycsekb.supabase.co`

```bash
supabase login
supabase link --project-ref mgilfojjplgmfuycsekb
supabase migration list
```

Publishable key là client key và được giới hạn bởi RLS. **Không đưa secret/service-role key vào frontend hoặc GitHub.**

## Security
- RLS bật trên 20/20 bảng public.
- SM: phạm vi workspace.
- HoEC: team mình quản.
- EC: lead-center mình phụ trách.
- Front Desk / Academic / CS không được quyền đọc toàn bộ pipeline sale.
- Server auth dùng `getClaims()`.
- View `lead_center_cards` dùng `security_invoker=true`.
- Helper `SECURITY DEFINER` nằm trong schema `private`, revoke public.
- Trigger kiểm tra `workspace_id` ngăn liên kết chéo tenant.
- Supabase Security Advisor hiện không còn cảnh báo.

## Brand / UX
UI lấy cảm hứng từ Gemini nhưng dùng nhận diện genAi: surface mềm, whitespace lớn, custom dropdown/popover, Kanban rõ trạng thái và ngôn ngữ đơn giản cho sale.
