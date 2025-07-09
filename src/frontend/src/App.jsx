import { useState, useEffect, useMemo } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import Brightness2Icon from '@mui/icons-material/Brightness2'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Paper from '@mui/material/Paper'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import AppCard from './components/AppCard'
import AppFormModal from './components/AppFormModal'
import TagManagerModal from './components/TagManagerModal'
import TrendsModal from './components/TrendsModal'
import { getApplications, createApplication, updateApplication, deleteApplication, getTags, createTag, deleteTag } from './api'
import './App.css'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from './assets/logo.png'; 

function filterApps(apps, search) {
  if (!search) return apps;
  const s = search.toLowerCase();
  return apps.filter(app =>
    app.name.toLowerCase().includes(s) ||
    (app.tags && app.tags.some(tag => tag.name.toLowerCase().includes(s)))
  );
}

function App() {
  const [apps, setApps] = useState([])
  const [tags, setTags] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editApp, setEditApp] = useState(null)
  const [tagModalOpen, setTagModalOpen] = useState(false)
  const [trendsApp, setTrendsApp] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [lastChecked, setLastChecked] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  // Memoize theme for performance
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#60A5FA' : '#2563EB',
      },
      background: {
        default: darkMode ? '#111827' : '#f9fafb',
        paper: darkMode ? '#1e293b' : '#fff',
      },
    },
    typography: {
      fontFamily: 'Inter, Roboto, Arial, sans-serif',
    },
  }), [darkMode]);

  // Fetch apps/tags, with auto-refresh every 30s
  useEffect(() => {
    let timeout;
    const fetchData = async () => {
      setRefreshing(true);
      setLoading(true);
      try {
        const [appsData, tagsData] = await Promise.all([
          getApplications(),
          getTags()
        ]);
        setApps(appsData);
        setTags(tagsData);
        setError(null);
        setLastChecked(new Date());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
        timeout = setTimeout(fetchData, 30000); // 30s
      }
    };
    fetchData();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const filtered = filterApps(apps, search)
  const prodApps = filtered.filter(a => a.is_production)
  const nonProdApps = filtered.filter(a => !a.is_production)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  async function handleAddApp(data) {
    const newApp = await createApplication(data)
    setApps(a => [...a, newApp])
  }

  async function handleEditApp(data) {
    const updated = await updateApplication(editApp.id, data)
    setApps(a => a.map(app => (app.id === editApp.id ? updated : app)))
  }

  async function handleDeleteApp(appId) {
    if (!window.confirm('Delete this application?')) return
    await deleteApplication(appId)
    setApps(a => a.filter(app => app.id !== appId))
  }

  async function handleAddTag(data) {
    const newTag = await createTag(data);
    setTags(t => [...t, newTag]);
  }

  async function handleDeleteTag(tag) {
    if (!window.confirm(`Delete tag "${tag.name}"?`)) return;
    await deleteTag(tag.id);
    setTags(t => t.filter(tg => tg.id !== tag.id));
  }

  function handleExportPDF() {
    const doc = new jsPDF();
    // Production section
    doc.text('Production Applications', 14, 16);
    const prodData = prodApps.map(app => {
      const lastCheck = app.health_checks && app.health_checks[0];
      return [
        app.name,
        app.url,
        lastCheck?.status === 'up' ? 'Up' : 'Down',
        lastCheck?.response_time != null ? lastCheck.response_time.toFixed(2) + 's' : '-'
      ];
    });
    autoTable(doc, {
      head: [['Name', 'URL', 'Status', 'Response Time']],
      body: prodData,
      startY: 22,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [37, 99, 235] },
    });
    // Non-Production section
    let nextY = doc.lastAutoTable.finalY + 10;
    doc.text('Non-Production Applications', 14, nextY);
    const nonProdData = nonProdApps.map(app => {
      const lastCheck = app.health_checks && app.health_checks[0];
      return [
        app.name,
        app.url,
        lastCheck?.status === 'up' ? 'Up' : 'Down',
        lastCheck?.response_time != null ? lastCheck.response_time.toFixed(2) + 's' : '-'
      ];
    });
    autoTable(doc, {
      head: [['Name', 'URL', 'Status', 'Response Time']],
      body: nonProdData,
      startY: nextY + 6,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [37, 99, 235] },
    });
    doc.save('app-health-report.pdf');
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="flex flex-col min-h-screen min-w-full h-full w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
        <AppBar position="static" color={darkMode ? 'default' : 'primary'} sx={{ background: darkMode ? '#111827' : '#fff', color: darkMode ? '#fff' : '#111827', boxShadow: 1 }}>
          <Toolbar className="flex flex-wrap gap-2 justify-between">
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              {/* <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white text-2xl font-bold shadow-md mr-2"> */}
                <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
              {/* </span> */}
              <Typography variant="h6" component="div" sx={{ fontWeight: 700 }} className="text-2xl font-bold text-gray-900 dark:text-white">App Health Dashboard</Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-300 hidden sm:inline">
                {lastChecked && (
                  <>Last checked: {lastChecked.toLocaleTimeString()}&nbsp;</>
                )}
                {refreshing && <CircularProgress size={16} color="inherit" className="ml-1 align-middle" />}
              </span>
              <IconButton sx={{ ml: 1 }} onClick={() => setDarkMode(d => !d)} color="inherit" aria-label="Toggle dark mode">
                {darkMode ? <Brightness7Icon /> : <Brightness2Icon />}
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <main className="flex-1 p-2 sm:p-4 flex flex-col w-full h-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name or tag..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full md:w-80 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300"
            />
            <div className="flex gap-2 flex-wrap justify-end">
              <Button variant="contained" color="primary" onClick={() => { setEditApp(null); setModalOpen(true); }}>
                + Add Application
              </Button>
              <Button variant="outlined" color="primary" onClick={() => setTagModalOpen(true)}>
                Manage Tags
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleExportPDF}>
                Export To PDF
              </Button>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <CircularProgress color="primary" />
            </div>
          ) : error ? (
            <div className="text-red-600 dark:text-red-400 text-center">{error}</div>
          ) : (
            <Paper elevation={0} className="bg-transparent">
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{
                    '& .MuiTab-root': {
                      color: darkMode ? '#9CA3AF' : '#4B5563',
                      '&.Mui-selected': {
                        color: darkMode ? '#60A5FA' : '#2563EB',
                      },
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: darkMode ? '#60A5FA' : '#2563EB',
                    },
                  }}
                >
                  <Tab label={`Production (${prodApps.length})`} />
                  <Tab label={`Non-Production (${nonProdApps.length})`} />
                </Tabs>
              </Box>
              <div role="tabpanel" hidden={activeTab !== 0}>
                {activeTab === 0 && (
                  <div className="flex justify-center">
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-full max-w-7xl mx-auto px-2 sm:px-4 mb-8">
                      {prodApps.length === 0 && 
                        <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                          No production apps found.
                        </div>
                      }
                      {prodApps.map(app => (
                        <AppCard
                          key={app.id}
                          app={app}
                          onShowTrends={setTrendsApp}
                          onEdit={(app) => { setEditApp(app); setModalOpen(true); }}
                          onDelete={handleDeleteApp}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div role="tabpanel" hidden={activeTab !== 1}>
                {activeTab === 1 && (
                  <div className="flex justify-center">
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-full max-w-7xl mx-auto px-2 sm:px-4 mb-8">
                      {nonProdApps.length === 0 && 
                        <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                          No non-production apps found.
                        </div>
                      }
                      {nonProdApps.map(app => (
                        <AppCard
                          key={app.id}
                          app={app}
                          onShowTrends={setTrendsApp}
                          onEdit={(app) => { setEditApp(app); setModalOpen(true); }}
                          onDelete={handleDeleteApp}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Paper>
          )}
          <AppFormModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={editApp ? handleEditApp : handleAddApp}
            initialData={editApp}
            tags={tags}
          />
          <TagManagerModal
            open={tagModalOpen}
            onClose={() => setTagModalOpen(false)}
            tags={tags}
            onAdd={handleAddTag}
            onDelete={handleDeleteTag}
          />
          <TrendsModal open={!!trendsApp} onClose={() => setTrendsApp(null)} app={trendsApp} />
        </main>
        <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-4 px-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500 dark:text-gray-300">
          <span>&copy; {new Date().getFullYear()} App Health Dashboard</span>
          <span>
            Made with <span className="text-blue-600 dark:text-blue-400">React</span> &amp; <span className="text-blue-600 dark:text-blue-400">Material UI</span>
          </span>
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default App
