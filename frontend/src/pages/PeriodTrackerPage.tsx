import { CalendarHeart, Plus, Sparkles, Trash2 } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { Input } from '../components/ui/Input'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { api, type PeriodRecord } from '../lib/api'

function formatDateDisplay(dateStr: string) {
  try {
    return new Intl.DateTimeFormat('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(`${dateStr}T12:00:00`))
  } catch {
    return dateStr
  }
}

export function PeriodTrackerPage() {
  const [records, setRecords] = useState<PeriodRecord[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [cycleLength, setCycleLength] = useState('28')
  const [symptoms, setSymptoms] = useState('')
  const [mood, setMood] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    void api
      .getPeriods()
      .then((data) => {
        setRecords(data)
      })
      .catch((err: Error) => {
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  // Calculate estimated next period
  const nextPeriodEstimate = useMemo(() => {
    if (!records.length) return null
    const latest = records[0]
    const date = new Date(`${latest.start_date}T12:00:00`)
    date.setDate(date.getDate() + (latest.cycle_length || 28))
    return date
  }, [records])

  async function handleAddPeriod(event: React.FormEvent) {
    event.preventDefault()
    if (!startDate) return

    setSaving(true)
    setError('')

    try {
      const newRecord = await api.addPeriod({
        start_date: startDate,
        end_date: endDate || null,
        cycle_length: Number(cycleLength) || 28,
        symptoms: symptoms
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        mood: mood || null,
      })

      setRecords((prev) => [newRecord, ...prev])
      setStartDate('')
      setEndDate('')
      setSymptoms('')
      setMood('')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save period record.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to remove this period record?')) return
    try {
      await api.deletePeriod(id)
      setRecords((prev) => prev.filter((r) => r.id !== id))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not delete record.')
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-purple-700">
          Cycle & Menstrual Care
        </p>
        <h1 className="page-heading mt-1">Period Tracker</h1>
        <p className="page-copy">
          Track your cycle trends privately to better understand your body and prepare questions for your nurse or doctor.
        </p>
      </div>

      {/* Cycle Forecast Banner */}
      {nextPeriodEstimate && (
        <Card className="mt-5 border border-purple-200 bg-purple-50/80">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-purple-700 text-white shadow-sm">
              <CalendarHeart size={24} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-800">
                Estimated Next Period
              </p>
              <p className="mt-0.5 text-xl font-bold text-plum">
                {nextPeriodEstimate.toLocaleDateString('en-ZA', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <p className="text-xs text-cocoa/60 mt-0.5">
                Based on your {records[0]?.cycle_length || 28}-day cycle length
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Add Record Form */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-sand pb-3">
            <Plus className="text-purple-700" size={18} />
            <h2 className="text-base font-bold text-plum">Log a Period</h2>
          </div>

          <form onSubmit={handleAddPeriod} className="mt-4 space-y-4">
            <Input
              label="Start date"
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={saving}
            />

            <Input
              label="End date (optional)"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={saving}
            />

            <Input
              label="Typical cycle length (days)"
              type="number"
              min="15"
              max="60"
              required
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              disabled={saving}
            />

            <Input
              label="Symptoms (optional)"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Cramps, headaches, tender breasts"
              disabled={saving}
            />

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-cocoa">
                Mood <span className="text-xs font-normal text-cocoa/50">(optional)</span>
              </span>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                disabled={saving}
                className="focus-ring min-h-12 w-full rounded-2xl border border-sand bg-white px-4 text-sm text-cocoa"
              >
                <option value="">Select how you feel</option>
                <option value="Calm">Calm</option>
                <option value="Tired">Tired</option>
                <option value="Irritable">Irritable</option>
                <option value="Energetic">Energetic</option>
                <option value="Anxious">Anxious</option>
              </select>
            </label>

            {error && (
              <p className="text-xs font-semibold text-rose" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" fullWidth loading={saving}>
              Save Period Entry
            </Button>
          </form>
        </Card>

        {/* History Records List */}
        <div className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-plum">Cycle History</h2>
            <span className="text-xs text-cocoa/50">{records.length} records saved</span>
          </div>

          {records.length === 0 ? (
            <EmptyState
              icon={<CalendarHeart size={24} />}
              title="No cycle entries yet"
            >
              Add the first day of your last period to start tracking your cycle and predicting future dates.
            </EmptyState>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <Card
                  key={record.id}
                  className="flex items-start justify-between gap-4 border border-sand/70 hover:border-purple-200 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-purple-700" />
                      <p className="font-bold text-plum text-sm sm:text-base">
                        Started {formatDateDisplay(record.start_date)}
                      </p>
                    </div>

                    <p className="mt-1 text-xs sm:text-sm text-cocoa/70">
                      {record.end_date ? `Ended ${formatDateDisplay(record.end_date)} · ` : ''}
                      {record.cycle_length}-day cycle
                      {record.mood ? ` · Mood: ${record.mood}` : ''}
                    </p>

                    {record.symptoms && record.symptoms.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {record.symptoms.map((sym, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-lg bg-purple-50 px-2 py-0.5 text-[11px] font-semibold text-purple-900"
                          >
                            {sym}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => void handleDelete(record.id)}
                    className="focus-ring rounded-xl p-2 text-cocoa/40 hover:bg-rose/10 hover:text-rose transition"
                    aria-label="Delete period record"
                    title="Delete record"
                  >
                    <Trash2 size={17} />
                  </button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
