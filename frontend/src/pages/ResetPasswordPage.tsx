import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { supabase } from '../lib/supabase'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!supabase) return
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (authError) {
      setError(authError.message)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <AuthLayout>
      <Card className="p-6 sm:p-8 border border-sand shadow-lift">
        <h1 className="text-2xl sm:text-3xl font-bold text-plum">Choose New Password</h1>
        <p className="mt-2 text-xs sm:text-sm leading-6 text-cocoa/70">
          Enter your new password below to secure your account.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />

          {error && (
            <div className="rounded-2xl bg-rose/10 border border-rose/20 p-3 text-xs font-semibold text-rose" role="alert">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth loading={loading}>
            Save New Password
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-cocoa/70">
          <Link
            to="/login"
            className="focus-ring rounded font-bold text-purple-700 hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </Card>
    </AuthLayout>
  )
}
