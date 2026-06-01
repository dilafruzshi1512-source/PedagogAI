import { apiRequest } from './client'

export function generateLesson({ topic, grade, language = 'uz' }) {
  return apiRequest('/generate-lesson', {
    method: 'POST',
    body: { topic, grade, language },
  })
}

export function createLessonWithAuth({ topic, grade, language = 'uz' }, token) {
  return apiRequest('/create-lesson', {
    method: 'POST',
    body: { topic, grade, language },
    token,
  })
}

export function fetchMyLessons(token) {
  return apiRequest('/my-lessons', { method: 'GET', token })
}
