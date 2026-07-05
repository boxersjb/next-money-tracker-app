import type { Metadata } from 'next'
import { Kanit, Inter } from 'next/font/google'
import './globals.css'

const kanit = Kanit({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-kanit',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

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
    <html lang="th" className={`${kanit.variable} ${inter.variable} font-sans`}>
      <body className="min-h-screen flex flex-col antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  )
}