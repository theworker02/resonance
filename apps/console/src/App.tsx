import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'

// Lazy-loaded pages
const Overview = lazy(() => import('./pages/Overview'))
const Incidents = lazy(() => import('./pages/Incidents'))
const Mesh = lazy(() => import('./pages/Mesh'))
const CellDetail = lazy(() => import('./pages/CellDetail'))
const Nodes = lazy(() => import('./pages/Nodes'))
const Sensors = lazy(() => import('./pages/Sensors'))
const Detectors = lazy(() => import('./pages/Detectors'))
const Models = lazy(() => import('./pages/Models'))
const Propagation = lazy(() => import('./pages/Propagation'))
const Calibration = lazy(() => import('./pages/Calibration'))
const Hardware = lazy(() => import('./pages/Hardware'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Audit = lazy(() => import('./pages/Audit'))
const System = lazy(() => import('./pages/System'))

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-resonance-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-gray-400">Loading…</span>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-950 text-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/mesh" element={<Mesh />} />
              <Route path="/cells/:id" element={<CellDetail />} />
              <Route path="/nodes" element={<Nodes />} />
              <Route path="/sensors" element={<Sensors />} />
              <Route path="/sensors/:id" element={<Sensors />} />
              <Route path="/detectors" element={<Detectors />} />
              <Route path="/models" element={<Models />} />
              <Route path="/propagation" element={<Propagation />} />
              <Route path="/calibration" element={<Calibration />} />
              <Route path="/hardware" element={<Hardware />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/audit" element={<Audit />} />
              <Route path="/system" element={<System />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  )
}
