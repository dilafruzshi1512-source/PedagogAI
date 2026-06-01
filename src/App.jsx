import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import Dashboard from '@/pages/Dashboard'
import LessonGenerator from '@/pages/LessonGenerator'
import TestGenerator from '@/pages/TestGenerator'
import InteractiveTasks from '@/pages/InteractiveTasks'
import AIAssistant from '@/pages/AIAssistant'
import Presentations from '@/pages/Presentations'
import Analytics from '@/pages/Analytics'
import Profile from '@/pages/Profile'

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.22, ease: 'easeOut' },
}

function AnimatedPage({ children }) {
  return (
    <motion.div {...pageTransition} className="h-full">
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
          <Route path="/lesson" element={<AnimatedPage><LessonGenerator /></AnimatedPage>} />
          <Route path="/test" element={<AnimatedPage><TestGenerator /></AnimatedPage>} />
          <Route path="/crossword" element={<AnimatedPage><InteractiveTasks /></AnimatedPage>} />
          <Route path="/assistant" element={<AnimatedPage><AIAssistant /></AnimatedPage>} />
          <Route path="/presentation" element={<AnimatedPage><Presentations /></AnimatedPage>} />
          <Route path="/analytics" element={<AnimatedPage><Analytics /></AnimatedPage>} />
          <Route path="/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return <AnimatedRoutes />
}
