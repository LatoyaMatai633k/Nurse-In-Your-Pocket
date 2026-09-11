import { CheckCircle2, HeartHandshake, Save, ShieldCheck } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { api, type HealthProfile } from '../lib/api'

const defaultProfile: HealthProfile = {
  name: null,
  age: null,
  emergency_contact: null,
  blood_group: null,
  allergies: [],
  medications: [],
  chronic_conditions: [],
  contraceptive_method: null,
  preferred_language: 'English',
}

const formatList = (items: string[]) => items.join(', ')
const parseList = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

export function ProfilePage() {
  const [profile, setProfile] = useState<HealthProfile>(defaultProfile)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    void api
      .getProfile()
      .then((data) => {
        setProfile(data)
      })
      .catch((err: Error) => {
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  const updateField = <K extends keyof HealthProfile>(key: K, value: HealthProfile[K]) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
    setSavedSuccess(false)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setSavedSuccess(false)
    setError('')

    try {
      const updated = await api.saveProfile(profile)
      setProfile(updated)
      setSavedSuccess(true)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save health profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="mx-auto max-w-3xl">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-purple-700">
          Personal Care Record
        </p>
        <h1 className="page-heading mt-1">Health Profile</h1>
        <p className="page-copy">
          Keep your essential medical notes in one private, secure place to help you prepare for clinic visits.
        </p>
      </div>

      <Card className="mt-5 flex items-start gap-3 border border-purple-200 bg-purple-50/70 p-4 shadow-none">
        <ShieldCheck className="mt-0.5 shrink-0 text-purple-700" size={20} />
        <p className="text-xs leading-5 text-plum">
          Your personal profile is encrypted and saved securely to your account. You have full control to edit or update it anytime.
        </p>
      </Card>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        {/* Personal Details Card */}
        <Card>
          <div className="flex items-center gap-2 border-b border-sand pb-3">
            <HeartHandshake className="text-purple-700" size={20} />
            <h2 className="text-lg font-bold text-plum">Personal Information</h2>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Input
              label="Full name or preferred name"
              value={profile.name ?? ''}
              onChange={(e) => updateField('name', e.target.value || null)}
              placeholder="e.g. Thandiwe Khumalo"
              disabled={loading || saving}
            />

            <Input
              label="Age"
              type="number"
              min="16"
              max="120"
              value={profile.age ?? ''}
              onChange={(e) => updateField('age', e.target.value ? Number(e.target.value) : null)}
              placeholder="e.g. 24"
              disabled={loading || saving}
            />

            <Input
              label="Emergency contact"
              value={profile.emergency_contact ?? ''}
              onChange={(e) => updateField('emergency_contact', e.target.value || null)}
              placeholder="Name and contact number"
              disabled={loading || saving}
            />

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-cocoa">
                Preferred language
              </span>
              <select
                value={profile.preferred_language}
                onChange={(e) =>
                  updateField(
                    'preferred_language',
                    e.target.value as HealthProfile['preferred_language']
                  )
                }
                disabled={loading || saving}
                className="focus-ring min-h-12 w-full rounded-2xl border border-sand bg-white px-4 text-sm text-cocoa"
              >
                <option value="English">English</option>
                <option value="isiZulu">isiZulu</option>
                <option value="Sesotho">Sesotho</option>
                <option value="isiXhosa">isiXhosa</option>
              </select>
            </label>
          </div>
        </Card>

        {/* Clinical Notes Card */}
        <Card>
          <div className="flex items-center gap-2 border-b border-sand pb-3">
            <ShieldCheck className="text-purple-700" size={20} />
            <h2 className="text-lg font-bold text-plum">Medical Context & History</h2>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Input
              label="Blood group"
              value={profile.blood_group ?? ''}
              onChange={(e) => updateField('blood_group', e.target.value || null)}
              placeholder="e.g. O+, A-, B+"
              disabled={loading || saving}
            />

            <Input
              label="Contraceptive method (if any)"
              value={profile.contraceptive_method ?? ''}
              onChange={(e) => updateField('contraceptive_method', e.target.value || null)}
              placeholder="e.g. Injection (Depo), Pill, Implant"
              disabled={loading || saving}
            />

            <Input
              label="Allergies"
              value={formatList(profile.allergies)}
              onChange={(e) => updateField('allergies', parseList(e.target.value))}
              placeholder="e.g. Penicillin, Peanuts (comma-separated)"
              disabled={loading || saving}
            />

            <Input
              label="Current medications"
              value={formatList(profile.medications)}
              onChange={(e) => updateField('medications', parseList(e.target.value))}
              placeholder="e.g. Iron supplements, ARVs (comma-separated)"
              disabled={loading || saving}
            />

            <div className="sm:col-span-2">
              <Input
                label="Chronic conditions"
                value={formatList(profile.chronic_conditions)}
                onChange={(e) => updateField('chronic_conditions', parseList(e.target.value))}
                placeholder="e.g. Asthma, Hypertension (comma-separated)"
                disabled={loading || saving}
              />
            </div>
          </div>
        </Card>

        {error && (
          <div className="rounded-2xl bg-rose/10 border border-rose/20 p-4 text-xs font-semibold text-rose">
            {error}
          </div>
        )}

        {savedSuccess && (
          <div className="flex items-center gap-2 rounded-2xl bg-sage/10 border border-sage/20 p-4 text-xs font-semibold text-sage">
            <CheckCircle2 size={18} />
            <span>Your health profile has been saved and updated successfully.</span>
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <Button type="submit" loading={saving} disabled={loading}>
            <Save size={18} />
            <span>Save Profile</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
