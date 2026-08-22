import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/session'
import Dashboard from '@/components/Dashboard'

export const metadata = {
  title: 'Dashboard - Workplace Intelligence',
}

export default async function DashboardPage() {
  if (!(await isAuthenticated())) {
    redirect('/login')
  }
  return <Dashboard />
}
