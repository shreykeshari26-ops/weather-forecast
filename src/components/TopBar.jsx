function TopBar() {
  return (
    <div className="mb-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between lg:mb-10">
      <div className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-white/35 bg-[linear-gradient(180deg,rgba(255,255,255,0.36),rgba(255,255,255,0.18)),rgba(178,220,247,0.24)] px-4 py-3 text-sm font-bold text-slate-900 transition duration-200 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/35 hover:shadow-[0_12px_28px_rgba(96,144,187,0.18)] sm:w-auto">
        <span className="h-2.5 w-2.5 rounded-full bg-[linear-gradient(135deg,#7dd3fc,#38bdf8)] shadow-[0_0_18px_rgba(125,211,252,0.75)]" />
        ForecastOS
        <span className="ml-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-sky-800/70">
          Prime
        </span>
      </div>
      <div className="inline-flex w-full items-center justify-center rounded-full border border-white/28 bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0.12)),rgba(164,211,241,0.22)] px-4 py-3 text-sm text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/30 hover:shadow-[0_12px_28px_rgba(96,144,187,0.14)] sm:w-auto">
        <span className="mr-2 h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.65)]" />
        Live Weather Feed
      </div>
    </div>
  );
}

export default TopBar;
