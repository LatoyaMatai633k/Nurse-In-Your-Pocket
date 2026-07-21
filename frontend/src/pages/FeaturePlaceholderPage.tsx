import { ArrowLeft, Construction } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'

export function FeaturePlaceholderPage({ feature }: { feature: string }) {
  return <div className="mx-auto max-w-2xl"><Link to="/dashboard" className="focus-ring inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-terracotta hover:underline"><ArrowLeft size={17} />Back to home</Link><h1 className="page-heading mt-7">{feature}</h1><p className="page-copy">This space is ready for the next milestone.</p><div className="mt-8"><EmptyState icon={<Construction size={23} />} title={`${feature} is coming soon`}>The navigation and layout are in place. Its healthcare-focused tools will be added in a future release.</EmptyState></div></div>
}
