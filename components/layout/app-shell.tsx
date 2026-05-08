import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

interface AppShellProps {
  children: React.ReactNode
  currentStudy?: string
  userName?: string
  userRole?: string
}

export function AppShell({ children, currentStudy, userName, userRole }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar currentStudy={currentStudy} userName={userName} userRole={userRole} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
