import React, { useState } from 'react'
import { Box, Paper, Typography, Divider, TextField, Checkbox, FormControlLabel, Alert, Grid } from '@mui/material'
import WcIcon from '@mui/icons-material/Wc'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useApp } from '../context/AppContext'
import FormWrapper from '../components/FormWrapper'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const SECTIONS = [
  {
    title: 'Definition of Sexual Harassment',
    text: 'Sexual harassment includes any unwelcome act or behaviour (whether directly or by implication) such as physical contact and advances, demand or request for sexual favours, making sexually coloured remarks, showing pornography, or any other unwelcome physical, verbal or non-verbal conduct of a sexual nature. This applies at the workplace and in any work-related setting outside the workplace.',
  },
  {
    title: 'Internal Complaints Committee (ICC)',
    text: 'The company has constituted an Internal Complaints Committee (ICC) as required under the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 (PoSH Act). Any employee (including contractual, temporary, or part-time) can file a complaint with the ICC. The ICC shall complete inquiry within 60 days and its proceedings are confidential.',
  },
  {
    title: 'Complaint Procedure',
    text: 'A written complaint must be submitted to the ICC within 3 months of the incident. The aggrieved person may file the complaint herself or through her legal heir. During the inquiry, the aggrieved person may request interim relief. Frivolous or malicious complaints may attract disciplinary action against the complainant.',
  },
  {
    title: 'Zero Tolerance Policy',
    text: 'Axiom Capital Management maintains a zero-tolerance policy towards sexual harassment. Any employee found guilty of sexual harassment shall be subject to disciplinary action up to and including termination of employment, and may be referred to law enforcement authorities. The company will not retaliate against any employee who in good faith reports sexual harassment.',
  },
  {
    title: 'Annual Awareness Obligation',
    text: 'All employees are required to attend the mandatory PoSH awareness session conducted annually by the company. By signing this acknowledgment, you confirm that you have read the PoSH Policy available on the company intranet and understand your rights and obligations under the PoSH Act, 2013.',
  },
]

export default function POSHAcknowledgment() {
  const { formStatus, submitForm, submissions } = useApp()
  const navigate = useNavigate()
  const status = formStatus('poshAcknowledgment')
  const existing = submissions.poshAcknowledgment

  const [form, setForm] = useState({
    fy: existing?.fy || 'FY 2025–26',
    sectionAcks: existing?.sectionAcks || SECTIONS.reduce((a, s) => ({ ...a, [s.title]: false }), {}),
    attendedTraining: existing?.attendedTraining || false,
    masterDeclaration: existing?.masterDeclaration || false,
    signature: existing?.signature || '',
    date: existing?.date || new Date().toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const setAck = key => e => setForm(p => ({ ...p, sectionAcks: { ...p.sectionAcks, [key]: e.target.checked } }))
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const allAcked = Object.values(form.sectionAcks).every(Boolean)

  const validate = () => {
    const e = {}
    if (!allAcked) e.sections = 'Please acknowledge all policy sections'
    if (!form.masterDeclaration) e.masterDeclaration = 'You must confirm the declaration'
    if (!form.signature.trim()) e.signature = 'Digital signature is required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async () => {
    if (!validate()) { toast.error('Please acknowledge all sections and sign'); return }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 900))
    submitForm('poshAcknowledgment', form)
    toast.success('PoSH Policy Acknowledgment submitted!')
    navigate('/dashboard')
  }

  const disabled = status === 'submitted-locked'

  return (
    <FormWrapper
      title="PoSH Policy Acknowledgment"
      description="Annual acknowledgment of the Prevention of Sexual Harassment (PoSH) Policy under the Sexual Harassment of Women at Workplace (Prevention, Prohibition & Redressal) Act, 2013."
      icon={<WcIcon />} iconColor="#f57c00" iconBg="#fff3e0"
      dueDate="Apr 30" status={status} submittedAt={existing?.submittedAt}
      submitting={submitting} onSubmit={handleSubmit}
    >
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2.5, fontSize: '0.82rem' }}>
        Please read each section carefully and acknowledge your understanding by checking the box. This is a <strong>legal compliance requirement</strong> under the PoSH Act 2013.
      </Alert>

      {errors.sections && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2.5 }}>{errors.sections}</Alert>}

      {SECTIONS.map(section => (
        <Paper key={section.title} elevation={0} sx={{
          p: 2.5, mb: 2, borderRadius: 3,
          border: '1.5px solid',
          borderColor: form.sectionAcks[section.title] ? 'success.light' : 'rgba(0,0,0,0.08)',
          bgcolor: form.sectionAcks[section.title] ? '#f1f8e9' : '#fff',
          transition: 'all 0.2s',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <CheckCircleOutlineIcon sx={{ mt: 0.25, color: form.sectionAcks[section.title] ? 'success.main' : 'text.disabled', fontSize: 20, flexShrink: 0 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom color={form.sectionAcks[section.title] ? 'success.dark' : 'text.primary'}>
                {section.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.6, fontSize: '0.82rem' }}>
                {section.text}
              </Typography>
              <FormControlLabel
                control={<Checkbox checked={form.sectionAcks[section.title]} onChange={setAck(section.title)} disabled={disabled} color="success" size="small" />}
                label={<Typography variant="body2" fontWeight={600} color={form.sectionAcks[section.title] ? 'success.dark' : 'text.primary'}>I have read and understood this section</Typography>}
              />
            </Box>
          </Box>
        </Paper>
      ))}

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Final Acknowledgment & Signature</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControlLabel
          control={<Checkbox checked={form.attendedTraining} onChange={set('attendedTraining')} disabled={disabled} color="primary" />}
          label={<Typography variant="body2">I confirm that I have attended / will attend the mandatory PoSH awareness training session for {form.fy}.</Typography>}
          sx={{ mb: 1.5, display: 'flex', alignItems: 'flex-start', '& .MuiFormControlLabel-label': { mt: 0.4 } }}
        />
        <FormControlLabel
          control={<Checkbox checked={form.masterDeclaration} onChange={set('masterDeclaration')} disabled={disabled} color="primary" />}
          label={<Typography variant="body2">I acknowledge that I have read the complete PoSH Policy of Axiom Capital Management Ltd., understand its provisions, and commit to uphold a respectful workplace. <span style={{ color: 'red' }}>*</span></Typography>}
          sx={{ display: 'flex', alignItems: 'flex-start', '& .MuiFormControlLabel-label': { mt: 0.4 } }}
        />
        {errors.masterDeclaration && <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, ml: 4 }}>{errors.masterDeclaration}</Typography>}
        <Grid container spacing={2} sx={{ mt: 2 }}>
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
