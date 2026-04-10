import React, { useState } from 'react'
import { Box, Paper, Typography, Divider, TextField, Checkbox, FormControlLabel,
  Alert, Grid, MenuItem, Select, FormControl, InputLabel, Button, IconButton,
  FormLabel, RadioGroup, Radio, Chip } from '@mui/material'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { useApp } from '../context/AppContext'
import FormWrapper from '../components/FormWrapper'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const GIFT_TYPES = ['Cash / Cash Equivalent', 'Voucher / Gift Card', 'Consumer Electronics', 'Jewellery / Luxury Item', 'Food / Hamper / Confectionery', 'Entertainment / Event Tickets', 'Travel / Accommodation', 'Other']
const GIVER_TYPES = ['Vendor / Supplier', 'Client / Investor', 'Regulator / Government Official', 'Business Associate', 'Personal Contact', 'Other']
const ACTIONS = ['Returned to giver', 'Surrendered to Compliance', 'Retained with Compliance approval', 'Donated to charity (with approval)', 'Shared with team (with approval)']
const THRESHOLD = 2000

const blankGift = { description: '', giverName: '', giverType: '', value: '', date: '', giftType: '', action: '', approvalRef: '' }

export default function GiftHospitality() {
  const { formStatus, submitForm, submissions } = useApp()
  const navigate = useNavigate()
  const status = formStatus('giftHospitality')
  const existing = submissions.giftHospitality

  const [form, setForm] = useState({
    fy: existing?.fy || 'FY 2025–26',
    receivedGifts: existing?.receivedGifts || 'No',
    offeredGifts: existing?.offeredGifts || 'No',
    received: existing?.received || [{ ...blankGift }],
    offered: existing?.offered || [{ ...blankGift }],
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
  const addRow = arr => () => setForm(p => ({ ...p, [arr]: [...p[arr], { ...blankGift }] }))
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
    submitForm('giftHospitality', form)
    toast.success('Gift & Hospitality Register submitted!')
    navigate('/dashboard')
  }

  const disabled = status === 'submitted-locked'

  const GiftRow = ({ arr, idx, item }) => {
    const isHighValue = parseFloat(item.value) >= THRESHOLD
    return (
      <Box sx={{ p: 2, mb: 1.5, borderRadius: 2.5, border: '1px solid', borderColor: isHighValue ? 'warning.light' : 'rgba(26,35,126,0.1)', bgcolor: isHighValue ? '#fffde7' : '#fafbff' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" fontWeight={700} color="primary">Entry {idx + 1}</Typography>
            {isHighValue && <Chip icon={<WarningAmberIcon sx={{ fontSize: '12px !important' }} />} label={`High Value ≥ ₹${THRESHOLD.toLocaleString()}`} size="small" color="warning" sx={{ fontSize: '0.65rem', height: 18 }} />}
          </Box>
          {idx > 0 && !disabled && <IconButton size="small" onClick={delRow(arr, idx)} color="error"><DeleteOutlineIcon fontSize="small" /></IconButton>}
        </Box>
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth size="small" label="Description of Gift / Hospitality" value={item.description} onChange={setRow(arr, idx, 'description')} disabled={disabled} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Type of Gift</InputLabel>
              <Select value={item.giftType} onChange={setRow(arr, idx, 'giftType')} label="Type of Gift" disabled={disabled}>
                {GIFT_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField fullWidth size="small" label="Approx. Value (₹)" type="number" value={item.value} onChange={setRow(arr, idx, 'value')} disabled={disabled}
              sx={{ '& input': { color: isHighValue ? 'warning.dark' : 'inherit', fontWeight: isHighValue ? 700 : 400 } }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth size="small" label="Giver / Recipient Name" value={item.giverName} onChange={setRow(arr, idx, 'giverName')} disabled={disabled} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Giver Category</InputLabel>
              <Select value={item.giverType} onChange={setRow(arr, idx, 'giverType')} label="Giver Category" disabled={disabled}>
                {GIVER_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={2}>
            <TextField fullWidth size="small" label="Date" type="date" value={item.date} onChange={setRow(arr, idx, 'date')} InputLabelProps={{ shrink: true }} disabled={disabled} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Action Taken</InputLabel>
              <Select value={item.action} onChange={setRow(arr, idx, 'action')} label="Action Taken" disabled={disabled}>
                {ACTIONS.map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          {(item.action?.includes('approval') || item.action?.includes('Retained')) && (
            <Grid item xs={12} sm={6}>
              <TextField fullWidth size="small" label="Compliance Approval Reference No." value={item.approvalRef} onChange={setRow(arr, idx, 'approvalRef')} disabled={disabled} helperText="Required for approved exceptions" />
            </Grid>
          )}
        </Grid>
      </Box>
    )
  }

  return (
    <FormWrapper
      title="Gift, Hospitality & Bribery Register"
      description="Annual register of gifts, hospitality, and entertainment received or offered above the ₹2,000 threshold. Mandatory under the company's Anti-Bribery & Anti-Corruption Policy."
      icon={<CardGiftcardIcon />} iconColor="#00838f" iconBg="#e0f7fa"
      dueDate="Mar 31" status={status} submittedAt={existing?.submittedAt}
      submitting={submitting} onSubmit={handleSubmit}
    >
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2.5, fontSize: '0.82rem' }}>
        Declare all gifts/hospitality <strong>received or offered</strong> with a value of ₹2,000 or more during {form.fy}. Items below ₹2,000 need not be declared but should follow common sense. Gifts from/to government officials require disclosure regardless of value.
      </Alert>

      {/* Received Gifts */}
      <Paper elevation={0} sx={{ p: 3, mb: 2.5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>A. Gifts / Hospitality Received</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem', mb: 1 }}>
            Did you receive any gift, hospitality, or entertainment worth ₹2,000 or more during {form.fy}?
          </FormLabel>
          <RadioGroup row value={form.receivedGifts} onChange={set('receivedGifts')}>
            <FormControlLabel value="No" control={<Radio disabled={disabled} size="small" color="success" />} label={<Typography variant="body2">No</Typography>} />
            <FormControlLabel value="Yes" control={<Radio disabled={disabled} size="small" color="warning" />} label={<Typography variant="body2">Yes (please declare below)</Typography>} />
          </RadioGroup>
        </FormControl>
        {form.receivedGifts === 'Yes' && (
          <Box>
            {form.received.map((item, i) => <GiftRow key={i} arr="received" idx={i} item={item} />)}
            {!disabled && form.received.length < 10 && (
              <Button startIcon={<AddIcon />} size="small" variant="outlined" onClick={addRow('received')} sx={{ borderRadius: 2, mt: 0.5 }}>Add Entry</Button>
            )}
          </Box>
        )}
      </Paper>

      {/* Offered Gifts */}
      <Paper elevation={0} sx={{ p: 3, mb: 2.5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>B. Gifts / Hospitality Offered</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem', mb: 1 }}>
            Did you offer or arrange any gift, hospitality, or entertainment worth ₹2,000 or more on behalf of the company during {form.fy}?
          </FormLabel>
          <RadioGroup row value={form.offeredGifts} onChange={set('offeredGifts')}>
            <FormControlLabel value="No" control={<Radio disabled={disabled} size="small" color="success" />} label={<Typography variant="body2">No</Typography>} />
            <FormControlLabel value="Yes" control={<Radio disabled={disabled} size="small" />} label={<Typography variant="body2">Yes (please declare below)</Typography>} />
          </RadioGroup>
        </FormControl>
        {form.offeredGifts === 'Yes' && (
          <Box>
            {form.offered.map((item, i) => <GiftRow key={i} arr="offered" idx={i} item={item} />)}
            {!disabled && form.offered.length < 10 && (
              <Button startIcon={<AddIcon />} size="small" variant="outlined" onClick={addRow('offered')} sx={{ borderRadius: 2, mt: 0.5 }}>Add Entry</Button>
            )}
          </Box>
        )}
      </Paper>

      {/* Declaration */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Declaration & Signature</Typography>
        <Divider sx={{ mb: 2 }} />
        <Alert severity="warning" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.8rem' }}>
          I hereby declare that the above information is complete and accurate for {form.fy}. I confirm that no gifts or hospitality have been offered or received that could create a conflict of interest or compromise my professional judgment.
        </Alert>
        <FormControlLabel
          control={<Checkbox checked={form.declaration} onChange={set('declaration')} disabled={disabled} color="primary" />}
          label={<Typography variant="body2">I confirm the above Gift & Hospitality Register is complete and accurate. <span style={{ color: 'red' }}>*</span></Typography>}
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
