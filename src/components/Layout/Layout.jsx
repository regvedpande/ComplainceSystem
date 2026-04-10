import React, { useState } from 'react'
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Divider, Typography, Chip, Collapse, Toolbar,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BarChartIcon from '@mui/icons-material/BarChart'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import BalanceIcon from '@mui/icons-material/Balance'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import WcIcon from '@mui/icons-material/Wc'
import BadgeIcon from '@mui/icons-material/Badge'
import GavelIcon from '@mui/icons-material/Gavel'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import ListAltIcon from '@mui/icons-material/ListAlt'
import LockIcon from '@mui/icons-material/Lock'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import { useApp, COMPANY } from '../../context/AppContext'

const DRAWER_WIDTH = 256

export const ALL_FORMS = [
  { key: 'assetLiability',      label: 'Asset & Liability',       path: '/form/asset-liability',       icon: AccountBalanceIcon, color: '#1565c0', bg: '#e3f2fd' },
  { key: 'conflictOfInterest',  label: 'Conflict of Interest',    path: '/form/conflict-of-interest',  icon: BalanceIcon,        color: '#6a1b9a', bg: '#f3e5f5' },
  { key: 'insiderTrading',      label: 'Insider Trading',         path: '/form/insider-trading',       icon: TrendingUpIcon,     color: '#e53935', bg: '#ffebee' },
  { key: 'amlDeclaration',      label: 'AML Declaration',         path: '/form/aml-declaration',       icon: VerifiedUserIcon,   color: '#00695c', bg: '#e0f2f1' },
  { key: 'poshAcknowledgment',  label: 'POSH Policy',             path: '/form/posh-acknowledgment',   icon: WcIcon,             color: '#f57c00', bg: '#fff3e0' },
  { key: 'kyeDeclaration',      label: 'KYE Declaration',         path: '/form/kye-declaration',       icon: BadgeIcon,          color: '#558b2f', bg: '#f1f8e9' },
  { key: 'codeOfConduct',       label: 'Code of Conduct',         path: '/form/code-of-conduct',       icon: GavelIcon,          color: '#4527a0', bg: '#ede7f6' },
  { key: 'giftHospitality',     label: 'Gift & Hospitality',      path: '/form/gift-hospitality',      icon: CardGiftcardIcon,   color: '#00838f', bg: '#e0f7fa' },
]

function StatusChip({ status }) {
  if (status === 'submitted-locked')   return <Chip label="Done" color="success" size="small" sx={{ fontSize: '0.6rem', height: 17, fontWeight: 700 }} />
  if (status === 'submitted-unlocked') return <Chip label="Redo" color="info"    size="small" sx={{ fontSize: '0.6rem', height: 17, fontWeight: 700 }} />
  return <Chip label="Due" color="warning" size="small" sx={{ fontSize: '0.6rem', height: 17, fontWeight: 700 }} />
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [formsOpen, setFormsOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const { formStatus } = useApp()

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon fontSize="small" /> },
    { label: 'Reports',   path: '/reports',   icon: <BarChartIcon fontSize="small" /> },
  ]

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />

      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', fontSize: '0.65rem' }}>
          Main Menu
        </Typography>
      </Box>

      <List dense disablePadding>
        {navItems.map(item => {
          const active = location.pathname === item.path
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => { navigate(item.path); setMobileOpen(false) }}
                selected={active}
                sx={{
                  mx: 1, borderRadius: 2.5, mb: 0.25,
                  '&.Mui-selected': { bgcolor: 'primary.main', color: '#fff', '& .MuiListItemIcon-root': { color: '#fff' }, '&:hover': { bgcolor: 'primary.dark' } },
                  '&:not(.Mui-selected):hover': { bgcolor: 'rgba(26,35,126,0.06)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 34, color: active ? 'inherit' : 'primary.main' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: active ? 700 : 500 }} />
              </ListItemButton>
            </ListItem>
          )
        })}

        <Divider sx={{ mx: 2, my: 1 }} />
        <Box sx={{ px: 2, pb: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', fontSize: '0.65rem' }}>
            Compliance Forms
          </Typography>
        </Box>

        <ListItem disablePadding>
          <ListItemButton onClick={() => setFormsOpen(p => !p)} sx={{ mx: 1, borderRadius: 2.5, mb: 0.25, '&:hover': { bgcolor: 'rgba(26,35,126,0.06)' } }}>
            <ListItemIcon sx={{ minWidth: 34, color: 'primary.main' }}><ListAltIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary="All Forms" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
            {formsOpen ? <ExpandLess fontSize="small" sx={{ color: 'text.secondary' }} /> : <ExpandMore fontSize="small" sx={{ color: 'text.secondary' }} />}
          </ListItemButton>
        </ListItem>

        <Collapse in={formsOpen}>
          <List dense disablePadding>
            {ALL_FORMS.map(form => {
              const status = formStatus(form.key)
              const active = location.pathname === form.path
              const Icon = form.icon
              return (
                <ListItem key={form.key} disablePadding>
                  <ListItemButton
                    onClick={() => { navigate(form.path); setMobileOpen(false) }}
                    selected={active}
                    sx={{
                      ml: 2, mr: 1, borderRadius: 2.5, mb: 0.25, py: 0.6,
                      '&.Mui-selected': { bgcolor: 'rgba(26,35,126,0.08)', color: 'primary.main', '& .MuiListItemIcon-root': { color: 'primary.main' } },
                      '&:not(.Mui-selected):hover': { bgcolor: 'rgba(26,35,126,0.04)' },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <Box sx={{ width: 24, height: 24, borderRadius: 1.5, bgcolor: form.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon sx={{ fontSize: 14, color: form.color }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={form.label}
                      primaryTypographyProps={{ fontSize: '0.78rem', fontWeight: active ? 700 : 400, noWrap: true }}
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
      <Divider sx={{ mx: 2 }} />
      <Box sx={{ px: 2.5, py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
          <LockIcon sx={{ fontSize: 11, color: 'success.main' }} />
          <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'success.main', fontWeight: 600 }}>Secure Portal</Typography>
        </Box>
        <Typography variant="caption" sx={{ fontSize: '0.63rem', color: 'text.disabled', display: 'block' }}>
          {COMPANY.name}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: '0.63rem', color: 'text.disabled' }}>
          Compliance Portal v2.0
        </Typography>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar onMenuToggle={() => setMobileOpen(p => !p)} />

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' } }}
        open
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh' }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />
        <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
