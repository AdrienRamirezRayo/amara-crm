import React from "react";

export function PageShell({ eyebrow, title, subtitle, actions, children }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {eyebrow ? (
            <div className="text-[10px] uppercase tracking-[0.32em] text-zinc-500">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="mt-1 bg-gradient-to-r from-white via-violet-200 to-emerald-200 bg-clip-text text-3xl font-black tracking-tight text-transparent">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-3xl text-sm text-zinc-400">{subtitle}</p>
          ) : null}
        </div>

        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>

      {children}
    </div>
  );
}

export function GlassPanel({ title, subtitle, rightSlot, children, className = "" }) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-5 shadow-[0_25px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-300 hover:border-white/15 ${className}`}
    >
      {(title || subtitle || rightSlot) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {subtitle ? (
              <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                {subtitle}
              </div>
            ) : null}
            {title ? (
              <h2 className="mt-1 text-2xl font-black tracking-tight text-white">{title}</h2>
            ) : null}
          </div>

          {rightSlot ? <div>{rightSlot}</div> : null}
        </div>
      )}

      {children}
    </div>
  );
}

export function MetricCard({ label, value, note, tone = "purple", icon = null }) {
  const toneClass =
    tone === "green"
      ? "from-emerald-500/18 to-emerald-400/5 border-emerald-500/20"
      : "from-violet-500/18 to-fuchsia-500/5 border-violet-500/20";

  return (
    <div
      className={`rounded-3xl border bg-gradient-to-br ${toneClass} p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-1`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">{label}</div>
        {icon ? <div className="text-zinc-400">{icon}</div> : null}
      </div>
      <div className="mt-3 text-3xl font-black tracking-tight text-white">{value}</div>
      {note ? <div className="mt-2 text-sm text-zinc-400">{note}</div> : null}
    </div>
  );
}

export function StatusPill({ children, tone = "purple" }) {
  const styles =
    tone === "green"
      ? "bg-emerald-500/15 text-emerald-300"
      : tone === "yellow"
      ? "bg-yellow-500/15 text-yellow-300"
      : tone === "red"
      ? "bg-red-500/15 text-red-300"
      : "bg-violet-500/15 text-violet-300";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${styles}`}>
      {children}
    </span>
  );
}

export function ActionButton({ children, tone = "purple", className = "", ...props }) {
  const tones =
    tone === "green"
      ? "bg-gradient-to-r from-emerald-500 to-emerald-400 text-black"
      : tone === "ghost"
      ? "bg-white/5 text-zinc-200 hover:bg-white/10"
      : "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white";

  return (
    <button
      className={`rounded-2xl px-5 py-3 text-sm font-black shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition-all duration-200 hover:scale-[1.02] ${tones} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SearchInput({ placeholder = "Search...", className = "" }) {
  return (
    <input
      placeholder={placeholder}
      className={`w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 ${className}`}
    />
  );
}

export function RingGauge({ value, label, sublabel, tone = "purple", size = 120 }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, value));
  const offset = circumference - (progress / 100) * circumference;
  const id = `${label.replace(/\s+/g, "")}-${tone}-${size}`;

  const colors =
    tone === "green"
      ? { start: "#10b981", end: "#34d399" }
      : { start: "#7c3aed", end: "#d946ef" };

  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-5 text-center">
      <div className="mx-auto flex items-center justify-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
            <defs>
              <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.start} />
                <stop offset="100%" stopColor={colors.end} />
              </linearGradient>
            </defs>

            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={`url(#${id})`}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-white">
            {progress}%
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-zinc-300">{label}</div>
      {sublabel ? <div className="mt-1 text-sm text-zinc-500">{sublabel}</div> : null}
    </div>
  );
}

export function MiniStat({ label, value, tone = "purple" }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{label}</div>
      <div className={`mt-2 text-2xl font-black ${tone === "green" ? "text-emerald-300" : "text-violet-200"}`}>
        {value}
      </div>
    </div>
  );
}

export function DataTable({ columns, rows }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/20">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="bg-[#0f1218] text-left text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id || index} className="border-t border-white/8">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-zinc-300">
                    {typeof col.render === "function" ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}