import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Divider,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { useApp } from '../context/AppContext'
import FormWrapper from '../components/FormWrapper'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const PERIODS = ['Annual 2026', 'Q1 2026', 'Q2 2026']

const NDA_SECTIONS = [
  {
    id: 'clientInfo',
    title: 'Confidentiality of Client Information',
    text: 'I acknowledge that all client information, including but not limited to personal data, investment preferences, account details, and financial records, is strictly confidential. I will not disclose, share, or misuse such information under any circumstance.',
  },
  {
    id: 'tradingStrategies',
    title: 'Proprietary Trading Strategies',
    text: 'I acknowledge the proprietary nature of trading strategies, portfolio construction methodologies, and investment models used by UTI AMC. I will not disclose these to any external party or use them for personal gain.',
  },
  {
    id: 'employeeData',
    title: 'Employee Personal Data',
    text: 'I acknowledge that employee data including compensation, performance reviews, personal details, and HR records is confidential and must not be shared outside authorised personnel.',
  },
  {
    id: 'itSystems',
    title: 'IT Systems and Access Credentials',
    text: 'I will not share my login credentials, passwords, or access tokens with any other individual. I acknowledge that all IT systems, software, and access rights are the property of UTI AMC.',
  },
  {
    id: 'regulatoryInfo',
    title: 'Regulatory and Compliance Information',
    text: 'I acknowledge that regulatory communications, compliance reports, audit findings, and related documentation are confidential and shall not be disclosed outside the organisation.',
  },
]

export default function NonDisclosure() {
  const { formStatus, submitForm, submissions } = useApp()
  const navigate = useNavigate()
  const status = formStatus('nonDisclosure')
  const existing = submissions.nonDisclosure

  const [form, setForm] = useState({
    period: existing?.period || 'Annual 2026',
    acknowledged: existing?.acknowledged || {},
    mainAck: existing?.mainAck || false,
    fileName: existing?.fileName || '',
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

  const toggleSection = (id) => {
    setForm((p) => ({ ...p, acknowledged: { ...p.acknowledged, [id]: !p.acknowledged[id] } }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setForm((p) => ({ ...p, fileName: file.name }))
  }

  const validate = () => {
    const e = {}
    const allAcked = NDA_SECTIONS.every((s) => form.acknowledged[s.id])
    if (!allAcked) e.sections = 'Please acknowledge all NDA sections'
    if (!form.mainAck) e.mainAck = 'You must accept the main acknowledgment'
    if (!form.signature.trim()) e.signature = 'Digital signature is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error('Please acknowledge all sections and fill required fields')
      return
    }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1000))
    submitForm('nonDisclosure', form)
    toast.success('Non-Disclosure Agreement Acknowledgment submitted!')
    navigate('/dashboard')
    setSubmitting(false)
  }

  const disabled = status === 'submitted'

  return (
    <FormWrapper
      title="Non-Disclosure Agreement Acknowledgment"
      description="Annual acknowledgment of NDA terms covering confidential information, proprietary data, and access credentials."
      icon={<LockIcon />}
      iconColor="#6a1b9a"
      iconBg="#f3e5f5"
      dueDate="Apr 20, 2026"
      status={status}
      submittedAt={existing?.submittedAt}
      submitting={submitting}
      onSubmit={handleSubmit}
    >
      {/* Period */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Declaration Period</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControl fullWidth>
          <InputLabel>Period</InputLabel>
          <Select value={form.period} onChange={set('period')} label="Period" disabled={disabled}>
            {PERIODS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
          </Select>
        </FormControl>
      </Paper>

      {/* NDA Sections */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>NDA Sections — Acknowledgment</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Please read each section carefully and check the box to acknowledge.
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {errors.sections && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{errors.sections}</Alert>
        )}
        {NDA_SECTIONS.map((section) => (
          <Box
            key={section.id}
            sx={{
              mb: 2,
              p: 2.5,
              borderRadius: 2,
              border: form.acknowledged[section.id]
                ? '1px solid #c8e6c9'
                : '1px solid rgba(0,0,0,0.12)',
              bgcolor: form.acknowledged[section.id] ? '#f1f8e9' : '#fafafa',
              transition: 'all 0.2s',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Checkbox
                checked={!!form.acknowledged[section.id]}
                onChange={() => !disabled && toggleSection(section.id)}
                disabled={disabled}
                color="success"
                sx={{ mt: -0.5 }}
              />
              <Box>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                  {section.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {section.text}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Paper>

      {/* Upload */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Upload Signed NDA</Typography>
        <Divider sx={{ mb: 2 }} />
        <Alert severity="info" sx={{ mb: 2, borderRadius: 2, fontSize: '0.82rem' }}>
          If you have a physically signed copy of the NDA, you may upload it here (optional).
        </Alert>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            component="label"
            variant="outlined"
            startIcon={<AttachFileIcon />}
            disabled={disabled}
            sx={{ borderRadius: 2 }}
          >
            Choose File
            <input type="file" hidden accept=".pdf,.jpg,.png" onChange={handleFileChange} />
          </Button>
          {form.fileName && (
            <Typography variant="body2" color="text.secondary">
              {form.fileName}
            </Typography>
          )}
          {!form.fileName && (
            <Typography variant="caption" color="text.disabled">
              No file chosen
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Declaration */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Signature & Final Acknowledgment</Typography>
        <Divider sx={{ mb: 2 }} />
        <FormControlLabel
          control={
            <Checkbox
              checked={form.mainAck}
              onChange={set('mainAck')}
              disabled={disabled}
              color="primary"
            />
          }
          label={
            <Typography variant="body2">
              I have read and I agree to all the NDA terms listed above. I understand that
              violation may result in disciplinary action and/or legal proceedings.{' '}
              <span style={{ color: 'red' }}>*</span>
            </Typography>
          }
        />
        {errors.mainAck && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, ml: 4 }}>
            {errors.mainAck}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 2, mt: 2.5, flexWrap: 'wrap' }}>
          <TextField
            label="Digital Signature *"
            value={form.signature}
            onChange={set('signature')}
            error={!!errors.signature}
            helperText={errors.signature || 'Type your full name as digital signature'}
            sx={{ flex: 2, minWidth: 200 }}
            disabled={disabled}
          />
          <TextField
            label="Date"
            type="date"
            value={form.date}
            sx={{ flex: 1, minWidth: 150 }}
            InputLabelProps={{ shrink: true }}
            disabled
          />
        </Box>
      </Paper>
    </FormWrapper>
  )
}
