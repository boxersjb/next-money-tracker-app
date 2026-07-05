import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Money Tracker App - บันทึกรายรับรายจ่ายอย่างมืออาชีพ',
  description: 'แอปพลิเคชันบันทึกรายรับรายจ่าย พร้อมระบบอัปโหลดสลิป ปลอดภัยด้วย Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Kanit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  )
}