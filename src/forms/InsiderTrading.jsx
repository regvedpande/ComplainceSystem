import React, { useState } from 'react'
import { Box, Paper, Typography, Divider, TextField, Checkbox, FormControlLabel,
  Alert, Grid, FormControl, FormLabel, RadioGroup, Radio } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { useApp } from '../context/AppContext'
import FormWrapper from '../components/FormWrapper'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const POLICIES = [
  { id: 'tradingWindow', label: 'Trading Window Policy', text: 'I understand that trading in the securities of Axiom Capital Management Ltd. is permitted only during designated Trading Window periods and is strictly prohibited when the window is closed. I acknowledge that trading while in possession of Unpublished Price Sensitive Information (UPSI) constitutes insider trading under SEBI (Prohibition of Insider Trading) Regulations, 2015.' },
  { id: 'upsiAwareness', label: 'UPSI Awareness', text: 'I confirm that I am aware of my obligation to maintain confidentiality of all UPSI that comes to my knowledge in the course of my employment. I shall not communicate, provide, or allow access to any UPSI to any person, including family members, unless required in the ordinary course of business.' },
  { id: 'preApproval', label: 'Pre-Clearance Requirement', text: 'I acknowledge that as a Designated Person, I am required to obtain pre-clearance from the Compliance Officer before executing any trade in securities of the company or its group entities, regardless of the value of such trade.' },
  { id: 'disclosureObligation', label: 'Disclosure Obligations', text: 'I acknowledge my obligation to disclose all trades in the securities of the company to the Compliance Officer within the timelines prescribed under SEBI regulations. I am aware that violations are subject to regulatory action including penalties.' },
]

export default function InsiderTrading() {
  const { formStatus, submitForm, submissions } = useApp()
  const navigate = useNavigate()
  const status = formStatus('insiderTrading')
  const existing = submissions.insiderTrading

  const [form, setForm] = useState({
    fy: existing?.fy || 'FY 2025–26',
    acknowledgments: existing?.acknowledgments || { tradingWindow: false, upsiAwareness: false, preApproval: false, disclosureObligation: false },
    tradedThisYear: existing?.tradedThisYear || 'No',
    tradeDetails: existing?.tradeDetails || '',
    preClearanceObtained: existing?.preClearanceObtained || 'NA',
    masterDeclaration: existing?.masterDeclaration || false,
    signature: existing?.signature || '',
    date: existing?.date || new Date().toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const setAck = key => e => setForm(p => ({ ...p, acknowledgments: { ...p.acknowledgments, [key]: e.target.checked } }))
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const validate = () => {
    const e = {}
    const allAcked = Object.values(form.acknowledgments).every(Boolean)
    if (!allAcked) e.acknowledgments = 'Please acknowledge all policy sections'
    if (!form.masterDeclaration) e.masterDeclaration = 'You must confirm the declaration'
    if (!form.signature.trim()) e.signature = 'Digital signature is required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async () => {
    if (!validate()) { toast.error('Please acknowledge all sections and sign'); return }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 900))
    submitForm('insiderTrading', form)
    toast.success('Insider Trading Policy Declaration submitted!')
    navigate('/dashboard')
  }

  const disabled = status === 'submitted-locked'

  return (
    <FormWrapper
      title="Insider Trading Compliance Declaration"
      description="Annual acknowledgment of SEBI (Prohibition of Insider Trading) Regulations, 2015 — trading window policy, UPSI obligations, and pre-clearance requirements."
      icon={<TrendingUpIcon />} iconColor="#e53935" iconBg="#ffebee"
      dueDate="Apr 10" status={status} submittedAt={existing?.submittedAt}
      submitting={submitting} onSubmit={handleSubmit}
    >
      <Alert severity="error" sx={{ mb: 3, borderRadius: 2.5, fontSize: '0.82rem' }}>
        <strong>Regulatory Notice:</strong> Non-compliance with insider trading regulations is a criminal offence under SEBI Act and Securities Contracts (Regulation) Act. Violations may result in prosecution, fines up to ₹25 crore, and imprisonment.
      </Alert>

      {/* Policy Acknowledgments */}
      <Paper elevation={0} sx={{ p: 3, mb: 2.5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Policy Acknowledgments</Typography>
        <Divider sx={{ mb: 2 }} />
        {errors.acknowledgments && <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: '0.8rem' }}>{errors.acknowledgments}</Alert>}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {POLICIES.map(policy => (
            <Box key={policy.id} sx={{ p: 2, borderRadius: 2.5, border: '1px solid', borderColor: form.acknowledgments[policy.id] ? 'success.light' : 'rgba(0,0,0,0.1)', bgcolor: form.acknowledgments[policy.id] ? '#f1f8e9' : '#fafafa', transition: 'all 0.2s' }}>
              <FormControlLabel
                control={<Checkbox checked={form.acknowledgments[policy.id]} onChange={setAck(policy.id)} disabled={disabled} color="success" size="small" />}
                label={<Typography variant="subtitle2" fontWeight={700} color={form.acknowledgments[policy.id] ? 'success.dark' : 'text.primary'}>{policy.label}</Typography>}
                sx={{ mb: 0.5, alignItems: 'flex-start', '& .MuiFormControlLabel-label': { mt: 0.4 } }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 4, display: 'block', lineHeight: 1.5 }}>{policy.text}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Trade Disclosure */}
      <Paper elevation={0} sx={{ p: 3, mb: 2.5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Trade Disclosure — {form.fy}</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem', mb: 1 }}>
            Did you trade in securities of Axiom Capital Management Ltd. or its group entities during this fiscal year?
          </FormLabel>
          <RadioGroup row value={form.tradedThisYear} onChange={set('tradedThisYear')}>
            <FormControlLabel value="No" control={<Radio disabled={disabled} size="small" />} label="No" />
            <FormControlLabel value="Yes" control={<Radio disabled={disabled} size="small" />} label="Yes" />
          </RadioGroup>
        </FormControl>
        {form.tradedThisYear === 'Yes' && (
          <Box>
            <TextField
              fullWidth multiline rows={3} size="small"
              label="Trade Details (Date, Security Name, Qty, Buy/Sell, Value)"
              value={form.tradeDetails} onChange={set('tradeDetails')} disabled={disabled}
              sx={{ mb: 2 }}
            />
            <FormControl component="fieldset">
              <FormLabel sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem', mb: 1 }}>
                Was pre-clearance obtained for all trades?
              </FormLabel>
              <RadioGroup row value={form.preClearanceObtained} onChange={set('preClearanceObtained')}>
                <FormControlLabel value="Yes" control={<Radio disabled={disabled} size="small" />} label="Yes, all trades pre-cleared" />
                <FormControlLabel value="No" control={<Radio disabled={disabled} size="small" />} label="No (explain in trade details)" />
              </RadioGroup>
            </FormControl>
          </Box>
        )}
      </Paper>

      {/* Declaration */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Declaration & Signature</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControlLabel
          control={<Checkbox checked={form.masterDeclaration} onChange={set('masterDeclaration')} disabled={disabled} color="primary" />}
          label={<Typography variant="body2">I have read, understood, and agree to comply with the SEBI Insider Trading Regulations and the Company's Code of Conduct for Prohibition of Insider Trading. I declare that the above information is true and correct. <span style={{ color: 'red' }}>*</span></Typography>}
        />
        {errors.masterDeclaration && <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, ml: 4 }}>{errors.masterDeclaration}</Typography>}
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
