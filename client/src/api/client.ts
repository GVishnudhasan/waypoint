const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '') + '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || 'API Error');
  }
  return res.json();
}

// Users
export const api = {
  // Users
  createUser: (data: any) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
  getUsers: (eventId: string, limit?: number) => request<any[]>(`/users?event_id=${eventId}${limit ? `&limit=${limit}` : ''}`),
  getUser: (id: string) => request<any>(`/users/${id}`),
  updateUser: (id: string, data: any) => request<any>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  generateTwin: (id: string) => request<any>(`/users/${id}/generate-twin`, { method: 'POST' }),

  // Goals
  getGoals: (userId: string) => request<any[]>(`/goals/user/${userId}`),
  createGoal: (data: any) => request('/goals', { method: 'POST', body: JSON.stringify(data) }),
  incrementGoal: (id: string) => request(`/goals/${id}/increment`, { method: 'POST' }),

  // Matching
  getMatches: (userId: string) => request<any[]>(`/matches/${userId}`),

  // Connections
  getConnections: (userId: string) => request<any[]>(`/connections/user/${userId}`),
  getPendingConnections: (userId: string) => request<any[]>(`/connections/pending/${userId}`),
  sendConnection: (data: { sender_id: string; receiver_id: string; message?: string; conversation_starter?: string }) =>
    request('/connections', { method: 'POST', body: JSON.stringify(data) }),
  acceptConnection: (id: string) => request(`/connections/${id}/accept`, { method: 'PUT' }),
  declineConnection: (id: string) => request(`/connections/${id}/decline`, { method: 'PUT' }),

  // Presence
  getZoneStats: (eventId: string) => request<any[]>(`/presence/zones?event_id=${eventId}`),
  getPresence: (userId: string) => request<any>(`/presence/${userId}`),
  getAvailableInZone: (zone: string) => request<any[]>(`/presence/zone/${encodeURIComponent(zone)}`),
  updatePresence: (data: { user_id: string; status: string; zone?: string; topics?: string; duration_minutes?: number }) =>
    request('/presence', { method: 'POST', body: JSON.stringify(data) }),

  // Zones management for Organizer
  getZonesList: (eventId: string) => request<any[]>(`/presence/zones-list?event_id=${eventId}`),
  createZone: (data: any) => request('/presence/zones', { method: 'POST', body: JSON.stringify(data) }),
  updateZone: (id: string, data: any) => request(`/presence/zones/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteZone: (id: string) => request(`/presence/zones/${id}`, { method: 'DELETE' }),

  // Event Config for Organizer
  getEventConfig: (id?: string) => request<any>(`/event-config${id ? `/${id}` : ''}`),
  updateEventConfig: (id: string, data: any) => request<any>(`/event-config/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  listEventConfigs: () => request<any[]>('/event-config/list'),
  createEventConfig: (data: any) => request<any>('/event-config', { method: 'POST', body: JSON.stringify(data) }),

  // User deletion for Organizer
  deleteUser: (id: string) => request(`/users/${id}`, { method: 'DELETE' }),

  // Analytics
  getAnalyticsOverview: () => request<any>('/analytics/overview'),
  getZoneAnalytics: () => request<any[]>('/analytics/zones'),

  // Dynamic Custom Roles (RBAC)
  listRoles: (eventId: string) => request<any[]>(`/roles?event_id=${eventId}`),
  createRole: (eventId: string, data: any) => request<any>(`/roles?event_id=${eventId}`, { method: 'POST', body: JSON.stringify(data) }),
  updateRolePermissions: (id: string, data: any) => request<any>(`/roles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRole: (id: string) => request<any>(`/roles/${id}`, { method: 'DELETE' }),

  // Sessions Builder (Schedule)
  listSessions: (eventId: string) => request<any[]>(`/sessions?event_id=${eventId}`),
  createSession: (data: any) => request<any>('/sessions', { method: 'POST', body: JSON.stringify(data) }),
  updateSession: (id: string, data: any) => request<any>(`/sessions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSession: (id: string) => request<any>(`/sessions/${id}`, { method: 'DELETE' }),

  // Audit Logs
  getAuditLogs: (eventId: string) => request<any[]>(`/audit-logs?event_id=${eventId}`),

  // User Membership Moderation
  listMemberships: (eventId: string) => request<any[]>(`/users/memberships/list?event_id=${eventId}`),
  updateUserRole: (id: string, eventId: string, role: string) => request<any>(`/users/${id}/role?event_id=${eventId}`, { method: 'PUT', body: JSON.stringify({ role }) }),
  updateUserStatus: (id: string, eventId: string, status: string) => request<any>(`/users/${id}/status?event_id=${eventId}`, { method: 'PUT', body: JSON.stringify({ status }) }),
};
