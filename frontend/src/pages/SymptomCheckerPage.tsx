import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Stethoscope,
} from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { api, type SymptomAssessmentResult } from '../lib/api'

type SymptomForm = {
  symptoms: string
  duration: string
  severity: 'Mild' | 'Moderate' | 'Severe'
  age: string
  medical_context: string
}

const initialForm: SymptomForm = {
  symptoms: '',
  duration: '',
  severity: 'Mild',
  age: '',
  medical_context: '',
}

export function SymptomCheckerPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<SymptomForm>(initialForm)
  const [result, setResult] = useState<SymptomAssessmentResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (key: keyof SymptomForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const validStep1 = form.symptoms.trim().length >= 3 && form.duration.trim().length >= 2
  const validStep2 = Number(form.age) >= 16

  async function handleAssess() {
    setLoading(true)
    setError('')

    try {
      const data = await api.assessSymptoms({
        symptoms: form.symptoms,
        duration: form.duration,
        severity: form.severity,
        age: Number(form.age),
        medical_context: form.medical_context.trim() || undefined,
      })
      setResult(data)
      setStep(4)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to generate symptom assessment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-purple-700">
          Triage & Health Guidance
        </p>
        <h1 className="page-heading mt-1">Symptom Checker</h1>
        <p className="page-copy">
          Answer a few quick questions to prepare a structured summary for your clinic visit or conversation with Nompilo.
        </p>
      </div>

      {/* Emergency Disclaimer Banner */}
      <Card className="mt-5 flex items-start gap-3 border border-rose/30 bg-rose/10 p-4 shadow-none">
        <ShieldAlert className="mt-0.5 shrink-0 text-rose" size={20} />
        <p className="text-xs leading-5 text-cocoa font-medium">
          <strong>This tool does not provide medical diagnoses.</strong> If you are experiencing difficulty breathing, chest pain, sudden fainting, severe heavy bleeding, or an emergency, seek urgent in-person medical care immediately.
        </p>
      </Card>

      {/* Progress Indicators */}
      <div className="mt-6 flex gap-2" aria-label="Assessment progress">
        {[1, 2, 3].map((num) => (
          <span
            key={num}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              step >= num ? 'bg-purple-700' : 'bg-sand'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Symptoms and Duration */}
      {step === 1 && (
        <Card className="mt-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-purple-700">
            <Stethoscope size={16} />
            <span>Step 1 of 3: Primary Symptoms</span>
          </div>

          <h2 className="mt-2 text-lg font-bold text-plum">
            What symptoms are you experiencing?
          </h2>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-cocoa">
                Describe what you feel
              </span>
              <textarea
                value={form.symptoms}
                onChange={(e) => update('symptoms', e.target.value)}
                rows={4}
                className="focus-ring w-full resize-none rounded-2xl border border-sand bg-cream/40 px-4 py-3 text-sm text-cocoa placeholder:text-cocoa/40"
                placeholder="e.g. Sharp lower abdominal pain, burning sensation when urinating, mild nausea"
              />
            </label>

            <Input
              label="How long have you had these symptoms?"
              value={form.duration}
              onChange={(e) => update('duration', e.target.value)}
              placeholder="e.g. 3 days, since yesterday morning"
            />

            <Button
              className="mt-2"
              onClick={() => setStep(2)}
              disabled={!validStep1}
            >
              <span>Continue</span>
              <ArrowRight size={17} />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Context, Severity, Age */}
      {step === 2 && (
        <Card className="mt-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-purple-700">
            <ClipboardList size={16} />
            <span>Step 2 of 3: Context & Severity</span>
          </div>

          <h2 className="mt-2 text-lg font-bold text-plum">
            Help us understand your background
          </h2>

          <div className="mt-5 space-y-4">
            <Input
              label="Your age (years)"
              type="number"
              min="16"
              max="120"
              value={form.age}
              onChange={(e) => update('age', e.target.value)}
              placeholder="e.g. 21"
            />

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-cocoa">
                How severe does the discomfort feel?
              </span>
              <select
                value={form.severity}
                onChange={(e) => update('severity', e.target.value)}
                className="focus-ring min-h-12 w-full rounded-2xl border border-sand bg-white px-4 text-sm text-cocoa"
              >
                <option value="Mild">Mild (Noticeable but manageable)</option>
                <option value="Moderate">Moderate (Interferes with daily tasks)</option>
                <option value="Severe">Severe (Unbearable, debilitating)</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-cocoa">
                Any other medical context?{' '}
                <span className="text-xs font-normal text-cocoa/50">(optional)</span>
              </span>
              <textarea
                value={form.medical_context}
                onChange={(e) => update('medical_context', e.target.value)}
                rows={3}
                className="focus-ring w-full resize-none rounded-2xl border border-sand bg-cream/40 px-4 py-3 text-sm text-cocoa placeholder:text-cocoa/40"
                placeholder="Current medications, pregnancy status, allergies, or past diagnoses"
              />
            </label>

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={() => setStep(1)}>
                <ArrowLeft size={17} />
                <span>Back</span>
              </Button>

              <Button onClick={() => setStep(3)} disabled={!validStep2}>
                <span>Review Summary</span>
                <ArrowRight size={17} />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <Card className="mt-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-purple-700">
            <Sparkles size={16} />
            <span>Step 3 of 3: Summary Review</span>
          </div>

          <h2 className="mt-2 text-lg font-bold text-plum">
            Ready to generate clinic-ready guidance
          </h2>

          <div className="mt-4 space-y-2 rounded-2xl bg-purple-50/70 border border-purple-200 p-4 text-xs sm:text-sm leading-6 text-plum">
            <p>
              <strong>Symptoms:</strong> {form.symptoms}
            </p>
            <p>
              <strong>Duration:</strong> {form.duration}
            </p>
            <p>
              <strong>Severity:</strong> {form.severity}
            </p>
            <p>
              <strong>Age:</strong> {form.age}
            </p>
            {form.medical_context && (
              <p>
                <strong>Context:</strong> {form.medical_context}
              </p>
            )}
          </div>

          {error && (
            <p className="mt-4 text-xs font-semibold text-rose" role="alert">
              {error}
            </p>
          )}

          <div className="mt-5 flex gap-3">
            <Button variant="secondary" onClick={() => setStep(2)}>
              <ArrowLeft size={17} />
              <span>Back</span>
            </Button>

            <Button loading={loading} onClick={() => void handleAssess()}>
              <ClipboardList size={17} />
              <span>Get AI Health Guidance</span>
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Assessment Results */}
      {step === 4 && result && (
        <Card className="mt-5">
          <h2 className="text-xl font-bold text-plum">Assessment & Guidance</h2>

          {result.safety_warning && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl bg-rose/15 border border-rose/30 p-4 text-xs leading-5 text-plum font-semibold">
              <AlertTriangle className="shrink-0 text-rose" size={20} />
              <p>{result.safety_warning}</p>
            </div>
          )}

          <div className="mt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-800">
              Structured Clinical Summary
            </h3>
            <pre className="mt-2 whitespace-pre-wrap rounded-2xl bg-sand/40 border border-sand p-4 font-sans text-xs sm:text-sm leading-6 text-cocoa">
              {result.summary}
            </pre>
          </div>

          <div className="mt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-800">
              Educational Guidance (Gemini AI)
            </h3>
            <div className="mt-2 whitespace-pre-wrap rounded-2xl bg-purple-50/60 border border-purple-200 p-4 text-xs sm:text-sm leading-7 text-plum font-medium">
              {result.guidance}
            </div>
          </div>

          <Button
            className="mt-6"
            variant="secondary"
            onClick={() => {
              setForm(initialForm)
              setResult(null)
              setStep(1)
            }}
          >
            <RotateCcw size={16} />
            <span>Start Another Assessment</span>
          </Button>
        </Card>
      )}
    </div>
  )
}
