import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import { useAuth } from './features/auth/AuthProvider'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const CoinPage = lazy(() => import('./pages/CoinPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))

const App = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="p-8 text-center text-slate-300">Loading…</div>
  }

  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-300">Loading…</div>}>
      <Routes>
        <Route
          path="/"
          element={user ? <DashboardPage /> : <AuthPage />}
        />
        <Route path="/coins/:id" element={user ? <CoinPage /> : <AuthPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
