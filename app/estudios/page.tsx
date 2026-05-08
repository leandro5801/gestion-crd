import { AppShell } from '@/components/layout/app-shell'
import { EstudiosContent } from './estudios-content'

export default function EstudiosPage() {
  return (
    <AppShell currentStudy="PV-2024-ALPHA" userName="Dr. Aris Thorne" userRole="Lead Investigator">
      <EstudiosContent />
    </AppShell>
  )
}
