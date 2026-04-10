import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#1a237e', light: '#534bae', dark: '#000051', contrastText: '#fff' },
    secondary: { main: '#00897b', light: '#4ebaaa', dark: '#005b4f', contrastText: '#fff' },
    background: { default: '#f0f2f8', paper: '#ffffff' },
    success: { main: '#2e7d32', light: '#4caf50', dark: '#1b5e20' },
    warning: { main: '#e65100', light: '#ff6d00', dark: '#bf360c' },
    error: { main: '#c62828', light: '#ef5350', dark: '#b71c1c' },
    info: { main: '#0277bd', light: '#29b6f6', dark: '#01579b' },
    grey: { 50: '#fafafa', 100: '#f5f5f5', 200: '#eeeeee' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.5px' },
    h5: { fontWeight: 700, letterSpacing: '-0.3px' },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.5 },
  },
  shape: { borderRadius: 8 },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.06)',
    '0 2px 8px rgba(0,0,0,0.08)',
    '0 4px 16px rgba(0,0,0,0.1)',
    '0 6px 24px rgba(0,0,0,0.1)',
    '0 8px 32px rgba(0,0,0,0.12)',
    ...Array(19).fill('0 8px 32px rgba(0,0,0,0.12)'),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 10, letterSpacing: 0.2 },
        contained: { boxShadow: '0 2px 8px rgba(26,35,126,0.25)', '&:hover': { boxShadow: '0 4px 16px rgba(26,35,126,0.35)' } },
      },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 10, boxShadow: '0 1px 6px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)' } },
    },
    MuiPaper: {
      styleOverrides: { root: { borderRadius: 10 } },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600, fontSize: '0.72rem' } },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
    },
    MuiSelect: {
      defaultProps: { size: 'small' },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#1a237e',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.78rem',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: { root: { borderRadius: 8, height: 8 } },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: '1px solid rgba(0,0,0,0.07)', backgroundColor: '#ffffff', borderRadius: 0 },
      },
    },
    MuiListItemButton: {
      styleOverrides: { root: { borderRadius: 10, margin: '1px 8px', padding: '6px 12px' } },
    },
  },
})

export default theme
