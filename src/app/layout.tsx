import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "genAi CRM", description: "CRM tuyển sinh đa cơ sở cho trung tâm giáo dục" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
