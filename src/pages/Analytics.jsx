import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from 'recharts'
import PageHeader from '@/components/ui/PageHeader'
import { DEMO_STATS } from '@/data/constants'
import { useAuth } from '@/context/AuthContext'
import { useEffect, useState } from 'react'
import { fetchMyLessons } from '@/api/lessons'

const CHART_TOOLTIP = {
  background: 'rgba(22, 36, 62, 0.95)',
  border: '1px solid rgba(148, 163, 184, 0.15)',
  borderRadius: '10px',
  color: '#f1f5f9',
}

const WEEKLY = [
  { day: 'Dush', lessons: 3, tests: 2 },
  { day: 'Sesh', lessons: 5, tests: 1 },
  { day: 'Chor', lessons: 2, tests: 4 },
  { day: 'Pay', lessons: 6, tests: 3 },
  { day: 'Jum', lessons: 4, tests: 2 },
  { day: 'Shan', lessons: 1, tests: 0 },
  { day: 'Yak', lessons: 0, tests: 0 },
]

export default function Analytics() {
  const { token, isAuthenticated } = useAuth()
  const [lessonCount, setLessonCount] = useState(DEMO_STATS.lessons)

  useEffect(() => {
    if (!isAuthenticated || !token) return
    fetchMyLessons(token)
      .then((data) => setLessonCount(data.lessons?.length ?? 0))
      .catch(() => {})
  }, [token, isAuthenticated])

  return (
    <div className="animate-fade-in max-w-6xl">
      <PageHeader title="Analitika" subtitle="Faoliyat va statistika" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-10">
        {[
          { label: 'Jami darslar', value: lessonCount },
          { label: 'Testlar', value: DEMO_STATS.tests },
          { label: 'Krossvordlar', value: DEMO_STATS.crosswords },
          { label: 'Taqdimotlar', value: DEMO_STATS.presentations },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <p className="text-content-muted text-xs font-medium mb-2">{s.label}</p>
            <p className="stat-value bg-gradient-text bg-clip-text text-transparent">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="glass-card p-5 lg:p-6">
          <h3 className="section-title mb-5">Haftalik darslar</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={WEEKLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" />
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={CHART_TOOLTIP} />
              <Bar dataKey="lessons" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5 lg:p-6">
          <h3 className="section-title mb-5">Test faoliyati</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={WEEKLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" />
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={CHART_TOOLTIP} />
              <Line
                type="monotone"
                dataKey="tests"
                stroke="#22d3ee"
                strokeWidth={2.5}
                dot={{ fill: '#22d3ee', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#67e8f9' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
