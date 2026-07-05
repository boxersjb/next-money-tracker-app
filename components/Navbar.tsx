'use client'

import Link from 'next/link'
import { Wallet, LogOut, User as UserIcon } from 'lucide-react'

interface NavbarProps {
  userEmail?: string
  userName?: string | null
}

export default function Navbar({ userEmail, userName }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-emerald-600">
          <Wallet className="w-6 h-6" />
          <span>Money Tracker</span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
            <UserIcon className="w-4 h-4 text-slate-500" />
            <span>{userName || userEmail}</span>
          </div>

          <form action="/api/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-1.5 text-sm text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>ออกจากระบบ</span>
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}