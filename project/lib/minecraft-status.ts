export type MinecraftStatus = {
  online: boolean | null
  playersOnline: number | null
  playersMax: number | null
  version: string | null
}

type StatusResponse = {
  online?: unknown
  players?: { online?: unknown; max?: unknown }
  version?: { name_clean?: unknown; name?: unknown }
}

function numericValue(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

export async function getMinecraftStatus(address: string): Promise<MinecraftStatus> {
  try {
    const response = await fetch(`https://api.mcstatus.io/v2/status/java/${encodeURIComponent(address)}`, {
      next: { revalidate: 45 },
      signal: AbortSignal.timeout(4500),
    })

    if (!response.ok) throw new Error(`Minecraft status request failed: ${response.status}`)

    const data = (await response.json()) as StatusResponse
    const online = typeof data.online === 'boolean' ? data.online : null

    return {
      online,
      playersOnline: numericValue(data.players?.online),
      playersMax: numericValue(data.players?.max),
      version: typeof data.version?.name_clean === 'string'
        ? data.version.name_clean
        : typeof data.version?.name === 'string'
          ? data.version.name
          : null,
    }
  } catch {
    return { online: null, playersOnline: null, playersMax: null, version: null }
  }
}
