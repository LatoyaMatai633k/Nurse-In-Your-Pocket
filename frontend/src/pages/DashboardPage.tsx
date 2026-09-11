import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  HeartPulse,
  MessageCircleHeart,
  Sparkles,
  Stethoscope,
} from 'lucide-react'
import React from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { Card } from '../components/ui/Card'

const quickActions = [
  {
    to: '/chat',
    title: 'Talk to Nompilo',
    description: 'Ask a private health question',
    icon: MessageCircleHeart,
    badgeBg: 'bg-purple-100 text-purple-800',
  },
  {
    to: '/symptoms',
    title: 'Check Symptoms',
    description: 'Structure notes for your clinic visit',
    icon: Stethoscope,
    badgeBg: 'bg-[#EAE1F5] text-purple-900',
  },
  {
    to: '/period',
    title: 'Track Your Cycle',
    description: 'Log periods and view estimations',
    icon: HeartPulse,
    badgeBg: 'bg-[#F4E6EC] text-rose',
  },
  {
    to: '/appointments',
    title: 'Appointments',
    description: 'Plan and schedule healthcare visits',
    icon: CalendarDays,
    badgeBg: 'bg-[#E5EEE8] text-sage',
  },
]

export function DashboardPage() {
  const { firstName } = useOutletContext<{ firstName: string }>()

  return (
    <div className="mx-auto max-w-5xl">
      {/* Welcome Banner */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-purple-700">
          Your Health Companion
        </p>
        <h1 className="page-heading mt-1">Sawubona, {firstName}.</h1>
        <p className="page-copy">
          How can Nurse in Your Pocket support your wellbeing today?
        </p>
      </div>

      {/* Quick Actions Grid */}
      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-plum">Quick Actions</h2>
          <span className="text-xs text-cocoa/50">Core features</span>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          {quickActions.map(({ to, title, description, icon: Icon, badgeBg }) => (
            <Link
              key={to}
              to={to}
              className="focus-ring group rounded-3xl"
            >
              <Card className="flex min-h-[5.5rem] items-center gap-4 border border-sand transition duration-200 group-hover:-translate-y-1 group-hover:border-purple-300 group-hover:shadow-lift">
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${badgeBg}`}
                >
                  <Icon size={22} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-plum text-sm sm:text-base group-hover:text-purple-800">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-xs text-cocoa/65">
                    {description}
                  </span>
                </span>

                <ChevronRight
                  size={18}
                  className="text-cocoa/30 transition group-hover:translate-x-0.5 group-hover:text-purple-700"
                />
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Nompilo Card + Health Library Hero */}
      <section className="mt-7 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3 border border-purple-200 bg-gradient-to-br from-white to-purple-50/40 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-900">
                <Sparkles size={13} />
                <span>Nompilo AI Assistant</span>
              </span>

              <MessageCircleHeart size={28} className="text-purple-700 shrink-0" />
            </div>

            <h2 className="mt-4 text-xl font-bold text-plum">
              A private, supportive ear for your health questions.
            </h2>

            <p className="mt-2 text-xs sm:text-sm leading-6 text-cocoa/70">
              Get confidential answers about menstrual health, contraception, wellness, and clinic preparation. Nompilo is powered by Google Gemini and trained to offer safe educational guidance.
            </p>
          </div>

          <Link
            to="/chat"
            className="focus-ring mt-6 inline-flex items-center gap-2 rounded-xl text-xs sm:text-sm font-bold text-purple-700 hover:underline"
          >
            <span>Start a conversation</span>
            <ArrowRight size={16} />
          </Link>
        </Card>

        <Card className="lg:col-span-2 border border-sand flex flex-col justify-between">
          <div>
            <BookOpen size={26} className="text-purple-700" />
            <h2 className="mt-4 text-lg font-bold text-plum">Health Library</h2>
            <p className="mt-2 text-xs sm:text-sm leading-6 text-cocoa/70">
              Explore trusted, simple topics on women’s health, STI prevention, nutrition, and mental wellness.
            </p>
          </div>

          <Link
            to="/library"
            className="focus-ring mt-6 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-700 hover:underline"
          >
            <span>Browse library</span>
            <ArrowRight size={15} />
          </Link>
        </Card>
      </section>

      {/* Secondary Quick Access Widgets */}
      <section className="mt-7 grid gap-4 md:grid-cols-2">
        <Card className="border border-sand hover:border-purple-200 transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-plum text-sm sm:text-base">Upcoming Appointments</h3>
              <p className="mt-1 text-xs text-cocoa/60">
                Manage your clinic visits and reminder preferences.
              </p>
            </div>
            <CalendarDays size={22} className="text-sage shrink-0" />
          </div>
          <Link
            to="/appointments"
            className="focus-ring mt-4 inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:underline"
          >
            <span>View calendar</span>
            <ChevronRight size={14} />
          </Link>
        </Card>

        <Card className="border border-sand hover:border-purple-200 transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-plum text-sm sm:text-base">Period & Cycle Tracker</h3>
              <p className="mt-1 text-xs text-cocoa/60">
                Check cycle history, symptoms, and estimated next period.
              </p>
            </div>
            <HeartPulse size={22} className="text-rose shrink-0" />
          </div>
          <Link
            to="/period"
            className="focus-ring mt-4 inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:underline"
          >
            <span>Open tracker</span>
            <ChevronRight size={14} />
          </Link>
        </Card>
      </section>
    </div>
  )
}
