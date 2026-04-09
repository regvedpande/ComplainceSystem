import React from 'react'
import {
  Box,
  Paper,
  Typography,
  Chip,
  Avatar,
  Alert,
  Button,
  CircularProgress,
  Divider,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EventIcon from '@mui/icons-material/Event'
import SaveIcon from '@mui/icons-material/Save'
import SendIcon from '@mui/icons-material/Send'
import toast from 'react-hot-toast'

export default function FormWrapper({
  title,
  description,
  icon,
  iconColor,
  iconBg,
  dueDate,
  status,
  submittedAt,
  submitting,
  onSaveDraft,
  onSubmit,
  children,
}) {
  const isSubmitted = status === 'submitted'
  const isNotDue = status === 'not-due'

  return (
    <Box sx={{ pb: 10 }}>
      {/* Form Header */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
          color: '#fff',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute', right: -30, top: -30,
            width: 140, height: 140, borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.06)',
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar sx={{ bgcolor: iconBg || 'rgba(255,255,255,0.15)', width: 56, height: 56 }}>
            {React.cloneElement(icon, { sx: { color: iconColor || '#fff', fontSize: 28 } })}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mb: 1.5 }}>
              {description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<EventIcon sx={{ fontSize: '14px !important', color: 'rgba(255,255,255,0.8) !important' }} />}
                label={`Due: ${dueDate}`}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.72rem' }}
              />
              <Chip
                label={isSubmitted ? 'Submitted' : isNotDue ? 'Not Due' : 'Pending'}
                size="small"
                color={isSubmitted ? 'success' : isNotDue ? 'default' : 'warning'}
                sx={{ fontWeight: 700, fontSize: '0.72rem' }}
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      {isSubmitted && (
        <Alert
          icon={<CheckCircleIcon />}
          severity="success"
          sx={{ mb: 3, borderRadius: 2, fontWeight: 600 }}
        >
          This form was submitted on{' '}
          {submittedAt ? new Date(submittedAt).toLocaleString('en-IN') : '—'}.
          Below is a read-only view of your submission.
        </Alert>
      )}

      {isNotDue && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          This form is not due for the current period. It will become available when required by
          compliance team.
        </Alert>
      )}

      {/* Form content */}
      <Box sx={{ opacity: isNotDue ? 0.6 : 1, pointerEvents: isNotDue ? 'none' : 'auto' }}>
        {children}
      </Box>

      {/* Sticky bottom bar */}
      {!isNotDue && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            right: 0,
            left: { xs: 0, md: 260 },
            zIndex: 1200,
            p: 2,
            borderTop: '1px solid rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            bgcolor: '#fff',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
            borderRadius: 0,
          }}
        >
          {!isSubmitted && (
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={() => toast.success('Draft saved successfully')}
              sx={{ borderRadius: 2 }}
            >
              Save Draft
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
            onClick={onSubmit}
            disabled={isSubmitted || submitting}
            sx={{
              borderRadius: 2,
              background: isSubmitted
                ? undefined
                : 'linear-gradient(135deg, #1a237e, #283593)',
              minWidth: 140,
            }}
          >
            {isSubmitted ? 'Already Submitted' : submitting ? 'Submitting...' : 'Submit Form'}
          </Button>
        </Paper>
      )}
    </Box>
  )
}
