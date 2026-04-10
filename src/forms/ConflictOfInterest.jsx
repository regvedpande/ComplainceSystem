import React, { useState } from 'react'
import { Box, Paper, Typography, Divider, TextField, Checkbox, FormControlLabel,
  Alert, Grid, MenuItem, Select, FormControl, InputLabel, Button, IconButton,
  FormLabel, RadioGroup, Radio } from '@mui/material'
import BalanceIcon from '@mui/icons-material/Balance'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useApp } from '../context/AppContext'
import FormWrapper from '../components/FormWrapper'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const INTEREST_TYPES = ['Equity Shareholding', 'Directorship / Board Seat', 'Partnership Interest', 'Beneficiary of Trust', 'Advisory Role', 'Other Financial Interest']
const OUTSIDE_TYPES = ['Part-time Employment', 'Consulting / Advisory', 'Board Membership', 'Freelance / Contract Work', 'Family Business', 'Other']
const RELATION_TYPES = ['Self', 'Spouse', 'Parent', 'Sibling', 'Child', 'In-law', 'Other']

const blankDisclosure = { companyName: '', interestType: '', relation: '', holdingPct: '', remarks: '' }
const blankOutside = { orgName: '', workType: '', timeCommitment: '', approvalObtained: 'No' }

export default function ConflictOfInterest() {
  const { formStatus, submitForm, submissions } = useApp()
  const navigate = useNavigate()
  const status = formStatus('conflictOfInterest')
  const existing = submissions.conflictOfInterest

  const [form, setForm] = useState({
    fy: existing?.fy || 'FY 2025–26',
    hasFinancialInterest: existing?.hasFinancialInterest || 'No',
    disclosures: existing?.disclosures || [{ ...blankDisclosure }],
    hasOutsideEmployment: existing?.hasOutsideEmployment || 'No',
    outsideEmployment: existing?.outsideEmployment || [{ ...blankOutside }],
    hasVendorRelation: existing?.hasVendorRelation || 'No',
    vendorRelationDetails: existing?.vendorRelationDetails || '',
    hasPendingLitigation: existing?.hasPendingLitigation || 'No',
    litigationDetails: existing?.litigationDetails || '',
    nothingToDisclose: existing?.nothingToDisclose || false,
    declaration: existing?.declaration || false,
    signature: existing?.signature || '',
    date: existing?.date || new Date().toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const set = f => e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(p => ({ ...p, [f]: val }))
    setErrors(p => ({ ...p, [f]: undefined }))
  }

  const setRow = (arr, idx, field) => e => {
    const updated = form[arr].map((r, i) => i === idx ? { ...r, [field]: e.target.value } : r)
    setForm(p => ({ ...p, [arr]: updated }))
  }
  const addRow = arr => () => setForm(p => ({ ...p, [arr]: [...p[arr], arr === 'disclosures' ? { ...blankDisclosure } : { ...blankOutside }] }))
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
    submitForm('conflictOfInterest', form)
    toast.success('Conflict of Interest Disclosure submitted!')
    navigate('/dashboard')
  }

  const disabled = status === 'submitted-locked'

  return (
    <FormWrapper
      title="Conflict of Interest Disclosure"
      description="Annual disclosure of any personal, financial, or professional interests that may conflict with your duties at Axiom Capital Management. Mandatory under SEBI regulations and company policy."
      icon={<BalanceIcon />} iconColor="#1565c0" iconBg="#e3f2fd"
      dueDate="Apr 15" status={status} submittedAt={existing?.submittedAt}
      submitting={submitting} onSubmit={handleSubmit}
    >
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2.5, fontSize: '0.82rem' }}>
        Disclose all actual, potential, or perceived conflicts of interest for <strong>{form.fy}</strong>. When in doubt, disclose. Undisclosed conflicts may constitute a serious disciplinary offence.
      </Alert>

      {/* Financial Interests */}
      <Paper elevation={0} sx={{ p: 3, mb: 2.5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>A. Financial Interests in External Entities</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem', mb: 1 }}>
            Do you or any immediate family member hold a financial interest (&gt;1%) in any company that does business with Axiom Capital, or that may be affected by your work?
          </FormLabel>
          <RadioGroup row value={form.hasFinancialInterest} onChange={set('hasFinancialInterest')}>
            <FormControlLabel value="No" control={<Radio disabled={disabled} size="small" color="success" />} label={<Typography variant="body2">No</Typography>} />
            <FormControlLabel value="Yes" control={<Radio disabled={disabled} size="small" color="warning" />} label={<Typography variant="body2">Yes (please declare below)</Typography>} />
          </RadioGroup>
        </FormControl>

        {form.hasFinancialInterest === 'Yes' && (
          <Box>
            {form.disclosures.map((d, idx) => (
              <Box key={idx} sx={{ p: 2, mb: 1.5, borderRadius: 2.5, border: '1px solid rgba(26,35,126,0.12)', bgcolor: '#fafbff' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="caption" fontWeight={700} color="primary">Disclosure {idx + 1}</Typography>
                  {idx > 0 && !disabled && <IconButton size="small" onClick={delRow('disclosures', idx)} color="error"><DeleteOutlineIcon fontSize="small" /></IconButton>}
                </Box>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth size="small" label="Company / Entity Name" value={d.companyName} onChange={setRow('disclosures', idx, 'companyName')} disabled={disabled} />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Type of Interest</InputLabel>
                      <Select value={d.interestType} onChange={setRow('disclosures', idx, 'interestType')} label="Type of Interest" disabled={disabled}>
                        {INTEREST_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Relation</InputLabel>
                      <Select value={d.relation} onChange={setRow('disclosures', idx, 'relation')} label="Relation" disabled={disabled}>
                        {RELATION_TYPES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={1}>
                    <TextField fullWidth size="small" label="% Holding" type="number" value={d.holdingPct} onChange={setRow('disclosures', idx, 'holdingPct')} disabled={disabled} InputProps={{ inputProps: { min: 0, max: 100 } }} />
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField fullWidth size="small" label="Remarks" value={d.remarks} onChange={setRow('disclosures', idx, 'remarks')} disabled={disabled} />
                  </Grid>
                </Grid>
              </Box>
            ))}
            {!disabled && form.disclosures.length < 5 && (
              <Button startIcon={<AddIcon />} size="small" variant="outlined" onClick={addRow('disclosures')} sx={{ borderRadius: 2, mt: 0.5 }}>Add Disclosure</Button>
            )}
          </Box>
        )}
      </Paper>

      {/* Outside Employment */}
      <Paper elevation={0} sx={{ p: 3, mb: 2.5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>B. Outside Employment / Business Activity</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem', mb: 1 }}>
            Are you engaged in any outside employment, consulting, advisory, or business activity (paid or unpaid)?
          </FormLabel>
          <RadioGroup row value={form.hasOutsideEmployment} onChange={set('hasOutsideEmployment')}>
            <FormControlLabel value="No" control={<Radio disabled={disabled} size="small" color="success" />} label={<Typography variant="body2">No</Typography>} />
            <FormControlLabel value="Yes" control={<Radio disabled={disabled} size="small" color="warning" />} label={<Typography variant="body2">Yes (please declare below)</Typography>} />
          </RadioGroup>
        </FormControl>

        {form.hasOutsideEmployment === 'Yes' && (
          <Box>
            {form.outsideEmployment.map((d, idx) => (
              <Box key={idx} sx={{ p: 2, mb: 1.5, borderRadius: 2.5, border: '1px solid rgba(26,35,126,0.12)', bgcolor: '#fafbff' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="caption" fontWeight={700} color="primary">Activity {idx + 1}</Typography>
                  {idx > 0 && !disabled && <IconButton size="small" onClick={delRow('outsideEmployment', idx)} color="error"><DeleteOutlineIcon fontSize="small" /></IconButton>}
                </Box>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth size="small" label="Organisation / Company" value={d.orgName} onChange={setRow('outsideEmployment', idx, 'orgName')} disabled={disabled} />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Nature of Work</InputLabel>
                      <Select value={d.workType} onChange={setRow('outsideEmployment', idx, 'workType')} label="Nature of Work" disabled={disabled}>
                        {OUTSIDE_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField fullWidth size="small" label="Hours/Week" value={d.timeCommitment} onChange={setRow('outsideEmployment', idx, 'timeCommitment')} disabled={disabled} placeholder="e.g. 5 hrs" />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Compliance Approval Obtained</InputLabel>
                      <Select value={d.approvalObtained} onChange={setRow('outsideEmployment', idx, 'approvalObtained')} label="Compliance Approval Obtained" disabled={disabled}>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No — Seeking Approval</MenuItem>
                        <MenuItem value="NA">N/A (Unpaid)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            ))}
            {!disabled && form.outsideEmployment.length < 5 && (
              <Button startIcon={<AddIcon />} size="small" variant="outlined" onClick={addRow('outsideEmployment')} sx={{ borderRadius: 2, mt: 0.5 }}>Add Activity</Button>
            )}
          </Box>
        )}
      </Paper>

      {/* Vendor / Client Relations */}
      <Paper elevation={0} sx={{ p: 3, mb: 2.5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>C. Other Disclosures</Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ mb: 2.5 }}>
          <FormControl component="fieldset">
            <FormLabel sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem', mb: 1 }}>
              Do you have any personal relationships (family or close friendship) with vendors, clients, or counterparties of the company?
            </FormLabel>
            <RadioGroup row value={form.hasVendorRelation} onChange={set('hasVendorRelation')}>
              <FormControlLabel value="No" control={<Radio disabled={disabled} size="small" color="success" />} label={<Typography variant="body2">No</Typography>} />
              <FormControlLabel value="Yes" control={<Radio disabled={disabled} size="small" color="warning" />} label={<Typography variant="body2">Yes</Typography>} />
            </RadioGroup>
          </FormControl>
          {form.hasVendorRelation === 'Yes' && (
            <TextField fullWidth multiline rows={2} size="small" label="Provide details of the relationship *" value={form.vendorRelationDetails} onChange={set('vendorRelationDetails')} disabled={disabled} sx={{ mt: 1.5 }} />
          )}
        </Box>

        <Box>
          <FormControl component="fieldset">
            <FormLabel sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem', mb: 1 }}>
              Are you or any immediate family member a party to any litigation or regulatory proceedings involving the company or its clients?
            </FormLabel>
            <RadioGroup row value={form.hasPendingLitigation} onChange={set('hasPendingLitigation')}>
              <FormControlLabel value="No" control={<Radio disabled={disabled} size="small" color="success" />} label={<Typography variant="body2">No</Typography>} />
              <FormControlLabel value="Yes" control={<Radio disabled={disabled} size="small" color="warning" />} label={<Typography variant="body2">Yes</Typography>} />
            </RadioGroup>
          </FormControl>
          {form.hasPendingLitigation === 'Yes' && (
            <TextField fullWidth multiline rows={2} size="small" label="Provide details of litigation / proceedings *" value={form.litigationDetails} onChange={set('litigationDetails')} disabled={disabled} sx={{ mt: 1.5 }} />
          )}
        </Box>
      </Paper>

      {/* Declaration */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Declaration & Signature</Typography>
        <Divider sx={{ mb: 2 }} />
        <Alert severity="warning" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.8rem' }}>
          I hereby declare that the information provided above is complete, accurate, and true to the best of my knowledge for {form.fy}. I understand that failure to disclose conflicts of interest or providing false information may result in disciplinary action up to and including termination.
        </Alert>
        <FormControlLabel
          control={<Checkbox checked={form.nothingToDisclose} onChange={set('nothingToDisclose')} disabled={disabled} color="primary" size="small" />}
          label={<Typography variant="body2">I confirm that I have no additional conflicts of interest to disclose beyond what is stated above.</Typography>}
          sx={{ mb: 1, display: 'flex', alignItems: 'flex-start', '& .MuiFormControlLabel-label': { mt: 0.4 } }}
        />
        <FormControlLabel
          control={<Checkbox checked={form.declaration} onChange={set('declaration')} disabled={disabled} color="primary" />}
          label={<Typography variant="body2">I confirm the above Conflict of Interest Disclosure is complete and accurate. <span style={{ color: 'red' }}>*</span></Typography>}
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
