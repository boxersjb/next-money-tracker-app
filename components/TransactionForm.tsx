'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { PlusCircle, Upload, X, Loader2 } from 'lucide-react'

interface TransactionFormProps {
  userId: string
}

export default function TransactionForm({ userId }: TransactionFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('อาหารและเครื่องดื่ม')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [slipFile, setSlipFile] = useState<File | null>(null)

  const categories = {
    EXPENSE: ['อาหารและเครื่องดื่ม', 'การเดินทาง', 'ที่พักอาศัย', 'ช้อปปิ้ง', 'บันเทิง', 'บิล/สาธารณูปโภค', 'อื่นๆ'],
    INCOME: ['เงินเดือน', 'โบนัส', 'ฟรีแลนซ์/อาชีพเสริม', 'การลงทุน', 'อื่นๆ']
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      // ตรวจสอบขนาดไฟล์ไม่เกิน 5MB
      if (file.size > 5 * 1024 * 1024) {
        setError('ขนาดไฟล์ต้องไม่เกิน 5MB')
        return
      }
      setSlipFile(file)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let slipUrl: string | null = null

      // อัปโหลดไฟล์รูปภาพหากมีการแนบสลิป
      if (slipFile) {
        const fileExt = slipFile.name.split('.').pop()
        const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('slips')
          .upload(fileName, slipFile)

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from('slips')
          .getPublicUrl(fileName)

        slipUrl = publicUrlData.publicUrl
      }

      // บันทึกข้อมูลลงฐานข้อมูล
      const { error: dbError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type,
          amount: parseFloat(amount),
          category,
          note: note.trim() || null,
          slip_url: slipUrl,
          transaction_date: new Date(date).toISOString(),
        } as any)

      if (dbError) throw dbError

      // รีเซ็ตค่าและปิดฟอร์ม
      setAmount('')
      setNote('')
      setSlipFile(null)
      setIsOpen(false)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all"
      >
        <PlusCircle className="w-5 h-5" />
        <span>เพิ่มรายการใหม่</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-4">เพิ่มรายการธุรกรรม</h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setType('EXPENSE')
                    setCategory(categories.EXPENSE[0])
                  }}
                  className={`py-2 rounded-lg font-medium text-sm transition-all ${
                    type === 'EXPENSE'
                      ? 'bg-red-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  รายจ่าย
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('INCOME')
                    setCategory(categories.INCOME[0])
                  }}
                  className={`py-2 rounded-lg font-medium text-sm transition-all ${
                    type === 'INCOME'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  รายรับ
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">จำนวนเงิน (บาท)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-lg font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">หมวดหมู่</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  {categories[type].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">วันที่ทำรายการ</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">หมายเหตุเพิ่มเติม</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="เช่น ซื้อกาแฟเช้า, ค่าโดยสารรถไฟฟ้า"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">แนบสลิป/ใบเสร็จ (สูงสุด 5MB)</label>
                <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 transition-colors">
                  <Upload className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-600">
                    {slipFile ? slipFile.name : 'คลิกเพื่อเลือกรูปภาพ'}
                  </span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-xl transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  <span>บันทึกรายการ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}