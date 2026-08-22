import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/session'
import TotalComp from '@/components/TotalComp'

export const metadata = {
  title: 'Total Comp - Workplace Intelligence',
}

export default async function TotalCompPage() {
  if (!(await isAuthenticated())) {
    redirect('/login')
  }
  return <TotalComp />
}
