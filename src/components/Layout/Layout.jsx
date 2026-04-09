import React, { useState } from 'react'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Chip,
  Collapse,
  Toolbar,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ListAltIcon from '@mui/icons-material/ListAlt'
import BarChartIcon from '@mui/icons-material/BarChart'
import SettingsIcon from '@mui/icons-material/Settings'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import SecurityIcon from '@mui/icons-material/Security'
import BalanceIcon from '@mui/icons-material/Balance'
import LockIcon from '@mui/icons-material/Lock'
import PersonIcon from '@mui/icons-material/Person'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import HomeIcon from '@mui/icons-material/Home'
import GavelIcon from '@mui/icons-material/Gavel'
import GroupIcon from '@mui/icons-material/Group'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import { useApp } from '../../context/AppContext'

const DRAWER_WIDTH = 260

const FORMS = [
  { key: 'antiFraud', label: 'Anti-Fraud', path: '/form/anti-fraud', icon: <SecurityIcon fontSize="small" /> },
  { key: 'conflictOfInterest', label: 'Conflict of Interest', path: '/form/conflict-of-interest', icon: <BalanceIcon fontSize="small" /> },
  { key: 'nonDisclosure', label: 'Non-Disclosure', path: '/form/non-disclosure', icon: <LockIcon fontSize="small" /> },
  { key: 'hrDeclaration', label: 'HR Declaration', path: '/form/hr-declaration', icon: <PersonIcon fontSize="small" /> },
  { key: 'giftReward', label: 'Gift & Reward', path: '/form/gift-reward', icon: <CardGiftcardIcon fontSize="small" /> },
  { key: 'propertyDeclaration', label: 'Property Declaration', path: '/form/property-declaration', icon: <HomeIcon fontSize="small" /> },
  { key: 'codeOfConduct', label: 'Code of Conduct', path: '/form/code-of-conduct', icon: <GavelIcon fontSize="small" /> },
  { key: 'relativeEmployment', label: 'Relative Employment', path: '/form/relative-employment', icon: <GroupIcon fontSize="small" /> },
]

function StatusChip({ status }) {
  const map = {
    submitted: { label: 'Done', color: 'success' },
    pending: { label: 'Due', color: 'warning' },
    'not-due': { label: 'N/A', color: 'default' },
  }
  const { label, color } = map[status] || map['not-due']
  return (
    <Chip
      label={label}
      color={color}
      size="small"
      sx={{ fontSize: '0.6rem', height: 18, fontWeight: 700, borderRadius: 4 }}
    />
  )
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [formsOpen, setFormsOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const { formStatus } = useApp()

  const handleMenuToggle = () => setMobileOpen((prev) => !prev)
  const handleFormsToggle = () => setFormsOpen((prev) => !prev)

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Reports', path: '/reports', icon: <BarChartIcon /> },
    { label: 'Settings', path: '/settings', icon: <SettingsIcon /> },
  ]

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fafafa' }}>
      <Toolbar />
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
          Navigation
        </Typography>
      </Box>
      <List dense disablePadding>
        {navItems.map((item) => {
          const active = location.pathname === item.path
          return (
            <ListItem key={item.path} disablePadding sx={{ px: 1, mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={active}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: '#fff',
                    '& .MuiListItemIcon-root': { color: '#fff' },
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: active ? 'inherit' : 'primary.main' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: '0.875rem' }} />
              </ListItemButton>
            </ListItem>
          )
        })}

        {/* Forms section */}
        <ListItem disablePadding sx={{ px: 1, mb: 0.5 }}>
          <ListItemButton onClick={handleFormsToggle} sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ minWidth: 36, color: 'primary.main' }}>
              <ListAltIcon />
            </ListItemIcon>
            <ListItemText
              primary="All Forms"
              primaryTypographyProps={{ fontWeight: 500, fontSize: '0.875rem' }}
            />
            {formsOpen ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </ListItemButton>
        </ListItem>

        <Collapse in={formsOpen} timeout="auto">
          <List dense disablePadding>
            {FORMS.map((form) => {
              const status = formStatus(form.key)
              const active = location.pathname === form.path
              return (
                <ListItem key={form.key} disablePadding sx={{ pl: 2, pr: 1, mb: 0.25 }}>
                  <ListItemButton
                    onClick={() => navigate(form.path)}
                    selected={active}
                    sx={{
                      borderRadius: 2,
                      py: 0.5,
                      '&.Mui-selected': {
                        bgcolor: 'rgba(26,35,126,0.08)',
                        color: 'primary.main',
                        '& .MuiListItemIcon-root': { color: 'primary.main' },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 30, color: active ? 'primary.main' : 'text.secondary' }}>
                      {form.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={form.label}
                      primaryTypographyProps={{
                        fontSize: '0.78rem',
                        fontWeight: active ? 700 : 400,
                        noWrap: true,
                      }}
                    />
                    <StatusChip status={status} />
                  </ListItemButton>
                </ListItem>
              )
            })}
          </List>
        </Collapse>
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
          EDF Compliance System v1.0
        </Typography>
        <br />
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
          © 2026 UTI AMC. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar onMenuToggle={handleMenuToggle} />

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleMenuToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0,0,0,0.08)',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
