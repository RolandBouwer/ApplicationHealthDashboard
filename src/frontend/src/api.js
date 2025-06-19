const API_BASE = 'http://localhost:8000';

export async function getApplications() {
  const res = await fetch(`${API_BASE}/applications/`);
  if (!res.ok) throw new Error('Failed to fetch applications');
  return res.json();
}

export async function getHealthChecks(appId) {
  const res = await fetch(`${API_BASE}/applications/${appId}/health_checks/`);
  if (!res.ok) throw new Error('Failed to fetch health checks');
  return res.json();
}

export async function createApplication(data) {
  const res = await fetch(`${API_BASE}/applications/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create application');
  return res.json();
}

export async function updateApplication(appId, data) {
  const res = await fetch(`${API_BASE}/applications/${appId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update application');
  return res.json();
}

export async function deleteApplication(appId) {
  const res = await fetch(`${API_BASE}/applications/${appId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete application');
  return res.json();
}

export async function getTags() {
  const res = await fetch(`${API_BASE}/tags/`);
  if (!res.ok) throw new Error('Failed to fetch tags');
  return res.json();
}

export async function createTag(data) {
  const res = await fetch(`${API_BASE}/tags/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create tag');
  return res.json();
}

// Tag update is not supported by backend, but if it is:
export async function updateTag() {
  // Not implemented in backend, placeholder
  throw new Error('Tag update not implemented');
}

export async function deleteTag(tagId) {
  const res = await fetch(`${API_BASE}/tags/${tagId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete tag');
  return res.json();
} 