import { Activity, Users, Wifi } from 'lucide-react'
import type { MinecraftStatus } from '@/lib/minecraft-status'

export function ServerStatusCard({ status }: { status: MinecraftStatus }) {
  const stateLabel = status.online === true ? 'Online' : status.online === false ? 'Offline' : 'Unavailable'

  return (
    <aside aria-label="Minecraft server status" className="w-full max-w-sm justify-self-start rounded-2xl border border-white/15 bg-[#111511]/75 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl lg:justify-self-end">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/45">Server status</p>
          <p className="mt-1 text-lg font-semibold tracking-tight">Murphy Hall</p>
        </div>
        <span className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${status.online ? 'border-[#a8d28b]/20 bg-[#a8d28b]/10 text-[#c1d6a4]' : status.online === false ? 'border-[#d47f70]/20 bg-[#d47f70]/10 text-[#e5a195]' : 'border-[#d3b879]/20 bg-[#d3b879]/10 text-[#e4d2a2]'}`}>
          <span className={`size-1.5 rounded-full ${status.online ? 'bg-[#a8d28b]' : status.online === false ? 'bg-[#d47f70]' : 'bg-[#d3b879]'}`} aria-hidden="true" />
          {stateLabel}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-4">
          <div className="mb-3 flex items-center gap-2 text-xs text-white/45"><Users size={14} aria-hidden="true" /> Players</div>
          <p className="text-2xl font-semibold tracking-tight">{status.playersOnline ?? '—'}<span className="ml-1 text-sm font-normal text-white/35">/ {status.playersMax ?? '—'}</span></p>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-4">
          <div className="mb-3 flex items-center gap-2 text-xs text-white/45"><Activity size={14} aria-hidden="true" /> Version</div>
          <p className="truncate text-base font-semibold tracking-tight">{status.version ?? '—'}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-white/40">
        <Wifi size={14} aria-hidden="true" />
        <span>{status.online === null ? 'Live status is temporarily unavailable' : status.online ? 'Java Edition · Live status' : 'Java Edition · Not reachable right now'}</span>
      </div>
    </aside>
  )
}
