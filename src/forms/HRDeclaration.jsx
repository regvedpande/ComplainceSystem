import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Divider,
  Alert,
  Grid,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useApp } from '../context/AppContext'
import FormWrapper from '../components/FormWrapper'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const blankNominee = { name: '', relationship: '', share: '' }

export default function HRDeclaration() {
  const { formStatus, submitForm, submissions, user } = useApp()
  const navigate = useNavigate()
  const status = formStatus('hrDeclaration')
  const existing = submissions.hrDeclaration

  const [form, setForm] = useState({
    name: existing?.name || user?.name || '',
    dob: existing?.dob || '',
    permanentAddress: existing?.permanentAddress || '',
    currentAddress: existing?.currentAddress || '',
    emergencyName: existing?.emergencyName || '',
    emergencyRelationship: existing?.emergencyRelationship || '',
    emergencyPhone: existing?.emergencyPhone || '',
    nominees: existing?.nominees || [{ ...blankNominee }],
    bankName: existing?.bankName || '',
    accountLast4: existing?.accountLast4 || '',
    ifsc: existing?.ifsc || '',
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

  const setNominee = (idx, field) => (e) => {
    const updated = form.nominees.map((n, i) => i === idx ? { ...n, [field]: e.target.value } : n)
    setForm((p) => ({ ...p, nominees: updated }))
  }

  const addNominee = () => {
    setForm((p) => ({ ...p, nominees: [...p.nominees, { ...blankNominee }] }))
  }

  const removeNominee = (idx) => {
    if (form.nominees.length > 1) {
      setForm((p) => ({ ...p, nominees: p.nominees.filter((_, i) => i !== idx) }))
    }
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.dob) e.dob = 'Date of birth is required'
    if (!form.permanentAddress.trim()) e.permanentAddress = 'Permanent address is required'
    if (!form.emergencyName.trim()) e.emergencyName = 'Emergency contact name is required'
    if (!form.emergencyPhone.trim()) e.emergencyPhone = 'Emergency contact phone is required'
    if (!form.declaration) e.declaration = 'You must confirm the declaration'
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
    submitForm('hrDeclaration', form)
    toast.success('HR Annual Declaration submitted successfully!')
    navigate('/dashboard')
    setSubmitting(false)
  }

  const disabled = status === 'submitted'

  return (
    <FormWrapper
      title="HR Annual Declaration"
      description="Annual verification of personal details, emergency contacts, nominee information, and bank details."
      icon={<PersonIcon />}
      iconColor="#00695c"
      iconBg="#e0f2f1"
      dueDate="Apr 30, 2026"
      status={status}
      submittedAt={existing?.submittedAt}
      submitting={submitting}
      onSubmit={handleSubmit}
    >
      {/* Personal Details */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Personal Details</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Please verify and update your personal information.
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Full Name *" value={form.name} onChange={set('name')}
              error={!!errors.name} helperText={errors.name} disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Date of Birth *" type="date" value={form.dob} onChange={set('dob')}
              error={!!errors.dob} helperText={errors.dob} InputLabelProps={{ shrink: true }} disabled={disabled}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth label="Permanent Address *" multiline rows={2} value={form.permanentAddress}
              onChange={set('permanentAddress')} error={!!errors.permanentAddress}
              helperText={errors.permanentAddress} disabled={disabled}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth label="Current Address (if different)" multiline rows={2}
              value={form.currentAddress} onChange={set('currentAddress')} disabled={disabled}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Emergency Contact */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Emergency Contact</Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth label="Contact Name *" value={form.emergencyName} onChange={set('emergencyName')}
              error={!!errors.emergencyName} helperText={errors.emergencyName} disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth label="Relationship" value={form.emergencyRelationship}
              onChange={set('emergencyRelationship')} placeholder="e.g. Spouse, Parent" disabled={disabled}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth label="Phone Number *" value={form.emergencyPhone} onChange={set('emergencyPhone')}
              error={!!errors.emergencyPhone} helperText={errors.emergencyPhone} disabled={disabled}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Nominee Details */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>Nominee Details</Typography>
          {!disabled && (
            <Button startIcon={<AddIcon />} size="small" onClick={addNominee} variant="outlined">
              Add Nominee
            </Button>
          )}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Total share percentage across all nominees must equal 100%.
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {form.nominees.map((nominee, idx) => (
          <Box key={idx} sx={{ p: 2, mb: 1.5, bgcolor: '#f8f9ff', borderRadius: 2, border: '1px solid #e3e7ff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="caption" fontWeight={700} color="primary">Nominee {idx + 1}</Typography>
              {idx > 0 && !disabled && (
                <IconButton size="small" color="error" onClick={() => removeNominee(idx)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={5}>
                <TextField fullWidth size="small" label="Nominee Name" value={nominee.name} onChange={setNominee(idx, 'name')} disabled={disabled} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth size="small" label="Relationship" value={nominee.relationship} onChange={setNominee(idx, 'relationship')} disabled={disabled} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField fullWidth size="small" label="Share %" value={nominee.share} onChange={setNominee(idx, 'share')} type="number" inputProps={{ min: 0, max: 100 }} disabled={disabled} />
              </Grid>
            </Grid>
          </Box>
        ))}
      </Paper>

      {/* Bank Details */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Bank Details</Typography>
        <Alert severity="info" sx={{ my: 1.5, borderRadius: 2, fontSize: '0.8rem' }}>
          For security, only partial account details are shown. Contact HR to update bank details.
        </Alert>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <TextField fullWidth label="Bank Name" value={form.bankName} onChange={set('bankName')} disabled={disabled} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth label="Account Last 4 Digits" value={form.accountLast4} onChange={set('accountLast4')} inputProps={{ maxLength: 4 }} disabled={disabled} helperText="Last 4 digits only" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="IFSC Code" value={form.ifsc} onChange={set('ifsc')} placeholder="e.g. HDFC0001234" disabled={disabled} />
          </Grid>
        </Grid>
      </Paper>

      {/* Declaration */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Declaration & Signature</Typography>
        <Divider sx={{ mb: 2 }} />
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2, fontSize: '0.82rem' }}>
          I hereby declare that all information provided above is true, complete, and correct to
          the best of my knowledge.
        </Alert>
        <FormControlLabel
          control={<Checkbox checked={form.declaration} onChange={set('declaration')} disabled={disabled} color="primary" />}
          label={<Typography variant="body2">All above information is correct and complete. <span style={{ color: 'red' }}>*</span></Typography>}
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
