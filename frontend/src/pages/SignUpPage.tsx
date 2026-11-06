import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../contexts/AuthContext'

export function SignUpPage() {
  const navigate = useNavigate(); const { signIn } = useAuth()
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('')
  function submit(event: React.FormEvent) { event.preventDefault(); if (!name.trim() || !email.trim() || password.length < 6) { setError('Enter your name, a valid email address, and a password of at least 6 characters.'); return }; signIn({ name: name.trim(), email: email.trim() }); navigate('/dashboard') }
  return <AuthLayout><section className="p-6 sm:p-8"><h1 className="text-2xl font-bold text-plum">Create account</h1><p className="mt-2 text-sm leading-6 text-cocoa/70">Set up your private Nurse in Your Pocket space on this device.</p><form onSubmit={submit} className="mt-6 space-y-4"><Input label="Full name" required value={name} onChange={(e) => setName(e.target.value)} /><Input label="Email address" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /><Input label="Create password" type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} />{error && <p className="login-error">{error}</p>}<Button type="submit" fullWidth>Create account</Button></form><p className="mt-6 text-center text-xs text-cocoa/70">Already have an account? <Link className="font-bold text-purple-700 hover:underline" to="/login">Sign in</Link></p></section></AuthLayout>
}
