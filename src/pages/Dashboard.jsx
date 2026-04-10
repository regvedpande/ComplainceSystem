import React from 'react'
import {
  Box, Card, CardContent, Typography, Grid, Chip, Button,
  LinearProgress, Avatar, Divider, Paper, List, ListItem,
  ListItemAvatar, ListItemText, Tooltip,
} from '@mui/material'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import BalanceIcon from '@mui/icons-material/Balance'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import WcIcon from '@mui/icons-material/Wc'
import BadgeIcon from '@mui/icons-material/Badge'
import GavelIcon from '@mui/icons-material/Gavel'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import LockClockIcon from '@mui/icons-material/LockClock'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { useNavigate } from 'react-router-dom'
import { useApp, getFiscalYear, getNextUnlockDate, COMPANY } from '../context/AppContext'
import { ALL_FORMS } from '../components/Layout/Layout'

const FORM_META = {
  assetLiability:     { dueDate: 'Apr 30',  desc: 'Annual disclosure of assets, liabilities & investments under SEBI mandate' },
  conflictOfInterest: { dueDate: 'Apr 15',  desc: 'Disclose personal or financial interests conflicting with company duties' },
  insiderTrading:     { dueDate: 'Apr 10',  desc: 'SEBI UPSI compliance — acknowledge insider trading policies & trading window' },
  amlDeclaration:     { dueDate: 'Apr 15',  desc: 'Anti-Money Laundering self-declaration and source-of-funds confirmation' },
  poshAcknowledgment: { dueDate: 'Apr 30',  desc: 'Prevention of Sexual Harassment policy acknowledgment (PoSH Act 2013)' },
  kyeDeclaration:     { dueDate: 'Apr 30',  desc: 'Annual KYE update — personal details, emergency contacts & nominee info' },
  codeOfConduct:      { dueDate: 'Apr 10',  desc: 'Acknowledge company ethics, information security & anti-bribery policies' },
  giftHospitality:    { dueDate: 'Mar 31',  desc: 'Register gifts/hospitality received above ₹2,000 threshold this fiscal year' },
}

function StatusBadge({ status }) {
  if (status === 'submitted-locked')   return <Chip icon={<CheckCircleIcon sx={{ fontSize: '13px !important' }} />} label="Submitted" color="success" size="small" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
  if (status === 'submitted-unlocked') return <Chip icon={<AutorenewIcon   sx={{ fontSize: '13px !important' }} />} label="Re-open"   color="info"    size="small" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
  return <Chip icon={<PendingActionsIcon sx={{ fontSize: '13px !important' }} />} label="Pending" color="warning" size="small" sx={{ fontWeight: 700, fontSize: '0.7rem' }} />
}

