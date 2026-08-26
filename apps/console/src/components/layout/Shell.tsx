import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function Shell() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-950 text-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main
          className="flex-1 overflow-y-auto px-6 py-5"
          id="main-content"
          tabIndex={-1}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
