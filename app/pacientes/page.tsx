import { AppShell } from '@/components/layout/app-shell'
import { PacientesContent } from './pacientes-content'

export default function PacientesPage() {
  return (
    <AppShell currentStudy="PV-2024-ALPHA" userName="Dr. Aris Thorne" userRole="Lead Investigator">
      <PacientesContent />
    </AppShell>
  )
}
