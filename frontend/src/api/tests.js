import { apiRequest } from './client'

/**
 * @returns {Promise<{ topic: string, grade: string, count: number, questions: Array }>}
 */
export function generateTest({ topic, grade, count = 5 }, token) {
  return apiRequest('/generate-test', {
    method: 'POST',
    body: {
      topic: topic.trim(),
      grade: String(grade),
      count: Number(count),
    },
    token,
  })
}
