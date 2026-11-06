import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { useAuth } from './contexts/AuthContext'
import { DashboardPage } from './pages/DashboardPage'
import { AppointmentsPage } from './pages/AppointmentsPage'
import { ChatPage } from './pages/ChatPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { LoginPage } from './pages/LoginPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { SignUpPage } from './pages/SignUpPage'
import { HealthLibraryPage } from './pages/HealthLibraryPage'
import { PeriodTrackerPage } from './pages/PeriodTrackerPage'
import { ProfilePage } from './pages/ProfilePage'
import { SymptomCheckerPage } from './pages/SymptomCheckerPage'
import { FeaturePlaceholderPage } from './pages/FeaturePlaceholderPage'

function ProtectedLayout() {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  return user ? <AppLayout /> : <Navigate to="/login" replace />
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/symptoms" element={<SymptomCheckerPage />} />
        <Route path="/period" element={<PeriodTrackerPage />} />
        <Route path="/library" element={<HealthLibraryPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<FeaturePlaceholderPage feature="Settings" />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
