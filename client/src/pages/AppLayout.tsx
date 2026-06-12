import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Icons } from '../components/Icons';
import { CommandPalette } from '../components/ui';
import { api } from '../api/client';
import './AppLayout.css';

const navItems = [
  { to: '/dashboard', icon: Icons.home, label: 'Dashboard' },
  { to: '/recommendations', icon: Icons.compass, label: 'Discover' },
  { to: '/connections', icon: Icons.users, label: 'Connections' },
  { to: '/networking', icon: Icons.map, label: 'Networking' },
  { to: '/schedule', icon: Icons.calendar, label: 'Schedule' },
];

const bottomNavItems = [
  { to: '/organizer', icon: Icons.barChart, label: 'Organizer' },
  { to: '/profile', icon: Icons.user, label: 'Profile' },
  { to: '/settings', icon: Icons.settings, label: 'Settings' },
];

export default function AppLayout() {
  const { currentUser, currentEvent, sidebarOpen, toggleSidebar, commandPaletteOpen, setCommandPaletteOpen, logout } = useStore();
  const [eventConfig, setEventConfig] = React.useState<any>(null);
  const [loadingConfig, setLoadingConfig] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    api.getEventConfig(currentEvent?.id || 'default')
      .then(setEventConfig)
      .catch(() => null)
      .finally(() => setLoadingConfig(false));
  }, [currentUser, currentEvent, navigate]);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!currentUser) return null;

  if (loadingConfig) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="skeleton" style={{ width: 120, height: 40 }} />
      </div>
    );
  }

  // If event is inactive and current user is not organizer, block access
  if (eventConfig && !eventConfig.is_active && currentUser.role !== 'organizer') {
    return (
      <div className="page animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center', padding: '0 var(--space-6)' }}>
        <div className="card" style={{ maxWidth: 500, padding: 'var(--space-8)' }}>
          <div style={{ color: 'var(--primary)', marginBottom: 'var(--space-4)' }}>
            <Icons.lock size={48} />
          </div>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Event Under Configuration</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
            The event organizer is currently designing the venue zones, setting permissions, and preparing the conference intelligence platform.
          </p>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', background: 'var(--surface-2)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
            Please wait until the event is officially launched by the organizer. You will be automatically entered once preparation is complete.
          </div>
          <button className="btn btn-secondary" onClick={logout} style={{ marginTop: 'var(--space-6)', width: '100%' }}>
            <Icons.logOut size={14} /> Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-layout ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      {/* Sidebar */}
      <aside className="sidebar" role="navigation" aria-label="Main navigation">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">◆</span>
            {sidebarOpen && <span className="sidebar-logo-text">Waypoint</span>}
          </div>
          <button className="btn btn-icon btn-ghost btn-sm" onClick={toggleSidebar} aria-label="Toggle sidebar">
            <Icons.menu size={16} />
          </button>
        </div>

        {/* Search trigger */}
        {sidebarOpen && (
          <button className="sidebar-search" onClick={() => setCommandPaletteOpen(true)}>
            <Icons.search size={14} />
            <span>Search...</span>
            <kbd>⌘K</kbd>
          </button>
        )}

        <nav className="sidebar-nav">
          {navItems
            .filter((item) => {
              if (item.to === '/connections' && eventConfig?.allow_connections === false) return false;
              if (item.to === '/networking' && eventConfig?.allow_presence === false) return false;
              if (item.to === '/recommendations' && eventConfig?.allow_ai_matching === false) return false;
              return true;
            })
            .map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <item.icon size={18} />
                {sidebarOpen && <span>{item.label}</span>}
              </NavLink>
            ))}
        </nav>

        <div className="sidebar-spacer" />

        <nav className="sidebar-nav sidebar-nav-bottom">
          {bottomNavItems
            .filter((item) => item.to !== '/organizer' || currentUser?.role === 'organizer')
            .map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <item.icon size={18} />
                {sidebarOpen && <span>{item.label}</span>}
              </NavLink>
            ))}
        </nav>

        {/* Current User */}
        {sidebarOpen && (
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {currentUser.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{currentUser.name}</div>
              <div className="sidebar-user-role">{currentUser.title}</div>
            </div>
            <button className="btn btn-icon btn-ghost btn-sm" onClick={logout} aria-label="Sign out" title="Sign out">
              <Icons.logOut size={16} />
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Overlays */}
      <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  );
}
