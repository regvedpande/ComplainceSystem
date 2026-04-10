import React, { useState } from 'react'
import { Box, Paper, Typography, Divider, TextField, Checkbox, FormControlLabel,
  Alert, Grid, MenuItem, Select, FormControl, InputLabel, Button, IconButton } from '@mui/material'
import BadgeIcon from '@mui/icons-material/Badge'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useApp } from '../context/AppContext'
import FormWrapper from '../components/FormWrapper'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const RELATIONS = ['Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Father-in-law', 'Mother-in-law', 'Other']
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Bank of Baroda', 'Punjab National Bank', 'Canara Bank', 'Other']

const blankNominee = { name: '', relation: '', dob: '', share: '' }

export default function KYEDeclaration() {
  const { formStatus, submitForm, submissions } = useApp()
  const navigate = useNavigate()
  const status = formStatus('kyeDeclaration')
  const existing = submissions.kyeDeclaration
  const { user } = useApp()

  const [form, setForm] = useState({
    fy: existing?.fy || 'FY 2025–26',
    // Personal
    fullName: existing?.fullName || user?.name || '',
    dob: existing?.dob || '',
    bloodGroup: existing?.bloodGroup || '',
    panNumber: existing?.panNumber || '',
    aadharLast4: existing?.aadharLast4 || '',
    permanentAddress: existing?.permanentAddress || '',
    currentAddress: existing?.currentAddress || '',
    sameAddress: existing?.sameAddress || false,
    // Emergency
    emergencyName: existing?.emergencyName || '',
    emergencyRelation: existing?.emergencyRelation || '',
    emergencyPhone: existing?.emergencyPhone || '',
    emergencyAltPhone: existing?.emergencyAltPhone || '',
    // Nominees
    nominees: existing?.nominees || [{ ...blankNominee }],
    // Bank
    bankName: existing?.bankName || '',
    accountLast4: existing?.accountLast4 || '',
    ifscCode: existing?.ifscCode || '',
    // Declaration
    infoCorrect: existing?.infoCorrect || false,
    declaration: existing?.declaration || false,
    signature: existing?.signature || '',
    date: existing?.date || new Date().toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const set = f => e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(p => {
      const upd = { ...p, [f]: val }
      if (f === 'sameAddress' && val) upd.currentAddress = p.permanentAddress
      if (f === 'permanentAddress' && p.sameAddress) upd.currentAddress = val
      return upd
    })
    setErrors(p => ({ ...p, [f]: undefined }))
  }
  const setNominee = (idx, field) => e => {
    const updated = form.nominees.map((n, i) => i === idx ? { ...n, [field]: e.target.value } : n)
    setForm(p => ({ ...p, nominees: updated }))
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Required'
    if (!form.emergencyName.trim()) e.emergencyName = 'Required'
    if (!form.emergencyPhone.trim()) e.emergencyPhone = 'Required'
    if (!form.declaration) e.declaration = 'You must confirm the declaration'
    if (!form.signature.trim()) e.signature = 'Digital signature is required'
    const nomTotal = form.nominees.reduce((s, n) => s + (parseFloat(n.share) || 0), 0)
    if (nomTotal !== 100 && form.nominees.some(n => n.name)) e.nominees = `Nominee shares must total 100% (currently ${nomTotal}%)`
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async () => {
    if (!validate()) { toast.error('Please complete all required fields'); return }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 900))
    submitForm('kyeDeclaration', form)
    toast.success('KYE Annual Declaration submitted!')
    navigate('/dashboard')
  }

  const disabled = status === 'submitted-locked'
  const Section = ({ title, children }) => (
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 2.5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>{title}</Typography>
      <Divider sx={{ mb: 2 }} />
      {children}
    </Paper>
  )

  return (
    <FormWrapper
      title="Know Your Employee (KYE) Annual Declaration"
      description="Annual update of personal details, emergency contacts, nominee information, and bank account details for HR records as required under company policy and statutory regulations."
      icon={<BadgeIcon />} iconColor="#558b2f" iconBg="#f1f8e9"
      dueDate="Apr 30" status={status} submittedAt={existing?.submittedAt}
      submitting={submitting} onSubmit={handleSubmit}
    >
      {/* Personal Details */}
      <Section title="A. Personal Details">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" label="Full Name (as per PAN) *" value={form.fullName} onChange={set('fullName')} error={!!errors.fullName} helperText={errors.fullName} disabled={disabled} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField fullWidth size="small" label="Date of Birth" type="date" value={form.dob} onChange={set('dob')} InputLabelProps={{ shrink: true }} disabled={disabled} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Blood Group</InputLabel>
              <Select value={form.bloodGroup} onChange={set('bloodGroup')} label="Blood Group" disabled={disabled}>
                {BLOOD_GROUPS.map(b => <MenuItem key={b} value={b}>{b}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField fullWidth size="small" label="PAN Number" value={form.panNumber} onChange={set('panNumber')} disabled={disabled} inputProps={{ maxLength: 10, style: { textTransform: 'uppercase' } }} helperText="e.g. ABCDE1234F" />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField fullWidth size="small" label="Aadhaar (Last 4 Digits)" value={form.aadharLast4} onChange={set('aadharLast4')} disabled={disabled} inputProps={{ maxLength: 4 }} helperText="Only last 4 digits" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth size="small" label="Permanent Address" multiline rows={2} value={form.permanentAddress} onChange={set('permanentAddress')} disabled={disabled} />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={form.sameAddress} onChange={set('sameAddress')} disabled={disabled} size="small" />}
              label={<Typography variant="body2">Current address same as permanent address</Typography>}
            />
            {!form.sameAddress && (
              <TextField fullWidth size="small" label="Current Address" multiline rows={2} value={form.currentAddress} onChange={set('currentAddress')} disabled={disabled} sx={{ mt: 1 }} />
            )}
          </Grid>
        </Grid>
      </Section>

      {/* Emergency Contact */}
      <Section title="B. Emergency Contact">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth size="small" label="Contact Name *" value={form.emergencyName} onChange={set('emergencyName')} error={!!errors.emergencyName} helperText={errors.emergencyName} disabled={disabled} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Relationship</InputLabel>
              <Select value={form.emergencyRelation} onChange={set('emergencyRelation')} label="Relationship" disabled={disabled}>
                {RELATIONS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField fullWidth size="small" label="Primary Phone *" value={form.emergencyPhone} onChange={set('emergencyPhone')} error={!!errors.emergencyPhone} helperText={errors.emergencyPhone} disabled={disabled} />
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField fullWidth size="small" label="Alternate Phone" value={form.emergencyAltPhone} onChange={set('emergencyAltPhone')} disabled={disabled} />
          </Grid>
        </Grid>
      </Section>

      {/* Nominees */}
      <Section title="C. Nominee Details (Total Share Must = 100%)">
        {errors.nominees && <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: '0.8rem' }}>{errors.nominees}</Alert>}
        {form.nominees.map((nom, i) => (
          <Box key={i} sx={{ p: 2, mb: 1.5, borderRadius: 2.5, border: '1px solid rgba(26,35,126,0.1)', bgcolor: '#fafbff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="caption" fontWeight={700} color="primary">Nominee {i + 1}</Typography>
              {i > 0 && !disabled && <IconButton size="small" onClick={() => setForm(p => ({ ...p, nominees: p.nominees.filter((_, ni) => ni !== i) }))} color="error"><DeleteOutlineIcon fontSize="small" /></IconButton>}
            </Box>
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size="small" label="Full Name" value={nom.name} onChange={setNominee(i, 'name')} disabled={disabled} />
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Relationship</InputLabel>
                  <Select value={nom.relation} onChange={setNominee(i, 'relation')} label="Relationship" disabled={disabled}>
                    {RELATIONS.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField fullWidth size="small" label="Date of Birth" type="date" value={nom.dob} onChange={setNominee(i, 'dob')} InputLabelProps={{ shrink: true }} disabled={disabled} />
              </Grid>
              <Grid item xs={6} sm={2}>
                <TextField fullWidth size="small" label="Share %" type="number" value={nom.share} onChange={setNominee(i, 'share')} disabled={disabled} InputProps={{ inputProps: { min: 0, max: 100 } }} />
              </Grid>
            </Grid>
          </Box>
        ))}
        {!disabled && form.nominees.length < 3 && (
          <Button startIcon={<AddIcon />} size="small" variant="outlined" onClick={() => setForm(p => ({ ...p, nominees: [...p.nominees, { ...blankNominee }] }))} sx={{ borderRadius: 2 }}>Add Nominee</Button>
        )}
      </Section>

      {/* Bank Details */}
      <Section title="D. Bank Account Details (Salary Account)">
        <Alert severity="info" sx={{ mb: 2, borderRadius: 2, fontSize: '0.8rem' }}>Enter only partial account details. Do not share full account number.</Alert>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Bank Name</InputLabel>
              <Select value={form.bankName} onChange={set('bankName')} label="Bank Name" disabled={disabled}>
                {BANKS.map(b => <MenuItem key={b} value={b}>{b}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField fullWidth size="small" label="Account No. (Last 4 Digits)" value={form.accountLast4} onChange={set('accountLast4')} disabled={disabled} inputProps={{ maxLength: 4 }} helperText="e.g. 4321" />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField fullWidth size="small" label="IFSC Code" value={form.ifscCode} onChange={set('ifscCode')} disabled={disabled} inputProps={{ maxLength: 11, style: { textTransform: 'uppercase' } }} helperText="e.g. HDFC0001234" />
          </Grid>
        </Grid>
      </Section>

      {/* Declaration */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Declaration & Signature</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControlLabel
          control={<Checkbox checked={form.infoCorrect} onChange={set('infoCorrect')} disabled={disabled} color="primary" />}
          label={<Typography variant="body2">I confirm that all personal information provided above is correct and up-to-date.</Typography>}
          sx={{ mb: 1, display: 'flex', alignItems: 'flex-start', '& .MuiFormControlLabel-label': { mt: 0.4 } }}
        />
        <FormControlLabel
          control={<Checkbox checked={form.declaration} onChange={set('declaration')} disabled={disabled} color="primary" />}
          label={<Typography variant="body2">I declare that this information is accurate and I will promptly notify HR of any changes. <span style={{ color: 'red' }}>*</span></Typography>}
          sx={{ display: 'flex', alignItems: 'flex-start', '& .MuiFormControlLabel-label': { mt: 0.4 } }}
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
