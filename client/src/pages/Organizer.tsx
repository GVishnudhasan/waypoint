import React from 'react';
import { api } from '../api/client';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../components/ui';
import { Icons } from '../components/Icons';
import './Organizer.css';

interface CustomTableProps<T> {
  data: T[];
  columns: {
    header: string;
    width?: string;
    render: (item: T) => React.ReactNode;
  }[];
  height?: string;
}

function CustomTable<T>({ data, columns, height }: CustomTableProps<T>) {
  return (
    <div style={{ 
      maxHeight: height || '400px', 
      overflowY: 'auto', 
      border: '1px solid var(--border-subtle)', 
      borderRadius: 'var(--radius-lg)', 
      background: 'var(--surface-1)' 
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border-subtle)' }}>
            {columns.map((col, idx) => (
              <th key={idx} style={{ 
                padding: 'var(--space-3) var(--space-4)', 
                color: 'var(--text-primary)', 
                fontWeight: 600, 
                fontSize: '11px', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                width: col.width
              }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                No records found
              </td>
            </tr>
          ) : (
            data.map((item, rowIdx) => (
              <tr key={rowIdx} className="table-row-hover" style={{ 
                borderBottom: rowIdx === data.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                transition: 'background 0.2s ease',
              }}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx} style={{ 
                    padding: 'var(--space-3) var(--space-4)', 
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--text-sm)',
                    verticalAlign: 'middle'
                  }}>
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function CustomDonutChart({ data }: { data: { category: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let accumulatedAngle = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-6)', padding: 'var(--space-4) var(--space-2)' }}>
      <div style={{ position: 'relative', width: 130, height: 130 }}>
        <svg width="100%" height="100%" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
          {total === 0 ? (
            <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="var(--surface-3)" strokeWidth="5.5" />
          ) : (
            data.map((item, idx) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = 100 - accumulatedAngle;
              accumulatedAngle += percentage;
              return (
                <circle
                  key={idx}
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="5.5"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              );
            })
          )}
          <circle cx="21" cy="21" r="12" fill="var(--surface-1)" />
        </svg>
        <div style={{ 
          position: 'absolute', 
          top: '52%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          textAlign: 'center' 
        }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{total}</div>
          <div style={{ fontSize: '8px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Participants</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {data.map((item, idx) => {
          const percentage = total > 0 ? ((item.value / total) * 100).toFixed(0) : '0';
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontSize: '11px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: item.color }} />
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{item.category}</span>
              </div>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.value} ({percentage}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CustomOccupancyChart({ data }: { data: { category: string; value: number; capacity: number; color: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: 'var(--space-2)' }}>
      {data.map((item, idx) => {
        const percent = Math.min((item.value / item.capacity) * 100, 100);
        return (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.category}</span>
              <span style={{ color: 'var(--text-secondary)' }}>
                {item.value} / <span style={{ color: 'var(--text-tertiary)' }}>{item.capacity} max</span>
              </span>
            </div>
            <div style={{ 
              width: '100%', 
              height: 6, 
              background: 'var(--surface-3)', 
              borderRadius: 'var(--radius-full)', 
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ 
                width: `${percent}%`, 
                height: '100%', 
                background: item.color, 
                borderRadius: 'var(--radius-full)',
                boxShadow: `0 0 6px ${item.color}60`,
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>
        );
      })}
      {data.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
          No venue zones configured
        </div>
      )}
    </div>
  );
}

export default function Organizer() {
  const { currentUser, currentEvent, setCurrentEvent, addToast } = useStore();
  const navigate = useNavigate();

  // Redirect if not organizer
  React.useEffect(() => {
    if (currentUser && currentUser.role !== 'organizer') {
      addToast('Access denied: Organizer role required', 'error');
      navigate('/dashboard');
    }
  }, [currentUser, navigate, addToast]);

  const [activeTab, setActiveTab] = React.useState<'analytics' | 'zones' | 'sessions' | 'roles' | 'users' | 'branding' | 'settings' | 'audits'>('analytics');
  const [analytics, setAnalytics] = React.useState<any>(null);
  const [zones, setZones] = React.useState<any[]>([]);
  const [usersList, setUsersList] = React.useState<any[]>([]);
  const [memberships, setMemberships] = React.useState<any[]>([]);
  const [sessions, setSessions] = React.useState<any[]>([]);
  const [roles, setRoles] = React.useState<any[]>([]);
  const [auditLogs, setAuditLogs] = React.useState<any[]>([]);
  const [eventBusLogs, setEventBusLogs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Form states for creating zones
  const [newZoneName, setNewZoneName] = React.useState('');
  const [newZoneIcon, setNewZoneIcon] = React.useState('coffee');
  const [newZoneColor, setNewZoneColor] = React.useState('#6366F1');
  const [newZoneCapacity, setNewZoneCapacity] = React.useState(100);

  // Form states for sessions schedule builder
  const [newSessionTitle, setNewSessionTitle] = React.useState('');
  const [newSessionDesc, setNewSessionDesc] = React.useState('');
  const [newSessionType, setNewSessionType] = React.useState('talk');
  const [newSessionZone, setNewSessionZone] = React.useState('');
  const [newSessionSpeaker, setNewSessionSpeaker] = React.useState('');
  const [newSessionStart, setNewSessionStart] = React.useState('');
  const [newSessionEnd, setNewSessionEnd] = React.useState('');

  // Form states for custom roles designer
  const [newRoleName, setNewRoleName] = React.useState('');
  const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>(['accept_meetings']);

  // Config settings states
  const [confName, setConfName] = React.useState('');
  const [confDesc, setConfDesc] = React.useState('');
  const [isActive, setIsActive] = React.useState(false);
  const [allowConnections, setAllowConnections] = React.useState(true);
  const [allowPresence, setAllowPresence] = React.useState(true);
  const [allowAiMatching, setAllowAiMatching] = React.useState(true);
  const [allowRegistration, setAllowRegistration] = React.useState(true);
  const [allowMessaging, setAllowMessaging] = React.useState(true);
  const [allowSponsorDiscovery, setAllowSponsorDiscovery] = React.useState(true);
  const [allowSessionRecs, setAllowSessionRecs] = React.useState(true);

  // Branding states
  const [logo, setLogo] = React.useState('');
  const [themeColor, setThemeColor] = React.useState('#6366F1');
  const [timezone, setTimezone] = React.useState('UTC');
  const [dates, setDates] = React.useState('');

  const AVAILABLE_PERMISSIONS = [
    { key: 'create_sessions', label: 'Create & Edit Sessions' },
    { key: 'manage_slides', label: 'Upload Slides & Slideshows' },
    { key: 'accept_meetings', label: 'Accept Matches & Calendar Invites' },
    { key: 'view_analytics', label: 'Access Overview Analytics' },
    { key: 'moderate_users', label: 'Mute/Suspend Attendee Memberships' },
    { key: 'manage_zones', label: 'Create & Modify Venue Zones' },
  ];

  // Fetch data
  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const eventId = currentEvent?.id || 'default';
      const [anData, znData, usrData, cfgData, mbrData, sessData, rolesData, auditData] = await Promise.all([
        api.getAnalyticsOverview().catch(() => null),
        api.getZoneAnalytics().catch(() => []),
        api.getUsers(eventId).catch(() => []),
        api.getEventConfig(eventId).catch(() => null),
        api.listMemberships(eventId).catch(() => []),
        api.listSessions(eventId).catch(() => []),
        api.listRoles(eventId).catch(() => []),
        api.getAuditLogs(eventId).catch(() => []),
      ]);

      setAnalytics(anData);
      setZones(znData);
      setUsersList(usrData);
      setMemberships(mbrData);
      setSessions(sessData);
      setRoles(rolesData);
      setAuditLogs(auditData);

      if (cfgData) {
        setConfName(cfgData.name || '');
        setConfDesc(cfgData.description || '');
        setIsActive(cfgData.is_active || false);
        setAllowConnections(cfgData.allow_connections !== false);
        setAllowPresence(cfgData.allow_presence !== false);
        setAllowAiMatching(cfgData.allow_ai_matching !== false);
        setAllowRegistration(cfgData.allow_registration !== false);
        setAllowMessaging(cfgData.allow_messaging !== false);
        setAllowSponsorDiscovery(cfgData.allow_sponsor_discovery !== false);
        setAllowSessionRecs(cfgData.allow_session_recs !== false);
        setLogo(cfgData.logo || '');
        setThemeColor(cfgData.theme_color || '#6366F1');
        setTimezone(cfgData.timezone || 'UTC');
        setDates(cfgData.dates || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [currentEvent]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Simulate Socket.IO telemetry for the Event Bus Logs
  React.useEffect(() => {
    const mockInterval = setInterval(() => {
      const mockTypes = ['USER_AVAILABLE', 'USER_BUSY', 'CONNECTION_REQUESTED', 'CONNECTION_ACCEPTED', 'ZONE_CHANGED', 'MISSION_COMPLETED'];
      const mockNames = ['Sarah Kim', 'Alex Rivera', 'Elena Rostova', 'Marcus Brody', 'Vikram Singh'];
      const randomType = mockTypes[Math.floor(Math.random() * mockTypes.length)];
      const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];

      const newLog = {
        id: Math.random().toString(36).substring(7),
        type: randomType,
        payload: { user: randomName, timestamp: new Date().toLocaleTimeString() },
        status: 'processed',
        timestamp: new Date()
      };

      setEventBusLogs((prev) => [newLog, ...prev].slice(0, 8));
    }, 4000);

    return () => clearInterval(mockInterval);
  }, []);

  // Zone Operations
  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName) return;
    try {
      await api.createZone({
        name: newZoneName,
        icon: newZoneIcon,
        color: newZoneColor,
        capacity: newZoneCapacity,
        event_id: currentEvent?.id || 'default',
      });
      addToast('Zone created successfully', 'success');
      setNewZoneName('');
      fetchData();
    } catch {
      addToast('Failed to create zone', 'error');
    }
  };

  const handleDeleteZone = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this zone?')) return;
    try {
      await api.deleteZone(id);
      addToast('Zone deleted successfully', 'success');
      fetchData();
    } catch {
      addToast('Failed to delete zone', 'error');
    }
  };

  // Session Operations
  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionTitle) return;
    try {
      await api.createSession({
        event_id: currentEvent?.id || 'default',
        title: newSessionTitle,
        description: newSessionDesc,
        type: newSessionType,
        zone_name: newSessionZone || 'Main Hall',
        speaker_id: newSessionSpeaker || undefined,
        start_time: newSessionStart ? new Date(newSessionStart) : undefined,
        end_time: newSessionEnd ? new Date(newSessionEnd) : undefined,
      });
      addToast('Session scheduled successfully', 'success');
      setNewSessionTitle('');
      setNewSessionDesc('');
      setNewSessionSpeaker('');
      fetchData();
    } catch {
      addToast('Failed to schedule session', 'error');
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    try {
      await api.deleteSession(id);
      addToast('Session removed from schedule', 'success');
      fetchData();
    } catch {
      addToast('Failed to delete session', 'error');
    }
  };

  // Role Operations
  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName) return;
    try {
      await api.createRole(currentEvent?.id || 'default', {
        name: newRoleName,
        permissions: selectedPermissions,
      });
      addToast(`Role "${newRoleName}" registered in RBAC`, 'success');
      setNewRoleName('');
      setSelectedPermissions(['accept_meetings']);
      fetchData();
    } catch {
      addToast('Failed to create custom role', 'error');
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      await api.deleteRole(id);
      addToast('Role deleted', 'success');
      fetchData();
    } catch {
      addToast('Failed to delete role', 'error');
    }
  };

  // User Moderation status & role promotions
  const handleUpdateMembershipRole = async (userId: string, newRole: string) => {
    try {
      await api.updateUserRole(userId, currentEvent?.id || 'default', newRole);
      addToast('User role promoted/changed', 'success');
      fetchData();
    } catch {
      addToast('Failed to change user role', 'error');
    }
  };

  const handleUpdateMembershipStatus = async (userId: string, status: string) => {
    try {
      await api.updateUserStatus(userId, currentEvent?.id || 'default', status);
      addToast(`User membership status updated to ${status.toUpperCase()}`, 'success');
      fetchData();
    } catch {
      addToast('Failed to update membership status', 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to completely delete this user?')) return;
    try {
      await api.deleteUser(userId);
      addToast('User deleted from platform', 'success');
      fetchData();
    } catch {
      addToast('Failed to delete user', 'error');
    }
  };

  // Save Settings & Branding Configurations
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updateEventConfig(currentEvent?.id || 'default', {
        name: confName,
        description: confDesc,
        is_active: isActive,
        allow_connections: allowConnections,
        allow_presence: allowPresence,
        allow_ai_matching: allowAiMatching,
        allow_registration: allowRegistration,
        allow_messaging: allowMessaging,
        allow_sponsor_discovery: allowSponsorDiscovery,
        allow_session_recs: allowSessionRecs,
        logo,
        theme_color: themeColor,
        timezone,
        dates,
      });
      setCurrentEvent(updated);
      addToast('Conference settings saved successfully', 'success');
      fetchData();
    } catch {
      addToast('Failed to save configuration', 'error');
    }
  };

  const getZoneIconSvg = (iconName: string) => {
    switch (iconName) {
      case '🎤':
      case 'speaker':
      case 'award':
        return <Icons.award size={16} />;
      case '☕':
      case 'coffee':
      case 'lounge':
        return <Icons.coffee size={16} />;
      case '🔧':
      case 'workshop':
      case 'settings':
        return <Icons.settings size={16} />;
      case '🏢':
      case 'expo':
      case 'home':
        return <Icons.home size={16} />;
      case '🤝':
      case 'networking':
      case 'users':
        return <Icons.users size={16} />;
      case '📚':
      case 'quiet':
      case 'compass':
        return <Icons.compass size={16} />;
      default:
        return <Icons.mapPin size={16} />;
    }
  };

  const roleDistributionData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    memberships.forEach((m) => {
      const r = m.role || 'attendee';
      counts[r] = (counts[r] || 0) + 1;
    });
    const ROLE_COLORS: Record<string, string> = {
      organizer: '#f43f5e',   // Rose
      speaker: '#c084fc',     // Purple
      moderator: '#38bdf8',   // Sky/Blue
      attendee: '#6366f1',    // Indigo
      sponsor: '#fb923c',     // Orange
      recruiter: '#10b981',   // Emerald
      volunteer: '#94a3b8',   // Slate/Gray
    };
    return Object.entries(counts).map(([category, value]) => {
      const catKey = category.toLowerCase();
      return {
        category,
        value,
        color: ROLE_COLORS[catKey] || '#818cf8',
      };
    });
  }, [memberships]);

  if (loading) {
    return (
      <div className="page" style={{ padding: 'var(--space-8)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="skeleton" style={{ height: 48, width: 250 }} />
          <div className="grid-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 100 }} />)}
          </div>
        </div>
      </div>
    );
  }

  const metrics = analytics ? [
    { icon: <Icons.users size={20} />, label: 'Active Memberships', value: memberships.length, change: 15, changeLabel: 'total' },
    { icon: <Icons.link size={20} />, label: 'Connections Made', value: analytics.connectionsMade, change: 23, changeLabel: 'today' },
    { icon: <Icons.calendar size={20} />, label: 'Scheduled Sessions', value: sessions.length, change: 4, changeLabel: 'added' },
    { icon: <Icons.target size={20} />, label: 'Active Custom Roles', value: roles.length, change: 0, changeLabel: 'RBAC' },
    { icon: <Icons.wifi size={20} />, label: 'Auditable Events', value: auditLogs.length, change: 10, changeLabel: 'logs' },
    { icon: <Icons.clock size={20} />, label: 'Pending Requests', value: analytics.pendingRequests },
  ] : [];

  return (
    <div className="page animate-fade-in" style={{ padding: 'var(--space-6) var(--space-8)' }}>
      
      {/* Studio Header */}
      <div className="page-header" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Icons.settings size={24} color="var(--primary)" />
            <h1 className="page-title" style={{ margin: 0 }}>{confName || 'Conference OS'} Studio</h1>
            <span className={`badge ${isActive ? 'badge-primary' : 'badge-secondary'}`}>
              {isActive ? 'LIVE / PUBLIC' : 'UNDER SETUP'}
            </span>
          </div>
          <p className="page-subtitle" style={{ marginTop: 4 }}>Shopify-style control hub for event branding, RBAC permission roles, scheduling, and user moderation.</p>
        </div>
      </div>

      {/* Studio Tabs Navigation */}
      <div className="org-tabs" style={{ display: 'flex', overflowX: 'auto', gap: 8, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8, marginBottom: 'var(--space-6)' }}>
        <button className={`org-tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
          <Icons.activity size={14} /> Dashboard
        </button>
        <button className={`org-tab-btn ${activeTab === 'branding' ? 'active' : ''}`} onClick={() => setActiveTab('branding')}>
          <Icons.award size={14} /> Theme & Branding
        </button>
        <button className={`org-tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <Icons.sliders size={14} /> Module Toggles
        </button>
        <button className={`org-tab-btn ${activeTab === 'zones' ? 'active' : ''}`} onClick={() => setActiveTab('zones')}>
          <Icons.map size={14} /> Venue Builder
        </button>
        <button className={`org-tab-btn ${activeTab === 'sessions' ? 'active' : ''}`} onClick={() => setActiveTab('sessions')}>
          <Icons.calendar size={14} /> Schedule Builder
        </button>
        <button className={`org-tab-btn ${activeTab === 'roles' ? 'active' : ''}`} onClick={() => setActiveTab('roles')}>
          <Icons.shield size={14} /> Role Designer
        </button>
        <button className={`org-tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          <Icons.users size={14} /> Users & Moderation
        </button>
        <button className={`org-tab-btn ${activeTab === 'audits' ? 'active' : ''}`} onClick={() => setActiveTab('audits')}>
          <Icons.clock size={14} /> Audit Trail
        </button>
      </div>

      {/* 1. ANALYTICS & EVENT BUS DASHBOARD */}
      {activeTab === 'analytics' && (
        <div className="animate-fade-in">
          <div className="grid-3 stagger" style={{ marginBottom: 'var(--space-6)' }}>
            {metrics.map((m) => (
              <StatCard key={m.label} icon={m.icon} label={m.label} value={m.value} change={m.change} changeLabel={m.changeLabel} />
            ))}
          </div>

          {/* Visual Telemetry Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: 'var(--space-6)' }}>
            <div className="card animate-fade-in-up" style={{ padding: 'var(--space-5)', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>
                Real-time Venue Room Occupancy
              </div>
              <CustomOccupancyChart
                data={zones.map(z => ({
                  category: z.zone,
                  value: z.count || 0,
                  capacity: z.capacity || 100,
                  color: z.color || '#6366F1'
                }))}
              />
            </div>
            <div className="card animate-fade-in-up" style={{ padding: 'var(--space-5)', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>
                Participants Role Breakdown
              </div>
              <CustomDonutChart data={roleDistributionData} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            
            {/* Live Venue Status */}
            <div>
              <div className="section-header" style={{ marginBottom: 'var(--space-4)' }}>
                <h3 className="section-title">Crowd Density Tracking</h3>
              </div>
              <div className="org-zones-grid">
                {zones.map((zone: any) => (
                  <div key={zone.zone} className="org-zone-card card">
                    <div className="org-zone-header">
                      <span className="org-zone-icon" style={{ background: `${zone.color}22`, color: zone.color }}>
                        {getZoneIconSvg(zone.icon)}
                      </span>
                      <div>
                        <div className="org-zone-name">{zone.zone}</div>
                        <div className="org-zone-count">{zone.count} checked-in networkers</div>
                      </div>
                    </div>
                    <div className="org-zone-bar">
                      <div className="org-zone-bar-fill" style={{ width: `${Math.min(100, (zone.count / (zone.capacity || 100)) * 100)}%`, background: zone.color }} />
                    </div>
                    <div className="org-zone-topics">
                      {(zone.topics || []).map((t: string) => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outbox Pipeline Real-Time Log */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ fontWeight: 600, fontSize: 13, color: 'var(--primary)', margin: 0 }}>Real-Time Event Bus (NATS/Outbox)</h4>
                <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 10, background: 'var(--surface-3)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>LIVE PIPELINE</span>
              </div>
              <p style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 12 }}>Audits asynchronous event loops handling analytics indices and recommendations.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {eventBusLogs.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 11 }}>Listening for queue dispatches...</div>
                ) : (
                  eventBusLogs.map((log) => (
                    <div key={log.id} style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '6px 8px', background: 'var(--surface-2)', borderRadius: 4, borderLeft: '3px solid var(--primary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, fontWeight: 'bold', fontFamily: 'monospace' }}>{log.type}</span>
                        <span style={{ fontSize: 8, color: 'var(--text-tertiary)' }}>{log.payload.timestamp}</span>
                      </div>
                      <span style={{ fontSize: 9, color: 'var(--text-secondary)' }}>Payload: User {log.payload.user} triggered action</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. THEME & BRANDING */}
      {activeTab === 'branding' && (
        <div className="card animate-fade-in" style={{ maxWidth: 650 }}>
          <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Event Identity & Branding</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: 'var(--space-4)' }}>Customize theme presets and localization information for attendees.</p>
          
          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="org-form-group">
              <label>Branding Logo URL</label>
              <input type="text" value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="e.g. https://domain.com/logo.png" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="org-form-group">
                <label>Dates & Schedule Span</label>
                <input type="text" value={dates} onChange={(e) => setDates(e.target.value)} placeholder="e.g. Oct 12-14, 2026" />
              </div>
              <div className="org-form-group">
                <label>Venue Timezone</label>
                <input type="text" value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="e.g. EST (Eastern Standard)" />
              </div>
            </div>

            <div className="org-form-group">
              <label>Theme Preset Primary Color</label>
              <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                {[
                  { name: 'Indigo', color: '#6366F1' },
                  { name: 'Emerald', color: '#10B981' },
                  { name: 'Amber', color: '#F59E0B' },
                  { name: 'Rose', color: '#F43F5E' },
                  { name: 'Violet', color: '#8B5CF6' }
                ].map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setThemeColor(c.color)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: c.color,
                      border: themeColor === c.color ? '3px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transform: themeColor === c.color ? 'scale(1.08)' : 'none',
                      transition: 'all 0.1s ease'
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: 'var(--space-2)' }}>
              <Icons.check size={14} /> Update Theme Configuration
            </button>
          </form>
        </div>
      )}

      {/* 3. MODULE FEATURE TOGGLES */}
      {activeTab === 'settings' && (
        <div className="card animate-fade-in" style={{ maxWidth: 650 }}>
          <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Tenant Module Toggles</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: 'var(--space-4)' }}>Enable or gate core features of the Waypoint Operating System per conference requirement.</p>
          
          <form onSubmit={handleSaveSettings}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { title: 'Launch Conference Event', desc: 'Activate the conference tenant. If inactive, non-organizers will see an "Under Configuration" screen.', checked: isActive, setChecked: setIsActive },
                { title: 'Attendee Registry Registration', desc: 'Allow users to register their profiles and request custom roles.', checked: allowRegistration, setChecked: setAllowRegistration },
                { title: 'AI Matchmaking Compatibility', desc: 'Activate AI Twin scoring pipelines and conversation openers.', checked: allowAiMatching, setChecked: setAllowAiMatching },
                { title: 'Attendee Peer Connections', desc: 'Allow users to request connections and build professional rosters.', checked: allowConnections, setChecked: setAllowConnections },
                { title: 'Physical Venue Zones Map', desc: 'Permit users to view rooms and check-in to broadcast availability.', checked: allowPresence, setChecked: setAllowPresence },
                { title: 'Direct Messaging Chats', desc: 'Allow peer-to-peer chats and networking conversation threads.', checked: allowMessaging, setChecked: setAllowMessaging },
                { title: 'Sponsor Hub Discovery', desc: 'Enable company directories and sponsor recruiter highlights.', checked: allowSponsorDiscovery, setChecked: setAllowSponsorDiscovery },
                { title: 'Session Recommendations', desc: 'Pre-calculate personalized talks matches for participant calendars.', checked: allowSessionRecs, setChecked: setAllowSessionRecs },
              ].map((toggle, i) => (
                <div key={i} className="org-settings-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div className="org-settings-info">
                    <span className="org-settings-title" style={{ fontWeight: 600, display: 'block', fontSize: 13 }}>{toggle.title}</span>
                    <span className="org-settings-desc" style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{toggle.desc}</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={toggle.checked} onChange={(e) => toggle.setChecked(e.target.checked)} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              ))}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-6)' }}>
              <Icons.check size={14} /> Save Module Permissions
            </button>
          </form>
        </div>
      )}

      {/* 4. VENUE BUILDER */}
      {activeTab === 'zones' && (
        <div className="grid-3 animate-fade-in" style={{ gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)' }}>
          {/* Create Zone */}
          <div className="card">
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Create Venue Zone</h3>
            <form onSubmit={handleCreateZone}>
              <div className="org-form-group">
                <label>Zone Name</label>
                <input type="text" value={newZoneName} onChange={(e) => setNewZoneName(e.target.value)} placeholder="e.g. AI Lounge" required />
              </div>
              <div className="org-form-group">
                <label>Theme Color</label>
                <input type="color" value={newZoneColor} onChange={(e) => setNewZoneColor(e.target.value)} />
              </div>
              <div className="org-form-group">
                <label>Capacity limit (pax)</label>
                <input type="number" value={newZoneCapacity} onChange={(e) => setNewZoneCapacity(parseInt(e.target.value))} min={5} />
              </div>
              <div className="org-form-group">
                <label>Icon Symbol</label>
                <select value={newZoneIcon} onChange={(e) => setNewZoneIcon(e.target.value)}>
                  <option value="award">Speaker/Mic Symbol</option>
                  <option value="coffee">Coffee/Lounge Symbol</option>
                  <option value="settings">Workshop/Tools Symbol</option>
                  <option value="home">Exhibition/Expo Symbol</option>
                  <option value="users">Networking/Discussion Symbol</option>
                  <option value="compass">Quiet/Study Symbol</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-3)' }}>
                <Icons.plus size={16} /> Add Zone to Venue
              </button>
            </form>
          </div>

          {/* Zones list */}
          <div className="card">
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Active Venue Zones</h3>
            <div className="org-table-wrapper" style={{ marginTop: 'var(--space-4)' }}>
              <CustomTable
                data={zones}
                height="300px"
                columns={[
                  {
                    header: 'Zone Name',
                    render: (item: any) => (
                      <div style={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                        <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: item.color || '#ccc', marginRight: 8 }} />
                        {item.zone}
                      </div>
                    )
                  },
                  {
                    header: 'Icon Type',
                    render: (item: any) => (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {getZoneIconSvg(item.icon)}
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{item.icon}</span>
                      </div>
                    )
                  },
                  {
                    header: 'Capacity Limit',
                    render: (item: any) => (
                      <span>{item.capacity || 'Unlimited'} pax</span>
                    )
                  },
                  {
                    header: 'Actions',
                    width: '80px',
                    render: (item: any) => (
                      <div style={{ textAlign: 'right' }}>
                        <button type="button" className="btn btn-icon btn-ghost btn-sm" onClick={() => handleDeleteZone(item.id || item.zone)} style={{ color: 'var(--error)' }}>
                          <Icons.trash size={14} />
                        </button>
                      </div>
                    )
                  }
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. SCHEDULE / SESSION BUILDER */}
      {activeTab === 'sessions' && (
        <div className="grid-3 animate-fade-in" style={{ gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)' }}>
          {/* Create Session */}
          <div className="card">
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Schedule New Session</h3>
            <form onSubmit={handleCreateSession} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="org-form-group">
                <label>Session Title *</label>
                <input type="text" value={newSessionTitle} onChange={(e) => setNewSessionTitle(e.target.value)} placeholder="e.g. NextJS 16 Deep Dive" required />
              </div>
              <div className="org-form-group">
                <label>Description</label>
                <textarea value={newSessionDesc} onChange={(e) => setNewSessionDesc(e.target.value)} placeholder="Session abstract..." rows={3} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div className="org-form-group">
                  <label>Session Type</label>
                  <select value={newSessionType} onChange={(e) => setNewSessionType(e.target.value)}>
                    <option value="keynote">Keynote</option>
                    <option value="talk">Tech Talk</option>
                    <option value="workshop">Workshop</option>
                    <option value="panel">Panel Discussion</option>
                    <option value="meetup">Meetup</option>
                  </select>
                </div>
                <div className="org-form-group">
                  <label>Venue Zone Location</label>
                  <select value={newSessionZone} onChange={(e) => setNewSessionZone(e.target.value)}>
                    <option value="">Choose Location...</option>
                    {zones.map((z) => (
                      <option key={z.zone} value={z.zone}>{z.zone}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="org-form-group">
                <label>Assign Speaker Profile</label>
                <select value={newSessionSpeaker} onChange={(e) => setNewSessionSpeaker(e.target.value)}>
                  <option value="">Select Speaker...</option>
                  {usersList.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div className="org-form-group">
                  <label>Start Time</label>
                  <input type="datetime-local" value={newSessionStart} onChange={(e) => setNewSessionStart(e.target.value)} />
                </div>
                <div className="org-form-group">
                  <label>End Time</label>
                  <input type="datetime-local" value={newSessionEnd} onChange={(e) => setNewSessionEnd(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
                <Icons.plus size={16} /> Schedule Session
              </button>
            </form>
          </div>

          {/* Sessions list */}
          <div className="card">
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Conference Schedule Calendar</h3>
            <div className="org-table-wrapper" style={{ marginTop: 'var(--space-4)' }}>
              <CustomTable
                data={sessions}
                height="320px"
                columns={[
                  {
                    header: 'Session Title',
                    render: (item: any) => (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                          {item.start_time ? new Date(item.start_time).toLocaleString() : 'No time scheduled'}
                        </span>
                      </div>
                    )
                  },
                  {
                    header: 'Type',
                    render: (item: any) => (
                      <span className="tag" style={{ textTransform: 'uppercase' }}>{item.type}</span>
                    )
                  },
                  {
                    header: 'Zone Location',
                    render: (item: any) => (
                      <span>{item.zone_name || 'N/A'}</span>
                    )
                  },
                  {
                    header: 'Speaker',
                    render: (item: any) => (
                      <span>{item.speaker ? item.speaker.name : 'Unassigned'}</span>
                    )
                  },
                  {
                    header: 'Actions',
                    width: '80px',
                    render: (item: any) => (
                      <div style={{ textAlign: 'right' }}>
                        <button type="button" className="btn btn-icon btn-ghost btn-sm" onClick={() => handleDeleteSession(item.id)} style={{ color: 'var(--error)' }}>
                          <Icons.trash size={14} />
                        </button>
                      </div>
                    )
                  }
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. ROLE DESIGNER (RBAC) */}
      {activeTab === 'roles' && (
        <div className="grid-3 animate-fade-in" style={{ gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)' }}>
          {/* Create Custom Role */}
          <div className="card">
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Dynamic Role Designer</h3>
            <form onSubmit={handleCreateRole} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="org-form-group">
                <label>Role Name *</label>
                <input type="text" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} placeholder="e.g. Volunteer" required />
              </div>
              
              <div className="org-form-group">
                <label>Role Permissions Scope</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
                  {AVAILABLE_PERMISSIONS.map((perm) => (
                    <label key={perm.key} className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm.key)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPermissions([...selectedPermissions, perm.key]);
                          } else {
                            setSelectedPermissions(selectedPermissions.filter((k) => k !== perm.key));
                          }
                        }}
                      />
                      {perm.label}
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
                <Icons.plus size={16} /> Register Role
              </button>
            </form>
          </div>

          {/* Active Roles & Permissions list */}
          <div className="card">
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>RBAC System Configuration</h3>
            <div className="org-table-wrapper" style={{ marginTop: 'var(--space-4)' }}>
              <CustomTable
                data={roles}
                height="320px"
                columns={[
                  {
                    header: 'Role Title',
                    render: (item: any) => (
                      <span style={{ fontWeight: 600, textTransform: 'capitalize', color: 'var(--text-primary)' }}>{item.name}</span>
                    )
                  },
                  {
                    header: 'Allowed Permissions Scope',
                    render: (item: any) => (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {(item.permissions || []).map((p: string) => (
                          <span key={p} className="tag" style={{ fontSize: 9, background: 'var(--surface-3)', border: '1px solid var(--border-subtle)' }}>{p.replace('_', ' ')}</span>
                        ))}
                      </div>
                    )
                  },
                  {
                    header: 'Actions',
                    width: '120px',
                    render: (item: any) => (
                      <div style={{ textAlign: 'right' }}>
                        {['organizer', 'moderator', 'speaker', 'attendee'].includes(item.name) ? (
                          <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>SYSTEM PRESET</span>
                        ) : (
                          <button type="button" className="btn btn-icon btn-ghost btn-sm" onClick={() => handleDeleteRole(item.id)} style={{ color: 'var(--error)' }}>
                            <Icons.trash size={14} />
                          </button>
                        )}
                      </div>
                    )
                  }
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {/* 7. USERS & MEMBERSHIP MODERATION */}
      {activeTab === 'users' && (
        <div className="card animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, margin: 0 }}>Participant Directory</h3>
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>Promote participant roles and manage suspension policies.</p>
            </div>
            <span className="tag">{memberships.length} active memberships</span>
          </div>

          <div className="org-table-wrapper" style={{ marginTop: 'var(--space-4)' }}>
            <CustomTable
              data={memberships}
              height="400px"
              columns={[
                {
                  header: 'Participant',
                  render: (item: any) => {
                    const u = item.user || {};
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name || 'Unnamed Participant'}</span>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{u.email}</span>
                      </div>
                    );
                  }
                },
                {
                  header: 'Workspace Credentials',
                  render: (item: any) => {
                    const u = item.user || {};
                    return (
                      <span>{item.title || u.title || 'Attendee'} at {item.company || u.company || 'N/A'}</span>
                    );
                  }
                },
                {
                  header: 'OS Badge Role',
                  render: (item: any) => (
                    <select
                      value={item.role}
                      onChange={(e) => handleUpdateMembershipRole(item.user_id, e.target.value)}
                      style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '4px 8px', color: 'var(--text-primary)', width: '100%', outline: 'none' }}
                    >
                      {roles.map((r) => (
                        <option key={r.id} value={r.name}>{r.name.toUpperCase()}</option>
                      ))}
                    </select>
                  )
                },
                {
                  header: 'Access Status',
                  render: (item: any) => (
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateMembershipStatus(item.user_id, e.target.value)}
                      style={{
                        background: item.status === 'suspended' ? '#EF444422' : item.status === 'muted' ? '#F59E0B22' : 'var(--surface-2)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '4px 8px',
                        color: item.status === 'suspended' ? '#EF4444' : item.status === 'muted' ? '#F59E0B' : 'var(--text-primary)',
                        fontWeight: item.status !== 'active' ? 600 : 'normal',
                        width: '100%',
                        outline: 'none'
                      }}
                    >
                      <option value="active">Active Access</option>
                      <option value="muted">Muted (No Chat/Matching)</option>
                      <option value="suspended">Suspended (Locked Out)</option>
                    </select>
                  )
                },
                {
                  header: 'Actions',
                  width: '80px',
                  render: (item: any) => {
                    const u = item.user || {};
                    return (
                      <div style={{ textAlign: 'right' }}>
                        <button type="button" className="btn btn-icon btn-ghost btn-sm" onClick={() => handleDeleteUser(item.user_id)} style={{ color: 'var(--error)' }} disabled={u.role === 'organizer'}>
                          <Icons.trash size={14} />
                        </button>
                      </div>
                    );
                  }
                }
              ]}
            />
          </div>
        </div>
      )}

      {/* 8. AUDIT TRAILS */}
      {activeTab === 'audits' && (
        <div className="card animate-fade-in">
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, margin: 0 }}>Administrative Audit Trail</h3>
            <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>Immutable ledger recording all moderation updates and role design deployments.</p>
          </div>

          <div className="org-table-wrapper" style={{ marginTop: 'var(--space-4)' }}>
            <CustomTable
              data={auditLogs}
              height="400px"
              columns={[
                {
                  header: 'Timestamp',
                  width: '200px',
                  render: (item: any) => (
                    <span style={{ fontFamily: 'monospace', color: 'var(--text-tertiary)' }}>
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  )
                },
                {
                  header: 'Administrator',
                  width: '180px',
                  render: (item: any) => (
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.actor_name}</span>
                  )
                },
                {
                  header: 'Action performed',
                  width: '220px',
                  render: (item: any) => (
                    <span className="tag" style={{ background: 'var(--surface-3)', border: '1px solid var(--border-subtle)', fontWeight: 'bold' }}>
                      {item.action}
                    </span>
                  )
                },
                {
                  header: 'Audit Logs Details',
                  render: (item: any) => (
                    <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)', fontSize: 11 }}>
                      {item.details || 'N/A'}
                    </span>
                  )
                }
              ]}
            />
          </div>
        </div>
      )}

    </div>
  );
}
