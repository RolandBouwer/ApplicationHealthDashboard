import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { getHealthChecks } from '../api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

export default function TrendsModal({ open, onClose, app }) {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && app) {
      setLoading(true);
      getHealthChecks(app.id)
        .then(setChecks)
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [open, app]);

  // Prepare data for charts
  const chartData = checks.slice().reverse().map(c => ({
    time: new Date(c.checked_at).toLocaleTimeString(),
    response: c.response_time,
    up: c.status === 'up' ? 1 : 0,
  }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Trends for {app?.name}</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center">{error}</div>
        ) : (
          <>
            <div className="mb-8">
              <h3 className="text-md font-semibold mb-2 text-blue-700 dark:text-blue-300">Response Time (s)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" fontSize={12} tick={{ fill: '#64748b' }} />
                  <YAxis fontSize={12} tick={{ fill: '#64748b' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="response" stroke="#2563eb" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-md font-semibold mb-2 text-blue-700 dark:text-blue-300">Uptime (last {chartData.length} checks)</h3>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={chartData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" fontSize={12} tick={false} />
                  <YAxis hide domain={[0, 1]} />
                  <Tooltip />
                  <Bar dataKey="up" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Close</Button>
      </DialogActions>
    </Dialog>
  );
} 