'use client'

// View: login form. Talks to the server only through the REST api-client.

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ApiRequestError, login } from '@/lib/api-client'
import styles from './LoginForm.module.css'

function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

const GENERIC_ERROR = 'Login failed. Please try again.'
const NETWORK_ERROR = 'Network error. Please try again.'

export default function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message || GENERIC_ERROR : NETWORK_ERROR)
      setLoading(false)
    }
  }

  function toggleShowPassword() {
    setShowPassword((value) => !value)
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginBrand}>
          <div className={styles.brandMark}>B</div>
          <h1 className={styles.loginTitle}>Workplace Intelligence</h1>
          <p className={styles.loginSubtitle}>Sign in to view your benefits</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label className={styles.fieldLabel} htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Username or email"
            className={styles.input}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label className={styles.fieldLabel} htmlFor="password">
            Password
          </label>
          <div className={styles.passwordWrap}>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Password"
              className={styles.input}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className={styles.eyeBtn}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              onClick={toggleShowPassword}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <div className={styles.forgotRow}>
            <a href="#">Forgot User</a>
            <a href="#">Forgot Password</a>
          </div>

          {error && (
            <p className={styles.loginError} role="alert">
              {error}
            </p>
          )}

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? 'Signing in…' : 'Log In'}
          </button>
        </form>

        <p className={styles.demoHint}>
          Demo credentials: <strong>demo</strong> / <strong>benefits123</strong>
        </p>
      </div>
    </div>
  )
}
