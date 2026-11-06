import {
  BookOpen,
  ChevronRight,
  HeartHandshake,
  Leaf,
  ShieldPlus,
  Sparkles,
} from 'lucide-react'
import React, { useState } from 'react'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'

type Article = {
  category: string
  title: string
  summary: string
  content: string
  icon: typeof BookOpen
}

const articles: Article[] = [
  {
    category: 'Menstrual Health',
    title: 'Understanding Your Menstrual Cycle',
    summary: 'A supportive overview of periods, cycle phases, and what is normal.',
    content:
      'Periods vary in length and flow between different bodies. Tracking your cycle helps you notice patterns in mood, cramps, and duration. Consult a nurse or doctor if you soak through pads in less than an hour, experience severe debilitating pain, or notice sudden missed periods without pregnancy.',
    icon: HeartHandshake,
  },
  {
    category: 'Contraception',
    title: 'Finding the Right Contraceptive Method',
    summary: 'Explore family planning choices to discuss with your healthcare clinic.',
    content:
      'South African public clinics offer free contraceptive choices including injections (Nur-Isterate, Petogen/Depo-Provera), oral contraceptive pills, subdermal implants (Implanon), and IUDs (intrauterine devices). Always ask your healthcare provider about STI prevention and side effects.',
    icon: ShieldPlus,
  },
  {
    category: 'Pregnancy',
    title: 'Early Pregnancy & Antenatal Care',
    summary: 'Key milestones, nutrition basics, and early clinic registration.',
    content:
      'Early clinic booking (ideally before 20 weeks) is essential for mother and baby health. The clinic provides free blood tests, iron and folate supplements, ultrasound scans, and wellness monitoring. If you notice sharp one-sided abdominal pain or sudden bleeding, visit emergency care immediately.',
    icon: HeartHandshake,
  },
  {
    category: 'STI Awareness',
    title: 'Confidential STI Prevention & Testing',
    summary: 'Private screening, dual protection with barrier methods, and symptoms to watch.',
    content:
      'Many sexually transmitted infections show no immediate symptoms. Regular testing is routine and confidential at primary healthcare facilities. If you experience unusual discharge, pain, or sores, complete full treatment courses alongside your partner.',
    icon: ShieldPlus,
  },
  {
    category: 'Mental Wellness',
    title: 'Caring for Your Emotional Wellbeing',
    summary: 'Managing stress, anxiety, burnout, and knowing when to ask for help.',
    content:
      'Emotional health directly impacts physical wellbeing. Creating boundaries, getting consistent sleep, and speaking with a counselor or trusted support group can bring relief. Free South African mental health hotlines like SADAG (0800 567 567) are available 24/7.',
    icon: HeartHandshake,
  },
  {
    category: 'Everyday Nutrition',
    title: 'Nourishing Habits on a Budget',
    summary: 'Simple, practical meal foundations for steady daily energy.',
    content:
      'Balanced energy comes from combining fiber-rich complex carbohydrates (oats, brown maize, beans, lentils), proteins, and seasonal vegetables. Staying hydrated with water supports clear skin, digestion, and energy.',
    icon: Leaf,
  },
  {
    category: "Women's Health",
    title: 'Routine Health Screenings & Pap Smears',
    summary: 'Preventative care guidelines for young women.',
    content:
      'Preventative visits allow you to check blood pressure, glucose, cervical health via regular Pap smears (starting from age 30, or earlier if HIV positive), and breast self-examinations. Ask your nurse what screenings are recommended for your age group.',
    icon: BookOpen,
  },
]

export function HealthLibraryPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  const categories = ['All', ...Array.from(new Set(articles.map((a) => a.category)))]
  const filtered =
    activeCategory === 'All'
      ? articles
      : articles.filter((a) => a.category === activeCategory)

  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-purple-700">
          Educational Resource Center
        </p>
        <h1 className="page-heading mt-1">Health Library</h1>
        <p className="page-copy">
          Clear, culturally-attuned, respectful health guidance to empower your body and conversations with nurses.
        </p>
      </div>

      {/* Category Pills Bar */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`focus-ring shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition ${
              activeCategory === cat
                ? 'bg-purple-700 text-white shadow-sm'
                : 'bg-white text-cocoa/70 border border-sand hover:bg-purple-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((article) => {
          const Icon = article.icon
          return (
            <button
              key={article.title}
              onClick={() => setSelectedArticle(article)}
              className="focus-ring text-left rounded-3xl group"
            >
              <Card className="h-full border border-sand transition duration-200 group-hover:-translate-y-1 group-hover:border-purple-300 group-hover:shadow-lift flex flex-col justify-between">
                <div>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-purple-100 text-purple-800">
                    <Icon size={20} />
                  </span>

                  <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-purple-700">
                    {article.category}
                  </p>

                  <h2 className="mt-1.5 text-base font-bold text-plum group-hover:text-purple-800">
                    {article.title}
                  </h2>

                  <p className="mt-2 text-xs sm:text-sm leading-6 text-cocoa/70">
                    {article.summary}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-sand/60 flex items-center gap-1 text-xs font-bold text-purple-700">
                  <span>Read full guide</span>
                  <ChevronRight size={15} />
                </div>
              </Card>
            </button>
          )
        })}
      </div>

      {/* Article Detail Modal */}
      <Modal
        open={Boolean(selectedArticle)}
        onClose={() => setSelectedArticle(null)}
        title={selectedArticle?.title ?? 'Health Guide'}
      >
        {selectedArticle && (
          <div>
            <span className="inline-block rounded-lg bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-900">
              {selectedArticle.category}
            </span>

            <div className="mt-4 text-xs sm:text-sm leading-7 text-cocoa/85 space-y-3">
              <p>{selectedArticle.content}</p>
            </div>

            <div className="mt-6 rounded-2xl bg-cream border border-sand p-3.5 text-xs leading-5 text-cocoa/70">
              <strong>Disclaimer:</strong> This content is for health education purposes and will expand with multilingual resources (English, isiZulu, Sesotho, and isiXhosa). Always consult a registered healthcare provider for personalized medical advice.
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
