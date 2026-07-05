import Link from 'next/link'
import { Wallet, ShieldCheck, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl text-emerald-600">
          <Wallet className="w-7 h-7" />
          <span>Money Tracker</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-lg transition-colors"
          >
            เข้าสู่ระบบ
          </Link>
          <Link
            href="/register"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-all"
          >
            เริ่มต้นใช้งานฟรี
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center px-4 py-16 max-w-5xl mx-auto text-center">
        <span className="bg-emerald-100 text-emerald-800 text-sm font-semibold px-3 py-1 rounded-full mb-6">
          v1.0 Production Ready
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
          จัดการเงินของคุณได้อย่างแม่นยำ <br className="hidden md:inline" />
          <span className="text-emerald-600">พร้อมแนบสลิปหลักฐาน</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10">
          บันทึกรายรับ-รายจ่าย ตรวจสอบสถิติด้านการเงินของคุณด้วยระบบที่ปลอดภัย 
          รองรับการเข้าสู่ระบบผ่าน Google และการเก็บสลิปขึ้น Cloud Storage อย่างปลอดภัย
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Link
            href="/register"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md transition-all text-center"
          >
            ลงทะเบียนใช้งานทันที
          </Link>
          <Link
            href="/login"
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-8 py-3.5 rounded-xl shadow-sm transition-all text-center"
          >
            มีบัญชีอยู่แล้ว? เข้าสู่ระบบ
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full text-left">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Zap className="w-10 h-10 text-emerald-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">รวดเร็วและแม่นยำ</h3>
            <p className="text-slate-600 text-sm">สร้างขึ้นด้วย Next.js 15 และ Tailwind CSS v4 ให้ประสบการณ์ใช้งานที่ลื่นไหล</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <ShieldCheck className="w-10 h-10 text-emerald-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">ปลอดภัยระดับสูงสุด</h3>
            <p className="text-slate-600 text-sm">ข้อมูลทุกรายการถูกปกป้องด้วย Row Level Security (RLS) จาก Supabase</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Wallet className="w-10 h-10 text-emerald-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">จัดเก็บหลักฐานสลิป</h3>
            <p className="text-slate-600 text-sm">อัปโหลดและเรียกดูสลิปโอนเงินได้ตลอดเวลา ป้องกันไฟล์สูญหาย</p>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-slate-500 border-t border-slate-200 bg-white">
        &copy; {new Date().getFullYear()} Money Tracker App. All rights reserved.
      </footer>
    </div>
  )
}