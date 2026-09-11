import {
  AlertTriangle,
  ArrowUp,
  Info,
  Mic,
  MicOff,
  Square,
  Volume2,
  VolumeX,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { LoadingScreen } from '../components/ui/LoadingScreen'
import { api, type ChatMessage } from '../lib/api'

// TypeScript declarations for Web Speech API
interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message?: string
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string
      }
    }
  }
}

interface IWindow extends Window {
  SpeechRecognition?: any
  webkitSpeechRecognition?: any
}

type AudioState = 'IDLE' | 'RECORDING' | 'PROCESSING' | 'NOMPILO_SPEAKING'

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  created_at: new Date().toISOString(),
  content:
    'Hello, I am Nompilo. I am here to share supportive health education, help you prepare for clinic visits, and answer questions about your wellbeing. What would you like to talk about today?',
}

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [audioState, setAudioState] = useState<AudioState>('IDLE')
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  // Initialize and check SpeechRecognition support
  useEffect(() => {
    const win = window as unknown as IWindow
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition

    if (SpeechRecognitionClass) {
      setVoiceSupported(true)
      const recognition = new SpeechRecognitionClass()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-ZA' // South African English

      recognition.onstart = () => {
        setAudioState('RECORDING')
        setError('')
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results as any)
          .map((res: any) => res[0].transcript)
          .join('')
        setDraft(transcript)
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.warn('Speech recognition error:', event.error)
        setAudioState('IDLE')
        if (event.error === 'not-allowed') {
          setError('Microphone permission was denied. Please enable microphone access in your browser settings.')
        } else if (event.error !== 'no-speech') {
          setError(`Voice input error: ${event.error}`)
        }
      }

      recognition.onend = () => {
        setAudioState((prev) => (prev === 'RECORDING' ? 'IDLE' : prev))
      }

      recognitionRef.current = recognition
    }

    // Load initial messages
    void api
      .getMessages()
      .then((data) => {
        setMessages(data)
      })
      .catch((err: Error) => {
        console.warn('Could not load chat history:', err.message)
      })
      .finally(() => setLoading(false))

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch {
          // ignore cleanup error
        }
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, audioState])

  // Speak Nompilo response using browser SpeechSynthesis
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()
    const cleanText = text.replace(/[*_#]/g, '').trim()
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 0.95
    utterance.pitch = 1.0

    utterance.onstart = () => {
      setAudioState('NOMPILO_SPEAKING')
    }

    utterance.onend = () => {
      setAudioState('IDLE')
    }

    utterance.onerror = () => {
      setAudioState('IDLE')
    }

    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setAudioState('IDLE')
  }

  // Handle Recording Toggle
  const toggleRecording = () => {
    if (audioState === 'NOMPILO_SPEAKING') {
      stopSpeaking()
      return
    }

    if (!voiceSupported) {
      setError('Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.')
      return
    }

    if (audioState === 'RECORDING') {
      try {
        recognitionRef.current?.stop()
      } catch {
        // ignore
      }
      setAudioState('IDLE')
    } else if (audioState === 'IDLE') {
      try {
        recognitionRef.current?.start()
      } catch (e) {
        console.error('Failed to start speech recognition:', e)
        setError('Microphone is busy or unavailable.')
      }
    }
  }

  // Handle Message Submission
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const userText = draft.trim()
    if (!userText || audioState === 'PROCESSING') return

    // Stop recording if active
    if (audioState === 'RECORDING') {
      try {
        recognitionRef.current?.stop()
      } catch {
        // ignore
      }
    }

    setDraft('')
    setAudioState('PROCESSING')
    setError('')

    const optimistic: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userText,
      created_at: new Date().toISOString(),
    }

    setMessages((current) => [...current, optimistic])

    try {
      const response = await api.sendMessage(userText)
      setMessages((current) => [
        ...current.filter((item) => item.id !== optimistic.id),
        response.user_message,
        response.assistant_message,
      ])

      // If audio auto-speak is enabled, pronounce response
      if (autoSpeakEnabled && response.assistant_message?.content) {
        speakText(response.assistant_message.content)
      } else {
        setAudioState('IDLE')
      }
    } catch (reason) {
      setMessages((current) => current.filter((item) => item.id !== optimistic.id))
      setDraft(userText)
      setError(reason instanceof Error ? reason.message : 'Could not send your message.')
      setAudioState('IDLE')
    }
  }

  if (loading) return <LoadingScreen />

  const displayList = messages.length > 0 ? messages : [welcomeMessage]

  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      {/* Page Header */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-purple-700">
              AI Health Companion
            </p>
            <h1 className="page-heading mt-1">Talk to Nompilo</h1>
          </div>

          {/* Voice Response Toggle Button */}
          <button
            onClick={() => setAutoSpeakEnabled((prev) => !prev)}
            className={`focus-ring flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
              autoSpeakEnabled
                ? 'border-purple-300 bg-purple-100 text-purple-900'
                : 'border-sand bg-white text-cocoa/60 hover:bg-cream'
            }`}
            title={autoSpeakEnabled ? 'Voice responses active' : 'Turn on voice responses'}
          >
            {autoSpeakEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{autoSpeakEnabled ? 'Voice on' : 'Voice off'}</span>
          </button>
        </div>
        <p className="page-copy">
          A confidential, caring space to ask questions, learn about your body, and prepare for clinic visits.
        </p>
      </div>

      {/* Safety Banner */}
      <Card className="mt-5 flex items-start gap-3 border border-purple-200 bg-purple-50/70 p-4 shadow-none">
        <AlertTriangle className="mt-0.5 shrink-0 text-purple-700" size={18} />
        <p className="text-xs leading-5 text-plum">
          <strong>Educational guidance only.</strong> Nompilo does not diagnose, prescribe medications, or handle medical emergencies. For severe pain, bleeding, or emergencies, please visit your nearest clinic immediately.
        </p>
      </Card>

      {/* Main Conversation Container */}
      <section
        className="mt-5 flex min-h-[25rem] flex-col justify-between rounded-3xl bg-white p-4 shadow-card sm:p-6"
        aria-label="Nompilo conversation"
      >
        {/* Messages List */}
        <div className="space-y-4">
          {displayList.map((message) => {
            const isUser = message.role === 'user'
            return (
              <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${
                    isUser
                      ? 'bg-purple-700 text-white'
                      : 'bg-sand/60 text-cocoa border border-sand/70'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {!isUser && (
                    <div className="mt-2 flex items-center justify-between border-t border-cocoa/10 pt-2 text-[11px] text-cocoa/60">
                      <span>Educational guidance</span>
                      <button
                        onClick={() => speakText(message.content)}
                        className="focus-ring flex items-center gap-1 rounded px-1 text-purple-700 hover:underline"
                        title="Read aloud"
                      >
                        <Volume2 size={13} />
                        <span>Listen</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* State: PROCESSING */}
          {audioState === 'PROCESSING' && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2.5 rounded-3xl bg-purple-50 border border-purple-200 px-4 py-3 text-sm font-medium text-purple-900">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-purple-700 border-t-transparent" />
                <span>Nompilo is thinking...</span>
              </div>
            </div>
          )}

          {/* State: NOMPILO SPEAKING (Audio Playing Badge with Stop Button) */}
          {audioState === 'NOMPILO_SPEAKING' && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3 rounded-2xl bg-purple-700 text-white px-4 py-2.5 text-xs font-semibold shadow-md">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-1 animate-pulse rounded-full bg-white [animation-delay:-0.3s]" />
                  <span className="h-3.5 w-1 animate-pulse rounded-full bg-white [animation-delay:-0.15s]" />
                  <span className="h-2.5 w-1 animate-pulse rounded-full bg-white" />
                </div>
                <span>Nompilo is speaking...</span>
                <button
                  onClick={stopSpeaking}
                  className="ml-2 flex items-center gap-1 rounded-lg bg-white/20 px-2 py-1 hover:bg-white/30"
                  aria-label="Stop audio"
                >
                  <Square size={12} fill="currentColor" />
                  <span>Stop</span>
                </button>
              </div>
            </div>
          )}

          {/* State: RECORDING (Active Listening Banner) */}
          {audioState === 'RECORDING' && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2 rounded-2xl bg-purple-100 border border-purple-300 px-4 py-2 text-xs font-bold text-purple-900 animate-pulse">
                <span className="h-2 w-2 rounded-full bg-purple-700 animate-ping" />
                <span>Listening to your voice... Tap the microphone or send when ready.</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Chat Input & Voice Record Action Controls */}
        <form onSubmit={handleSubmit} className="mt-6 border-t border-sand pt-4">
          <label className="sr-only" htmlFor="chat-message-input">
            Your message
          </label>
          <div className="flex items-end gap-2">
            <textarea
              id="chat-message-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={3000}
              rows={2}
              placeholder="Ask a health question or tap the microphone to speak..."
              className="focus-ring min-h-12 flex-1 resize-none rounded-2xl border border-sand bg-cream/40 px-4 py-3 text-sm placeholder:text-cocoa/40"
            />

            {/* Voice Record / Mic Button with 4 Distinct States */}
            <button
              type="button"
              onClick={toggleRecording}
              disabled={audioState === 'PROCESSING'}
              className={`focus-ring grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition duration-200 ${
                audioState === 'RECORDING'
                  ? 'bg-purple-700 text-white ring-4 ring-purple-200 animate-pulse'
                  : audioState === 'NOMPILO_SPEAKING'
                  ? 'bg-purple-100 text-purple-900 hover:bg-purple-200'
                  : 'bg-white text-purple-700 border border-sand hover:bg-purple-50'
              } disabled:cursor-not-allowed disabled:opacity-50`}
              aria-label={
                audioState === 'RECORDING'
                  ? 'Stop recording'
                  : audioState === 'NOMPILO_SPEAKING'
                  ? 'Stop speaking'
                  : 'Start voice recording'
              }
              title={
                audioState === 'RECORDING'
                  ? 'Recording in progress (tap to stop)'
                  : audioState === 'NOMPILO_SPEAKING'
                  ? 'Nompilo speaking (tap to mute)'
                  : 'Voice input'
              }
            >
              {audioState === 'RECORDING' ? (
                <Mic size={20} className="animate-bounce" />
              ) : audioState === 'NOMPILO_SPEAKING' ? (
                <Square size={16} fill="currentColor" />
              ) : voiceSupported ? (
                <Mic size={20} />
              ) : (
                <MicOff size={20} className="text-cocoa/40" />
              )}
            </button>

            {/* Text Send Button */}
            <Button
              type="submit"
              className="h-12 w-12 shrink-0 px-0"
              disabled={!draft.trim() || audioState === 'PROCESSING'}
              loading={audioState === 'PROCESSING'}
              aria-label="Send message"
            >
              <ArrowUp size={19} />
            </Button>
          </div>

          {error && (
            <p className="mt-2 text-xs font-semibold text-rose" role="alert">
              {error}
            </p>
          )}
        </form>
      </section>

      {/* Footer reassurance */}
      <div className="mt-4 flex items-center gap-2 text-xs text-cocoa/60">
        <Info size={14} className="text-purple-700 shrink-0" />
        <span>Your conversations with Nompilo are stored privately in your account.</span>
      </div>
    </div>
  )
}
