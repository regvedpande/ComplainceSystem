import React, { useState } from 'react'
import { Box, Paper, Typography, Divider, TextField, Checkbox, FormControlLabel, Alert, Grid, LinearProgress } from '@mui/material'
import GavelIcon from '@mui/icons-material/Gavel'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useApp } from '../context/AppContext'
import FormWrapper from '../components/FormWrapper'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const SECTIONS = [
  { id: 'ethics', title: 'Workplace Ethics & Integrity', icon: '⚖️',
    text: 'All employees must conduct themselves with the highest standards of integrity, honesty, and professionalism. You must not engage in or condone unethical practices including misrepresentation, falsification of records, or fraudulent activities. Employees are expected to protect company assets and use them only for legitimate business purposes.' },
  { id: 'infoSec', title: 'Information Security & Data Privacy', icon: '🔒',
    text: 'You must protect all confidential and proprietary information of the company, its clients, and counterparties. This includes maintaining strong passwords, not sharing login credentials, reporting security incidents promptly, and complying with the IT security policy. Personal data of clients and employees must be handled in accordance with applicable privacy laws.' },
  { id: 'antiBribery', title: 'Anti-Bribery & Anti-Corruption', icon: '🚫',
    text: 'Axiom Capital Management has a zero-tolerance policy for bribery and corruption in any form. You must not offer, promise, give, request, or accept any bribe, kickback, or improper payment to or from any person, including government officials, regulators, clients, or vendors. Facilitation payments are also prohibited regardless of local practice.' },
  { id: 'socialMedia', title: 'Social Media & Public Communications', icon: '📱',
    text: 'Employees must not post or comment on matters related to the company, its clients, investments, or regulatory matters on any public platform without prior Compliance approval. You must not make statements construable as market commentary or investment advice on personal social media accounts.' },
  { id: 'whistleblower', title: 'Whistleblower & Speak-Up Policy', icon: '📢',
    text: 'Employees are encouraged and protected to report suspected violations of law, regulations, or company policies through the designated whistleblower channel. Reports may be made anonymously. The company strictly prohibits retaliation against anyone who raises concerns in good faith.' },
  { id: 'conflict', title: 'Conflict of Interest Management', icon: '🔍',
    text: 'You must proactively identify and disclose potential conflicts of interest to your manager and Compliance. You must not participate in decisions where you have a personal financial interest. Outside employment, board memberships, or advisory roles require prior written Compliance approval.' },
]

export default function CodeOfConduct() {
  const { formStatus, submitForm, submissions } = useApp()
  const navigate = useNavigate()
  const status = formStatus('codeOfConduct')
  const existing = submissions.codeOfConduct

  const [form, setForm] = useState({
    fy: existing?.fy || 'FY 2025–26',
    sectionAcks: existing?.sectionAcks || SECTIONS.reduce((a, s) => ({ ...a, [s.id]: false }), {}),
    readFullPolicy: existing?.readFullPolicy || false,
    masterDeclaration: existing?.masterDeclaration || false,
    signature: existing?.signature || '',
    date: existing?.date || new Date().toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const setAck = id => e => setForm(p => ({ ...p, sectionAcks: { ...p.sectionAcks, [id]: e.target.checked } }))
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const ackedCount = Object.values(form.sectionAcks).filter(Boolean).length
  const allAcked = ackedCount === SECTIONS.length

  const validate = () => {
    const e = {}
    if (!allAcked) e.sections = 'Please acknowledge all policy sections before submitting'
    if (!form.masterDeclaration) e.masterDeclaration = 'You must confirm the final declaration'
    if (!form.signature.trim()) e.signature = 'Digital signature is required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async () => {
    if (!validate()) { toast.error('Please acknowledge all sections and sign'); return }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 900))
    submitForm('codeOfConduct', form)
    toast.success('Code of Conduct Acknowledgment submitted!')
    navigate('/dashboard')
  }

  const disabled = status === 'submitted-locked'

  return (
    <FormWrapper
      title="Code of Conduct & Ethics Acknowledgment"
      description="Annual acknowledgment of the company Code of Conduct covering workplace ethics, information security, anti-bribery, social media, whistleblower, and conflict of interest policies."
      icon={<GavelIcon />} iconColor="#4527a0" iconBg="#ede7f6"
      dueDate="Apr 10" status={status} submittedAt={existing?.submittedAt}
      submitting={submitting} onSubmit={handleSubmit}
    >
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" fontWeight={600}>Sections Acknowledged</Typography>
          <Typography variant="body2" fontWeight={700} color={allAcked ? 'success.main' : 'primary.main'}>{ackedCount} / {SECTIONS.length}</Typography>
        </Box>
        <LinearProgress variant="determinate" value={(ackedCount / SECTIONS.length) * 100}
          sx={{ borderRadius: 4, height: 7, bgcolor: 'rgba(0,0,0,0.07)',
            '& .MuiLinearProgress-bar': { borderRadius: 4, background: allAcked ? 'linear-gradient(90deg,#1b5e20,#43a047)' : 'linear-gradient(90deg,#4527a0,#7b1fa2)' }
          }}
        />
        {errors.sections && <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>{errors.sections}</Typography>}
      </Paper>

      {SECTIONS.map(section => (
        <Paper key={section.id} elevation={0} sx={{
          p: 2.5, mb: 2, borderRadius: 3, transition: 'all 0.2s',
          border: '1.5px solid', borderColor: form.sectionAcks[section.id] ? '#c8e6c9' : 'rgba(0,0,0,0.07)',
          bgcolor: form.sectionAcks[section.id] ? '#f1f8e9' : '#fafafa',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Typography sx={{ fontSize: 20, mt: 0.1, flexShrink: 0 }}>{section.icon}</Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom color={form.sectionAcks[section.id] ? 'success.dark' : 'text.primary'}>
                {section.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, lineHeight: 1.6 }}>
                {section.text}
              </Typography>
              <FormControlLabel
                control={<Checkbox checked={form.sectionAcks[section.id]} onChange={setAck(section.id)} disabled={disabled} color="success" size="small" />}
                label={<Typography variant="body2" fontWeight={600} color={form.sectionAcks[section.id] ? 'success.dark' : 'text.secondary'}>
                  {form.sectionAcks[section.id] ? '✓ Acknowledged' : 'I have read and understood this policy'}
                </Typography>}
              />
            </Box>
            <CheckCircleOutlineIcon sx={{ fontSize: 22, color: form.sectionAcks[section.id] ? 'success.main' : 'text.disabled', flexShrink: 0, mt: 0.2 }} />
          </Box>
        </Paper>
      ))}

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Final Declaration & Signature</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControlLabel
          control={<Checkbox checked={form.readFullPolicy} onChange={set('readFullPolicy')} disabled={disabled} color="primary" size="small" />}
          label={<Typography variant="body2">I confirm I have read the complete Code of Conduct Policy document available on the company intranet.</Typography>}
          sx={{ mb: 1.5, display: 'flex', alignItems: 'flex-start', '& .MuiFormControlLabel-label': { mt: 0.4 } }}
        />
        <FormControlLabel
          control={<Checkbox checked={form.masterDeclaration} onChange={set('masterDeclaration')} disabled={disabled} color="primary" />}
          label={<Typography variant="body2">I acknowledge and agree to abide by Axiom Capital Management's Code of Conduct and all applicable policies. I understand that violations may result in disciplinary action including termination. <span style={{ color: 'red' }}>*</span></Typography>}
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
