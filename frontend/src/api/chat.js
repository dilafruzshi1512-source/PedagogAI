import { apiRequest } from './client'

export function sendChatMessage(message, token) {
  return apiRequest('/chat', {
    method: 'POST',
    body: { message },
    token,
  })
}
