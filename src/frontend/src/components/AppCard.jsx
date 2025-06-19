import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

export default function AppCard({ app, onShowTrends, onEdit, onDelete }) {
  const lastCheck = app.health_checks && app.health_checks[0];
  let shadowColor = 'shadow-lg';
  if (lastCheck) {
    shadowColor = lastCheck.status === 'up'
      ? 'shadow-green-500/40 shadow-lg'
      : 'shadow-red-500/40 shadow-lg';
  }
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <div
      className={`w-full max-w-sm h-full flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-blue-500 transition-all duration-200 p-4 group ${shadowColor} hover:shadow-2xl relative`}
      style={{
        // Overlay for Edge browser: subtle background and border
        boxShadow: shadowColor.includes('green')
          ? '0 4px 20px 0 rgba(34,197,94,0.25)' // green
          : shadowColor.includes('red')
          ? '0 4px 20px 0 rgba(239,68,68,0.25)' // red
          : undefined,
        zIndex: 1,
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
          {app.name}
        </h2>
        <IconButton
          aria-label="settings"
          size="small"
          onClick={handleMenuOpen}
          className="ml-2"
        >
          <SettingsIcon fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => { handleMenuClose(); onEdit && onEdit(app); }}>Edit</MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); onDelete && onDelete(app.id); }}>Delete</MenuItem>
        </Menu>
      </div>
      <div className="mb-2">
        <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 text-sm break-all hover:underline">
          {app.url}
        </a>
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {app.tags && app.tags.map(tag => (
          <span key={tag.id} className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-0.5 rounded">
            {tag.name}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${lastCheck?.status === 'up' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
          {lastCheck?.status === 'up' ? 'Up' : 'Down'}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {lastCheck ? `Response: ${lastCheck.response_time?.toFixed(2) ?? '-'}s` : 'No checks yet'}
        </span>
      </div>
      <Button
        className="mt-auto"
        variant="contained"
        color="primary"
        size="small"
        onClick={() => onShowTrends && onShowTrends(app)}
        aria-label="Show Trends"
      >
        Show Trends
      </Button>
    </div>
  );
} 