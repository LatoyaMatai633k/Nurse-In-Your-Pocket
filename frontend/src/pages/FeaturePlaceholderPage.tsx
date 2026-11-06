import { ArrowLeft, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'

export function FeaturePlaceholderPage({ feature }: { feature: string }) {
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/dashboard"
        className="focus-ring inline-flex items-center gap-2 rounded-lg text-xs sm:text-sm font-semibold text-purple-700 hover:underline"
      >
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </Link>
      <h1 className="page-heading mt-6">{feature}</h1>
      <p className="page-copy">This section is being prepared for the upcoming update.</p>
      <div className="mt-7">
        <EmptyState
          icon={<Clock size={24} />}
          title={`${feature} settings coming soon`}
        >
          All profile and notification settings will be customizable here in future releases.
        </EmptyState>
      </div>
    </div>
  )
}
