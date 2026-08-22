import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/session'
import Portfolio from '@/components/Portfolio'

export const metadata = {
  title: 'Portfolio & Banking - Workplace Intelligence',
}

export default async function PortfolioPage() {
  if (!(await isAuthenticated())) {
    redirect('/login')
  }
  return <Portfolio />
}
