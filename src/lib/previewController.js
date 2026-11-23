const MAX_ACTIVE_PREVIEWS = 3
const players = new Map()
let audioUnlocked = false

function reconcile() {
  const wanted = [...players.entries()].filter(([, player]) => player.wanted)
  const shouldPlay = new Set(wanted.slice(0, MAX_ACTIVE_PREVIEWS).map(([id]) => id))
  const soundId = wanted.find(([, player]) => player.withSound && audioUnlocked)?.[0]

  for (const [id, player] of players) {
    player.element.muted = id !== soundId
    if (shouldPlay.has(id)) {
      const attempt = player.element.play()
      if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {})
    } else {
      player.element.pause()
    }
    player.playing = shouldPlay.has(id)
  }
}

export function registerPreview(id, element) {
  players.set(id, { element, wanted: false, withSound: false, playing: false })
  reconcile()
}

export function setPreviewWanted(id, wanted, withSound = false) {
  const player = players.get(id)
  if (!player) return
  if (player.wanted === wanted && player.withSound === withSound) return
  player.wanted = wanted
  player.withSound = withSound
  reconcile()
}

export function unregisterPreview(id) {
  const player = players.get(id)
  if (player) player.element.pause()
  players.delete(id)
  reconcile()
}

if (typeof document !== 'undefined') {
  const unlockAudio = () => {
    if (audioUnlocked) return
    audioUnlocked = true
    reconcile()
  }

  document.addEventListener('pointerdown', unlockAudio, { once: true })
  document.addEventListener('keydown', unlockAudio, { once: true })
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      for (const player of players.values()) player.element.pause()
    } else {
      reconcile()
    }
  })
}
