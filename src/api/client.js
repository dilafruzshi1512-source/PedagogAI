const API_BASE = import.meta.env.VITE_API_URL || '/api'

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export async function apiRequest(path, options = {}) {
  const { token, body, headers = {}, ...rest } = options

  const config = {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (body !== undefined) {
    config.body = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(`${API_BASE}${path}`, config)
  } catch {
    throw new ApiError(
      'API serverga ulanib bo\'lmadi. Backend ishlayotganini tekshiring (port 8000).',
      0,
      null
    )
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    let message = data?.error || data?.message || `Request failed (${response.status})`
    const detail = data?.detail
    if (detail) {
      message = typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
          ? detail.map((m) => m.msg || m).join(', ')
          : String(detail)
    }
    throw new ApiError(message, response.status, data)
  }

  if (data?.error) {
    throw new ApiError(data.error, response.status, data)
  }

  return data
}

export { API_BASE }
