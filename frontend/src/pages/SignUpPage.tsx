import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { AuthNotice } from '../components/auth/AuthNotice'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export function SignUpPage() {
  const navigate = useNavigate(); const { configured } = useAuth(); const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  async function submit(event: React.FormEvent) { event.preventDefault(); if (!supabase) return; setError(''); setMessage(''); setLoading(true); const { data, error: authError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/dashboard` } }); setLoading(false); if (authError) setError(authError.message); else if (!data.session) setMessage('Check your email to confirm your account.'); else navigate('/dashboard') }
  return <AuthLayout><Card className="p-6 sm:p-8"><h1 className="font-display text-3xl font-bold">Create your account</h1><p className="mt-2 text-sm leading-6 text-cocoa/65">A calm, private space for your health information.</p>{!configured && <div className="mt-5"><AuthNotice>Add your Supabase keys to <code>.env</code> to enable registration.</AuthNotice></div>}<form className="mt-7 space-y-5" onSubmit={submit}><Input label="First and last name" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" disabled={!configured} /><Input label="Email address" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" disabled={!configured} /><Input label="Create a password" type="password" autoComplete="new-password" minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" disabled={!configured} />{error && <p className="text-sm font-medium text-rose" role="alert">{error}</p>}{message && <p className="text-sm font-medium text-sage" role="status">{message}</p>}<Button type="submit" fullWidth loading={loading} disabled={!configured}>Create account</Button></form><p className="mt-7 text-center text-sm text-cocoa/65">Already have an account? <Link className="focus-ring rounded font-semibold text-terracotta hover:underline" to="/login">Sign in</Link></p></Card></AuthLayout>
}
