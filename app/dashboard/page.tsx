import { AppShell } from '@/components/layout/app-shell'
import { DashboardContent } from './dashboard-content'

export default function DashboardPage() {
  return (
    <AppShell currentStudy="PV-2024-ALPHA" userName="Dr. Elena Ross" userRole="Chief Clinical Investigator">
      <DashboardContent />
    </AppShell>
  )
}
