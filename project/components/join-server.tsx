'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export function JoinServer({ address }: { address: string }) {
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setCopyFailed(false)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopyFailed(true)
      setCopied(false)
    }
  }

  return (
    <section id="join" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="relative overflow-hidden rounded-3xl border border-[#c1d6a4]/15 bg-[#171d16] px-6 py-10 sm:px-10 sm:py-14 lg:px-16">
        <div className="pointer-events-none absolute -right-20 -top-36 size-96 rounded-full bg-[#9ab778]/10 blur-3xl" aria-hidden="true" />
        <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#c1d6a4]">Your next adventure</p>
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">There&apos;s room for one more.</h2>
            <p className="mt-4 text-sm leading-6 text-white/55">Open Minecraft, add a server, and you&apos;re on your way. We&apos;ll save you the typing.</p>
          </div>
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e120e]/75 p-4 sm:p-5">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Server address · Java Edition</p>
            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2 pl-4">
              <code className="min-w-0 flex-1 truncate font-mono text-sm text-white sm:text-base" aria-label={`Server IP address ${address}`}>{address}</code>
              <button onClick={copyAddress} className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg bg-[#c1d6a4] px-3.5 text-xs font-semibold text-[#182016] transition hover:bg-[#d1e3b8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c1d6a4] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e120e]" aria-label={copied ? 'Server address copied' : 'Copy server address'}>
                {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                {copied ? 'Copied' : 'Copy IP'}
              </button>
            </div>
            <p aria-live="polite" className="mt-3 min-h-4 text-xs text-[#c1d6a4]">{copied ? 'Address copied — paste it into Minecraft.' : copyFailed ? 'Clipboard unavailable. Select and copy the address above.' : 'Multiplayer → Add Server → paste the address.'}</p>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-white/40"><span className="size-1.5 rounded-full bg-[#a8d28b]" aria-hidden="true" /> We&apos;ll see you in there.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
