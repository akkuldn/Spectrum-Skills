import React from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Layout from './components/layout/Layout'

// Pages
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import ChildDashboard from './pages/ChildDashboard'
import ActivitiesHub from './pages/ActivitiesHub'
import ActivityPage from './pages/ActivityPage'
import Progress from './pages/Progress'
import Rewards from './pages/Rewards'
import ParentDashboard from './pages/ParentDashboard'
import Settings from './pages/Settings'

function ProtectedRoute() {
  const { isLoggedIn } = useApp()
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth />} />

      {/* Protected — wrapped in Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<ChildDashboard />} />
          <Route path="/activities" element={<ActivitiesHub />} />
          <Route path="/activities/:activityId" element={<ActivityPage />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/parent" element={<ParentDashboard />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
