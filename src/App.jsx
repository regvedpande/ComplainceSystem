import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Toaster } from 'react-hot-toast'
import theme from './theme'
import { AppProvider, useApp } from './context/AppContext'
import Layout from './components/Layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import AntiFraud from './forms/AntiFraud'
import ConflictOfInterest from './forms/ConflictOfInterest'
import NonDisclosure from './forms/NonDisclosure'
import HRDeclaration from './forms/HRDeclaration'
import GiftReward from './forms/GiftReward'
import PropertyDeclaration from './forms/PropertyDeclaration'
import CodeOfConduct from './forms/CodeOfConduct'
import RelativeEmployment from './forms/RelativeEmployment'

function ProtectedRoute({ children }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="reports" element={<Reports />} />
        <Route path="form/anti-fraud" element={<AntiFraud />} />
        <Route path="form/conflict-of-interest" element={<ConflictOfInterest />} />
        <Route path="form/non-disclosure" element={<NonDisclosure />} />
        <Route path="form/hr-declaration" element={<HRDeclaration />} />
        <Route path="form/gift-reward" element={<GiftReward />} />
        <Route path="form/property-declaration" element={<PropertyDeclaration />} />
        <Route path="form/code-of-conduct" element={<CodeOfConduct />} />
        <Route path="form/relative-employment" element={<RelativeEmployment />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '10px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              },
              success: {
                style: { background: '#1b5e20', color: '#fff' },
                iconTheme: { primary: '#fff', secondary: '#1b5e20' },
              },
              error: {
                style: { background: '#b71c1c', color: '#fff' },
                iconTheme: { primary: '#fff', secondary: '#b71c1c' },
              },
            }}
          />
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  )
}
