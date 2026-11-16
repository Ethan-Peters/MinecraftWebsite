import { ArrowUpRight, CalendarDays, Clock3 } from 'lucide-react'

export function EventsSection() {
  return (
    <section id="events" className="border-y border-white/[0.08] bg-[#121612]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#c1d6a4]">Make a date of it</p>
            <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Around the Hall</h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-white/45">Community builds, little adventures, and whatever we dream up next.</p>
        </div>

        <article className="grid gap-6 rounded-2xl border border-white/10 bg-[#171c17] p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-8 sm:p-8">
          <div className="flex size-14 items-center justify-center rounded-xl border border-[#c1d6a4]/20 bg-[#c1d6a4]/10 text-[#c1d6a4]">
            <CalendarDays size={23} strokeWidth={1.6} aria-hidden="true" />
          </div>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#c1d6a4]/20 bg-[#c1d6a4]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c1d6a4]">Coming soon</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-white/40"><Clock3 size={13} aria-hidden="true" /> Date to be announced</span>
            </div>
            <h3 className="text-xl font-semibold tracking-tight">Something is taking shape</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">Events are in development. Check back soon for community builds, server nights, and new ways to explore Murphy Hall together.</p>
          </div>
          <span className="hidden size-10 items-center justify-center rounded-full border border-white/10 text-white/50 sm:flex" aria-hidden="true"><ArrowUpRight size={17} /></span>
        </article>
      </div>
    </section>
  )
}
