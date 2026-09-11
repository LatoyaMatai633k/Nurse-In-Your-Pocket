import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { AuthNotice } from '../components/auth/AuthNotice'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export function ForgotPasswordPage() {
  const { configured } = useAuth()
  const [email, setEmail] = useState('')
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!supabase) return
    setError('')
    setFeedback('')
    setLoading(true)

    const { error: authError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)
    if (authError) {
      setError(authError.message)
    } else {
      setFeedback('If an account exists for this email, password reset instructions have been sent.')
    }
  }

  return (
    <AuthLayout>
      <Card className="p-6 sm:p-8 border border-sand shadow-lift">
        <h1 className="text-2xl sm:text-3xl font-bold text-plum">Reset Password</h1>
        <p className="mt-2 text-xs sm:text-sm leading-6 text-cocoa/70">
          Enter your registered email address and we will send you a secure reset link.
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
            disabled={!configured || loading}
          />

          {error && (
            <div className="rounded-2xl bg-rose/10 border border-rose/20 p-3 text-xs font-semibold text-rose" role="alert">
              {error}
            </div>
          )}

          {feedback && (
            <div className="rounded-2xl bg-sage/10 border border-sage/20 p-3.5 text-xs font-semibold text-sage" role="status">
              {feedback}
            </div>
          )}

          <Button type="submit" fullWidth loading={loading} disabled={!configured}>
            Send Reset Link
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-cocoa/70">
          Remembered your password?{' '}
          <Link
            to="/login"
            className="focus-ring rounded font-bold text-purple-700 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </AuthLayout>
  )
}
