import { ArrowDown, ArrowUpRight, Blocks, Compass, Pickaxe, Shield, Sparkles } from 'lucide-react'
import { EventsSection } from '@/components/events-section'
import { JoinServer } from '@/components/join-server'
import { ServerStatusCard } from '@/components/server-status-card'
import { getMinecraftStatus } from '@/lib/minecraft-status'

const serverAddress = 'murphyhall.duckdns.org'

export default async function Home() {
  const status = await getMinecraftStatus(serverAddress)

  return (
    <main className="min-h-screen overflow-hidden bg-[#0d100e] text-[#f3f2eb] selection:bg-[#c1d6a4] selection:text-[#10130f]">
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <a href="#home" className="group flex items-center gap-3" aria-label="Murphy Hall home">
          <span className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-[#c1d6a4] transition group-hover:border-[#c1d6a4]/40">
            <Blocks size={19} strokeWidth={1.7} aria-hidden="true" />
          </span>
          <span className="font-semibold tracking-tight">Murphy Hall</span>
        </a>
        <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm text-white/60 md:flex">
          <a className="transition hover:text-white" href="#about">The server</a>
          <a className="transition hover:text-white" href="#events">Events</a>
          <a className="transition hover:text-white" href="#join">How to join</a>
        </nav>
        <a href="#join" className="inline-flex items-center gap-2 rounded-full bg-[#c1d6a4] px-4 py-2.5 text-sm font-semibold text-[#182016] transition hover:bg-[#d1e3b8]">
          Join the server <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </header>

      <section id="home" className="relative isolate mx-auto flex min-h-[610px] max-w-[1600px] items-center px-5 pb-24 pt-16 sm:min-h-[680px] sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 -z-10 h-[640px] bg-[url('/images/murphy-hall-night.png')] bg-cover bg-[center_54%]" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 -z-10 h-[640px] bg-gradient-to-r from-[#0d100e] via-[#0d100e]/75 to-[#0d100e]/20" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 -z-10 h-[640px] bg-gradient-to-b from-[#0d100e]/30 via-transparent to-[#0d100e]" aria-hidden="true" />
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1fr_340px]">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3.5 py-2 text-xs font-medium tracking-wide text-white/75 backdrop-blur-sm">
              <span className={`size-2 rounded-full ${status.online ? 'bg-[#a8d28b] shadow-[0_0_12px_#a8d28b]' : status.online === false ? 'bg-[#d47f70]' : 'bg-[#d3b879]'}`} aria-hidden="true" />
              {status.online ? 'THE WORLD IS OPEN' : status.online === false ? 'SERVER OFFLINE' : 'CHECKING SERVER'}
            </div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#c1d6a4]">A place to make your own</p>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-7xl lg:text-[88px]">
              Find your <span className="font-serif font-normal italic text-[#c1d6a4]">corner</span> of the world.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
              Welcome to Murphy Hall — a little blocky home for building, exploring, and making stories together.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a href="#join" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#c1d6a4] px-6 text-sm font-semibold text-[#182016] transition hover:-translate-y-0.5 hover:bg-[#d1e3b8]">
                <Pickaxe size={17} aria-hidden="true" /> Come on in
              </a>
              <a href="#about" className="inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-sm font-medium text-white/75 transition hover:text-white">
                Take a look <ArrowDown size={15} aria-hidden="true" />
              </a>
            </div>
          </div>

          <ServerStatusCard status={status} />
        </div>
        <div className="absolute bottom-0 left-5 right-5 mx-auto flex max-w-7xl items-center justify-between border-t border-white/10 py-5 text-[11px] uppercase tracking-[0.22em] text-white/40 sm:left-8 sm:right-8 lg:left-12 lg:right-12">
          <span>Murphy Hall · Minecraft community</span>
          <span className="hidden items-center gap-2 sm:flex"><Compass size={13} aria-hidden="true" /> Your next great build starts here</span>
        </div>
      </section>

      <section id="about" className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-12">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#c1d6a4]">A world worth wandering</p>
          <h2 className="max-w-md text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">Built together, one block at a time.</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          <Feature icon={<Blocks size={18} />} title="Make it yours" description="Bring a half-formed idea or a grand plan. There is room for both." />
          <Feature icon={<Shield size={18} />} title="A friendly place" description="A community-first world where good neighbors make great stories." />
          <Feature icon={<Sparkles size={18} />} title="More to come" description="The world is growing. New adventures are just around the corner." />
        </div>
      </section>

      <EventsSection />

      <JoinServer address={serverAddress} />

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-white/10 px-5 py-7 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <span>© {new Date().getFullYear()} Murphy Hall</span>
        <span>A community server. Built block by block.</span>
      </footer>
    </main>
  )
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <article className="border-t border-white/15 pt-5">
      <span className="mb-5 flex size-9 items-center justify-center rounded-lg bg-[#c1d6a4]/10 text-[#c1d6a4]">{icon}</span>
      <h3 className="mb-2 text-base font-semibold tracking-tight">{title}</h3>
      <p className="text-sm leading-6 text-white/50">{description}</p>
    </article>
  )
}
