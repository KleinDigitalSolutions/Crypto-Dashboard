import { lazy,Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const CoinPage = lazy(() => import('./pages/CoinPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-8 text-center text-slate-300">Loading…</div>}>
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="/coins/:id" element={<CoinPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
