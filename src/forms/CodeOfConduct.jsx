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
} from '@mui/material'
import GavelIcon from '@mui/icons-material/Gavel'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import { useApp } from '../context/AppContext'
import FormWrapper from '../components/FormWrapper'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const SECTIONS = [
  {
    id: 'workplaceEthics',
    title: '1. Workplace Ethics',
    icon: '🤝',
    text: `All employees are expected to conduct themselves with the highest standards of professional integrity. This includes treating colleagues, clients, and stakeholders with respect and fairness, avoiding any behaviour that could be considered harassment, discrimination, or bullying. Employees must act in the best interest of UTI AMC at all times and avoid any actions that may damage the company's reputation.`,
  },
  {
    id: 'infoSecurity',
    title: '2. Information Security',
    icon: '🔐',
    text: `Employees must protect all confidential, proprietary, and sensitive information belonging to UTI AMC, its clients, and employees. This includes proper handling of physical and digital data, following IT security protocols, using company systems only for authorised purposes, and promptly reporting any suspected security breach or data loss to the IT security team.`,
  },
  {
    id: 'socialMedia',
    title: '3. Social Media Policy',
    icon: '📱',
    text: `Employees must not post, share, or comment on social media in a manner that could harm UTI AMC's reputation or disclose confidential information. Employees must not represent themselves as official spokespersons of the company unless explicitly authorised. Personal opinions shared online must clearly not be attributed to UTI AMC.`,
  },
  {
    id: 'antiBribery',
    title: '4. Anti-Bribery Policy',
    icon: '⚖️',
    text: `UTI AMC has zero tolerance for bribery and corruption in any form. Employees must not offer, give, request, or receive any bribe, kickback, or improper payment — whether in cash or in kind — to or from any person or entity, including government officials, clients, vendors, or colleagues. Violations will result in immediate disciplinary action and may be reported to regulatory authorities.`,
  },
  {
    id: 'whistleblower',
    title: '5. Whistleblower Policy',
    icon: '📣',
    text: `Employees are encouraged to report genuine concerns about unethical behavior, fraud, or regulatory violations through UTI AMC's confidential whistleblower hotline. All reports will be investigated promptly and confidentially. UTI AMC strictly prohibits retaliation against any employee who reports concerns in good faith. Anonymous reporting is available.`,
  },
  {
    id: 'equalOpportunity',
    title: '6. Equal Opportunity & Inclusion',
    icon: '🌈',
    text: `UTI AMC is committed to providing equal employment opportunities to all individuals regardless of race, gender, religion, nationality, age, disability, or any other protected characteristic. We foster a diverse and inclusive workplace where all employees feel valued and respected. Discrimination of any form is strictly prohibited and subject to disciplinary action.`,
  },
]

export default function CodeOfConduct() {
  const { formStatus, submitForm, submissions } = useApp()
  const navigate = useNavigate()
  const status = formStatus('codeOfConduct')
  const existing = submissions.codeOfConduct

  const [form, setForm] = useState({
    acknowledged: existing?.acknowledged || {},
    masterAck: existing?.masterAck || false,
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

  const allAcked = SECTIONS.every((s) => form.acknowledged[s.id])

  const validate = () => {
    const e = {}
    if (!allAcked) e.sections = 'Please acknowledge all sections of the Code of Conduct'
    if (!form.masterAck) e.masterAck = 'You must confirm the master acknowledgment'
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
    submitForm('codeOfConduct', form)
    toast.success('Code of Conduct Acknowledgment submitted!')
    navigate('/dashboard')
    setSubmitting(false)
  }

  const disabled = status === 'submitted'

  return (
    <FormWrapper
      title="Code of Conduct Acknowledgment"
      description="Annual acknowledgment of UTI AMC's Code of Conduct, covering workplace ethics, data security, anti-bribery, and more."
      icon={<GavelIcon />}
      iconColor="#4527a0"
      iconBg="#ede7f6"
      dueDate="Apr 10, 2026"
      status={status}
      submittedAt={existing?.submittedAt}
      submitting={submitting}
      onSubmit={handleSubmit}
    >
      {errors.sections && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{errors.sections}</Alert>
      )}

      {/* Progress indicator */}
      <Paper sx={{ p: 2.5, mb: 2.5, borderRadius: 3, bgcolor: allAcked ? '#f1f8e9' : '#f8f9ff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <VerifiedUserIcon color={allAcked ? 'success' : 'disabled'} />
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>
              {SECTIONS.filter((s) => form.acknowledged[s.id]).length} of {SECTIONS.length} sections acknowledged
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Please read and acknowledge each section to proceed.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Individual Sections */}
      {SECTIONS.map((section) => {
        const acked = !!form.acknowledged[section.id]
        return (
          <Paper
            key={section.id}
            sx={{
              p: 3,
              mb: 2,
              borderRadius: 3,
              border: acked ? '1px solid #c8e6c9' : '1px solid rgba(0,0,0,0.1)',
              bgcolor: acked ? '#fafff8' : '#fff',
              transition: 'all 0.2s',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
              <Typography fontSize="1.3rem">{section.icon}</Typography>
              <Typography variant="subtitle1" fontWeight={700}>{section.title}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
              {section.text}
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
            <FormControlLabel
              control={
                <Checkbox
                  checked={acked}
                  onChange={() => !disabled && toggleSection(section.id)}
                  disabled={disabled}
                  color="success"
                />
              }
              label={
                <Typography variant="body2" fontWeight={acked ? 700 : 400} color={acked ? 'success.dark' : 'text.primary'}>
                  {acked ? '✓ I have read and acknowledge this section' : 'I have read and acknowledge this section'}
                </Typography>
              }
            />
          </Paper>
        )
      })}

      {/* Master Acknowledgment & Signature */}
      <Paper sx={{ p: 3, mb: 2.5, borderRadius: 3, bgcolor: '#f3e5f5', border: '1px solid #ce93d8' }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Master Acknowledgment & Signature
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Alert severity="info" sx={{ mb: 2, borderRadius: 2, fontSize: '0.82rem' }}>
          By signing below, you confirm that you have read, understood, and agree to comply with
          UTI AMC's complete Code of Conduct. Violations may result in disciplinary action up to
          and including termination of employment.
        </Alert>
        <FormControlLabel
          control={
            <Checkbox
              checked={form.masterAck}
              onChange={set('masterAck')}
              disabled={disabled || !allAcked}
              color="primary"
            />
          }
          label={
            <Typography variant="body2" fontWeight={600}>
              I acknowledge having read and understood the complete Code of Conduct and agree to
              abide by all its terms. <span style={{ color: 'red' }}>*</span>
            </Typography>
          }
        />
        {errors.masterAck && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, ml: 4 }}>
            {errors.masterAck}
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
