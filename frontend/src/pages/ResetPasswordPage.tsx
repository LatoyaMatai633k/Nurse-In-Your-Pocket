import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { supabase } from '../lib/supabase'

export function ResetPasswordPage() {
  const navigate = useNavigate(); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  async function submit(event: React.FormEvent) { event.preventDefault(); if (!supabase) return; setError(''); setLoading(true); const { error: authError } = await supabase.auth.updateUser({ password }); setLoading(false); if (authError) setError(authError.message); else navigate('/dashboard') }
  return <AuthLayout><Card className="p-6 sm:p-8"><h1 className="font-display text-3xl font-bold">Choose a new password</h1><p className="mt-2 text-sm leading-6 text-cocoa/65">Use a password you have not used before.</p><form className="mt-7 space-y-5" onSubmit={submit}><Input label="New password" type="password" autoComplete="new-password" minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" />{error && <p className="text-sm font-medium text-rose" role="alert">{error}</p>}<Button type="submit" fullWidth loading={loading}>Save new password</Button></form><Link className="focus-ring mt-6 inline-block rounded text-sm font-semibold text-terracotta hover:underline" to="/login">Back to sign in</Link></Card></AuthLayout>
}
