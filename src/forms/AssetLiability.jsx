import React, { useState } from 'react'
import { Box, Paper, Typography, Divider, TextField, MenuItem, Select,
  FormControl, InputLabel, Checkbox, FormControlLabel, Button, Grid,
  IconButton, Alert } from '@mui/material'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useApp } from '../context/AppContext'
import FormWrapper from '../components/FormWrapper'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const FY_OPTIONS = ['FY 2025–26', 'FY 2024–25']
const PROP_TYPES = ['Residential Flat/House', 'Plot/Land', 'Commercial Property', 'Agricultural Land', 'Other']
const ACQ_MODES  = ['Self-Purchased', 'Joint Purchase', 'Inherited', 'Gift', 'Other']
const INVEST_TYPES = ['Equity Shares (Listed)', 'Unlisted Shares', 'Mutual Funds', 'NPS', 'PPF/EPF', 'Fixed Deposits', 'Bonds/Debentures', 'Other']
const LIAB_TYPES = ['Home Loan', 'Vehicle Loan', 'Personal Loan', 'Education Loan', 'Credit Card Outstanding', 'Other']

const blankProp  = { type: '', location: '', value: '', mode: '', year: '', loan: 'No', loanAmt: '' }
const blankInvest = { type: '', institution: '', value: '', folio: '' }
const blankLiab  = { type: '', lender: '', outstanding: '', emi: '' }

