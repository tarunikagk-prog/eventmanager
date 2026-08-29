import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import AdminPanelPage from './pages/AdminPanelPage'
import DashboardPage from './pages/DashboardPage'
import EventDetailsPage from './pages/EventDetailsPage'
import EventFormPage from './pages/EventFormPage'
import EventsPage from './pages/EventsPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MyRegistrationsPage from './pages/MyRegistrationsPage'
import RegisterPage from './pages/RegisterPage'
import type { Role } from './lib/mockData'
import { getCurrentUser } from './lib/mockData'

interface ProtectedRouteProps {
  children: ReactNode
  roles?: Role[]
}

function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const currentUser = getCurrentUser()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route
            path="/events/new"
            element={
              <ProtectedRoute roles={['ADMIN', 'ORGANIZER']}>
                <EventFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id/edit"
            element={
              <ProtectedRoute roles={['ADMIN', 'ORGANIZER']}>
                <EventFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-registrations"
            element={
              <ProtectedRoute>
                <MyRegistrationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminPanelPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
