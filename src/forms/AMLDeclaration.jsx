import React, { useState } from 'react'
import { Box, Paper, Typography, Divider, TextField, Checkbox, FormControlLabel,
  Alert, Grid, FormControl, FormLabel, RadioGroup, Radio } from '@mui/material'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import { useApp } from '../context/AppContext'
import FormWrapper from '../components/FormWrapper'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const QUESTIONS = [
  { id: 'q1', text: 'Are you a Politically Exposed Person (PEP) or a relative/associate of a PEP as defined under PMLA, 2002?' },
  { id: 'q2', text: 'Have you been charged with or convicted of any offence relating to money laundering, terrorist financing, or financial fraud in India or any other country?' },
  { id: 'q3', text: 'Do you have any business or financial dealings with entities/individuals under OFAC, UN, or RBI sanctions list?' },
  { id: 'q4', text: 'Are you aware of any suspicious transactions in your department that may indicate money laundering or terrorist financing?' },
  { id: 'q5', text: 'Do you receive income from sources outside India that have not been disclosed to the Income Tax Department?' },
]

export default function AMLDeclaration() {
  const { formStatus, submitForm, submissions } = useApp()
  const navigate = useNavigate()
  const status = formStatus('amlDeclaration')
  const existing = submissions.amlDeclaration

  const initAnswers = QUESTIONS.reduce((acc, q) => ({ ...acc, [q.id]: existing?.answers?.[q.id] || 'No' }), {})
  const initDetails = QUESTIONS.reduce((acc, q) => ({ ...acc, [`${q.id}_details`]: existing?.answers?.[`${q.id}_details`] || '' }), {})

  const [form, setForm] = useState({
    fy: existing?.fy || 'FY 2025–26',
    answers: { ...initAnswers, ...initDetails },
    sourceOfFunds: existing?.sourceOfFunds || 'Salary',
    otherSource: existing?.otherSource || '',
    declaration: existing?.declaration || false,
    signature: existing?.signature || '',
    date: existing?.date || new Date().toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const setAns = (key, val) => setForm(p => ({ ...p, answers: { ...p.answers, [key]: val } }))

  const validate = () => {
    const e = {}
    if (!form.declaration) e.declaration = 'You must confirm the declaration'
    if (!form.signature.trim()) e.signature = 'Digital signature is required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async () => {
    if (!validate()) { toast.error('Please complete all required fields'); return }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 900))
    submitForm('amlDeclaration', form)
    toast.success('AML Declaration submitted successfully!')
    navigate('/dashboard')
  }

  const disabled = status === 'submitted-locked'

  return (
    <FormWrapper
      title="Anti-Money Laundering (AML) Self-Declaration"
      description="Annual self-declaration under the Prevention of Money Laundering Act (PMLA), 2002 and RBI/SEBI AML/CFT guidelines. Mandatory for all employees in regulated financial entities."
      icon={<VerifiedUserIcon />} iconColor="#00695c" iconBg="#e0f2f1"
      dueDate="Apr 15" status={status} submittedAt={existing?.submittedAt}
      submitting={submitting} onSubmit={handleSubmit}
    >
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2.5, fontSize: '0.82rem' }}>
        This declaration is required under PMLA 2002, SEBI AML Guidelines, and FATF recommendations. Provide accurate information — false declarations attract penalties under applicable laws.
      </Alert>

      {/* AML Questions */}
      <Paper elevation={0} sx={{ p: 3, mb: 2.5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>AML / KYC Compliance Questions</Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {QUESTIONS.map((q, idx) => (
            <Box key={q.id} sx={{ p: 2, borderRadius: 2.5, border: '1px solid rgba(0,0,0,0.08)', bgcolor: '#fafafa' }}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>{idx + 1}. {q.text}</Typography>
              <RadioGroup row value={form.answers[q.id]} onChange={e => setAns(q.id, e.target.value)}>
                <FormControlLabel value="No" control={<Radio disabled={disabled} size="small" color="success" />} label={<Typography variant="body2">No</Typography>} />
                <FormControlLabel value="Yes" control={<Radio disabled={disabled} size="small" color="error" />} label={<Typography variant="body2">Yes</Typography>} />
              </RadioGroup>
              {form.answers[q.id] === 'Yes' && (
                <TextField
                  fullWidth multiline rows={2} size="small"
                  label="Please provide details *"
                  value={form.answers[`${q.id}_details`]}
                  onChange={e => setAns(`${q.id}_details`, e.target.value)}
                  disabled={disabled} sx={{ mt: 1 }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Source of Funds */}
      <Paper elevation={0} sx={{ p: 3, mb: 2.5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Source of Funds Declaration</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControl component="fieldset">
          <FormLabel sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem', mb: 1 }}>Primary source of your personal income/funds:</FormLabel>
          <RadioGroup value={form.sourceOfFunds} onChange={set('sourceOfFunds')}>
            {['Salary', 'Business Income', 'Professional Income', 'Rental Income', 'Investment Returns', 'Inheritance', 'Other'].map(s => (
              <FormControlLabel key={s} value={s} control={<Radio disabled={disabled} size="small" />} label={<Typography variant="body2">{s}</Typography>} />
            ))}
          </RadioGroup>
        </FormControl>
        {form.sourceOfFunds === 'Other' && (
          <TextField fullWidth size="small" label="Specify source of funds" value={form.otherSource} onChange={set('otherSource')} disabled={disabled} sx={{ mt: 1.5 }} />
        )}
      </Paper>

      {/* Declaration */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Declaration & Signature</Typography>
        <Divider sx={{ mb: 2 }} />
        <Alert severity="warning" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.8rem' }}>
          I hereby declare that I am not involved in any money laundering or terrorist financing activities. The information provided is true and accurate. I understand that false declaration is an offence under PMLA 2002 and may result in prosecution.
        </Alert>
        <FormControlLabel
          control={<Checkbox checked={form.declaration} onChange={set('declaration')} disabled={disabled} color="primary" />}
          label={<Typography variant="body2">I confirm the above AML self-declaration is complete and accurate. <span style={{ color: 'red' }}>*</span></Typography>}
        />
        {errors.declaration && <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, ml: 4 }}>{errors.declaration}</Typography>}
        <Grid container spacing={2} sx={{ mt: 1.5 }}>
          <Grid item xs={12} sm={8}>
            <TextField fullWidth size="small" label="Digital Signature — Type Full Name *" value={form.signature} onChange={set('signature')} error={!!errors.signature} helperText={errors.signature} disabled={disabled} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth size="small" label="Date" type="date" value={form.date} InputLabelProps={{ shrink: true }} disabled />
          </Grid>
        </Grid>
      </Paper>
    </FormWrapper>
  )
}