function StatCard({ title, value, icon, gradient, sub }) {
  return (
    <Card sx={{ background: gradient, color: '#fff', borderRadius: 2, border: 'none', height: '100%' }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1, fontSize: { xs: '2rem', sm: '2.4rem' } }}>{value}</Typography>
            <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600, opacity: 0.95, fontSize: { xs: '0.78rem', sm: '0.85rem' } }}>{title}</Typography>
            {sub && <Typography variant="caption" sx={{ opacity: 0.7 }}>{sub}</Typography>}
          </Box>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.18)', width: 44, height: 44 }}>{icon}</Avatar>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { user, formStatus, submissions } = useApp()
  const navigate = useNavigate()
  const fy = getFiscalYear()

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const counts = ALL_FORMS.reduce((acc, f) => {
    const s = formStatus(f.key)
    if (s === 'submitted-locked') acc.submitted++
    else if (s === 'submitted-unlocked') acc.reopen++
    else acc.pending++
    return acc
  }, { submitted: 0, pending: 0, reopen: 0 })

  const dueCount = ALL_FORMS.filter(f => formStatus(f.key) !== 'submitted-locked').length
  const progress = dueCount > 0 ? Math.round((counts.submitted / ALL_FORMS.length) * 100) : 100

  const recent = ALL_FORMS
    .filter(f => submissions[f.key])
    .map(f => ({ ...f, sub: submissions[f.key] }))
    .sort((a, b) => new Date(b.sub.submittedAt) - new Date(a.sub.submittedAt))
    .slice(0, 5)

  return (
    <Box>
      {/* Welcome Banner */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #0d1560 0%, #1a237e 55%, #00695c 100%)',
          borderRadius: 2, p: { xs: 2.5, sm: 3.5 }, mb: 3, color: '#fff',
          position: 'relative', overflow: 'hidden', border: 'none',
        }}
      >
        {[200, 130, 70].map((s, i) => (
          <Box key={i} sx={{ position: 'absolute', right: -s / 2.5, top: -s / 2.5, width: s, height: s, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        ))}
        <Box sx={{ display: 'flex', alignItems: { sm: 'center' }, justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.25, fontSize: { xs: '1.15rem', sm: '1.35rem' } }}>
              Welcome, {user?.name?.split(' ')[0]} 👋
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.75, mb: 1.5 }}>{today}</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[user?.department, user?.designation, `Band ${user?.band}`, user?.employeeCode].map((l, i) => (
                <Chip key={i} label={l} size="small"
                  sx={{ bgcolor: i === 3 ? 'rgba(0,137,123,0.35)' : 'rgba(255,255,255,0.13)', color: i === 3 ? '#80cbc4' : '#fff', fontWeight: 600, fontSize: '0.7rem' }}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Chip
              icon={<CalendarTodayIcon sx={{ fontSize: '13px !important', color: '#80cbc4 !important' }} />}
              label={fy}
              sx={{ bgcolor: 'rgba(0,137,123,0.25)', color: '#80cbc4', fontWeight: 700, mb: 0.5 }}
            />
            <Typography variant="caption" sx={{ display: 'block', opacity: 0.65, fontSize: '0.7rem' }}>
              {COMPANY.name}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { title: 'Total Forms',  value: 8,              gradient: 'linear-gradient(135deg,#1a237e,#534bae)', sub: fy, icon: <AssignmentTurnedInIcon sx={{ color: '#fff' }} /> },
          { title: 'Submitted',    value: counts.submitted, gradient: 'linear-gradient(135deg,#1b5e20,#388e3c)', sub: 'Locked ✓',     icon: <CheckCircleIcon    sx={{ color: '#fff' }} /> },
          { title: 'Pending',      value: counts.pending,  gradient: 'linear-gradient(135deg,#bf360c,#e64a19)', sub: 'Action needed', icon: <PendingActionsIcon sx={{ color: '#fff' }} /> },
          { title: 'Re-submittable', value: counts.reopen, gradient: 'linear-gradient(135deg,#01579b,#0288d1)', sub: 'New FY open',   icon: <AutorenewIcon      sx={{ color: '#fff' }} /> },
        ].map(c => (
          <Grid item xs={6} md={3} key={c.title}>
            <StatCard {...c} />
          </Grid>
        ))}
      </Grid>

      {/* Progress */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>Compliance Progress — {fy}</Typography>
          <Typography variant="subtitle1" fontWeight={800} color={progress === 100 ? 'success.main' : progress >= 50 ? 'primary.main' : 'warning.main'}>
            {progress}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 10, borderRadius: 5, bgcolor: 'rgba(0,0,0,0.07)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              background: progress === 100
                ? 'linear-gradient(90deg,#1b5e20,#43a047)'
                : 'linear-gradient(90deg,#1a237e,#00897b)',
            },
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: 'block' }}>
          {counts.submitted} of {ALL_FORMS.length} forms submitted this compliance cycle
        </Typography>
      </Paper>

      {/* Form Cards */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>Compliance Forms</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {ALL_FORMS.map(form => {
          const status = formStatus(form.key)
          const sub = submissions[form.key]
          const locked = status === 'submitted-locked'
          const reopen = status === 'submitted-unlocked'
          const pending = status === 'pending'
          const Icon = form.icon
          const meta = FORM_META[form.key]
          const nextUnlock = sub ? getNextUnlockDate(sub.submittedAt) : null

          return (
            <Grid item xs={12} sm={6} lg={4} xl={3} key={form.key}>
              <Card
                sx={{
                  height: '100%', display: 'flex', flexDirection: 'column',
                  transition: 'transform 0.18s, box-shadow 0.18s',
                  '&:hover': pending || reopen ? { transform: 'translateY(-3px)', boxShadow: '0 8px 28px rgba(0,0,0,0.13)' } : {},
                  border: locked ? '1.5px solid #c8e6c9' : reopen ? '1.5px solid #b3e5fc' : '1.5px solid transparent',
                  opacity: locked ? 0.92 : 1,
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Avatar sx={{ bgcolor: form.bg, width: 42, height: 42 }}>
                      <Icon sx={{ color: form.color, fontSize: 21 }} />
                    </Avatar>
                    <StatusBadge status={status} />
                  </Box>
                  <Typography variant="subtitle2" fontWeight={800} gutterBottom sx={{ lineHeight: 1.3 }}>
                    {FORM_META[form.key] ? form.label : form.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5, lineHeight: 1.45 }}>
                    {meta.desc}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarTodayIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                    <Typography variant="caption" color={locked ? 'success.main' : 'text.secondary'} fontWeight={locked ? 600 : 400}>
                      {locked
                        ? `Next: Apr 1, ${nextUnlock?.getFullYear()}`
                        : `Due: ${meta.dueDate}`}
                    </Typography>
                  </Box>
                  {locked && sub && (
                    <Box sx={{ mt: 1.2, p: 1, bgcolor: '#f1f8e9', borderRadius: 2 }}>
                      <Typography variant="caption" color="success.dark" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LockClockIcon sx={{ fontSize: 12 }} />
                        Submitted {new Date(sub.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <Box sx={{ px: 2.5, pb: 2.5 }}>
                  <Tooltip title={locked ? `Locked until Apr 1, ${nextUnlock?.getFullYear()}` : ''}>
                    <span style={{ display: 'block' }}>
                      <Button
                        variant={locked ? 'outlined' : 'contained'}
                        fullWidth size="small"
                        disabled={locked}
                        onClick={() => navigate(form.path)}
                        color={reopen ? 'info' : 'primary'}
                        sx={{
                          borderRadius: 2.5,
                          background: locked ? undefined : reopen ? undefined : 'linear-gradient(135deg,#1a237e,#283593)',
                          '&:not(:disabled):hover': { background: locked || reopen ? undefined : 'linear-gradient(135deg,#0d1560,#1a237e)' },
                        }}
                      >
                        {locked ? '🔒 Submitted' : reopen ? 'Re-Submit Now' : 'Fill Form →'}
                      </Button>
                    </span>
                  </Tooltip>
                </Box>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Recent Activity */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>Recent Activity</Typography>
        <Divider sx={{ mb: 1.5 }} />
        {recent.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <PendingActionsIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">No forms submitted yet this fiscal year.</Typography>
            <Typography variant="caption" color="text.disabled">Start with the compliance forms above.</Typography>
          </Box>
        ) : (
          <List dense disablePadding>
            {recent.map(item => {
              const Icon = item.icon
              return (
                <ListItem key={item.key} disablePadding sx={{ mb: 0.75 }}>
                  <ListItemAvatar sx={{ minWidth: 42 }}>
                    <Avatar sx={{ bgcolor: item.bg, width: 34, height: 34 }}>
                      <Icon sx={{ color: item.color, fontSize: 16 }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="body2" fontWeight={700}>{item.label}</Typography>
                      <Chip label="Submitted" color="success" size="small" sx={{ fontSize: '0.62rem', height: 17 }} />
                    </Box>}
                    secondary={`${new Date(item.sub.submittedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} · ${item.sub.fiscalYear || ''}`}
                    secondaryTypographyProps={{ fontSize: '0.72rem' }}
                  />
                </ListItem>
              )
            })}
          </List>
        )}
      </Paper>
    </Box>
  )
}
