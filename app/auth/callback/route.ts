import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // หากเกิด Error ในการยืนยัน ให้ Redirect กลับไปหน้า Login พร้อมส่งข้อความแจ้งเตือน
  return NextResponse.redirect(`${origin}/login?error=Authentication%20failed`)
}