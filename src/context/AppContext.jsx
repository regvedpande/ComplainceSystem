import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export const COMPANY = {
  name: 'Axiom Capital Management Ltd.',
  short: 'Axiom Capital',
  code: 'ACML',
  tagline: 'Regulatory Compliance Portal',
}

export const DEMO_USER = {
  name: 'Regved Pande',
  employeeCode: 'EMP001',
  department: 'Compliance',
  designation: 'Senior Compliance Analyst',
  band: 'M5',
}

// Indian fiscal year: April 1 – March 31
// After submitting, locked until April 1 of the following year
export function getNextUnlockDate(submittedAt) {
  const submitted = new Date(submittedAt)
  const submittedYear = submitted.getFullYear()
  // If submitted before April 1, next unlock is April 1 same year
  // If submitted on/after April 1, next unlock is April 1 next year
  const april1SameYear = new Date(submittedYear, 3, 1) // April = month 3
  if (submitted < april1SameYear) {
    return april1SameYear
  }
  return new Date(submittedYear + 1, 3, 1)
}

export function isLocked(submission) {
  if (!submission) return false
  return new Date() < getNextUnlockDate(submission.submittedAt)
}

export function getFiscalYear() {
  const now = new Date()
  const year = now.getFullYear()
  // FY starts April 1: if month < April, FY started last year
  if (now.getMonth() < 3) {
    return `FY ${year - 1}–${String(year).slice(2)}`
  }
  return `FY ${year}–${String(year + 1).slice(2)}`
}

const INITIAL_SUBMISSIONS = {
  assetLiability: null,
  conflictOfInterest: null,
  insiderTrading: null,
  amlDeclaration: null,
  poshAcknowledgment: null,
  kyeDeclaration: null,
  codeOfConduct: null,
  giftHospitality: null,
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('acml_user')
      return saved ? JSON.parse(saved) : DEMO_USER
    } catch {
      return DEMO_USER
    }
  })

  const [submissions, setSubmissions] = useState(() => {
    try {
      const saved = localStorage.getItem('acml_submissions')
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS
    } catch {
      return INITIAL_SUBMISSIONS
    }
  })

  useEffect(() => {
    localStorage.setItem('acml_user', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem('acml_submissions', JSON.stringify(submissions))
  }, [submissions])

  const submitForm = (formName, data) => {
    setSubmissions(prev => ({
      ...prev,
      [formName]: {
        ...data,
        submittedAt: new Date().toISOString(),
        submittedBy: user?.name,
        employeeCode: user?.employeeCode,
        department: user?.department,
        fiscalYear: getFiscalYear(),
      },
    }))
  }

  // 'submitted-locked' | 'pending' | 'submitted-unlocked'
  const formStatus = (formName) => {
    const sub = submissions[formName]
    if (!sub) return 'pending'
    if (isLocked(sub)) return 'submitted-locked'
    return 'submitted-unlocked' // can resubmit now
  }

  const logout = () => {
    setUser(DEMO_USER)
    setSubmissions(INITIAL_SUBMISSIONS)
    localStorage.setItem('acml_user', JSON.stringify(DEMO_USER))
    localStorage.removeItem('acml_submissions')
  }

  return (
    <AppContext.Provider
      value={{ user, setUser, submissions, submitForm, formStatus, isLocked, logout }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export default AppContext
