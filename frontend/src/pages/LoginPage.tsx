import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { AuthNotice } from '../components/auth/AuthNotice'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export function LoginPage() {
  const navigate = useNavigate()
  const { user, configured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)

  if (user) return <Navigate to="/dashboard" replace />

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!supabase) return
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(false)
    if (authError) {
      setError(authError.message)
    } else {
      navigate('/dashboard')
    }
  }

  async function handleGoogleSignIn() {
    if (!supabase) return
    setError('')
    setOauthLoading(true)

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (authError) {
      setOauthLoading(false)
      setError(authError.message)
    }
  }

  return (
    <AuthLayout>
      <Card className="p-6 sm:p-8 border border-sand shadow-lift">
        <h1 className="text-2xl sm:text-3xl font-bold text-plum">Welcome Back</h1>
        <p className="mt-2 text-xs sm:text-sm leading-6 text-cocoa/70">
          Sign in to your private Nurse in Your Pocket account.
        </p>

        {!configured && (
          <div className="mt-5">
            <AuthNotice>
              Supabase environment variables are not yet configured in <code>.env</code>.
            </AuthNotice>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={!configured || loading || oauthLoading}
          />

          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={!configured || loading || oauthLoading}
          />

          {error && (
            <div className="rounded-2xl bg-rose/10 border border-rose/20 p-3 text-xs font-semibold text-rose" role="alert">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="focus-ring rounded text-xs font-semibold text-purple-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={!configured || oauthLoading}
          >
            Sign In
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-cocoa/40">
          <span className="h-px flex-1 bg-sand" />
          <span>or</span>
          <span className="h-px flex-1 bg-sand" />
        </div>

        {/* Google OAuth Button with SVG Google Icon */}
        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={() => void handleGoogleSignIn()}
          loading={oauthLoading}
          disabled={!configured || loading}
        >
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          <span>Continue with Google</span>
        </Button>

        <p className="mt-6 text-center text-xs text-cocoa/70">
          New here?{' '}
          <Link
            to="/sign-up"
            className="focus-ring rounded font-bold text-purple-700 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </Card>
    </AuthLayout>
  )
}
