import { supabase } from './supabase'

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').replace(/\/+$/, '')

export type HealthProfile = {
  name: string | null
  age: number | null
  emergency_contact: string | null
  blood_group: string | null
  allergies: string[]
  medications: string[]
  chronic_conditions: string[]
  contraceptive_method: string | null
  preferred_language: 'English' | 'isiZulu' | 'Sesotho' | 'isiXhosa'
}

export type PeriodRecord = {
  id: string
  start_date: string
  end_date: string | null
  cycle_length: number
  symptoms: string[]
  mood: string | null
  created_at: string
}

export type Appointment = {
  id: string
  title: string
  appointment_at: string
  location: string | null
  notes: string | null
  reminder_enabled: boolean
  created_at: string
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export type SymptomAssessmentPayload = {
  symptoms: string
  duration: string
  severity: 'Mild' | 'Moderate' | 'Severe'
  age: number
  medical_context?: string
}

export type SymptomAssessmentResult = {
  summary: string
  safety_warning: string | null
  guidance: string
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!supabase) {
    throw new Error('Supabase authentication is not configured.')
  }

  const { data } = await supabase.auth.getSession()
  const token = data?.session?.access_token

  if (!token) {
    throw new Error('Your session has expired or you are not logged in. Please sign in again.')
  }

  const endpoint = `${apiUrl}${path.startsWith('/') ? path : `/${path}`}`

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (response.status === 204) {
      return undefined as T
    }

    const contentType = response.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    const body = isJson ? await response.json() : await response.text()

    if (!response.ok) {
      const errorMsg =
        typeof body === 'object' && body !== null && 'detail' in body
          ? String((body as { detail: string }).detail)
          : 'Service temporarily unavailable. Please verify backend connection.'
      throw new Error(errorMsg)
    }

    return body as T
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        throw new Error('Could not connect to the backend server. Please verify your internet connection or backend status.')
      }
      throw err
    }
    throw new Error('An unexpected network error occurred.')
  }
}

export const api = {
  // Health Profile
  getProfile: () => request<HealthProfile>('/profile'),
  saveProfile: (profile: HealthProfile) =>
    request<HealthProfile>('/profile', { method: 'PUT', body: JSON.stringify(profile) }),

  // Period Tracker
  getPeriods: () => request<PeriodRecord[]>('/periods'),
  addPeriod: (record: Omit<PeriodRecord, 'id' | 'created_at'>) =>
    request<PeriodRecord>('/periods', { method: 'POST', body: JSON.stringify(record) }),
  deletePeriod: (id: string) => request<void>(`/periods/${id}`, { method: 'DELETE' }),

  // Appointments
  getAppointments: () => request<Appointment[]>('/appointments'),
  saveAppointment: (appointment: Omit<Appointment, 'id' | 'created_at'>, id?: string) =>
    request<Appointment>(`/appointments${id ? `/${id}` : ''}`, {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(appointment),
    }),
  deleteAppointment: (id: string) => request<void>(`/appointments/${id}`, { method: 'DELETE' }),

  // Nompilo AI Chat
  getMessages: () => request<ChatMessage[]>('/chat/messages'),
  sendMessage: (content: string) =>
    request<{ user_message: ChatMessage; assistant_message: ChatMessage }>('/chat/messages', {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  // Symptom Checker
  assessSymptoms: (payload: SymptomAssessmentPayload) =>
    request<SymptomAssessmentResult>('/symptoms/assessment', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}
