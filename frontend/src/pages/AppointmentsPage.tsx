import {
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { Input } from '../components/ui/Input'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { Modal } from '../components/ui/Modal'
import { api, type Appointment } from '../lib/api'

type AppointmentForm = {
  title: string
  appointment_at: string
  location: string
  notes: string
  reminder_enabled: boolean
}

const emptyForm: AppointmentForm = {
  title: '',
  appointment_at: '',
  location: '',
  notes: '',
  reminder_enabled: true,
}

const formatLocalDateTime = (dateStr: string) => {
  try {
    const d = new Date(dateStr)
    // Format for datetime-local: YYYY-MM-DDTHH:mm
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  } catch {
    return ''
  }
}

const displayFormattedDate = (dateStr: string) => {
  try {
    return new Intl.DateTimeFormat('en-ZA', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Appointment | null>(null)
  const [form, setForm] = useState<AppointmentForm>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    void api
      .getAppointments()
      .then((data) => {
        setAppointments(data)
      })
      .catch((err: Error) => {
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  function openCreateOrEditModal(item?: Appointment) {
    setError('')
    setEditingItem(item ?? null)
    if (item) {
      setForm({
        title: item.title,
        appointment_at: formatLocalDateTime(item.appointment_at),
        location: item.location ?? '',
        notes: item.notes ?? '',
        reminder_enabled: item.reminder_enabled,
      })
    } else {
      setForm(emptyForm)
    }
    setModalOpen(true)
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = {
        title: form.title,
        appointment_at: new Date(form.appointment_at).toISOString(),
        location: form.location.trim() || null,
        notes: form.notes.trim() || null,
        reminder_enabled: form.reminder_enabled,
      }

      const saved = await api.saveAppointment(payload, editingItem?.id)

      setAppointments((current) => {
        const next = editingItem
          ? current.map((a) => (a.id === saved.id ? saved : a))
          : [...current, saved]
        return next.sort((a, b) => a.appointment_at.localeCompare(b.appointment_at))
      })

      setModalOpen(false)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save appointment.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this appointment record?')) return
    try {
      await api.deleteAppointment(id)
      setAppointments((prev) => prev.filter((a) => a.id !== id))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not delete appointment.')
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-purple-700">
            Care Calendar
          </p>
          <h1 className="page-heading mt-1">Appointments</h1>
          <p className="page-copy">
            Organize upcoming clinic visits, contraceptive collections, and doctor consultations.
          </p>
        </div>

        <Button onClick={() => openCreateOrEditModal()}>
          <Plus size={18} />
          <span>Add Appointment</span>
        </Button>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl bg-rose/10 border border-rose/20 p-4 text-xs font-semibold text-rose">
          {error}
        </div>
      )}

      {/* Appointments List */}
      <section className="mt-7">
        {appointments.length === 0 ? (
          <EmptyState
            icon={<CalendarDays size={24} />}
            title="No appointments scheduled"
          >
            Keep track of your next clinic visit, routine screening, or pharmacy pick-up.
          </EmptyState>
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment) => {
              const isPast = new Date(appointment.appointment_at) < new Date()
              return (
                <Card
                  key={appointment.id}
                  className={`border transition ${
                    isPast
                      ? 'border-sand/60 bg-white/70 opacity-80'
                      : 'border-sand hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                        isPast
                          ? 'bg-sand text-cocoa/50'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      <CalendarDays size={22} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-plum text-base">
                          {appointment.title}
                        </h3>
                        {isPast && (
                          <span className="rounded bg-sand/80 px-2 py-0.5 text-[10px] font-semibold text-cocoa/60">
                            Past
                          </span>
                        )}
                      </div>

                      <p className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-cocoa/70 font-medium">
                        <Clock3 size={15} className="text-purple-700 shrink-0" />
                        <span>{displayFormattedDate(appointment.appointment_at)}</span>
                      </p>

                      {appointment.location && (
                        <p className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-cocoa/65">
                          <MapPin size={15} className="text-purple-700 shrink-0" />
                          <span>{appointment.location}</span>
                        </p>
                      )}

                      {appointment.notes && (
                        <p className="mt-3 rounded-xl bg-sand/30 p-2.5 text-xs leading-5 text-cocoa/80">
                          {appointment.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => openCreateOrEditModal(appointment)}
                        className="focus-ring rounded-xl p-2 text-cocoa/50 hover:bg-purple-50 hover:text-purple-700 transition"
                        aria-label="Edit appointment"
                        title="Edit"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => void handleDelete(appointment.id)}
                        className="focus-ring rounded-xl p-2 text-cocoa/40 hover:bg-rose/10 hover:text-rose transition"
                        aria-label="Delete appointment"
                        title="Delete"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {/* Modal for Add / Edit */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Appointment' : 'Add New Appointment'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Appointment Title"
            required
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="e.g. Clinic Follow-up, Pap Smear"
          />

          <Input
            label="Date and Time"
            type="datetime-local"
            required
            value={form.appointment_at}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, appointment_at: e.target.value }))
            }
          />

          <Input
            label="Clinic or Location (optional)"
            value={form.location}
            onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
            placeholder="e.g. Hillbrow Community Health Centre"
          />

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-cocoa">
              Notes <span className="text-xs font-normal text-cocoa/50">(optional)</span>
            </span>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
              maxLength={1000}
              className="focus-ring w-full resize-none rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-cocoa placeholder:text-cocoa/40"
              placeholder="Questions to ask the nurse, blood tests to request, etc."
            />
          </label>

          <label className="flex min-h-12 items-center gap-3 rounded-2xl bg-purple-50/70 border border-purple-200 px-4 text-xs font-semibold text-plum cursor-pointer">
            <input
              type="checkbox"
              checked={form.reminder_enabled}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, reminder_enabled: e.target.checked }))
              }
              className="h-4 w-4 accent-purple-700"
            />
            <span>Enable visit reminder notifications</span>
          </label>

          <Button type="submit" fullWidth loading={saving}>
            Save Appointment
          </Button>
        </form>
      </Modal>
    </div>
  )
}
