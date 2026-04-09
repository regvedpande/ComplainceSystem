import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material'
import ShieldIcon from '@mui/icons-material/Shield'
import LockIcon from '@mui/icons-material/Lock'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

const DEPARTMENTS = ['Compliance', 'Finance', 'HR', 'IT', 'Operations', 'Risk Management']
const BANDS = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'A1', 'A2', 'A3', 'A4', 'A5']

export default function Login() {
  const { setUser } = useApp()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    employeeCode: '',
    department: '',
    designation: '',
    band: '',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.employeeCode.trim()) e.employeeCode = 'Employee code is required'
    if (!form.department) e.department = 'Department is required'
    if (!form.designation.trim()) e.designation = 'Designation is required'
    if (!form.band) e.band = 'Band is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setUser(form)
    toast.success(`Welcome back, ${form.name}!`)
    navigate('/dashboard')
    setLoading(false)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 40%, #00695c 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        p: 2,
      }}
    >
      {/* Background pattern */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 200 + i * 80,
            height: 200 + i * 80,
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
      ))}

      <Box sx={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 460 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.12)',
              mb: 2,
              border: '2px solid rgba(255,255,255,0.2)',
            }}
          >
            <ShieldIcon sx={{ fontSize: 40, color: '#80cbc4' }} />
          </Box>
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
            EDF Compliance Portal
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            UTI Asset Management Company
          </Typography>
          <Chip
            icon={<VerifiedUserIcon sx={{ fontSize: '14px !important' }} />}
            label="Secure Login — 256-bit SSL"
            size="small"
            sx={{
              mt: 1.5,
              bgcolor: 'rgba(0,137,123,0.3)',
              color: '#80cbc4',
              border: '1px solid rgba(0,137,123,0.5)',
              fontSize: '0.7rem',
              '& .MuiChip-icon': { color: '#80cbc4' },
            }}
          />
        </Box>

        {/* Login Card */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            overflow: 'visible',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1a237e, #283593)',
              borderRadius: '12px 12px 0 0',
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <LockIcon sx={{ color: '#80cbc4', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700 }}>
              Employee Login
            </Typography>
          </Box>

          <CardContent sx={{ p: 3 }}>
            <Alert severity="info" sx={{ mb: 2.5, fontSize: '0.78rem', borderRadius: 2 }}>
              Use your employee credentials to access the compliance portal.
            </Alert>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Full Name"
                fullWidth
                value={form.name}
                onChange={handleChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                sx={{ mb: 2 }}
                placeholder="e.g. Rajesh Kumar"
              />
              <TextField
                label="Employee Code"
                fullWidth
                value={form.employeeCode}
                onChange={handleChange('employeeCode')}
                error={!!errors.employeeCode}
                helperText={errors.employeeCode || 'e.g. EMP001'}
                sx={{ mb: 2 }}
                placeholder="EMP001"
              />
              <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.department}>
                <InputLabel>Department</InputLabel>
                <Select
                  value={form.department}
                  onChange={handleChange('department')}
                  label="Department"
                >
                  {DEPARTMENTS.map((d) => (
                    <MenuItem key={d} value={d}>{d}</MenuItem>
                  ))}
                </Select>
                {errors.department && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.department}
                  </Typography>
                )}
              </FormControl>
              <TextField
                label="Designation"
                fullWidth
                value={form.designation}
                onChange={handleChange('designation')}
                error={!!errors.designation}
                helperText={errors.designation}
                sx={{ mb: 2 }}
                placeholder="e.g. Senior Analyst"
              />
              <FormControl fullWidth sx={{ mb: 3 }} error={!!errors.band}>
                <InputLabel>Band</InputLabel>
                <Select
                  value={form.band}
                  onChange={handleChange('band')}
                  label="Band"
                >
                  {BANDS.map((b) => (
                    <MenuItem key={b} value={b}>{b}</MenuItem>
                  ))}
                </Select>
                {errors.band && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.band}
                  </Typography>
                )}
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #1a237e, #283593)',
                  '&:hover': { background: 'linear-gradient(135deg, #0d1560, #1a237e)' },
                  fontSize: '1rem',
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={18} color="inherit" />
                    Authenticating...
                  </Box>
                ) : (
                  'Login to Portal'
                )}
              </Button>
            </form>

            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
              For access issues, contact IT Helpdesk: helpdesk@utiamt.com
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'rgba(255,255,255,0.5)', mt: 2 }}>
          © 2026 UTI Asset Management Company Ltd. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}