export default function AssetLiability() {
  const { formStatus, submitForm, submissions } = useApp()
  const navigate = useNavigate()
  const status = formStatus('assetLiability')
  const existing = submissions.assetLiability

  const [form, setForm] = useState({
    fy: existing?.fy || 'FY 2025–26',
    hasProperty: existing?.hasProperty || 'No',
    properties: existing?.properties || [{ ...blankProp }],
    hasInvestments: existing?.hasInvestments || 'No',
    investments: existing?.investments || [{ ...blankInvest }],
    hasLiabilities: existing?.hasLiabilities || 'No',
    liabilities: existing?.liabilities || [{ ...blankLiab }],
    vehicleCount: existing?.vehicleCount || '0',
    vehicleValue: existing?.vehicleValue || '',
    jewelleryValue: existing?.jewelleryValue || '',
    declaration: existing?.declaration || false,
    signature: existing?.signature || '',
    date: existing?.date || new Date().toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const setRow = (arr, idx, field) => e => {
    const updated = form[arr].map((r, i) => i === idx ? { ...r, [field]: e.target.value } : r)
    setForm(p => ({ ...p, [arr]: updated }))
  }
  const addRow = (arr, blank) => () => setForm(p => ({ ...p, [arr]: [...p[arr], { ...blank }] }))
  const delRow = (arr, idx) => () => setForm(p => ({ ...p, [arr]: p[arr].filter((_, i) => i !== idx) }))

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
    submitForm('assetLiability', form)
    toast.success('Asset & Liability Declaration submitted!')
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
      title="Annual Asset & Liability Declaration"
      description="Mandatory annual disclosure of immovable properties, investments, and liabilities as required under SEBI regulations and company policy."
      icon={<AccountBalanceIcon />} iconColor="#1565c0" iconBg="#e3f2fd"
      dueDate="Apr 30" status={status} submittedAt={existing?.submittedAt}
      submitting={submitting} onSubmit={handleSubmit}
    >
      <Section title="Declaration Period">
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Fiscal Year</InputLabel>
          <Select value={form.fy} onChange={set('fy')} label="Fiscal Year" disabled={disabled}>
            {FY_OPTIONS.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
          </Select>
        </FormControl>
      </Section>

      {/* Immovable Property */}
      <Section title="A. Immovable Properties">
        <Alert severity="info" sx={{ mb: 2, borderRadius: 2, fontSize: '0.8rem' }}>Declare all immovable properties owned by you or jointly with family members.</Alert>
        <FormControl sx={{ mb: 2 }}>
          <InputLabel>Do you own any immovable property?</InputLabel>
          <Select value={form.hasProperty} onChange={set('hasProperty')} label="Do you own any immovable property?" disabled={disabled} sx={{ minWidth: 280 }}>
            <MenuItem value="No">No</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
          </Select>
        </FormControl>
        {form.hasProperty === 'Yes' && (
          <Box>
            {form.properties.map((p, i) => (
              <Box key={i} sx={{ p: 2, mb: 1.5, borderRadius: 2.5, border: '1px solid rgba(26,35,126,0.12)', bgcolor: '#fafbff' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="caption" fontWeight={700} color="primary">Property {i + 1}</Typography>
                  {i > 0 && !disabled && <IconButton size="small" onClick={delRow('properties', i)} color="error"><DeleteOutlineIcon fontSize="small" /></IconButton>}
                </Box>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Type</InputLabel>
                      <Select value={p.type} onChange={setRow('properties', i, 'type')} label="Type" disabled={disabled}>
                        {PROP_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField fullWidth size="small" label="Location (City, State)" value={p.location} onChange={setRow('properties', i, 'location')} disabled={disabled} />
                  </Grid>
                  <Grid item xs={6} sm={4} md={2}>
                    <TextField fullWidth size="small" label="Approx. Value (₹)" value={p.value} onChange={setRow('properties', i, 'value')} disabled={disabled} />
                  </Grid>
                  <Grid item xs={6} sm={4} md={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Mode of Acquisition</InputLabel>
                      <Select value={p.mode} onChange={setRow('properties', i, 'mode')} label="Mode of Acquisition" disabled={disabled}>
                        {ACQ_MODES.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={4} md={2}>
                    <TextField fullWidth size="small" label="Year Acquired" value={p.year} onChange={setRow('properties', i, 'year')} disabled={disabled} />
                  </Grid>
                  <Grid item xs={6} sm={4} md={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Loan Outstanding?</InputLabel>
                      <Select value={p.loan} onChange={setRow('properties', i, 'loan')} label="Loan Outstanding?" disabled={disabled}>
                        <MenuItem value="No">No</MenuItem>
                        <MenuItem value="Yes">Yes</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {p.loan === 'Yes' && (
                    <Grid item xs={6} sm={4} md={3}>
                      <TextField fullWidth size="small" label="Loan Amount (₹)" value={p.loanAmt} onChange={setRow('properties', i, 'loanAmt')} disabled={disabled} />
                    </Grid>
                  )}
                </Grid>
              </Box>
            ))}
            {!disabled && form.properties.length < 5 && (
              <Button startIcon={<AddIcon />} size="small" variant="outlined" onClick={addRow('properties', blankProp)} sx={{ mt: 0.5, borderRadius: 2 }}>Add Property</Button>
            )}
          </Box>
        )}
      </Section>

      {/* Investments */}
      <Section title="B. Investments & Financial Assets">
        <FormControl sx={{ mb: 2 }}>
          <InputLabel>Do you hold any investments?</InputLabel>
          <Select value={form.hasInvestments} onChange={set('hasInvestments')} label="Do you hold any investments?" disabled={disabled} sx={{ minWidth: 260 }}>
            <MenuItem value="No">No</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
          </Select>
        </FormControl>
        {form.hasInvestments === 'Yes' && (
          <Box>
            {form.investments.map((inv, i) => (
              <Box key={i} sx={{ p: 2, mb: 1.5, borderRadius: 2.5, border: '1px solid rgba(26,35,126,0.12)', bgcolor: '#fafbff' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="caption" fontWeight={700} color="primary">Investment {i + 1}</Typography>
                  {i > 0 && !disabled && <IconButton size="small" onClick={delRow('investments', i)} color="error"><DeleteOutlineIcon fontSize="small" /></IconButton>}
                </Box>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Investment Type</InputLabel>
                      <Select value={inv.type} onChange={setRow('investments', i, 'type')} label="Investment Type" disabled={disabled}>
                        {INVEST_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth size="small" label="Institution / Fund Name" value={inv.institution} onChange={setRow('investments', i, 'institution')} disabled={disabled} />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField fullWidth size="small" label="Value (₹)" value={inv.value} onChange={setRow('investments', i, 'value')} disabled={disabled} />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField fullWidth size="small" label="Folio / A/c No." value={inv.folio} onChange={setRow('investments', i, 'folio')} disabled={disabled} />
                  </Grid>
                </Grid>
              </Box>
            ))}
            {!disabled && form.investments.length < 10 && (
              <Button startIcon={<AddIcon />} size="small" variant="outlined" onClick={addRow('investments', blankInvest)} sx={{ borderRadius: 2 }}>Add Investment</Button>
            )}
          </Box>
        )}
        <Grid container spacing={2} sx={{ mt: 1.5 }}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth size="small" label="No. of Vehicles Owned" type="number" value={form.vehicleCount} onChange={set('vehicleCount')} disabled={disabled} InputProps={{ inputProps: { min: 0 } }} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth size="small" label="Total Vehicle Value (₹)" value={form.vehicleValue} onChange={set('vehicleValue')} disabled={disabled} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth size="small" label="Jewellery / Valuables (₹)" value={form.jewelleryValue} onChange={set('jewelleryValue')} disabled={disabled} />
          </Grid>
        </Grid>
      </Section>

      {/* Liabilities */}
      <Section title="C. Liabilities & Loans">
        <FormControl sx={{ mb: 2 }}>
          <InputLabel>Do you have any outstanding liabilities?</InputLabel>
          <Select value={form.hasLiabilities} onChange={set('hasLiabilities')} label="Do you have any outstanding liabilities?" disabled={disabled} sx={{ minWidth: 300 }}>
            <MenuItem value="No">No</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
          </Select>
        </FormControl>
        {form.hasLiabilities === 'Yes' && (
          <Box>
            {form.liabilities.map((l, i) => (
              <Box key={i} sx={{ p: 2, mb: 1.5, borderRadius: 2.5, border: '1px solid rgba(26,35,126,0.12)', bgcolor: '#fafbff' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="caption" fontWeight={700} color="primary">Liability {i + 1}</Typography>
                  {i > 0 && !disabled && <IconButton size="small" onClick={delRow('liabilities', i)} color="error"><DeleteOutlineIcon fontSize="small" /></IconButton>}
                </Box>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Liability Type</InputLabel>
                      <Select value={l.type} onChange={setRow('liabilities', i, 'type')} label="Liability Type" disabled={disabled}>
                        {LIAB_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField fullWidth size="small" label="Lender Name" value={l.lender} onChange={setRow('liabilities', i, 'lender')} disabled={disabled} />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField fullWidth size="small" label="Outstanding Amount (₹)" value={l.outstanding} onChange={setRow('liabilities', i, 'outstanding')} disabled={disabled} />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField fullWidth size="small" label="Monthly EMI (₹)" value={l.emi} onChange={setRow('liabilities', i, 'emi')} disabled={disabled} />
                  </Grid>
                </Grid>
              </Box>
            ))}
            {!disabled && form.liabilities.length < 5 && (
              <Button startIcon={<AddIcon />} size="small" variant="outlined" onClick={addRow('liabilities', blankLiab)} sx={{ borderRadius: 2 }}>Add Liability</Button>
            )}
          </Box>
        )}
      </Section>

      {/* Declaration */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Declaration & Signature</Typography>
        <Divider sx={{ mb: 2 }} />
        <Alert severity="warning" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.8rem' }}>
          I hereby declare that the information provided above is true, complete, and accurate to the best of my knowledge. I understand that any false declaration is a serious misconduct under company policy and applicable SEBI regulations.
        </Alert>
        <FormControlLabel
          control={<Checkbox checked={form.declaration} onChange={set('declaration')} disabled={disabled} color="primary" />}
          label={<Typography variant="body2">I confirm the above declaration is complete and accurate. <span style={{ color: 'red' }}>*</span></Typography>}
        />
        {errors.declaration && <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, ml: 4 }}>{errors.declaration}</Typography>}
        <Grid container spacing={2} sx={{ mt: 1.5 }}>
          <Grid item xs={12} sm={8}>
            <TextField fullWidth size="small" label="Digital Signature — Type Full Name *" value={form.signature} onChange={set('signature')} error={!!errors.signature} helperText={errors.signature || 'Type your full legal name as digital signature'} disabled={disabled} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth size="small" label="Date" type="date" value={form.date} InputLabelProps={{ shrink: true }} disabled />
          </Grid>
        </Grid>
      </Paper>
    </FormWrapper>
  )
}
