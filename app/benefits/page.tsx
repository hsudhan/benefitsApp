import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/session'
import Benefits from '@/components/Benefits'

export const metadata = {
  title: 'Benefits - Workplace Intelligence',
}

export default async function BenefitsPage() {
  if (!(await isAuthenticated())) {
    redirect('/login')
  }
  return <Benefits />
}
