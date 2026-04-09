import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
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
  { id: 1, employee: 'Priya Sharma', empCode: 'EMP001', department: 'Compliance', form: 'Anti-Fraud Declaration', submittedOn: '2026-04-02T10:30:00', status: 'submitted', details: { period: 'Q1 2026', signature: 'Priya Sharma' } },
  { id: 2, employee: 'Rahul Mehta', empCode: 'EMP002', department: 'Finance', form: 'Code of Conduct', submittedOn: '2026-04-03T14:20:00', status: 'submitted', details: { period: 'Annual 2026', signature: 'Rahul Mehta' } },
  { id: 3, employee: 'Anita Desai', empCode: 'EMP003', department: 'HR', form: 'HR Annual Declaration', submittedOn: '2026-04-04T09:15:00', status: 'submitted', details: { period: 'FY 2025-26', signature: 'Anita Desai' } },
  { id: 4, employee: 'Suresh Patel', empCode: 'EMP004', department: 'IT', form: 'Non-Disclosure Agreement', submittedOn: '2026-04-05T11:45:00', status: 'submitted', details: { period: 'Annual 2026', signature: 'Suresh Patel' } },
  { id: 5, employee: 'Meera Nair', empCode: 'EMP005', department: 'Operations', form: 'Conflict of Interest', submittedOn: '2026-04-05T16:00:00', status: 'submitted', details: { period: 'Q1 2026', signature: 'Meera Nair' } },
  { id: 6, employee: 'Vikram Singh', empCode: 'EMP006', department: 'Risk Management', form: 'Property Declaration', submittedOn: '2026-04-06T10:00:00', status: 'submitted', details: { period: 'FY 2025-26', signature: 'Vikram Singh' } },
  { id: 7, employee: 'Kavya Reddy', empCode: 'EMP007', department: 'Compliance', form: 'Gift & Reward Declaration', submittedOn: '2026-04-07T13:30:00', status: 'submitted', details: { period: 'Q1 2026', signature: 'Kavya Reddy' } },
  { id: 8, employee: 'Arjun Krishnan', empCode: 'EMP008', department: 'Finance', form: 'Anti-Fraud Declaration', submittedOn: '2026-04-07T15:00:00', status: 'submitted', details: { period: 'Q1 2026', signature: 'Arjun Krishnan' } },
  { id: 9, employee: 'Pooja Joshi', empCode: 'EMP009', department: 'Operations', form: 'Code of Conduct', submittedOn: '2026-04-08T09:00:00', status: 'submitted', details: { period: 'Annual 2026', signature: 'Pooja Joshi' } },
  { id: 10, employee: 'Rohan Kapoor', empCode: 'EMP010', department: 'IT', form: 'Relative Employment', submittedOn: '2026-04-08T14:30:00', status: 'submitted', details: { period: 'Q1 2026', signature: 'Rohan Kapoor' } },
  { id: 11, employee: 'Sunita Verma', empCode: 'EMP011', department: 'HR', form: 'Anti-Fraud Declaration', submittedOn: null, status: 'pending', details: {} },
  { id: 12, employee: 'Deepak Gupta', empCode: 'EMP012', department: 'Finance', form: 'Conflict of Interest', submittedOn: null, status: 'pending', details: {} },
]

const DEPARTMENTS = ['All', 'Compliance', 'Finance', 'HR', 'IT', 'Operations', 'Risk Management']
const FORM_TYPES = [
  'All',
  'Anti-Fraud Declaration',
  'Conflict of Interest',
  'Non-Disclosure Agreement',
  'HR Annual Declaration',
  'Gift & Reward Declaration',
  'Property Declaration',
  'Code of Conduct',
  'Relative Employment',
]
const PERIODS = ['All', 'Q1 2026', 'Q2 2026', 'Annual 2026', 'FY 2025-26']
const STATUSES = ['All', 'submitted', 'pending']

