import React, { useState } from 'react'
import {
  Box, Card, CardContent, Typography, Grid, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button, MenuItem, Select, FormControl,
  InputLabel, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Avatar,
  Divider, IconButton, Tooltip,
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FilterListIcon from '@mui/icons-material/FilterList'
import AssessmentIcon from '@mui/icons-material/Assessment'
import PeopleIcon from '@mui/icons-material/People'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import CloseIcon from '@mui/icons-material/Close'
import toast from 'react-hot-toast'
import { useApp } from '../context/AppContext'

const MOCK_SUBMISSIONS = [
  { id: 1,  employee: 'Priya Sharma',   empCode: 'EMP002', department: 'Compliance',       form: 'Asset & Liability Declaration',       submittedOn: '2026-04-02T10:30:00', status: 'submitted', details: { fy: 'FY 2025–26', signature: 'Priya Sharma' } },
  { id: 2,  employee: 'Rahul Mehta',    empCode: 'EMP003', department: 'Finance',           form: 'Code of Conduct Acknowledgment',      submittedOn: '2026-04-03T14:20:00', status: 'submitted', details: { fy: 'FY 2025–26', signature: 'Rahul Mehta' } },
  { id: 3,  employee: 'Anita Desai',    empCode: 'EMP004', department: 'HR',                form: 'KYE Annual Declaration',              submittedOn: '2026-04-04T09:15:00', status: 'submitted', details: { fy: 'FY 2025–26', signature: 'Anita Desai' } },
  { id: 4,  employee: 'Suresh Patel',   empCode: 'EMP005', department: 'IT',                form: 'Insider Trading Self-Certification',  submittedOn: '2026-04-05T11:45:00', status: 'submitted', details: { fy: 'FY 2025–26', signature: 'Suresh Patel' } },
  { id: 5,  employee: 'Meera Nair',     empCode: 'EMP006', department: 'Operations',        form: 'Conflict of Interest Disclosure',     submittedOn: '2026-04-05T16:00:00', status: 'submitted', details: { fy: 'FY 2025–26', signature: 'Meera Nair' } },
  { id: 6,  employee: 'Vikram Singh',   empCode: 'EMP007', department: 'Risk Management',   form: 'AML Self-Declaration',                submittedOn: '2026-04-06T10:00:00', status: 'submitted', details: { fy: 'FY 2025–26', signature: 'Vikram Singh' } },
  { id: 7,  employee: 'Kavya Reddy',    empCode: 'EMP008', department: 'Compliance',        form: 'Gift & Hospitality Register',         submittedOn: '2026-04-07T13:30:00', status: 'submitted', details: { fy: 'FY 2025–26', signature: 'Kavya Reddy' } },
  { id: 8,  employee: 'Arjun Krishnan', empCode: 'EMP009', department: 'Finance',           form: 'PoSH Policy Acknowledgment',          submittedOn: '2026-04-07T15:00:00', status: 'submitted', details: { fy: 'FY 2025–26', signature: 'Arjun Krishnan' } },
  { id: 9,  employee: 'Pooja Joshi',    empCode: 'EMP010', department: 'Operations',        form: 'Code of Conduct Acknowledgment',      submittedOn: '2026-04-08T09:00:00', status: 'submitted', details: { fy: 'FY 2025–26', signature: 'Pooja Joshi' } },
  { id: 10, employee: 'Rohan Kapoor',   empCode: 'EMP011', department: 'IT',                form: 'Asset & Liability Declaration',       submittedOn: '2026-04-08T14:30:00', status: 'submitted', details: { fy: 'FY 2025–26', signature: 'Rohan Kapoor' } },
  { id: 11, employee: 'Sunita Verma',   empCode: 'EMP012', department: 'HR',                form: 'KYE Annual Declaration',              submittedOn: null,                  status: 'pending',   details: {} },
  { id: 12, employee: 'Deepak Gupta',   empCode: 'EMP013', department: 'Finance',           form: 'Conflict of Interest Disclosure',     submittedOn: null,                  status: 'pending',   details: {} },
  { id: 13, employee: 'Nisha Iyer',     empCode: 'EMP014', department: 'Risk Management',   form: 'AML Self-Declaration',                submittedOn: null,                  status: 'pending',   details: {} },
  { id: 14, employee: 'Kiran Bose',     empCode: 'EMP015', department: 'Operations',        form: 'PoSH Policy Acknowledgment',          submittedOn: null,                  status: 'pending',   details: {} },
]

const DEPARTMENTS = ['All', 'Compliance', 'Finance', 'HR', 'IT', 'Operations', 'Risk Management']
const FORM_TYPES = [
  'All',
  'Asset & Liability Declaration',
  'Conflict of Interest Disclosure',
  'Insider Trading Self-Certification',
  'AML Self-Declaration',
  'PoSH Policy Acknowledgment',
  'KYE Annual Declaration',
  'Code of Conduct Acknowledgment',
  'Gift & Hospitality Register',
]
const STATUSES = ['All', 'submitted', 'pending']

const FORM_KEY_LABELS = {
  assetLiability:       'Asset & Liability Declaration',
  conflictOfInterest:   'Conflict of Interest Disclosure',
  insiderTrading:       'Insider Trading Self-Certification',
  amlDeclaration:       'AML Self-Declaration',
  poshAcknowledgment:   'PoSH Policy Acknowledgment',
  kyeDeclaration:       'KYE Annual Declaration',
  codeOfConduct:        'Code of Conduct Acknowledgment',
  giftHospitality:      'Gift & Hospitality Register',
}

function StatCard({ title, value, icon, color }) {
  return (
    <Card sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }} elevation={0}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color }}>{value}</Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>{title}</Typography>
          </Box>
          <Avatar sx={{ bgcolor: color + '18', width: 48, height: 48 }}>
            {React.cloneElement(icon, { sx: { color } })}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function Reports() {
  const { user, submissions } = useApp()
  const [filters, setFilters] = useState({ department: 'All', formType: 'All', status: 'All', search: '' })
  const [selectedRow, setSelectedRow] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Merge real submissions with mock data
  const allData = [...MOCK_SUBMISSIONS]
  if (user && submissions) {
    Object.entries(submissions).forEach(([key, val]) => {
      if (val) {
        allData.unshift({
          id: `real-${key}`,
          employee: val.submittedBy || user.name,
          empCode: val.employeeCode || user.employeeCode || 'EMP001',
          department: val.department || user.department,
          form: FORM_KEY_LABELS[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
          submittedOn: val.submittedAt,
          status: 'submitted',
          details: val,
        })
      }
    })
  }

  const setFilter = field => e => setFilters(p => ({ ...p, [field]: e.target.value }))

  const filtered = allData.filter(row => {
    if (filters.department !== 'All' && row.department !== filters.department) return false
    if (filters.formType !== 'All' && row.form !== filters.formType) return false
    if (filters.status !== 'All' && row.status !== filters.status) return false
    if (filters.search && !row.employee.toLowerCase().includes(filters.search.toLowerCase()) && !row.empCode.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  const submittedCount = filtered.filter(r => r.status === 'submitted').length
  const pendingCount = filtered.filter(r => r.status === 'pending').length

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Compliance Reports</Typography>
          <Typography variant="body2" color="text.secondary">Admin View — All employee submissions across FY 2025–26</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => toast.success('Export initiated — CSV will be downloaded shortly')}
          sx={{ background: 'linear-gradient(135deg, #1a237e, #283593)', borderRadius: 2 }}
        >
          Export to Excel
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <StatCard title="Total Submissions" value={allData.filter(r => r.status === 'submitted').length} icon={<AssessmentIcon />} color="#1a237e" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Unique Employees" value={new Set(allData.map(r => r.empCode)).size} icon={<PeopleIcon />} color="#00897b" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Pending Submissions" value={allData.filter(r => r.status === 'pending').length} icon={<PendingIcon />} color="#e65100" />
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 2.5, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FilterListIcon color="primary" fontSize="small" />
          <Typography variant="subtitle2" fontWeight={700}>Filter Records</Typography>
        </Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Department</InputLabel>
              <Select value={filters.department} onChange={setFilter('department')} label="Department">
                {DEPARTMENTS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Form Type</InputLabel>
              <Select value={filters.formType} onChange={setFilter('formType')} label="Form Type">
                {FORM_TYPES.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={filters.status} onChange={setFilter('status')} label="Status">
                {STATUSES.map(s => <MenuItem key={s} value={s}>{s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField label="Search Employee" size="small" fullWidth value={filters.search} onChange={setFilter('search')} placeholder="Name or employee code..." />
          </Grid>
        </Grid>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
          Showing {filtered.length} of {allData.length} records — {submittedCount} submitted, {pendingCount} pending
        </Typography>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', overflow: 'auto' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {['Employee', 'Emp Code', 'Form Name', 'Department', 'Submitted On', 'Status', 'Actions'].map(h => (
                <TableCell key={h} sx={{ fontWeight: 700, bgcolor: '#1a237e', color: '#fff', fontSize: '0.78rem', py: 1.5, borderBottom: 'none', whiteSpace: 'nowrap' }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row, idx) => (
              <TableRow
                key={row.id}
                sx={{ bgcolor: idx % 2 === 0 ? '#fff' : '#f8f9ff', '&:hover': { bgcolor: '#e8eaf6' }, transition: 'background 0.15s' }}
              >
                <TableCell sx={{ fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{row.employee}</TableCell>
                <TableCell sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>{row.empCode}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem', maxWidth: 200 }}>
                  <Typography noWrap variant="body2" fontSize="0.8rem" title={row.form}>{row.form}</Typography>
                </TableCell>
                <TableCell sx={{ fontSize: '0.78rem' }}>{row.department}</TableCell>
                <TableCell sx={{ fontSize: '0.78rem', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                  {row.submittedOn ? new Date(row.submittedOn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.status === 'submitted' ? 'Submitted' : 'Pending'}
                    color={row.status === 'submitted' ? 'success' : 'warning'}
                    size="small"
                    icon={row.status === 'submitted' ? <CheckCircleIcon sx={{ fontSize: '12px !important' }} /> : <PendingIcon sx={{ fontSize: '12px !important' }} />}
                    sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title={row.status === 'submitted' ? 'View Details' : 'Not yet submitted'}>
                    <span>
                      <IconButton size="small" color="primary" onClick={() => { setSelectedRow(row); setDialogOpen(true) }} disabled={row.status !== 'submitted'}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography color="text.secondary">No records match the current filters.</Typography>
          </Box>
        )}
      </TableContainer>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        {selectedRow && (
          <>
            <DialogTitle sx={{ background: 'linear-gradient(135deg, #1a237e, #283593)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
              <Typography fontWeight={700} fontSize="1rem">Submission Details</Typography>
              <IconButton onClick={() => setDialogOpen(false)} sx={{ color: '#fff' }} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={2}>
                {[
                  ['Employee', selectedRow.employee],
                  ['Employee Code', selectedRow.empCode],
                  ['Department', selectedRow.department],
                  ['Form', selectedRow.form],
                  ['Submitted On', selectedRow.submittedOn ? new Date(selectedRow.submittedOn).toLocaleString('en-IN') : '—'],
                  ['Status', selectedRow.status === 'submitted' ? 'Submitted' : 'Pending'],
                ].map(([label, value]) => (
                  <Grid item xs={12} sm={6} key={label}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.68rem' }}>
                      {label}
                    </Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ mt: 0.25 }}>{value}</Typography>
                  </Grid>
                ))}
              </Grid>
              {Object.keys(selectedRow.details || {}).length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>Form Details</Typography>
                  {Object.entries(selectedRow.details).map(([key, val]) => {
                    if (typeof val === 'object' || key === 'submittedAt') return null
                    return (
                      <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1')}
                        </Typography>
                        <Typography variant="caption" fontWeight={600}>{String(val)}</Typography>
                      </Box>
                    )
                  })}
                </>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button variant="outlined" onClick={() => setDialogOpen(false)} sx={{ borderRadius: 2 }}>Close</Button>
              <Button variant="contained" startIcon={<DownloadIcon />} onClick={() => toast.success('PDF export initiated')} sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#1a237e,#283593)' }}>
                Export PDF
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}
