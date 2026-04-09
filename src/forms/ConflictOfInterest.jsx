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
  Button,
  Grid,
  IconButton,
  Alert,
} from '@mui/material'
import BalanceIcon from '@mui/icons-material/Balance'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useApp } from '../context/AppContext'
import FormWrapper from '../components/FormWrapper'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const PERIODS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026']

const blankDisclosure = { companyName: '', natureOfInterest: '', holdingPct: '' }
const blankOutside = { companyName: '', natureOfWork: '', timeCommitment: '' }

export default function ConflictOfInterest() {
  const { formStatus, submitForm, submissions } = useApp()
  const navigate = useNavigate()
  const status = formStatus('conflictOfInterest')
  const existing = submissions.conflictOfInterest

  const [form, setForm] = useState({
    period: existing?.period || 'Q1 2026',
    q1: existing?.q1 || 'No',
    disclosures: existing?.disclosures || [{ ...blankDisclosure }],
    q2: existing?.q2 || 'No',
    outsideEmployment: existing?.outsideEmployment || [{ ...blankOutside }],
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

  const setDisclosure = (idx, field) => (e) => {
    const updated = form.disclosures.map((d, i) => i === idx ? { ...d, [field]: e.target.value } : d)
    setForm((p) => ({ ...p, disclosures: updated }))
  }

  const setOutside = (idx, field) => (e) => {
    const updated = form.outsideEmployment.map((d, i) => i === idx ? { ...d, [field]: e.target.value } : d)
    setForm((p) => ({ ...p, outsideEmployment: updated }))
  }

  const addDisclosure = () => {
    if (form.disclosures.length < 3) {
      setForm((p) => ({ ...p, disclosures: [...p.disclosures, { ...blankDisclosure }] }))
    }
  }

  const removeDisclosure = (idx) => {
    setForm((p) => ({ ...p, disclosures: p.disclosures.filter((_, i) => i !== idx) }))
  }

  const validate = () => {
    const e = {}
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
    submitForm('conflictOfInterest', form)
    toast.success('Conflict of Interest Disclosure submitted!')
    navigate('/dashboard')
    setSubmitting(false)
  }

  const disabled = status === 'submitted'

  return (
    <FormWrapper
      title="Conflict of Interest Disclosure"
      description="Quarterly disclosure of any personal, financial, or professional interests that may conflict with your duties at UTI AMC."
      icon={<BalanceIcon />}
      iconColor="#1565c0"
      iconBg="#e3f2fd"
      dueDate="Apr 15, 2026"
      status={status}
      submittedAt={existing?.submittedAt}
      submitting={submitting}
      onSubmit={handleSubmit}
    >
      {/* Period */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Declaration Period</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControl fullWidth>
          <InputLabel>Period</InputLabel>
          <Select value={form.period} onChange={set('period')} label="Period" disabled={disabled}>
            {PERIODS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
          </Select>
        </FormControl>
      </Paper>

      {/* Q1 */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Financial Interests</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControl component="fieldset">
          <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            1. Do you or any immediate family member hold a financial interest (&gt;1%) in any
            company that does business with UTI AMC?
          </FormLabel>
          <RadioGroup row value={form.q1} onChange={set('q1')}>
            <FormControlLabel value="Yes" control={<Radio disabled={disabled} />} label="Yes" />
            <FormControlLabel value="No" control={<Radio disabled={disabled} />} label="No" />
          </RadioGroup>
        </FormControl>

        {form.q1 === 'Yes' && (
          <Box sx={{ mt: 2 }}>
            {form.disclosures.map((d, idx) => (
              <Box key={idx} sx={{ p: 2, mb: 1.5, bgcolor: '#f8f9ff', borderRadius: 2, border: '1px solid #e3e7ff' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="caption" fontWeight={700} color="primary">Disclosure {idx + 1}</Typography>
                  {idx > 0 && !disabled && (
                    <IconButton size="small" onClick={() => removeDisclosure(idx)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth size="small" label="Company Name" value={d.companyName} onChange={setDisclosure(idx, 'companyName')} disabled={disabled} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth size="small" label="Nature of Interest" value={d.natureOfInterest} onChange={setDisclosure(idx, 'natureOfInterest')} disabled={disabled} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField fullWidth size="small" label="% Holding" value={d.holdingPct} onChange={setDisclosure(idx, 'holdingPct')} type="number" disabled={disabled} />
                  </Grid>
                </Grid>
              </Box>
            ))}
            {!disabled && form.disclosures.length < 3 && (
              <Button startIcon={<AddIcon />} size="small" onClick={addDisclosure} variant="outlined" sx={{ mt: 1 }}>
                Add More Disclosures
              </Button>
            )}
          </Box>
        )}
      </Paper>

      {/* Q2 */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Outside Employment</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControl component="fieldset">
          <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            2. Are you involved in any outside employment, consulting, or business activity?
          </FormLabel>
          <RadioGroup row value={form.q2} onChange={set('q2')}>
            <FormControlLabel value="Yes" control={<Radio disabled={disabled} />} label="Yes" />
            <FormControlLabel value="No" control={<Radio disabled={disabled} />} label="No" />
          </RadioGroup>
        </FormControl>
        {form.q2 === 'Yes' && (
          <Box sx={{ mt: 2 }}>
            {form.outsideEmployment.map((d, idx) => (
              <Grid container spacing={2} key={idx} sx={{ mb: 1 }}>
                <Grid item xs={12} sm={5}>
                  <TextField fullWidth size="small" label="Company / Organization" value={d.companyName} onChange={setOutside(idx, 'companyName')} disabled={disabled} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth size="small" label="Nature of Work" value={d.natureOfWork} onChange={setOutside(idx, 'natureOfWork')} disabled={disabled} />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField fullWidth size="small" label="Time Commitment" value={d.timeCommitment} onChange={setOutside(idx, 'timeCommitment')} placeholder="e.g. 5 hrs/week" disabled={disabled} />
                </Grid>
              </Grid>
            ))}
          </Box>
        )}
      </Paper>

      {/* Q3 & Q4 */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Other Disclosures</Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mb: 3 }}>
          <FormControl component="fieldset">
            <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
              3. Do you have any personal relationships with vendors or clients of UTI AMC?
            </FormLabel>
            <RadioGroup row value={form.q3} onChange={set('q3')}>
              <FormControlLabel value="Yes" control={<Radio disabled={disabled} />} label="Yes" />
              <FormControlLabel value="No" control={<Radio disabled={disabled} />} label="No" />
            </RadioGroup>
          </FormControl>
        </Box>
        <FormControl component="fieldset">
          <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            4. Have you received any gifts or hospitality from vendors this quarter?
          </FormLabel>
          <RadioGroup row value={form.q4} onChange={set('q4')}>
            <FormControlLabel value="Yes" control={<Radio disabled={disabled} />} label="Yes" />
            <FormControlLabel value="No" control={<Radio disabled={disabled} />} label="No" />
          </RadioGroup>
        </FormControl>
      </Paper>

      {/* Declaration */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Declaration & Signature</Typography>
        <Divider sx={{ mb: 2 }} />
        <Alert severity="info" sx={{ mb: 2, borderRadius: 2, fontSize: '0.82rem' }}>
          I hereby declare that the above information is complete, accurate, and true. I understand
          that failure to disclose conflicts of interest may result in disciplinary action.
        </Alert>
        <FormControlLabel
          control={<Checkbox checked={form.declaration} onChange={set('declaration')} disabled={disabled} color="primary" />}
          label={<Typography variant="body2">I confirm the above declaration is accurate and complete. <span style={{ color: 'red' }}>*</span></Typography>}
        />
        {errors.declaration && <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, ml: 4 }}>{errors.declaration}</Typography>}
        <Box sx={{ display: 'flex', gap: 2, mt: 2.5, flexWrap: 'wrap' }}>
          <TextField label="Digital Signature *" value={form.signature} onChange={set('signature')} error={!!errors.signature} helperText={errors.signature || 'Type your full name'} sx={{ flex: 2, minWidth: 200 }} disabled={disabled} />
          <TextField label="Date" type="date" value={form.date} sx={{ flex: 1, minWidth: 150 }} InputLabelProps={{ shrink: true }} disabled />
        </Box>
      </Paper>
    </FormWrapper>
  )
}