function StatCard({ title, value, icon, color }) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color }}>{value}</Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>{title}</Typography>
          </Box>
          <Avatar sx={{ bgcolor: color + '15', width: 48, height: 48 }}>
            {React.cloneElement(icon, { sx: { color } })}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function Reports() {
  const { user, submissions } = useApp()
  const [filters, setFilters] = useState({ period: 'All', department: 'All', formType: 'All', status: 'All', search: '' })
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
          empCode: val.employeeCode || user.employeeCode,
          department: val.department || user.department,
          form: key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
          submittedOn: val.submittedAt,
          status: 'submitted',
          details: val,
        })
      }
    })
  }

  const handleFilterChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const filtered = allData.filter((row) => {
    if (filters.department !== 'All' && row.department !== filters.department) return false
    if (filters.formType !== 'All' && row.form !== filters.formType) return false
    if (filters.status !== 'All' && row.status !== filters.status) return false
    if (filters.search && !row.employee.toLowerCase().includes(filters.search.toLowerCase()) && !row.empCode.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  const submittedCount = filtered.filter((r) => r.status === 'submitted').length
  const pendingCount = filtered.filter((r) => r.status === 'pending').length
  const uniqueEmployees = new Set(filtered.map((r) => r.empCode)).size

  const handleView = (row) => {
    setSelectedRow(row)
    setDialogOpen(true)
  }

  const handleExport = () => {
    toast.success('Export initiated — CSV will be downloaded shortly')
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Compliance Reports</Typography>
          <Typography variant="body2" color="text.secondary">Admin View — All employee submissions</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
          sx={{ background: 'linear-gradient(135deg, #1a237e, #283593)' }}
        >
          Export to Excel
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <StatCard title="Total Submissions" value={allData.filter(r=>r.status==='submitted').length} icon={<AssessmentIcon />} color="#1a237e" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Unique Employees" value={new Set(allData.map(r=>r.empCode)).size} icon={<PeopleIcon />} color="#00897b" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Pending Actions" value={allData.filter(r=>r.status==='pending').length} icon={<PendingIcon />} color="#e65100" />
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2.5, mb: 2.5, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FilterListIcon color="primary" />
          <Typography variant="subtitle2" fontWeight={700}>Filters</Typography>
        </Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Period</InputLabel>
              <Select value={filters.period} onChange={handleFilterChange('period')} label="Period">
                {PERIODS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Department</InputLabel>
              <Select value={filters.department} onChange={handleFilterChange('department')} label="Department">
                {DEPARTMENTS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Form Type</InputLabel>
              <Select value={filters.formType} onChange={handleFilterChange('formType')} label="Form Type">
                {FORM_TYPES.map((f) => <MenuItem key={f} value={f}>{f}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select value={filters.status} onChange={handleFilterChange('status')} label="Status">
                {STATUSES.map((s) => <MenuItem key={s} value={s}>{s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Search Employee"
              size="small"
              fullWidth
              value={filters.search}
              onChange={handleFilterChange('search')}
              placeholder="Name or code..."
            />
          </Grid>
        </Grid>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: 'block' }}>
          Showing {filtered.length} of {allData.length} records — {submittedCount} submitted, {pendingCount} pending
        </Typography>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {['Employee', 'Emp Code', 'Form Name', 'Department', 'Submitted On', 'Status', 'Actions'].map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    fontWeight: 700,
                    bgcolor: '#1a237e',
                    color: '#fff',
                    fontSize: '0.8rem',
                    py: 1.5,
                    borderBottom: 'none',
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row, idx) => (
              <TableRow
                key={row.id}
                sx={{
                  bgcolor: idx % 2 === 0 ? '#fff' : '#f8f9ff',
                  '&:hover': { bgcolor: '#e8eaf6' },
                  transition: 'background 0.15s',
                }}
              >
                <TableCell sx={{ fontWeight: 600, fontSize: '0.82rem' }}>{row.employee}</TableCell>
                <TableCell sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>{row.empCode}</TableCell>
                <TableCell sx={{ fontSize: '0.82rem', maxWidth: 180 }}>
                  <Typography noWrap variant="body2" fontSize="0.82rem">{row.form}</Typography>
                </TableCell>
                <TableCell sx={{ fontSize: '0.78rem' }}>{row.department}</TableCell>
                <TableCell sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                  {row.submittedOn
                    ? new Date(row.submittedOn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                    : '—'}
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
                  <Tooltip title="View Details">
                    <span>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleView(row)}
                        disabled={row.status !== 'submitted'}
                      >
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
          <Box sx={{ py: 5, textAlign: 'center' }}>
            <Typography color="text.secondary">No records match the current filters.</Typography>
          </Box>
        )}
      </TableContainer>

      {/* Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedRow && (
          <>
            <DialogTitle
              sx={{
                background: 'linear-gradient(135deg, #1a237e, #283593)',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography fontWeight={700}>Submission Details</Typography>
              <IconButton onClick={() => setDialogOpen(false)} sx={{ color: '#fff' }}>
                <CloseIcon />
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
                  ['Status', selectedRow.status],
                ].map(([label, value]) => (
                  <Grid item xs={12} sm={6} key={label}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {label}
                    </Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ mt: 0.25 }}>
                      {value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Form Details
              </Typography>
              {Object.entries(selectedRow.details || {}).map(([key, val]) => {
                if (typeof val === 'object') return null
                return (
                  <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </Typography>
                    <Typography variant="caption" fontWeight={500}>
                      {String(val)}
                    </Typography>
                  </Box>
                )
              })}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button variant="outlined" onClick={() => setDialogOpen(false)}>Close</Button>
              <Button variant="contained" startIcon={<DownloadIcon />} onClick={() => toast.success('PDF export initiated')}>
                Export PDF
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}
