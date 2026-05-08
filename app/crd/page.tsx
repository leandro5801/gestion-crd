import { AppShell } from '@/components/layout/app-shell'
import { CRDContent } from './crd-content'

export default function CRDPage() {
  return (
    <AppShell currentStudy="PV-2024-ALPHA" userName="Dr. Aris Thorne" userRole="Lead Investigator">
      <CRDContent />
    </AppShell>
  )
}
