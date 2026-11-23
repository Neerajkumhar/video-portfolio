export function assetPath(relativePath) {
  if (!relativePath) return ''
  return `${import.meta.env.BASE_URL}${relativePath}`
}

export function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const minutes = Math.floor(total / 60)
  const remainder = String(total % 60).padStart(2, '0')
  return `${minutes}:${remainder}`
}

export function formatCount(count) {
  return String(count).padStart(2, '0')
}
