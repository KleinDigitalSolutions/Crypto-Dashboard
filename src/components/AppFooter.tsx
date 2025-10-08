const AppFooter = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-800 bg-surface/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-slate-400 sm:flex-row sm:px-6">
        <span>&copy; {year} Crypto Dashboard</span>
        <span>Built with Vite, React, TypeScript & Tailwind</span>
      </div>
    </footer>
  )
}

export default AppFooter
