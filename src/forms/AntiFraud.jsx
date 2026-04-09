import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Checkbox,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  Divider,
  Alert,
} from '@mui/material'
import SecurityIcon from '@mui/icons-material/Security'
import { useApp } from '../context/AppContext'
import FormWrapper from '../components/FormWrapper'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const PERIODS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026']

export default function AntiFraud() {
  const { formStatus, submitForm, submissions } = useApp()
  const navigate = useNavigate()
  const status = formStatus('antiFraud')
  const existing = submissions.antiFraud

  const [form, setForm] = useState({
    period: existing?.period || 'Q1 2026',
    q1: existing?.q1 || 'No',
    q1Details: existing?.q1Details || '',
    q2: existing?.q2 || 'No',
    q3: existing?.q3 || 'No',
    q4: existing?.q4 || 'No',
    declaration: existing?.declaration || false,
    signature: existing?.signature || '',
    date: existing?.date || new Date().toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((p) => ({ ...p, [field]: val }))
    setErrors((p) => ({ ...p, [field]: undefined }))
  }

  const validate = () => {
    const e = {}
    if (!form.period) e.period = 'Required'
    if (form.q1 === 'Yes' && !form.q1Details.trim()) e.q1Details = 'Please provide details'
    if (!form.declaration) e.declaration = 'You must accept the declaration'
    if (!form.signature.trim()) e.signature = 'Digital signature is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('Please fill all required fields')
      return
    }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1000))
    submitForm('antiFraud', form)
    toast.success('Anti-Fraud Declaration submitted successfully!')
    navigate('/dashboard')
    setSubmitting(false)
  }

  return (
    <FormWrapper
      title="Anti-Fraud Declaration Form"
      description="Quarterly declaration regarding awareness of fraudulent, corrupt, or dishonest activities within or related to the organisation."
      icon={<SecurityIcon />}
      iconColor="#e53935"
      iconBg="#ffebee"
      dueDate="Apr 15, 2026"
      status={status}
      submittedAt={existing?.submittedAt}
      submitting={submitting}
      onSubmit={handleSubmit}
    >
      {/* Section 1: Period */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Declaration Period
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControl fullWidth>
          <InputLabel>Period</InputLabel>
          <Select value={form.period} onChange={set('period')} label="Period" disabled={status === 'submitted'}>
            {PERIODS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
          </Select>
        </FormControl>
      </Paper>

      {/* Section 2: Questions */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Declaration Questions
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Q1 */}
        <Box sx={{ mb: 3 }}>
          <FormControl component="fieldset">
            <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
              1. Have you been involved in or are you aware of any fraudulent, corrupt or dishonest
              activities within or related to UTI AMC?
            </FormLabel>
            <RadioGroup row value={form.q1} onChange={set('q1')}>
              <FormControlLabel value="Yes" control={<Radio disabled={status === 'submitted'} />} label="Yes" />
              <FormControlLabel value="No" control={<Radio disabled={status === 'submitted'} />} label="No" />
            </RadioGroup>
          </FormControl>
          {form.q1 === 'Yes' && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Please provide details *"
              value={form.q1Details}
              onChange={set('q1Details')}
              error={!!errors.q1Details}
              helperText={errors.q1Details}
              sx={{ mt: 1.5 }}
              disabled={status === 'submitted'}
            />
          )}
        </Box>

        {/* Q2 */}
        <Box sx={{ mb: 3 }}>
          <FormControl component="fieldset">
            <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
              2. Have you observed any unusual transactions or activities that may indicate fraud?
            </FormLabel>
            <RadioGroup row value={form.q2} onChange={set('q2')}>
              <FormControlLabel value="Yes" control={<Radio disabled={status === 'submitted'} />} label="Yes" />
              <FormControlLabel value="No" control={<Radio disabled={status === 'submitted'} />} label="No" />
            </RadioGroup>
          </FormControl>
        </Box>

        {/* Q3 */}
        <Box sx={{ mb: 3 }}>
          <FormControl component="fieldset">
            <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
              3. Are you aware of any misuse of company assets, funds, or information?
            </FormLabel>
            <RadioGroup row value={form.q3} onChange={set('q3')}>
              <FormControlLabel value="Yes" control={<Radio disabled={status === 'submitted'} />} label="Yes" />
              <FormControlLabel value="No" control={<Radio disabled={status === 'submitted'} />} label="No" />
            </RadioGroup>
          </FormControl>
        </Box>

        {/* Q4 */}
        <Box>
          <FormControl component="fieldset">
            <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
              4. Do you have any reason to believe that company data security has been compromised?
            </FormLabel>
            <RadioGroup row value={form.q4} onChange={set('q4')}>
              <FormControlLabel value="Yes" control={<Radio disabled={status === 'submitted'} />} label="Yes" />
              <FormControlLabel value="No" control={<Radio disabled={status === 'submitted'} />} label="No" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Paper>

      {/* Section 3: Declaration */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Declaration & Signature
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Alert severity="warning" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.82rem' }}>
          <strong>Important:</strong> I understand that making a false declaration or concealing
          information related to fraud is a serious disciplinary offence and may result in
          termination of employment and/or legal proceedings. I hereby declare that the information
          provided above is true and correct to the best of my knowledge.
        </Alert>

        <FormControlLabel
          control={
            <Checkbox
              checked={form.declaration}
              onChange={set('declaration')}
              disabled={status === 'submitted'}
              color="primary"
            />
          }
          label={
            <Typography variant="body2">
              I have read and understood the above declaration and confirm its accuracy.{' '}
              <span style={{ color: 'red' }}>*</span>
            </Typography>
          }
        />
        {errors.declaration && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, ml: 4 }}>
            {errors.declaration}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2, mt: 2.5, flexWrap: 'wrap' }}>
          <TextField
            label="Digital Signature (Type full name) *"
            value={form.signature}
            onChange={set('signature')}
            error={!!errors.signature}
            helperText={errors.signature || 'Type your full name as digital signature'}
            sx={{ flex: 2, minWidth: 200 }}
            disabled={status === 'submitted'}
          />
          <TextField
            label="Date"
            type="date"
            value={form.date}
            onChange={set('date')}
            sx={{ flex: 1, minWidth: 150 }}
            InputLabelProps={{ shrink: true }}
            disabled
          />
        </Box>
      </Paper>
    </FormWrapper>
  )
}
