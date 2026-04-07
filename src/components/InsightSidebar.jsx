function InsightCard({ label, title, copy, highlight = false }) {
  return (
    <article
      className={`animate-fade-up rounded-[28px] border p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_50px_rgba(0,0,0,0.28)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(0,0,0,0.32),0_0_28px_rgba(34,197,94,0.06)] ${
        highlight
          ? "border-emerald-400/15 bg-[linear-gradient(180deg,rgba(34,197,94,0.14),rgba(16,185,129,0.06)),rgba(8,18,14,0.8)]"
          : "border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015)),rgba(8,14,12,0.78)]"
      }`}
    >
      <p className="text-[0.72rem] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <h2 className="mt-3 text-[1.8rem] font-bold leading-[1.05] tracking-[-0.04em] text-white">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-6 text-slate-300">{copy}</p>
    </article>
  );
}

function InsightSidebar() {
  return (
    <aside className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
      <InsightCard
        label="Forecast Desk"
        title="Clear situational awareness for live weather."
        copy="A futuristic readout surface built for temperature trends, humidity shifts, and wind movement at a glance."
      />
      <article className="animate-fade-up rounded-[28px] border border-emerald-400/15 bg-[linear-gradient(180deg,rgba(34,197,94,0.14),rgba(16,185,129,0.06)),rgba(8,18,14,0.8)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_50px_rgba(0,0,0,0.28)] transition duration-200 [animation-delay:100ms] hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(0,0,0,0.34),0_0_28px_rgba(34,197,94,0.08)]">
        <p className="text-[0.72rem] uppercase tracking-[0.18em] text-slate-500">System Status</p>
        <p className="mt-3 text-[2.2rem] font-bold tracking-[-0.05em] text-white">Online</p>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Search any city to stream current conditions into the main forecast panel.
        </p>
      </article>
    </aside>
  );
}

export default InsightSidebar;
