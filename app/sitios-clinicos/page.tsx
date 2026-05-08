import { AppShell } from '@/components/layout/app-shell'
import { SitiosClinicosContent } from './sitios-clinicos-content'

export default function SitiosClinicosPage() {
  return (
    <AppShell currentStudy="PV-2024-ALPHA" userName="Dr. Aris Thorne" userRole="Lead Investigator">
      <SitiosClinicosContent />
    </AppShell>
  )
}
