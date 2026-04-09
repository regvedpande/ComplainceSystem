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
import GroupIcon from '@mui/icons-material/Group'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useApp } from '../context/AppContext'
import FormWrapper from '../components/FormWrapper'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const QUARTERS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026']
const RELATIONSHIPS = ['Spouse', 'Parent', 'Sibling', 'Child', 'In-law', 'Other']

const blankRelative = {
  name: '',
  relationship: 'Spouse',
  company: '',
  designation: '',
  doesBusiness: 'No',
  conflictNature: '',
}

export default function RelativeEmployment() {
  const { formStatus, submitForm, submissions } = useApp()
  const navigate = useNavigate()
  const status = formStatus('relativeEmployment')
  const existing = submissions.relativeEmployment

  const [form, setForm] = useState({
    quarter: existing?.quarter || 'Q1 2026',
    hasRelatives: existing?.hasRelatives || 'No',
    relatives: existing?.relatives || [{ ...blankRelative }],
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

  const setRelative = (idx, field) => (e) => {
    const updated = form.relatives.map((r, i) => i === idx ? { ...r, [field]: e.target.value } : r)
    setForm((p) => ({ ...p, relatives: updated }))
  }

  const addRelative = () => {
    setForm((p) => ({ ...p, relatives: [...p.relatives, { ...blankRelative }] }))
  }

  const removeRelative = (idx) => {
    if (form.relatives.length > 1) {
      setForm((p) => ({ ...p, relatives: p.relatives.filter((_, i) => i !== idx) }))
    }
  }

  const validate = () => {
    const e = {}
    if (!form.declaration) e.declaration = 'You must accept the declaration'
    if (!form.signature.trim()) e.signature = 'Digital signature is required'
    if (form.hasRelatives === 'Yes') {
      form.relatives.forEach((r, i) => {
        if (!r.name.trim()) e[`rel_${i}_name`] = 'Name required'
        if (!r.company.trim()) e[`rel_${i}_company`] = 'Company required'
      })
    }
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
    submitForm('relativeEmployment', form)
    toast.success('Relative Employment Declaration submitted!')
    navigate('/dashboard')
    setSubmitting(false)
  }

  const disabled = status === 'submitted'

  return (
    <FormWrapper
      title="Relative Employment Declaration"
      description="Declare if any immediate family members are employed in the financial services industry, to identify potential conflicts of interest."
      icon={<GroupIcon />}
      iconColor="#00838f"
      iconBg="#e0f7fa"
      dueDate="Not Due (Demo)"
      status={status}
      submittedAt={existing?.submittedAt}
      submitting={submitting}
      onSubmit={handleSubmit}
    >
      {/* Quarter */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Quarter</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControl fullWidth sx={{ maxWidth: 300 }}>
          <InputLabel>Quarter</InputLabel>
          <Select value={form.quarter} onChange={set('quarter')} label="Quarter" disabled={disabled}>
            {QUARTERS.map((q) => <MenuItem key={q} value={q}>{q}</MenuItem>)}
          </Select>
        </FormControl>
      </Paper>

      {/* Main Question */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Relative Employment Details</Typography>
        <Divider sx={{ mb: 2 }} />
        <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.82rem' }}>
          "Financial services industry" includes banks, NBFCs, mutual funds, insurance companies,
          broking firms, asset management companies, rating agencies, and regulatory bodies.
        </Alert>

        <FormControl component="fieldset">
          <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            Do any of your immediate family members (spouse, parents, siblings, children, in-laws)
            work in the financial services industry?
          </FormLabel>
          <RadioGroup row value={form.hasRelatives} onChange={set('hasRelatives')}>
            <FormControlLabel value="Yes" control={<Radio disabled={disabled} />} label="Yes" />
            <FormControlLabel value="No" control={<Radio disabled={disabled} />} label="No" />
          </RadioGroup>
        </FormControl>

        {form.hasRelatives === 'Yes' && (
          <Box sx={{ mt: 2.5 }}>
            {form.relatives.map((rel, idx) => (
              <Box
                key={idx}
                sx={{ p: 2.5, mb: 2, bgcolor: '#e0f7fa', borderRadius: 2, border: '1px solid #b2ebf2' }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="info.dark">
                    Relative {idx + 1}
                  </Typography>
                  {idx > 0 && !disabled && (
                    <IconButton size="small" color="error" onClick={() => removeRelative(idx)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth size="small" label="Relative Name *"
                      value={rel.name} onChange={setRelative(idx, 'name')}
                      error={!!errors[`rel_${idx}_name`]} helperText={errors[`rel_${idx}_name`]}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Relationship</InputLabel>
                      <Select value={rel.relationship} onChange={setRelative(idx, 'relationship')} label="Relationship" disabled={disabled}>
                        {RELATIONSHIPS.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth size="small" label="Company Name *"
                      value={rel.company} onChange={setRelative(idx, 'company')}
                      error={!!errors[`rel_${idx}_company`]} helperText={errors[`rel_${idx}_company`]}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth size="small" label="Designation / Role"
                      value={rel.designation} onChange={setRelative(idx, 'designation')}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl component="fieldset" sx={{ mt: 0.5 }}>
                      <FormLabel sx={{ fontSize: '0.75rem', mb: 0.5 }}>Company does business with UTI AMC?</FormLabel>
                      <RadioGroup row value={rel.doesBusiness} onChange={setRelative(idx, 'doesBusiness')}>
                        <FormControlLabel value="Yes" control={<Radio size="small" disabled={disabled} />} label="Yes" />
                        <FormControlLabel value="No" control={<Radio size="small" disabled={disabled} />} label="No" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  {rel.doesBusiness === 'Yes' && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth size="small" multiline rows={2}
                        label="Nature of Potential Conflict"
                        value={rel.conflictNature} onChange={setRelative(idx, 'conflictNature')}
                        placeholder="Describe the nature of potential conflict of interest..."
                        disabled={disabled}
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>
            ))}
            {!disabled && (
              <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={addRelative}>
                Add Another Relative
              </Button>
            )}
          </Box>
        )}
      </Paper>

      {/* Declaration */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Declaration & Signature</Typography>
        <Divider sx={{ mb: 2 }} />
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2, fontSize: '0.82rem' }}>
          I hereby declare that the information provided above is complete, accurate, and up to
          date. I understand that non-disclosure of relevant information may be treated as a
          violation of the Code of Conduct.
        </Alert>
        <FormControlLabel
          control={<Checkbox checked={form.declaration} onChange={set('declaration')} disabled={disabled} color="primary" />}
          label={<Typography variant="body2">I confirm the above declaration is accurate and complete. <span style={{ color: 'red' }}>*</span></Typography>}
        />
        {errors.declaration && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, ml: 4 }}>
            {errors.declaration}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 2, mt: 2.5, flexWrap: 'wrap' }}>
          <TextField
            label="Digital Signature *" value={form.signature} onChange={set('signature')}
            error={!!errors.signature} helperText={errors.signature || 'Type your full name'}
            sx={{ flex: 2, minWidth: 200 }} disabled={disabled}
          />
          <TextField
            label="Date" type="date" value={form.date}
            sx={{ flex: 1, minWidth: 150 }} InputLabelProps={{ shrink: true }} disabled
          />
        </Box>
      </Paper>
    </FormWrapper>
  )
}
