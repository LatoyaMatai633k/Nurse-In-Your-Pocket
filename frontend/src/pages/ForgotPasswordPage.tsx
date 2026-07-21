import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { AuthNotice } from '../components/auth/AuthNotice'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export function ForgotPasswordPage() {
  const { configured } = useAuth(); const [email, setEmail] = useState(''); const [feedback, setFeedback] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  async function submit(event: React.FormEvent) { event.preventDefault(); if (!supabase) return; setError(''); setLoading(true); const { error: authError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` }); setLoading(false); if (authError) setError(authError.message); else setFeedback('If an account exists for this email, a reset link is on its way.') }
  return <AuthLayout><Card className="p-6 sm:p-8"><h1 className="font-display text-3xl font-bold">Reset your password</h1><p className="mt-2 text-sm leading-6 text-cocoa/65">Enter your email and we’ll send a secure reset link.</p>{!configured && <div className="mt-5"><AuthNotice>Add your Supabase keys to <code>.env</code> to enable password recovery.</AuthNotice></div>}<form className="mt-7 space-y-5" onSubmit={submit}><Input label="Email address" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" disabled={!configured} />{error && <p className="text-sm font-medium text-rose" role="alert">{error}</p>}{feedback && <p className="text-sm font-medium text-sage" role="status">{feedback}</p>}<Button type="submit" fullWidth loading={loading} disabled={!configured}>Send reset link</Button></form><Link className="focus-ring mt-6 inline-block rounded text-sm font-semibold text-terracotta hover:underline" to="/login">Back to sign in</Link></Card></AuthLayout>
}
