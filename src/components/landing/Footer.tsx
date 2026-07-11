export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm text-muted">
        <span className="font-display italic text-ink">Ledger</span>
        <div className="flex items-center gap-6">
          <a href="/terms" className="hover:text-ink">Terms</a>
          <a href="/privacy" className="hover:text-ink">Privacy</a>
          <a href="/changelog" className="hover:text-ink">Changelog</a>
          <a href="/about" className="hover:text-ink">About</a>
        </div>
        <span>Built by Zine Eddine.</span>
      </div>
    </footer>
  );
}
