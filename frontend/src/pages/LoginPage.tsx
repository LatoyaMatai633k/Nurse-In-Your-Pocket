import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../contexts/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { user, signIn } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  if (user) return <Navigate to="/dashboard" replace />

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!name.trim() || !email.trim() || !password) { setError('Please enter your name, email address, and password.'); return }
    signIn({ name: name.trim(), email: email.trim() })
    navigate('/dashboard')
  }

  return <main className="login-page">
    <section className="login-visual" aria-label="Nurse in Your Pocket community member">
      <img src="/images/girl-image.jpeg" alt="Woman smiling while holding Nurse in Your Pocket on her phone" />
    </section>
    <section className="login-panel">
      <div className="login-form-wrap">
        <img className="login-logo" src="/images/nurse-in-your-pocket-logo.jpeg" alt="Nurse in Your Pocket" />
        <p className="login-kicker">Your health companion</p>
        <h1>Welcome back</h1>
        <p className="login-copy">Sign in to continue your private health journey with Nurse in Your Pocket.</p>
        <form onSubmit={submit} className="login-form">
          <Input label="Your name" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your name" />
          <Input label="Email address" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          <Input label="Password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" />
          {error && <p className="login-error" role="alert">{error}</p>}
          <div className="login-form-links"><Link to="/forgot-password">Forgot password?</Link></div>
          <Button type="submit" fullWidth>Sign in</Button>
        </form>
        <p className="login-footer">New here? <Link to="/sign-up">Create an account</Link></p>
        <p className="login-disclaimer">Nurse in Your Pocket shares health education and does not replace a doctor or nurse.</p>
      </div>
    </section>
  </main>
}
