import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ShieldIcon from '@mui/icons-material/Shield'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const [notifAnchor, setNotifAnchor] = useState(null)

  const handleUserMenuOpen = (e) => setAnchorEl(e.currentTarget)
  const handleUserMenuClose = () => setAnchorEl(null)
  const handleNotifOpen = (e) => setNotifAnchor(e.currentTarget)
  const handleNotifClose = () => setNotifAnchor(null)

  const handleLogout = () => {
    handleUserMenuClose()
    logout()
    navigate('/')
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
        boxShadow: '0 2px 12px rgba(26,35,126,0.4)',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuToggle}
          sx={{ mr: 1, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <ShieldIcon sx={{ fontSize: 28, mr: 1, color: '#80cbc4' }} />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.1, letterSpacing: 0.5 }}>
            EDF Compliance Portal
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', letterSpacing: 0.5 }}>
            UTI Asset Management Company
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton color="inherit" onClick={handleNotifOpen} sx={{ mr: 1 }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={notifAnchor}
          open={Boolean(notifAnchor)}
          onClose={handleNotifClose}
          PaperProps={{ sx: { width: 300, mt: 1.5 } }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" fontWeight={700}>Notifications</Typography>
          </Box>
          <Divider />
          {[
            { msg: 'Anti-Fraud form due by Apr 15', time: '2 hrs ago' },
            { msg: 'Code of Conduct acknowledgment pending', time: '1 day ago' },
            { msg: 'HR Declaration reminder', time: '2 days ago' },
          ].map((n, i) => (
            <MenuItem key={i} onClick={handleNotifClose} sx={{ whiteSpace: 'normal', py: 1.5 }}>
              <Box>
                <Typography variant="body2">{n.msg}</Typography>
                <Typography variant="caption" color="text.secondary">{n.time}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* User Avatar */}
        <Tooltip title={user?.name || 'User'}>
          <IconButton onClick={handleUserMenuOpen} sx={{ p: 0.5 }}>
            <Avatar
              sx={{
                bgcolor: '#00897b',
                width: 36,
                height: 36,
                fontSize: '0.85rem',
                fontWeight: 700,
                border: '2px solid rgba(255,255,255,0.3)',
              }}
            >
              {initials}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Box sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
            {user?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {user?.employeeCode}
          </Typography>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleUserMenuClose}
          PaperProps={{ sx: { mt: 1.5, minWidth: 200 } }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={700}>{user?.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.department} | {user?.band}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => { handleUserMenuClose(); navigate('/dashboard') }}>
            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
            My Dashboard
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
