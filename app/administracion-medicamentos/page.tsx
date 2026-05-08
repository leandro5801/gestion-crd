import { AppShell } from '@/components/layout/app-shell'
import { AdministracionContent } from './administracion-content'

export default function AdministracionMedicamentosPage() {
  return (
    <AppShell currentStudy="PV-2024-ALPHA" userName="Dr. Alejandro V." userRole="Investigador Principal">
      <AdministracionContent />
    </AppShell>
  )
}
