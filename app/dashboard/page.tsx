import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Navbar from '@/components/Navbar'
import TransactionForm from '@/components/TransactionForm'
import TransactionList from '@/components/TransactionList'
import { Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Database } from '@/types/database'

type Transaction = Database['public']['Tables']['transactions']['Row']

export default async function DashboardPage() {
  const supabase = await createClient()

  // ตรวจสอบ Authentication Session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // ดึงข้อมูล Profile ของผู้ใช้
  const { data: profile } = (await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()) as any

  // ดึงรายการธุรกรรมทั้งหมด เรียงจากวันที่ล่าสุด
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: false })

  const txList = (transactions || []) as Transaction[]

  // คำนวณสรุปยอด (Summary Calculations)
  const totalIncome = txList
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = txList
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const netBalance = totalIncome - totalExpense

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userEmail={user.email} userName={profile?.full_name} />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* สรุปภาพรวมทางการเงิน */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">ยอดเงินคงเหลือสุทธิ</p>
              <h3 className={`text-2xl font-bold ${netBalance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
                {netBalance.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿
              </h3>
            </div>
            <div className="p-3 bg-slate-100 rounded-xl text-slate-700">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">รายรับทั้งหมด</p>
              <h3 className="text-2xl font-bold text-emerald-600">
                +{totalIncome.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">รายจ่ายทั้งหมด</p>
              <h3 className="text-2xl font-bold text-red-600">
                -{totalExpense.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿
              </h3>
            </div>
            <div className="p-3 bg-red-50 rounded-xl text-red-600">
              <ArrowDownRight className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">ประวัติการทำรายการ</h2>
            <p className="text-sm text-slate-500">จัดการและตรวจสอบรายรับ-รายจ่ายย้อนหลัง</p>
          </div>
          <TransactionForm userId={user.id} />
        </div>

        {/* ตารางรายการธุรกรรม */}
        <TransactionList initialTransactions={txList} />
      </main>
    </div>
  )
}