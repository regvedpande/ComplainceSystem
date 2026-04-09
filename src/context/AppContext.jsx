import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

const INITIAL_SUBMISSIONS = {
  antiFraud: null,
  conflictOfInterest: null,
  nonDisclosure: null,
  hrDeclaration: null,
  giftReward: null,
  propertyDeclaration: null,
  codeOfConduct: null,
  relativeEmployment: null,
}

// Forms that are 'not-due' by default for demo
const NOT_DUE_FORMS = ['giftReward', 'relativeEmployment']

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('compliance_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [submissions, setSubmissions] = useState(() => {
    try {
      const saved = localStorage.getItem('compliance_submissions')
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS
    } catch {
      return INITIAL_SUBMISSIONS
    }
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('compliance_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('compliance_user')
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem('compliance_submissions', JSON.stringify(submissions))
  }, [submissions])

  const submitForm = (formName, data) => {
    setSubmissions((prev) => ({
      ...prev,
      [formName]: {
        ...data,
        submittedAt: new Date().toISOString(),
        submittedBy: user?.name,
        employeeCode: user?.employeeCode,
        department: user?.department,
      },
    }))
  }

  const formStatus = (formName) => {
    if (submissions[formName]) return 'submitted'
    if (NOT_DUE_FORMS.includes(formName)) return 'not-due'
    return 'pending'
  }

  const logout = () => {
    setUser(null)
    setSubmissions(INITIAL_SUBMISSIONS)
    localStorage.removeItem('compliance_user')
    localStorage.removeItem('compliance_submissions')
  }

  return (
    <AppContext.Provider
      value={{ user, setUser, submissions, submitForm, formStatus, logout }}
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
