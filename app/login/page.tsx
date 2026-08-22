import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/session'
import LoginForm from '@/components/LoginForm'

export const metadata = {
  title: 'Sign In - Workplace Intelligence',
}

export default async function LoginPage() {
  if (await isAuthenticated()) {
    redirect('/dashboard')
  }
  return <LoginForm />
}
