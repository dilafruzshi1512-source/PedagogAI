import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

function BackgroundMesh() {
  return (
    <>
      <div className="fixed inset-0 bg-gradient-mesh z-0" aria-hidden />
      <div className="orb w-[480px] h-[480px] bg-brand-indigo -top-40 -left-40 animate-drift" />
      <div className="orb w-[360px] h-[360px] bg-brand-cyan bottom-[-80px] right-[-60px] animate-drift2" />
      <div className="orb w-[280px] h-[280px] bg-brand-purple top-[40%] left-[35%] animate-drift3 opacity-20" />
    </>
  )
}

export default function AppLayout() {
  return (
    <div className="h-full flex relative overflow-hidden">
      <BackgroundMesh />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 ml-[var(--sidebar-width)] relative z-10">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
