import { apiRequest } from './client'

export function registerUser({ name, email, password }) {
  return apiRequest('/register', {
    method: 'POST',
    body: { name, email, password },
  })
}

export function loginUser({ email, password }) {
  return apiRequest('/login', {
    method: 'POST',
    body: { email, password },
  })
}

export function fetchCurrentUser(token) {
  return apiRequest('/me', { method: 'GET', token })
}
