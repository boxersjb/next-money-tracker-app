'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Database } from '@/types/database'
import { Trash2, FileText, ArrowUpRight, ArrowDownRight, X, Loader2 } from 'lucide-react'

type Transaction = Database['public']['Tables']['transactions']['Row']

interface TransactionListProps {
  initialTransactions: Transaction[]
}

export default function TransactionList({ initialTransactions }: TransactionListProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedSlip, setSelectedSlip] = useState<string | null>(null)

  const handleDelete = async (id: string, slipUrl: string | null) => {
    if (!window.confirm('คุณต้องการลบรายการนี้ใช่หรือไม่?')) return
    setDeletingId(id)

    try {
      // 1. ลบไฟล์จาก Storage ก่อน (ถ้ามี)
      if (slipUrl) {
        try {
          const urlObj = new URL(slipUrl)
          const pathname = urlObj.pathname
          const parts = pathname.split('/slips/')
          if (parts.length > 1) {
            const filePath = decodeURIComponent(parts[1])
            await supabase.storage.from('slips').remove([filePath])
          }
        } catch {
          // ละเว้นหากเกิดข้อผิดพลาดในการแปล Path รูป
        }
      }

      // 2. ลบข้อมูลใน Database
      const { error } = await supabase.from('transactions').delete().eq('id', id)
      if (error) throw error

      router.refresh()
    } catch (err: any) {
      alert(err.message || 'ไม่สามารถลบข้อมูลได้')
    } finally {
      setDeletingId(null)
    }
  }

  if (initialTransactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
        <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
        <p className="text-lg font-medium text-slate-700">ยังไม่มีรายการธุรกรรม</p>
        <p className="text-sm mt-1">กดปุ่ม "เพิ่มรายการใหม่" ด้านบนเพื่อเริ่มต้นบันทึกข้อมูลของคุณ</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                <th className="p-4">ประเภท / วันที่</th>
                <th className="p-4">หมวดหมู่</th>
                <th className="p-4">หมายเหตุ</th>
                <th className="p-4 text-right">จำนวนเงิน</th>
                <th className="p-4 text-center">สลิป</th>
                <th className="p-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {initialTransactions.map((t) => {
                const isIncome = t.type === 'INCOME'
                return (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                          {isIncome ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{isIncome ? 'รายรับ' : 'รายจ่าย'}</p>
                          <p className="text-xs text-slate-400">
                            {new Date(t.transaction_date).toLocaleDateString('th-TH', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-700">{t.category}</td>
                    <td className="p-4 text-slate-500 max-w-xs truncate">{t.note || '-'}</td>
                    <td className={`p-4 text-right font-bold text-base ${isIncome ? 'text-emerald-600' : 'text-red-600'}`}>
                      {isIncome ? '+' : '-'}{t.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿
                    </td>
                    <td className="p-4 text-center">
                      {t.slip_url ? (
                        <button
                          onClick={() => setSelectedSlip(t.slip_url)}
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>ดูสลิป</span>
                        </button>
                      ) : (
                        <span className="text-slate-300 text-xs">-</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(t.id, t.slip_url)}
                        disabled={deletingId === t.id}
                        className="text-slate-400 hover:text-red-600 p-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deletingId === t.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal ดูสลิป (ใช้ next/image optimization) */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h4 className="font-semibold text-slate-800">หลักฐานการโอนเงิน</h4>
              <button
                onClick={() => setSelectedSlip(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex justify-center relative min-h-[400px] bg-slate-100">
              <Image
                src={selectedSlip}
                alt="Transaction Slip"
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}