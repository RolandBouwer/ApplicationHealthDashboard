import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export default function TagManagerModal({ open, onClose, tags, onAdd, onDelete }) {
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState(null);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newTag.trim()) {
      setError('Tag name required');
      return;
    }
    try {
      await onAdd({ name: newTag.trim() });
      setNewTag('');
      setError(null);
    } catch (err) {
      setError(err.message || 'Error adding tag');
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Tags</DialogTitle>
      <form onSubmit={handleAdd}>
        <DialogContent dividers>
          <div className="flex gap-2 mb-4">
            <input
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="New tag name"
            />
            <Button type="submit" variant="contained" color="primary">Add</Button>
          </div>
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <ul className="space-y-2">
            {tags.map(tag => (
              <li key={tag.id} className="flex items-center justify-between bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded">
                <span className="text-blue-800 dark:text-blue-200 text-sm">{tag.name}</span>
                {onDelete && (
                  <Button
                    size="small"
                    color="error"
                    variant="contained"
                    onClick={() => onDelete(tag)}
                  >Delete</Button>
                )}
              </li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">Close</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 