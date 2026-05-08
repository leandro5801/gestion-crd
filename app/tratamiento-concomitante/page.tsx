import { AppShell } from '@/components/layout/app-shell'
import { TratamientoConcomitanteContent } from './tratamiento-concomitante-content'

export default function TratamientoConcomitantePage() {
  return (
    <AppShell currentStudy="PV-2024-ALPHA" userName="Dr. Alejandro V." userRole="Investigador Principal">
      <TratamientoConcomitanteContent />
    </AppShell>
  )
}
