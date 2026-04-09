import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  LinearProgress,
  Avatar,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material'
import SecurityIcon from '@mui/icons-material/Security'
import BalanceIcon from '@mui/icons-material/Balance'
import LockIcon from '@mui/icons-material/Lock'
import PersonIcon from '@mui/icons-material/Person'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import HomeIcon from '@mui/icons-material/Home'
import GavelIcon from '@mui/icons-material/Gavel'
import GroupIcon from '@mui/icons-material/Group'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'


const ALL_FORMS = [
  {
    key: 'antiFraud',
    label: 'Anti-Fraud Declaration',
    description: 'Declare awareness of fraudulent activities or misconduct',
    path: '/form/anti-fraud',
    icon: SecurityIcon,
    iconColor: '#e53935',
    bgColor: '#ffebee',
    dueDate: 'Apr 15, 2026',
  },
  {
    key: 'conflictOfInterest',
    label: 'Conflict of Interest',
    description: 'Disclose any personal interests that may conflict with duties',
    path: '/form/conflict-of-interest',
    icon: BalanceIcon,
    iconColor: '#1565c0',
    bgColor: '#e3f2fd',
    dueDate: 'Apr 15, 2026',
  },
  {
    key: 'nonDisclosure',
    label: 'Non-Disclosure Agreement',
    description: 'Acknowledge NDA terms for confidential information',
    path: '/form/non-disclosure',
    icon: LockIcon,
    iconColor: '#6a1b9a',
    bgColor: '#f3e5f5',
    dueDate: 'Apr 20, 2026',
  },
  {
    key: 'hrDeclaration',
    label: 'HR Annual Declaration',
    description: 'Verify and confirm personal details, nominees, and bank info',
    path: '/form/hr-declaration',
    icon: PersonIcon,
    iconColor: '#00695c',
    bgColor: '#e0f2f1',
    dueDate: 'Apr 30, 2026',
  },
  {
    key: 'giftReward',
    label: 'Gift & Reward Declaration',
    description: 'Declare any gifts or rewards received above threshold',
    path: '/form/gift-reward',
    icon: CardGiftcardIcon,
    iconColor: '#e65100',
    bgColor: '#fff3e0',
    dueDate: 'Not Due',
  },
  {
    key: 'propertyDeclaration',
    label: 'Property Declaration',
    description: 'Annual declaration of immovable and movable assets',
    path: '/form/property-declaration',
    icon: HomeIcon,
    iconColor: '#558b2f',
    bgColor: '#f1f8e9',
    dueDate: 'Apr 30, 2026',
  },
  {
    key: 'codeOfConduct',
    label: 'Code of Conduct',
    description: 'Acknowledge and affirm company code of conduct policies',
    path: '/form/code-of-conduct',
    icon: GavelIcon,
    iconColor: '#4527a0',
    bgColor: '#ede7f6',
    dueDate: 'Apr 10, 2026',
  },
  {
    key: 'relativeEmployment',
    label: 'Relative Employment',
    description: 'Declare family members in financial services industry',
    path: '/form/relative-employment',
    icon: GroupIcon,
    iconColor: '#00838f',
    bgColor: '#e0f7fa',
    dueDate: 'Not Due',
  },
]

function StatusChip({ status }) {
  const map = {
    submitted: { label: 'Submitted', color: 'success', icon: <CheckCircleIcon sx={{ fontSize: '14px !important' }} /> },
    pending: { label: 'Pending', color: 'warning', icon: <PendingActionsIcon sx={{ fontSize: '14px !important' }} /> },
    'not-due': { label: 'Not Due', color: 'default', icon: <DoNotDisturbIcon sx={{ fontSize: '14px !important' }} /> },
  }
  const { label, color, icon } = map[status] || map['not-due']
  return <Chip label={label} color={color} size="small" icon={icon} sx={{ fontWeight: 700, fontSize: '0.72rem' }} />
}

