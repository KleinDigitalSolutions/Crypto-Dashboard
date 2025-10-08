import { Link } from 'react-router-dom'

import AppFooter from '../components/AppFooter'
import AppHeader from '../components/AppHeader'
import usePageMetadata from '../hooks/usePageMetadata'

const NotFoundPage = () => {
  usePageMetadata({
    title: '404 · Crypto Dashboard',
    description: 'The requested page could not be found.',
  })

  return (
    <div className="flex min-h-screen flex-col bg-background text-slate-100">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">404</p>
        <h1 className="mt-3 text-3xl font-bold">Seite nicht gefunden</h1>
        <p className="mt-2 text-sm text-slate-400">
          Die angeforderte Seite existiert nicht. Kehre zurück zum Dashboard und entdecke die Märkte.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center rounded-xl border border-accent px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent/10"
        >
          Zurück zum Dashboard
        </Link>
      </main>
      <AppFooter />
    </div>
  )
}

export default NotFoundPage
