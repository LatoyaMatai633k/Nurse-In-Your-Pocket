import { CheckCircle2 } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { AuthNotice } from '../components/auth/AuthNotice'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export function SignUpPage() {
  const navigate = useNavigate()
  const { configured } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!supabase) return
    setError('')
    setMessage('')
    setLoading(true)

    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    setLoading(false)
    if (authError) {
      setError(authError.message)
    } else if (!data.session) {
      setMessage('Account created! Please check your email to confirm your registration.')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <AuthLayout>
      <Card className="p-6 sm:p-8 border border-sand shadow-lift">
        <h1 className="text-2xl sm:text-3xl font-bold text-plum">Create Account</h1>
        <p className="mt-2 text-xs sm:text-sm leading-6 text-cocoa/70">
          Join Nurse in Your Pocket for private, supportive health tracking and guidance.
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
            label="Full name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            disabled={!configured || loading}
          />

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

          <Input
            label="Create password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            disabled={!configured || loading}
          />

          {error && (
            <div className="rounded-2xl bg-rose/10 border border-rose/20 p-3 text-xs font-semibold text-rose" role="alert">
              {error}
            </div>
          )}

          {message && (
            <div className="flex items-start gap-2 rounded-2xl bg-sage/10 border border-sage/20 p-3.5 text-xs font-semibold text-sage" role="status">
              <CheckCircle2 size={17} className="shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
          )}

          <Button type="submit" fullWidth loading={loading} disabled={!configured}>
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-cocoa/70">
          Already have an account?{' '}
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
