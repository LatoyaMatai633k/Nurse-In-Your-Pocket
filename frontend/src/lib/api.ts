import { supabase } from './supabase'

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'

export type HealthProfile = {
  name: string | null; age: number | null; emergency_contact: string | null; blood_group: string | null
  allergies: string[]; medications: string[]; chronic_conditions: string[]; contraceptive_method: string | null
  preferred_language: 'English' | 'isiZulu' | 'Sesotho' | 'isiXhosa'
}
export type PeriodRecord = { id: string; start_date: string; end_date: string | null; cycle_length: number; symptoms: string[]; mood: string | null; created_at: string }
export type Appointment = { id: string; title: string; appointment_at: string; location: string | null; notes: string | null; reminder_enabled: boolean; created_at: string }
export type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string; created_at: string }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!supabase) throw new Error('Supabase has not been configured.')
  const { data } = await supabase.auth.getSession()
  if (!data.session?.access_token) throw new Error('Your session has expired. Please sign in again.')
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${data.session.access_token}`, 'Content-Type': 'application/json', ...options.headers },
  })
  if (response.status === 204) return undefined as T
  const body = await response.json().catch(() => ({ detail: 'The service returned an unexpected response.' }))
  if (!response.ok) throw new Error(body.detail ?? 'Something went wrong. Please try again.')
  return body as T
}

export const api = {
  getProfile: () => request<HealthProfile>('/profile'),
  saveProfile: (profile: HealthProfile) => request<HealthProfile>('/profile', { method: 'PUT', body: JSON.stringify(profile) }),
  getPeriods: () => request<PeriodRecord[]>('/periods'),
  addPeriod: (record: Omit<PeriodRecord, 'id' | 'created_at'>) => request<PeriodRecord>('/periods', { method: 'POST', body: JSON.stringify(record) }),
  deletePeriod: (id: string) => request<void>(`/periods/${id}`, { method: 'DELETE' }),
  getAppointments: () => request<Appointment[]>('/appointments'),
  saveAppointment: (appointment: Omit<Appointment, 'id' | 'created_at'>, id?: string) => request<Appointment>(`/appointments${id ? `/${id}` : ''}`, { method: id ? 'PUT' : 'POST', body: JSON.stringify(appointment) }),
  deleteAppointment: (id: string) => request<void>(`/appointments/${id}`, { method: 'DELETE' }),
  getMessages: () => request<ChatMessage[]>('/chat/messages'),
  sendMessage: (content: string) => request<{ user_message: ChatMessage; assistant_message: ChatMessage }>('/chat/messages', { method: 'POST', body: JSON.stringify({ content }) }),
  assessSymptoms: (payload: { symptoms: string; duration: string; severity: 'Mild' | 'Moderate' | 'Severe'; age: number; medical_context?: string }) => request<{ summary: string; safety_warning: string | null; guidance: string }>('/symptoms/assessment', { method: 'POST', body: JSON.stringify(payload) }),
}
