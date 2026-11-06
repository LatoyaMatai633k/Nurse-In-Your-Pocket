const storage = <T>(key: string, fallback: T): T => { try { return JSON.parse(localStorage.getItem(`niyp.${key}`) || '') as T } catch { return fallback } }
const save = <T>(key: string, value: T) => localStorage.setItem(`niyp.${key}`, JSON.stringify(value))
const makeId = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`

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

async function askAssistant(message: string) {
  if (!navigator.onLine) throw new Error('You are offline. Nompilo needs an internet connection, but saved resources remain available.')
  const response = await fetch('/.netlify/functions/health-assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) })
  const body = await response.json().catch(() => ({})) as { reply?: string; error?: string }
  if (!response.ok) throw new Error(body.error || 'Nompilo is temporarily unavailable. Please try again.')
  return body.reply || 'I could not prepare a response right now. Please try again.'
}

export const api = {
  // Health Profile
  getProfile: async () => storage<HealthProfile>('profile', { name: null, age: null, emergency_contact: null, blood_group: null, allergies: [], medications: [], chronic_conditions: [], contraceptive_method: null, preferred_language: 'English' }),
  saveProfile: async (profile: HealthProfile) => { save('profile', profile); return profile },

  // Period Tracker
  getPeriods: async () => storage<PeriodRecord[]>('periods', []),
  addPeriod: async (record: Omit<PeriodRecord, 'id' | 'created_at'>) => { const next = { ...record, id: makeId(), created_at: new Date().toISOString() }; save('periods', [next, ...storage<PeriodRecord[]>('periods', [])]); return next },
  deletePeriod: async (id: string) => save('periods', storage<PeriodRecord[]>('periods', []).filter((item) => item.id !== id)),

  // Appointments
  getAppointments: async () => storage<Appointment[]>('appointments', []),
  saveAppointment: async (appointment: Omit<Appointment, 'id' | 'created_at'>, id?: string) => { const all = storage<Appointment[]>('appointments', []); const next = { ...appointment, id: id || makeId(), created_at: id ? all.find((item) => item.id === id)?.created_at || new Date().toISOString() : new Date().toISOString() }; save('appointments', id ? all.map((item) => item.id === id ? next : item) : [...all, next]); return next },
  deleteAppointment: async (id: string) => save('appointments', storage<Appointment[]>('appointments', []).filter((item) => item.id !== id)),

  // Nompilo AI Chat
  getMessages: async () => storage<ChatMessage[]>('messages', []),
  sendMessage: async (content: string) => { const user_message: ChatMessage = { id: makeId(), role: 'user', content, created_at: new Date().toISOString() }; const assistant_message: ChatMessage = { id: makeId(), role: 'assistant', content: await askAssistant(content), created_at: new Date().toISOString() }; save('messages', [...storage<ChatMessage[]>('messages', []), user_message, assistant_message]); return { user_message, assistant_message } },

  // Symptom Checker
  assessSymptoms: async (payload: SymptomAssessmentPayload) => { const summary = `Symptoms: ${payload.symptoms}\nDuration: ${payload.duration}\nSeverity: ${payload.severity}\nAge: ${payload.age}${payload.medical_context ? `\nContext: ${payload.medical_context}` : ''}`; return { summary, safety_warning: payload.severity === 'Severe' ? 'Severe symptoms can need urgent in-person assessment. Seek urgent care if symptoms worsen or you are worried.' : null, guidance: await askAssistant(`Provide concise educational guidance for this symptom summary. Do not diagnose. ${summary}`) } },
}
