import { AppShell } from '@/components/layout/app-shell'
import { EventosAdversosContent } from './eventos-adversos-content'

export default function EventosAdversosPage() {
  return (
    <AppShell currentStudy="PV-2024-ALPHA" userName="Dr. Aris Thorne" userRole="Lead Investigator">
      <EventosAdversosContent />
    </AppShell>
  )
}
