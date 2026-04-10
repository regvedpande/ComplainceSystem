import React, { useState } from 'react'
import {
  AppBar, Toolbar, IconButton, Typography, Box, Avatar,
  Badge, Tooltip, Menu, MenuItem, Divider, ListItemIcon, Chip,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ShieldIcon from '@mui/icons-material/Shield'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LogoutIcon from '@mui/icons-material/Logout'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { useNavigate } from 'react-router-dom'
import { useApp, COMPANY } from '../../context/AppContext'

const NOTIFS = [
  { msg: 'Asset & Liability Declaration due Apr 15', urgency: 'high' },
  { msg: 'Code of Conduct acknowledgment pending', urgency: 'medium' },
  { msg: 'KYE Annual update reminder', urgency: 'low' },
]

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const [notifAnchor, setNotifAnchor] = useState(null)

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const urgencyColor = { high: '#ef5350', medium: '#ff9800', low: '#66bb6a' }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: t => t.zIndex.drawer + 1,
        background: 'linear-gradient(135deg, #0d1560 0%, #1a237e 60%, #283593 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 1.5, sm: 2.5 } }}>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuToggle}
          sx={{ mr: 1, display: { md: 'none' } }}
          aria-label="open menu"
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mr: 2 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <ShieldIcon sx={{ fontSize: 20, color: '#80cbc4' }} />
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.1, color: '#fff', letterSpacing: 0.3, fontSize: '0.95rem' }}>
              {COMPANY.short}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.6rem', letterSpacing: 0.8, textTransform: 'uppercase' }}>
              {COMPANY.tagline}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton color="inherit" onClick={e => setNotifAnchor(e.currentTarget)} sx={{ mr: 0.5 }}>
            <Badge badgeContent={NOTIFS.length} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}>
              <NotificationsIcon sx={{ fontSize: 22 }} />
            </Badge>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={notifAnchor}
          open={Boolean(notifAnchor)}
          onClose={() => setNotifAnchor(null)}
          PaperProps={{ sx: { width: 320, mt: 1.5, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' } }}
        >
          <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <Typography variant="subtitle2" fontWeight={700}>Notifications</Typography>
            <Typography variant="caption" color="text.secondary">3 pending actions</Typography>
          </Box>
          {NOTIFS.map((n, i) => (
            <MenuItem key={i} onClick={() => setNotifAnchor(null)} sx={{ py: 1.5, px: 2.5 }}>
              <FiberManualRecordIcon sx={{ fontSize: 8, color: urgencyColor[n.urgency], mr: 1.5, flexShrink: 0 }} />
              <Typography variant="body2" sx={{ lineHeight: 1.4 }}>{n.msg}</Typography>
            </MenuItem>
          ))}
        </Menu>

        {/* User */}
        <Tooltip title="Account">
          <Box
            onClick={e => setAnchorEl(e.currentTarget)}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer',
              px: 1.2, py: 0.6, borderRadius: 2,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }, transition: 'background 0.2s' }}
          >
            <Avatar sx={{ bgcolor: '#00897b', width: 34, height: 34, fontSize: '0.82rem', fontWeight: 800, border: '2px solid rgba(255,255,255,0.25)' }}>
              {initials}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff', lineHeight: 1.2, fontSize: '0.82rem' }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.68rem' }}>
                {user?.employeeCode} · {user?.department}
              </Typography>
            </Box>
          </Box>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{ sx: { mt: 1.5, minWidth: 220, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' } }}
        >
          <Box sx={{ px: 2.5, py: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={800}>{user?.name}</Typography>
            <Typography variant="caption" color="text.secondary">{user?.designation}</Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip label={`Band ${user?.band}`} size="small" color="primary" sx={{ fontSize: '0.62rem', height: 18, mr: 0.5 }} />
              <Chip label={user?.department} size="small" sx={{ fontSize: '0.62rem', height: 18 }} />
            </Box>
          </Box>
          <Divider />
          <MenuItem onClick={() => { setAnchorEl(null); navigate('/dashboard') }} sx={{ py: 1.2 }}>
            <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
            Dashboard
          </MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); logout(); navigate('/dashboard') }} sx={{ color: 'error.main', py: 1.2 }}>
            <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
            Reset Demo
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
