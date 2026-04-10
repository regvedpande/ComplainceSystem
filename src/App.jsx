import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Toaster } from 'react-hot-toast'
import theme from './theme'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import AssetLiability from './forms/AssetLiability'
import ConflictOfInterest from './forms/ConflictOfInterest'
import InsiderTrading from './forms/InsiderTrading'
import AMLDeclaration from './forms/AMLDeclaration'
import POSHAcknowledgment from './forms/POSHAcknowledgment'
import KYEDeclaration from './forms/KYEDeclaration'
import CodeOfConduct from './forms/CodeOfConduct'
import GiftHospitality from './forms/GiftHospitality'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="reports" element={<Reports />} />
        <Route path="form/asset-liability" element={<AssetLiability />} />
        <Route path="form/conflict-of-interest" element={<ConflictOfInterest />} />
        <Route path="form/insider-trading" element={<InsiderTrading />} />
        <Route path="form/aml-declaration" element={<AMLDeclaration />} />
        <Route path="form/posh-acknowledgment" element={<POSHAcknowledgment />} />
        <Route path="form/kye-declaration" element={<KYEDeclaration />} />
        <Route path="form/code-of-conduct" element={<CodeOfConduct />} />
        <Route path="form/gift-hospitality" element={<GiftHospitality />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
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
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
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
