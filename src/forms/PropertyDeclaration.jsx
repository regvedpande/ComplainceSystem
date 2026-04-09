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
  InputAdornment,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useApp } from '../context/AppContext'
import FormWrapper from '../components/FormWrapper'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const YEARS = ['FY 2025-26', 'FY 2024-25']
const PROPERTY_TYPES = ['House / Flat', 'Land', 'Commercial Property', 'Other']
const ACQUISITION_TYPES = ['Purchase', 'Inheritance', 'Gift', 'Court Order']

const blankProperty = {
  type: 'House / Flat',
  city: '',
  state: '',
  value: '',
  acquired: 'Purchase',
  acquisitionDate: '',
  hasLoan: 'No',
  loanAmount: '',
}

export default function PropertyDeclaration() {
  const { formStatus, submitForm, submissions } = useApp()
  const navigate = useNavigate()
  const status = formStatus('propertyDeclaration')
  const existing = submissions.propertyDeclaration

  const [form, setForm] = useState({
    year: existing?.year || 'FY 2025-26',
    hasImmovable: existing?.hasImmovable || 'No',
    properties: existing?.properties || [{ ...blankProperty }],
    hasVehicles: existing?.hasVehicles || 'No',
    vehicleCount: existing?.vehicleCount || '',
    vehicleValue: existing?.vehicleValue || '',
    investmentValue: existing?.investmentValue || '',
    jewelryValue: existing?.jewelryValue || '',
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

  const setProp = (idx, field) => (e) => {
    const updated = form.properties.map((p, i) => i === idx ? { ...p, [field]: e.target.value } : p)
    setForm((p) => ({ ...p, properties: updated }))
  }

  const addProperty = () => {
    setForm((p) => ({ ...p, properties: [...p.properties, { ...blankProperty }] }))
  }

  const removeProperty = (idx) => {
    if (form.properties.length > 1) {
      setForm((p) => ({ ...p, properties: p.properties.filter((_, i) => i !== idx) }))
    }
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
    submitForm('propertyDeclaration', form)
    toast.success('Property Declaration submitted successfully!')
    navigate('/dashboard')
    setSubmitting(false)
  }

  const disabled = status === 'submitted'

  return (
    <FormWrapper
      title="Property & Asset Declaration"
      description="Annual declaration of immovable property, vehicles, investments, and other significant movable assets."
      icon={<HomeIcon />}
      iconColor="#558b2f"
      iconBg="#f1f8e9"
      dueDate="Apr 30, 2026"
      status={status}
      submittedAt={existing?.submittedAt}
      submitting={submitting}
      onSubmit={handleSubmit}
    >
      {/* Year */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Declaration Year</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControl fullWidth sx={{ maxWidth: 300 }}>
          <InputLabel>Year</InputLabel>
          <Select value={form.year} onChange={set('year')} label="Year" disabled={disabled}>
            {YEARS.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </Select>
        </FormControl>
      </Paper>

      {/* Immovable Property */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Immovable Property</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControl component="fieldset">
          <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            Do you own any immovable property (house, land, commercial property)?
          </FormLabel>
          <RadioGroup row value={form.hasImmovable} onChange={set('hasImmovable')}>
            <FormControlLabel value="Yes" control={<Radio disabled={disabled} />} label="Yes" />
            <FormControlLabel value="No" control={<Radio disabled={disabled} />} label="No" />
          </RadioGroup>
        </FormControl>

        {form.hasImmovable === 'Yes' && (
          <Box sx={{ mt: 2.5 }}>
            {form.properties.map((prop, idx) => (
              <Box key={idx} sx={{ p: 2.5, mb: 2, bgcolor: '#f1f8e9', borderRadius: 2, border: '1px solid #c8e6c9' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="success.dark">Property {idx + 1}</Typography>
                  {idx > 0 && !disabled && (
                    <IconButton size="small" color="error" onClick={() => removeProperty(idx)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Property Type</InputLabel>
                      <Select value={prop.type} onChange={setProp(idx, 'type')} label="Property Type" disabled={disabled}>
                        {PROPERTY_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth size="small" label="City" value={prop.city} onChange={setProp(idx, 'city')} disabled={disabled} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth size="small" label="State" value={prop.state} onChange={setProp(idx, 'state')} disabled={disabled} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth size="small" label="Approximate Value" value={prop.value}
                      onChange={setProp(idx, 'value')} type="number"
                      InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>How Acquired</InputLabel>
                      <Select value={prop.acquired} onChange={setProp(idx, 'acquired')} label="How Acquired" disabled={disabled}>
                        {ACQUISITION_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth size="small" label="Date of Acquisition" type="date" value={prop.acquisitionDate} onChange={setProp(idx, 'acquisitionDate')} InputLabelProps={{ shrink: true }} disabled={disabled} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl component="fieldset">
                      <FormLabel sx={{ fontSize: '0.75rem', mb: 0.5 }}>Loan on this property?</FormLabel>
                      <RadioGroup row value={prop.hasLoan} onChange={setProp(idx, 'hasLoan')}>
                        <FormControlLabel value="Yes" control={<Radio size="small" disabled={disabled} />} label="Yes" />
                        <FormControlLabel value="No" control={<Radio size="small" disabled={disabled} />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  {prop.hasLoan === 'Yes' && (
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth size="small" label="Outstanding Loan Amount" value={prop.loanAmount}
                        onChange={setProp(idx, 'loanAmount')} type="number"
                        InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                        disabled={disabled}
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>
            ))}
            {!disabled && (
              <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={addProperty}>
                Add Another Property
              </Button>
            )}
          </Box>
        )}
      </Paper>

      {/* Movable Assets */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Movable Assets</Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Vehicles */}
        <Box sx={{ mb: 3 }}>
          <FormControl component="fieldset">
            <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
              Do you own any vehicles (cars, bikes, etc.)?
            </FormLabel>
            <RadioGroup row value={form.hasVehicles} onChange={set('hasVehicles')}>
              <FormControlLabel value="Yes" control={<Radio disabled={disabled} />} label="Yes" />
              <FormControlLabel value="No" control={<Radio disabled={disabled} />} label="No" />
            </RadioGroup>
          </FormControl>
          {form.hasVehicles === 'Yes' && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField fullWidth size="small" label="Number of Vehicles" value={form.vehicleCount} onChange={set('vehicleCount')} type="number" disabled={disabled} />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth size="small" label="Approx. Total Value" value={form.vehicleValue} onChange={set('vehicleValue')} type="number"
                  InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                  disabled={disabled}
                />
              </Grid>
            </Grid>
          )}
        </Box>

        {/* Investments */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight={600} gutterBottom>
            Investments exceeding ₹5 Lakhs (Mutual Funds, Stocks, etc.):
          </Typography>
          <TextField
            fullWidth size="small" label="Approximate Total Value" value={form.investmentValue}
            onChange={set('investmentValue')} type="number"
            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
            helperText="Leave blank if not applicable" disabled={disabled}
          />
        </Box>

        {/* Jewelry */}
        <Box>
          <Typography variant="body2" fontWeight={600} gutterBottom>
            Jewelry / Valuables (Approximate Total Value):
          </Typography>
          <TextField
            fullWidth size="small" label="Approximate Value" value={form.jewelryValue}
            onChange={set('jewelryValue')} type="number"
            InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
            helperText="Leave blank if not applicable" disabled={disabled}
          />
        </Box>
      </Paper>

      {/* Declaration */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Declaration & Signature</Typography>
        <Divider sx={{ mb: 2 }} />
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2, fontSize: '0.82rem' }}>
          I hereby declare that the above information regarding my assets and properties is true
          and complete. I understand that any false declaration may lead to disciplinary action.
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
