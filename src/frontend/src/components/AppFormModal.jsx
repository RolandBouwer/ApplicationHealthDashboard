import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export default function AppFormModal({ open, onClose, onSubmit, initialData, tags }) {
  const [form, setForm] = useState({
    name: '',
    url: '',
    is_production: false,
    tags: [],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        url: initialData.url || '',
        is_production: initialData.is_production || false,
        tags: initialData.tags ? initialData.tags.map(t => t.name) : [],
      });
    } else {
      setForm({ name: '', url: '', is_production: false, tags: [] });
    }
    setError(null);
  }, [initialData, open]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleTagChange(tagName) {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tagName)
        ? f.tags.filter(t => t !== tagName)
        : [...f.tags, tagName],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.url) {
      setError('Name and URL are required.');
      return;
    }
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(err.message || 'Error saving application.');
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Edit Application' : 'Add Application'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">URL</label>
              <input
                name="url"
                value={form.url}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_production"
                checked={form.is_production}
                onChange={handleChange}
                id="is_production"
              />
              <label htmlFor="is_production" className="text-sm text-gray-700 dark:text-gray-200">Production</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags && tags.map(tag => (
                  <label key={tag.id} className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.tags.includes(tag.name)}
                      onChange={() => handleTagChange(tag.name)}
                    />
                    {tag.name}
                  </label>
                ))}
              </div>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">{initialData ? 'Save' : 'Add'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 