function StatCard({ title, value, icon, gradient, subtitle }) {
  return (
    <Card sx={{ height: '100%', background: gradient, color: '#fff', borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1 }}>
              {value}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9, fontWeight: 600 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ opacity: 0.75 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { user, formStatus, submissions } = useApp()
  const navigate = useNavigate()

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const counts = ALL_FORMS.reduce(
    (acc, f) => {
      const s = formStatus(f.key)
      acc[s] = (acc[s] || 0) + 1
      return acc
    },
    { submitted: 0, pending: 0, 'not-due': 0 }
  )

  const dueForms = ALL_FORMS.filter((f) => formStatus(f.key) !== 'not-due').length
  const progress = dueForms > 0 ? Math.round((counts.submitted / dueForms) * 100) : 0

  const recentActivity = ALL_FORMS
    .filter((f) => submissions[f.key])
    .map((f) => ({ ...f, submission: submissions[f.key] }))
    .sort((a, b) => new Date(b.submission.submittedAt) - new Date(a.submission.submittedAt))
    .slice(0, 5)

  return (
    <Box>
      {/* Welcome Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a237e 0%, #283593 60%, #00695c 100%)',
          borderRadius: 3,
          p: { xs: 2.5, md: 3.5 },
          mb: 3,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute', right: -40, top: -40,
            width: 200, height: 200,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.06)',
          }}
        />
        <Box
          sx={{
            position: 'absolute', right: 20, top: 20,
            width: 120, height: 120,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.06)',
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
          Welcome back, {user?.name} 👋
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
          {today}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={user?.department}
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600 }}
          />
          <Chip
            label={user?.designation}
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600 }}
          />
          <Chip
            label={`Band: ${user?.band}`}
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600 }}
          />
          <Chip
            label={user?.employeeCode}
            size="small"
            sx={{ bgcolor: 'rgba(0,137,123,0.35)', color: '#80cbc4', fontWeight: 600 }}
          />
        </Box>
      </Box>

      {/* Stats Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <StatCard
            title="Total Forms"
            value={8}
            icon={<AssignmentTurnedInIcon sx={{ color: '#fff' }} />}
            gradient="linear-gradient(135deg, #1a237e, #534bae)"
            subtitle="This cycle"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            title="Submitted"
            value={counts.submitted}
            icon={<TaskAltIcon sx={{ color: '#fff' }} />}
            gradient="linear-gradient(135deg, #1b5e20, #388e3c)"
            subtitle="Completed"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            title="Pending"
            value={counts.pending}
            icon={<PendingActionsIcon sx={{ color: '#fff' }} />}
            gradient="linear-gradient(135deg, #bf360c, #e64a19)"
            subtitle="Action needed"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <StatCard
            title="Not Due"
            value={counts['not-due']}
            icon={<DoNotDisturbIcon sx={{ color: '#fff' }} />}
            gradient="linear-gradient(135deg, #37474f, #546e7a)"
            subtitle="This quarter"
          />
        </Grid>
      </Grid>

      {/* Progress Bar */}
      <Paper sx={{ p: 2.5, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Compliance Progress
          </Typography>
          <Typography variant="subtitle1" fontWeight={700} color={progress === 100 ? 'success.main' : 'warning.main'}>
            {progress}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: 'rgba(0,0,0,0.08)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              background:
                progress === 100
                  ? 'linear-gradient(90deg, #1b5e20, #43a047)'
                  : 'linear-gradient(90deg, #1a237e, #00897b)',
            },
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {counts.submitted} of {dueForms} due forms submitted this compliance cycle
        </Typography>
      </Paper>

      {/* Form Cards Grid */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Compliance Forms
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {ALL_FORMS.map((form) => {
          const status = formStatus(form.key)
          const Icon = form.icon
          const sub = submissions[form.key]
          const isSubmitted = status === 'submitted'
          const isNotDue = status === 'not-due'
          return (
            <Grid item xs={12} sm={6} lg={4} xl={3} key={form.key}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: isSubmitted || isNotDue ? 'none' : 'translateY(-4px)',
                    boxShadow: isSubmitted || isNotDue ? undefined : '0 8px 24px rgba(0,0,0,0.15)',
                  },
                  opacity: isNotDue ? 0.7 : 1,
                  border: isSubmitted ? '1px solid #c8e6c9' : '1px solid transparent',
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Avatar sx={{ bgcolor: form.bgColor, width: 44, height: 44 }}>
                      <Icon sx={{ color: form.iconColor, fontSize: 22 }} />
                    </Avatar>
                    <StatusChip status={status} />
                  </Box>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    {form.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                    {form.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: isNotDue ? 'text.disabled' : 'text.secondary' }}>
                      Due: {form.dueDate}
                    </Typography>
                  </Box>
                  {isSubmitted && sub && (
                    <Box sx={{ mt: 1, p: 1, bgcolor: '#f1f8e9', borderRadius: 1.5 }}>
                      <Typography variant="caption" color="success.main" fontWeight={600}>
                        ✓ Submitted on {new Date(sub.submittedAt).toLocaleDateString('en-IN')}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
                <Box sx={{ px: 2.5, pb: 2 }}>
                  <Button
                    variant={isSubmitted ? 'outlined' : 'contained'}
                    fullWidth
                    size="small"
                    disabled={isSubmitted || isNotDue}
                    onClick={() => navigate(form.path)}
                    color={isSubmitted ? 'success' : 'primary'}
                    sx={{ borderRadius: 2 }}
                  >
                    {isSubmitted ? 'Submitted' : isNotDue ? 'Not Due' : 'Fill Form'}
                  </Button>
                </Box>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Recent Activity */}
      <Paper sx={{ p: 2.5, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Recent Activity
        </Typography>
        <Divider sx={{ mb: 1.5 }} />
        {recentActivity.length === 0 ? (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No forms submitted yet. Start with the forms above.
            </Typography>
          </Box>
        ) : (
          <List dense disablePadding>
            {recentActivity.map((item) => {
              const Icon = item.icon
              return (
                <ListItem key={item.key} disablePadding sx={{ mb: 1 }}>
                  <ListItemAvatar sx={{ minWidth: 44 }}>
                    <Avatar sx={{ bgcolor: item.bgColor, width: 36, height: 36 }}>
                      <Icon sx={{ color: item.iconColor, fontSize: 18 }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight={600}>{item.label}</Typography>
                        <Chip label="Submitted" color="success" size="small" sx={{ fontSize: '0.65rem', height: 18 }} />
                      </Box>
                    }
                    secondary={`Submitted on ${new Date(item.submission.submittedAt).toLocaleString('en-IN')}`}
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
