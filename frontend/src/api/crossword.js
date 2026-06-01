import { apiRequest } from './client'

export function generateCrossword({ topic, count = 5 }) {
  return apiRequest('/generate-crossword', {
    method: 'POST',
    body: { topic, count },
  })
}

export function parseCrosswordData(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
