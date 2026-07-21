import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { AuthNotice } from '../components/auth/AuthNotice'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export function LoginPage() {
  const navigate = useNavigate(); const { user, configured } = useAuth()
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  if (user) return <Navigate to="/dashboard" replace />
  async function submit(event: React.FormEvent) { event.preventDefault(); if (!supabase) return; setError(''); setLoading(true); const { error: authError } = await supabase.auth.signInWithPassword({ email, password }); setLoading(false); if (authError) setError(authError.message); else navigate('/dashboard') }
  async function googleSignIn() { if (!supabase) return; setError(''); const { error: authError } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/dashboard` } }); if (authError) setError(authError.message) }
  return <AuthLayout><Card className="p-6 sm:p-8"><h1 className="font-display text-3xl font-bold">Welcome back</h1><p className="mt-2 text-sm leading-6 text-cocoa/65">Sign in to continue caring for your health.</p>{!configured && <div className="mt-5"><AuthNotice>Add your Supabase keys to <code>.env</code> to enable sign-in.</AuthNotice></div>}<form className="mt-7 space-y-5" onSubmit={submit}><Input label="Email address" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" disabled={!configured} /><Input label="Password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" disabled={!configured} />{error && <p className="text-sm font-medium text-rose" role="alert">{error}</p>}<div className="text-right"><Link className="focus-ring rounded text-sm font-semibold text-terracotta hover:underline" to="/forgot-password">Forgot password?</Link></div><Button type="submit" fullWidth loading={loading} disabled={!configured}>Sign in</Button></form><div className="my-6 flex items-center gap-3 text-xs text-cocoa/45"><span className="h-px flex-1 bg-sand" />or<span className="h-px flex-1 bg-sand" /></div><Button type="button" variant="secondary" fullWidth onClick={() => void googleSignIn()} disabled={!configured}>Continue with Google</Button><p className="mt-7 text-center text-sm text-cocoa/65">New here? <Link className="focus-ring rounded font-semibold text-terracotta hover:underline" to="/sign-up">Create an account</Link></p></Card></AuthLayout>
}
