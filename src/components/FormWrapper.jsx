import React from 'react'
import { Box, Paper, Typography, Chip, Avatar, Alert, Button, CircularProgress, Divider, Tooltip } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EventIcon from '@mui/icons-material/Event'
import LockClockIcon from '@mui/icons-material/LockClock'
import SaveIcon from '@mui/icons-material/Save'
import SendIcon from '@mui/icons-material/Send'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { getNextUnlockDate } from '../context/AppContext'

export default function FormWrapper({
  title, description, icon, iconColor, iconBg,
  dueDate, status, submittedAt, submitting, onSubmit, children,
}) {
  const navigate = useNavigate()
  const isLocked = status === 'submitted-locked'
  const canResubmit = status === 'submitted-unlocked'

  const nextUnlock = submittedAt ? getNextUnlockDate(submittedAt) : null
  const nextUnlockStr = nextUnlock
    ? nextUnlock.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : null

  return (
    <Box sx={{ pb: { xs: 10, md: 10 } }}>
      {/* Back button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dashboard')}
        size="small"
        sx={{ mb: 2, color: 'text.secondary', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
      >
        Back to Dashboard
      </Button>

      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3 },
          mb: 3,
          background: 'linear-gradient(135deg, #0d1560 0%, #1a237e 60%, #283593 100%)',
          color: '#fff',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          border: 'none',
        }}
      >
        {[160, 100, 60].map((size, i) => (
          <Box key={i} sx={{
            position: 'absolute', right: -size / 3, top: -size / 3,
            width: size, height: size, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.06)',
            pointerEvents: 'none',
          }} />
        ))}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, position: 'relative' }}>
          <Avatar sx={{ bgcolor: iconBg || 'rgba(255,255,255,0.15)', width: 52, height: 52, flexShrink: 0 }}>
            {React.cloneElement(icon, { sx: { color: iconColor || '#fff', fontSize: 26 } })}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h6" fontWeight={800} gutterBottom sx={{ lineHeight: 1.2, fontSize: { xs: '1rem', sm: '1.15rem' } }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1.5, lineHeight: 1.5 }}>{description}</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<EventIcon sx={{ fontSize: '13px !important', color: 'rgba(255,255,255,0.8) !important' }} />}
                label={`Due: ${dueDate}`}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.7rem' }}
              />
              {isLocked && (
                <Chip
                  icon={<LockClockIcon sx={{ fontSize: '13px !important', color: '#80cbc4 !important' }} />}
                  label={`Next: ${nextUnlockStr}`}
                  size="small"
                  sx={{ bgcolor: 'rgba(0,137,123,0.3)', color: '#80cbc4', fontSize: '0.7rem' }}
                />
              )}
              {!isLocked && !canResubmit && (
                <Chip label="Pending" size="small" color="warning" sx={{ fontSize: '0.7rem', fontWeight: 700 }} />
              )}
              {canResubmit && (
                <Chip label="Re-submission Open" size="small" color="success" sx={{ fontSize: '0.7rem', fontWeight: 700 }} />
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Submitted & locked alert */}
      {isLocked && (
        <Alert
          icon={<LockClockIcon />}
          severity="success"
          sx={{ mb: 3, borderRadius: 2.5, '& .MuiAlert-message': { fontWeight: 500 } }}
        >
          <strong>Submitted successfully</strong> on {new Date(submittedAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}.
          {' '}Re-submission is locked until <strong>{nextUnlockStr}</strong> (start of the next Indian fiscal year).
        </Alert>
      )}

      {canResubmit && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2.5 }}>
          A new fiscal year has started. You can now submit this form again for the current year.
        </Alert>
      )}

      {/* Content */}
      <Box sx={{ pointerEvents: isLocked ? 'none' : 'auto', opacity: isLocked ? 0.75 : 1 }}>
        {children}
      </Box>

      {/* Sticky bottom bar */}
      <Paper
        elevation={4}
        sx={{
          position: 'fixed', bottom: 0, right: 0,
          left: { xs: 0, md: 256 },
          zIndex: 1100, px: { xs: 2, sm: 3 }, py: 1.5,
          borderTop: '1px solid rgba(0,0,0,0.07)',
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
          gap: 1.5, bgcolor: '#fff', borderRadius: 0,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ mr: 'auto', display: { xs: 'none', sm: 'block' } }}>
          {isLocked ? `Locked until ${nextUnlockStr}` : 'All fields marked * are required'}
        </Typography>
        {!isLocked && (
          <Button
            variant="outlined"
            startIcon={<SaveIcon fontSize="small" />}
            onClick={() => toast.success('Draft saved locally')}
            size="small"
            sx={{ borderRadius: 2.5 }}
          >
            Save Draft
          </Button>
        )}
        <Tooltip title={isLocked ? `Locked until ${nextUnlockStr}` : ''}>
          <span>
            <Button
              variant="contained"
              startIcon={submitting ? <CircularProgress size={15} color="inherit" /> : <SendIcon fontSize="small" />}
              onClick={onSubmit}
              disabled={isLocked || submitting}
              size="small"
              sx={{
                borderRadius: 2.5, minWidth: 130,
                background: isLocked ? undefined : 'linear-gradient(135deg, #1a237e, #283593)',
                '&:not(:disabled):hover': { background: 'linear-gradient(135deg, #0d1560, #1a237e)' },
              }}
            >
              {isLocked ? 'Locked' : submitting ? 'Submitting…' : canResubmit ? 'Re-Submit' : 'Submit Form'}
            </Button>
          </span>
        </Tooltip>
      </Paper>
    </Box>
  )
}
