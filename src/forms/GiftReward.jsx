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
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useApp } from '../context/AppContext'
import FormWrapper from '../components/FormWrapper'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const QUARTERS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026']
const GIFT_NATURES = ['Gift', 'Hospitality', 'Entertainment', 'Other']
const ACTIONS = ['Returned to sender', 'Disclosed to manager', 'Retained with approval']

const blankGift = {
  description: '',
  from: '',
  value: '',
  dateReceived: '',
  nature: 'Gift',
  action: 'Disclosed to manager',
}

export default function GiftReward() {
  const { formStatus, submitForm, submissions } = useApp()
  const navigate = useNavigate()
  const status = formStatus('giftReward')
  const existing = submissions.giftReward

  const [form, setForm] = useState({
    quarter: existing?.quarter || 'Q1 2026',
    hasGifts: existing?.hasGifts || 'No',
    gifts: existing?.gifts || [{ ...blankGift }],
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

  const setGift = (idx, field) => (e) => {
    const updated = form.gifts.map((g, i) => i === idx ? { ...g, [field]: e.target.value } : g)
    setForm((p) => ({ ...p, gifts: updated }))
  }

  const addGift = () => {
    setForm((p) => ({ ...p, gifts: [...p.gifts, { ...blankGift }] }))
  }

  const removeGift = (idx) => {
    if (form.gifts.length > 1) {
      setForm((p) => ({ ...p, gifts: p.gifts.filter((_, i) => i !== idx) }))
    }
  }

  const validate = () => {
    const e = {}
    if (!form.declaration) e.declaration = 'You must accept the declaration'
    if (!form.signature.trim()) e.signature = 'Digital signature is required'
    if (form.hasGifts === 'Yes') {
      form.gifts.forEach((g, i) => {
        if (!g.description.trim()) e[`gift_${i}_desc`] = 'Description required'
        if (!g.from.trim()) e[`gift_${i}_from`] = 'Sender required'
        if (!g.value) e[`gift_${i}_val`] = 'Value required'
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
    submitForm('giftReward', form)
    toast.success('Gift & Reward Declaration submitted successfully!')
    navigate('/dashboard')
    setSubmitting(false)
  }

  const disabled = status === 'submitted'

  return (
    <FormWrapper
      title="Gift & Reward Declaration"
      description="Declare any gifts, rewards, or hospitality received with value exceeding ₹1,000 during the quarter."
      icon={<CardGiftcardIcon />}
      iconColor="#e65100"
      iconBg="#fff3e0"
      dueDate="Not Due (Demo)"
      status={status}
      submittedAt={existing?.submittedAt}
      submitting={submitting}
      onSubmit={handleSubmit}
    >
      {/* Quarter */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Quarter Selection</Typography>
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
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Gift Declaration</Typography>
        <Divider sx={{ mb: 2 }} />
        <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.82rem' }}>
          As per UTI AMC's Gift Policy, any gift, reward, entertainment, or hospitality with
          a value exceeding <strong>₹1,000</strong> must be declared to the Compliance team.
        </Alert>

        <FormControl component="fieldset">
          <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            Did you receive any gift, reward, or hospitality with value exceeding ₹1,000 this
            quarter?
          </FormLabel>
          <RadioGroup row value={form.hasGifts} onChange={set('hasGifts')}>
            <FormControlLabel value="Yes" control={<Radio disabled={disabled} />} label="Yes" />
            <FormControlLabel value="No" control={<Radio disabled={disabled} />} label="No — I confirm I have not received any such gift" />
          </RadioGroup>
        </FormControl>

        {form.hasGifts === 'Yes' && (
          <Box sx={{ mt: 2.5 }}>
            {form.gifts.map((gift, idx) => (
              <Box
                key={idx}
                sx={{ p: 2.5, mb: 2, bgcolor: '#fff8f0', borderRadius: 2, border: '1px solid #ffe0b2' }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="warning.dark">
                    Gift #{idx + 1}
                  </Typography>
                  {idx > 0 && !disabled && (
                    <IconButton size="small" color="error" onClick={() => removeGift(idx)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="Gift Description *"
                      value={gift.description} onChange={setGift(idx, 'description')}
                      error={!!errors[`gift_${idx}_desc`]} helperText={errors[`gift_${idx}_desc`]}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small" label="Received From *"
                      value={gift.from} onChange={setGift(idx, 'from')}
                      error={!!errors[`gift_${idx}_from`]} helperText={errors[`gift_${idx}_from`]}
                      placeholder="Person / Company name" disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth size="small" label="Approx. Value *" type="number"
                      value={gift.value} onChange={setGift(idx, 'value')}
                      error={!!errors[`gift_${idx}_val`]} helperText={errors[`gift_${idx}_val`]}
                      InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                      disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth size="small" label="Date Received" type="date"
                      value={gift.dateReceived} onChange={setGift(idx, 'dateReceived')}
                      InputLabelProps={{ shrink: true }} disabled={disabled}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Nature</InputLabel>
                      <Select value={gift.nature} onChange={setGift(idx, 'nature')} label="Nature" disabled={disabled}>
                        {GIFT_NATURES.map((n) => <MenuItem key={n} value={n}>{n}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Action Taken</InputLabel>
                      <Select value={gift.action} onChange={setGift(idx, 'action')} label="Action Taken" disabled={disabled}>
                        {ACTIONS.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            ))}
            {!disabled && (
              <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={addGift}>
                Add Another Gift
              </Button>
            )}
          </Box>
        )}
      </Paper>

      {/* Declaration */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Declaration & Signature</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControlLabel
          control={<Checkbox checked={form.declaration} onChange={set('declaration')} disabled={disabled} color="primary" />}
          label={<Typography variant="body2">I declare that the above information is complete and accurate. <span style={{ color: 'red' }}>*</span></Typography>}
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
