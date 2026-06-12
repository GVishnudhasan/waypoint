import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { api } from '../api/client';
import { Icons } from '../components/Icons';
import './Landing.css';

const organizerStepperItems = [
  { label: 'Profile' },
  { label: 'Config' },
  { label: 'Features' },
  { label: 'Roles' },
  { label: 'Venue' },
  { label: 'Rules' },
  { label: 'Publish' }
];

export default function Landing() {
  const navigate = useNavigate();
  const { setCurrentUser, currentEvent, setCurrentEvent, addToast } = useStore();
  const [events, setEvents] = React.useState<any[]>([]);
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  // Form states for creating a new conference (7-Step Wizard)
  const [wizardStep, setWizardStep] = React.useState(0); // 0 to 6
  const [eventId, setEventId] = React.useState('');
  const [eventName, setEventName] = React.useState('');
  const [eventDesc, setEventDesc] = React.useState('');
  
  // Organizer details
  const [orgName, setOrgName] = React.useState('');
  const [orgEmail, setOrgEmail] = React.useState('');
  const [orgTitle, setOrgTitle] = React.useState('Director of Events');
  const [orgCompany, setOrgCompany] = React.useState('Waypoint Devs');

  // Branding & Details
  const [dates, setDates] = React.useState('');
  const [timezone, setTimezone] = React.useState('EST');
  const [themeColor, setThemeColor] = React.useState('#6366F1');
  const [eventWebsite, setEventWebsite] = React.useState('https://waypoint.event');
  const [eventLogo, setEventLogo] = React.useState('');

  // Conf Type & Format
  const [confType, setConfType] = React.useState('technology');
  const [confFormat, setConfFormat] = React.useState('in-person');
  const [expectedAttendees, setExpectedAttendees] = React.useState(250);

  // Feature Toggles
  const [allowConnections, setAllowConnections] = React.useState(true);
  const [allowPresence, setAllowPresence] = React.useState(true);
  const [allowAiMatching, setAllowAiMatching] = React.useState(true);
  const [allowRegistration, setAllowRegistration] = React.useState(true);
  const [allowMessaging, setAllowMessaging] = React.useState(true);
  const [allowSponsorDiscovery, setAllowSponsorDiscovery] = React.useState(true);
  const [allowSessionRecs, setAllowSessionRecs] = React.useState(true);
  const [allowGamification, setAllowGamification] = React.useState(true);
  const [allowMissionTracking, setAllowMissionTracking] = React.useState(true);
  const [allowCommunityFeed, setAllowCommunityFeed] = React.useState(true);

  // Role Configuration
  const [rolesList, setRolesList] = React.useState([
    { name: 'attendee', permissions: ['accept_meetings'] },
    { name: 'speaker', permissions: ['create_sessions', 'manage_slides', 'accept_meetings'] },
    { name: 'panelist', permissions: ['accept_meetings'] },
    { name: 'moderator', permissions: ['moderate_users', 'view_analytics'] },
    { name: 'sponsor', permissions: ['accept_meetings'] },
  ]);
  const [newRoleName, setNewRoleName] = React.useState('');
  const [newRolePermissions, setNewRolePermissions] = React.useState<string[]>(['accept_meetings']);

  // Venue Builder zones state
  const [venueZones, setVenueZones] = React.useState([
    { name: 'Main Keynote Hall', capacity: 300, color: '#10B981', icon: 'award' },
    { name: 'Sponsor Expo Hall', capacity: 150, color: '#F59E0B', icon: 'home' },
    { name: 'Coffee Lounge', capacity: 100, color: '#EF4444', icon: 'coffee' },
    { name: 'VIP Lounge', capacity: 50, color: '#8B5CF6', icon: 'shield' },
  ]);
  const [newZoneName, setNewZoneName] = React.useState('');
  const [newZoneCapacity, setNewZoneCapacity] = React.useState(100);
  const [newZoneColor, setNewZoneColor] = React.useState('#6366F1');
  const [newZoneIcon, setNewZoneIcon] = React.useState('coffee');

  const getZoneIconSvg = (iconName: string, size = 16) => {
    switch (iconName) {
      case 'award':
      case '🎤':
        return <Icons.award size={size} />;
      case 'coffee':
      case '☕':
        return <Icons.coffee size={size} />;
      case 'settings':
      case '🔧':
        return <Icons.settings size={size} />;
      case 'home':
      case '🏢':
      case '🎪':
        return <Icons.home size={size} />;
      case 'shield':
      case '🏆':
        return <Icons.shield size={size} />;
      case 'users':
      case '🤝':
        return <Icons.users size={size} />;
      case 'compass':
      case '📚':
        return <Icons.compass size={size} />;
      default:
        return <Icons.mapPin size={size} />;
    }
  };

  // Networking Rules
  const [ruleCanMessage, setRuleCanMessage] = React.useState(true);
  const [ruleCanSeeProfiles, setRuleCanSeeProfiles] = React.useState(true);
  const [ruleShareLinkedIn, setRuleShareLinkedIn] = React.useState(true);
  const [ruleShareGitHub, setRuleShareGitHub] = React.useState(true);
  const [ruleCanSeeLocation, setRuleCanSeeLocation] = React.useState(true);
  const [ruleCanScheduleMeetings, setRuleCanScheduleMeetings] = React.useState(true);
  const [ruleCanAppearInDiscovery, setRuleCanAppearInDiscovery] = React.useState(true);
  const [ruleCanOptOut, setRuleCanOptOut] = React.useState(true);

  const handleAddRole = () => {
    if (!newRoleName) return;
    if (rolesList.some(r => r.name.toLowerCase() === newRoleName.toLowerCase())) {
      addToast('Role already exists', 'error');
      return;
    }
    setRolesList([...rolesList, { name: newRoleName.toLowerCase(), permissions: newRolePermissions }]);
    setNewRoleName('');
    setNewRolePermissions(['accept_meetings']);
  };

  const handleRemoveRole = (name: string) => {
    if (['organizer', 'attendee', 'speaker'].includes(name.toLowerCase())) {
      addToast('Cannot remove core system roles', 'error');
      return;
    }
    setRolesList(rolesList.filter(r => r.name !== name));
  };

  const handleAddZone = () => {
    if (!newZoneName) return;
    if (venueZones.some(z => z.name.toLowerCase() === newZoneName.toLowerCase())) {
      addToast('Zone already exists', 'error');
      return;
    }
    setVenueZones([...venueZones, {
      name: newZoneName,
      capacity: newZoneCapacity,
      color: newZoneColor,
      icon: newZoneIcon
    }]);
    setNewZoneName('');
    setNewZoneCapacity(100);
    setNewZoneColor('#6366F1');
  };

  const handleRemoveZone = (name: string) => {
    setVenueZones(venueZones.filter(z => z.name !== name));
  };

  const fetchEvents = async () => {
    try {
      const list = await api.listEventConfigs();
      setEvents(list);
      if (list.length > 0 && !currentEvent) {
        // Default to first event
        setCurrentEvent(list[0]);
      }
    } catch (e) {
      console.error('Failed to load events', e);
    }
  };

  React.useEffect(() => {
    fetchEvents();
  }, []);

  React.useEffect(() => {
    if (currentEvent) {
      api.getUsers(currentEvent.id, 6)
        .then(setUsers)
        .catch(() => setUsers([]));
    } else {
      setUsers([]);
    }
  }, [currentEvent]);

  const handleQuickLogin = async (user: any) => {
    setLoading(true);
    setCurrentUser(user);
    navigate('/dashboard');
  };

  const handleCreateEvent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!eventId || !eventName || !orgName || !orgEmail) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }

    try {
      // 1. Create the event config (Tenant)
      await api.createEventConfig({
        id: eventId,
        name: eventName,
        description: eventDesc,
        is_active: true, // Make active immediately
        allow_connections: allowConnections,
        allow_presence: allowPresence,
        allow_ai_matching: allowAiMatching,
        allow_registration: allowRegistration,
        allow_messaging: allowMessaging,
        allow_sponsor_discovery: allowSponsorDiscovery,
        allow_session_recs: allowSessionRecs,
        dates,
        timezone,
        theme_color: themeColor,
        allowed_roles: rolesList.map(r => r.name),
        metadata: JSON.stringify({
          orgTitle,
          orgCompany,
          eventWebsite,
          eventLogo,
          confType,
          confFormat,
          expectedAttendees,
          allowGamification,
          allowMissionTracking,
          allowCommunityFeed,
          networkingRules: {
            ruleCanMessage,
            ruleCanSeeProfiles,
            ruleShareLinkedIn,
            ruleShareGitHub,
            ruleCanSeeLocation,
            ruleCanScheduleMeetings,
            ruleCanAppearInDiscovery,
            ruleCanOptOut
          }
        })
      });

      // 2. Create the custom roles
      for (const r of rolesList) {
        await api.createRole(eventId, {
          name: r.name,
          permissions: r.permissions
        }).catch(err => console.log('Role seed error:', err));
      }

      // 3. Create the venue zones
      for (const z of venueZones) {
        await api.createZone({
          event_id: eventId,
          name: z.name,
          icon: z.icon,
          color: z.color,
          capacity: z.capacity
        }).catch(err => console.log('Zone seed error:', err));
      }

      // 4. Create the default organizer user profile for this event
      const user = await api.createUser({
        name: orgName,
        email: orgEmail,
        role: 'organizer',
        title: orgTitle || 'Event Organizer',
        company: orgCompany || eventName,
        bio: `Organizer and creator of ${eventName}. Contact me for questions regarding schedules or venue zones.`,
        event_id: eventId,
        skills: ['Event Management', 'Planning'],
        interests: ['Networking'],
      });

      addToast('Conference Operating System Tenant initialized successfully!', 'success');
      
      // Refresh list and select the new event
      const list = await api.listEventConfigs();
      setEvents(list);
      const newEv = list.find((item) => item.id === eventId);
      if (newEv) {
        setCurrentEvent(newEv);
      }
      
      // Auto login as organizer
      setCurrentUser(user);
      
      // Transition to success screen
      setWizardStep(6); // Step 7 is index 6
    } catch (error: any) {
      addToast(error.message || 'Failed to list conference', 'error');
    }
  };

  const stepsData = [
    { step: '01', icon: Icons.target, title: 'Define Your Mission', desc: 'Tell us what you want to achieve — find a job, hire engineers, meet founders, or learn new skills.' },
    { step: '02', icon: Icons.zap, title: 'AI Builds Your Twin', desc: 'We analyze your profile, skills, and goals to create an AI representation of who you are.' },
    { step: '03', icon: Icons.compass, title: 'Get Smart Matches', desc: 'Receive ranked recommendations with reasons why each person, session, or sponsor matters to you.' },
    { step: '04', icon: Icons.users, title: 'Connect & Achieve', desc: 'One-tap connections with AI-generated conversation starters. Track progress toward your goals.' },
  ];

  return (
    <div className="landing animate-fade-in">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo">
            <span className="landing-logo-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <Icons.target size={20} color="var(--primary)" />
            </span>
            <span className="landing-logo-text">Waypoint</span>
          </div>
          <div className="landing-nav-links">
            <button className="btn btn-ghost" onClick={() => setShowCreateModal(true)}>
              Host Conference
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/onboarding')}>
              Join Conference
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Outcome-Driven Conference Operating Layer
        </div>
        <h1 className="hero-title">
          Stop attending conferences.<br />
          <span className="hero-title-accent">Start achieving outcomes.</span>
        </h1>
        <p className="hero-subtitle">
          Waypoint is an open intelligence layer for modern events. Customize policies, list your event, let attendees generate AI twins, and drive goal-based networking.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" onClick={() => setShowCreateModal(true)}>
            <Icons.plus size={16} /> List Your Conference
          </button>
          <a href="#conference-directory" className="btn btn-secondary btn-lg">
            <Icons.compass size={16} /> Browse Conferences
          </a>
        </div>

        {/* Global Stats */}
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">{events.length}</span>
            <span className="hero-stat-label">Conferences Active</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">12+</span>
            <span className="hero-stat-label">Venue Zones Setup</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">94%</span>
            <span className="hero-stat-label">Goal Matching Rate</span>
          </div>
        </div>
      </section>

      {/* Conference Directory Section */}
      <section id="conference-directory" className="landing-section" style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-1)' }}>
        <div className="landing-section-inner">
          <h2 className="landing-section-title">Approved Conferences</h2>
          <p className="landing-section-desc">Select an event below to configure as organizer or join as a participant</p>

          <div className="events-grid">
            {events.map((ev) => (
              <button
                key={ev.id}
                className={`event-card card-interactive ${currentEvent?.id === ev.id ? 'active' : ''}`}
                onClick={() => setCurrentEvent(ev)}
                style={{ textAlign: 'left', width: '100%', padding: 'var(--space-6)' }}
              >
                <div className="event-card-title">
                  <Icons.award size={18} color={currentEvent?.id === ev.id ? 'var(--primary)' : 'var(--text-secondary)'} />
                  {ev.name}
                </div>
                <div className="event-card-desc">{ev.description || 'No description provided.'}</div>
                <div className="event-card-meta">
                  <span className={`badge ${ev.is_active ? 'badge-success' : 'badge-warning'}`}>
                    {ev.is_active ? 'Live' : 'Configuring'}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-quaternary)' }}>
                    ID: {ev.id}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Event details & participant logs */}
      {currentEvent && (
        <section className="landing-section" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="landing-section-inner">
            <div className="card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-8)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 className="section-title" style={{ fontSize: 'var(--text-xl)', marginBottom: 4 }}>
                    Selected: {currentEvent.name}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    {currentEvent.description}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <button className="btn btn-secondary" onClick={() => navigate('/onboarding')}>
                    <Icons.plus size={16} /> Register Profile
                  </button>
                </div>
              </div>

              {/* Event specific policies */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-6)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  <Icons.check size={14} color={currentEvent.allow_connections ? 'var(--success)' : 'var(--text-quaternary)'} />
                  Peer Connections: {currentEvent.allow_connections ? 'Enabled' : 'Disabled'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  <Icons.check size={14} color={currentEvent.allow_presence ? 'var(--success)' : 'var(--text-quaternary)'} />
                  Real-time Check-ins: {currentEvent.allow_presence ? 'Enabled' : 'Disabled'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  <Icons.check size={14} color={currentEvent.allow_ai_matching ? 'var(--success)' : 'var(--text-quaternary)'} />
                  AI Twin Matching: {currentEvent.allow_ai_matching ? 'Enabled' : 'Disabled'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  <Icons.check size={14} color={currentEvent.allow_registration ? 'var(--success)' : 'var(--text-quaternary)'} />
                  Open Registration: {currentEvent.allow_registration ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>

            {users.length > 0 ? (
              <div>
                <h3 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>Enter Conference Platform</h3>
                <p className="page-subtitle" style={{ marginBottom: 'var(--space-6)' }}>Select a seeded persona for this conference to test different badge roles (Organizer, Attendee, Speaker):</p>
                <div className="demo-users-grid">
                  {users.map((u) => (
                    <button key={u.id} className="demo-user-card card card-interactive" onClick={() => handleQuickLogin(u)} disabled={loading}>
                      <div className="demo-user-avatar">{u.name.split(' ').map((n: string) => n[0]).join('')}</div>
                      <div className="demo-user-info">
                        <div className="demo-user-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {u.name}
                          <span className={`badge ${u.role === 'organizer' ? 'badge-primary' : 'badge-secondary'}`} style={{ fontSize: 9, padding: '2px 6px' }}>
                            {u.role.toUpperCase()}
                          </span>
                        </div>
                        <div className="demo-user-role">{u.title} at {u.company}</div>
                        {u.goals?.[0] && (
                          <div className="demo-user-goal">
                            <span style={{ display: 'flex', alignItems: 'center' }}><Icons.target size={10} /></span>
                            {u.goals[0].description}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                <span style={{ display: 'inline-block', marginBottom: 12 }}><Icons.users size={32} /></span>
                <h4>No registered profiles yet</h4>
                <p style={{ fontSize: 'var(--text-sm)', marginBottom: 16 }}>Be the first to join this conference event!</p>
                <button className="btn btn-primary" onClick={() => navigate('/onboarding')}>
                  Join & Register
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Host Conference Modal: Multi-Step Operating System Tenant Creator */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => { setShowCreateModal(false); setWizardStep(0); }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', width: '90%' }}>
            <div className="modal-header" style={{ padding: 'var(--space-5) var(--space-6)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="section-title" style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Configure Conference Operating System</h3>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '11px', marginTop: 2 }}>
                  Step {wizardStep + 1} of 7 — {wizardStep === 6 ? 'Success' : organizerStepperItems[wizardStep]?.label}
                </p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => { setShowCreateModal(false); setWizardStep(0); }}>
                ✕
              </button>
            </div>
            
            {/* Custom Stepper Navigation */}
            <div style={{ padding: 'var(--space-4) var(--space-6)', background: 'var(--surface-1)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
              {organizerStepperItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  <button
                    type="button"
                    className={`custom-step ${idx === wizardStep ? 'active' : idx < wizardStep ? 'done' : ''}`}
                    onClick={() => {
                      if (idx < wizardStep) {
                        setWizardStep(idx);
                      } else if (idx > wizardStep && wizardStep === 0 && (!eventId || !eventName || !orgName || !orgEmail)) {
                        addToast('Slug, Name, and Admin Credentials are required.', 'error');
                      } else if (idx < 6) {
                        setWizardStep(idx);
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      cursor: (idx <= wizardStep || (wizardStep === 0 && eventId && eventName && orgName && orgEmail)) ? 'pointer' : 'default',
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 700,
                        background: idx === wizardStep 
                          ? 'var(--primary)' 
                          : idx < wizardStep 
                            ? 'var(--primary-muted)' 
                            : 'var(--surface-3)',
                        color: idx === wizardStep 
                          ? 'white' 
                          : idx < wizardStep 
                            ? 'var(--primary)' 
                            : 'var(--text-secondary)',
                        border: `1px solid ${
                          idx === wizardStep || idx < wizardStep 
                            ? 'var(--primary)' 
                            : 'var(--border-default)'
                        }`,
                        boxShadow: idx === wizardStep ? '0 0 10px rgba(99, 102, 241, 0.4)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {idx < wizardStep ? <Icons.check size={10} /> : idx + 1}
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: idx === wizardStep ? 700 : 500,
                        color: idx === wizardStep 
                          ? 'var(--text-primary)' 
                          : 'var(--text-secondary)',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {item.label}
                    </span>
                  </button>
                  {idx < organizerStepperItems.length - 1 && (
                    <div
                      style={{
                        flex: 1,
                        height: 2,
                        background: idx < wizardStep ? 'var(--primary)' : 'var(--border-default)',
                        transition: 'background 0.2s ease',
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            <form onSubmit={handleCreateEvent}>
              <div className="modal-body" style={{ minHeight: '340px', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', padding: 'var(--space-6)' }}>
                
                {/* STEP 1: Organizer & Conference Profile */}
                {wizardStep === 0 && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <h4 style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
                      1. Organizer & Conference Profile
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="input-wrapper">
                        <label className="input-label">Organizer Name *</label>
                        <input className="input" placeholder="Sarah Kim" value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
                      </div>
                      <div className="input-wrapper">
                        <label className="input-label">Organizer Email *</label>
                        <input className="input" type="email" placeholder="sarah@summit.org" value={orgEmail} onChange={(e) => setOrgEmail(e.target.value)} required />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="input-wrapper">
                        <label className="input-label">Organizer Title</label>
                        <input className="input" placeholder="VP of Events" value={orgTitle} onChange={(e) => setOrgTitle(e.target.value)} />
                      </div>
                      <div className="input-wrapper">
                        <label className="input-label">Organization/Company</label>
                        <input className="input" placeholder="Waypoint Devs" value={orgCompany} onChange={(e) => setOrgCompany(e.target.value)} />
                      </div>
                    </div>
                    <div className="divider" style={{ margin: '8px 0' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                      <div className="input-wrapper">
                        <label className="input-label">URL Slug *</label>
                        <input className="input" placeholder="e.g. react-summit" value={eventId} onChange={(e) => setEventId(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))} required />
                        <span style={{ fontSize: 9, color: 'var(--text-tertiary)' }}>localhost:5173/{eventId || 'slug'}</span>
                      </div>
                      <div className="input-wrapper">
                        <label className="input-label">Conference Name *</label>
                        <input className="input" placeholder="React Summit 2026" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
                      </div>
                    </div>
                    <div className="input-wrapper">
                      <label className="input-label">Conference Description</label>
                      <textarea className="input" placeholder="The premier developer conference for React..." value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} rows={2} style={{ resize: 'none', fontFamily: 'inherit' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="input-wrapper">
                        <label className="input-label">Event Website URL</label>
                        <input className="input" placeholder="https://reactsummit.com" value={eventWebsite} onChange={(e) => setEventWebsite(e.target.value)} />
                      </div>
                      <div className="input-wrapper">
                        <label className="input-label">Branding Logo URL</label>
                        <input className="input" placeholder="https://domain.com/logo.png" value={eventLogo} onChange={(e) => setEventLogo(e.target.value)} />
                      </div>
                    </div>
                    <div className="input-wrapper">
                      <label className="input-label">Branding Theme Color</label>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
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
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              background: c.color,
                              border: themeColor === c.color ? '3px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                              cursor: 'pointer',
                              transform: themeColor === c.color ? 'scale(1.1)' : 'none',
                              transition: 'all 0.1s ease'
                            }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Conference Configuration */}
                {wizardStep === 1 && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <h4 style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
                      2. Conference Configuration
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="input-wrapper">
                        <label className="input-label">Conference Type</label>
                        <select className="input" value={confType} onChange={(e) => setConfType(e.target.value)} style={{ background: 'var(--surface-1)' }}>
                          <option value="technology">Technology & Devs</option>
                          <option value="startup">Startups & VC</option>
                          <option value="academic">Academic & Science</option>
                          <option value="corporate">Corporate & Enterprise</option>
                          <option value="community">Community & Non-profit</option>
                        </select>
                      </div>
                      <div className="input-wrapper">
                        <label className="input-label">Format Type</label>
                        <select className="input" value={confFormat} onChange={(e) => setConfFormat(e.target.value)} style={{ background: 'var(--surface-1)' }}>
                          <option value="in-person">In-Person physical venue</option>
                          <option value="hybrid">Hybrid (Phys + Virt)</option>
                          <option value="virtual">100% Virtual Online</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="input-wrapper">
                        <label className="input-label">Dates & schedule span</label>
                        <input className="input" placeholder="e.g. Oct 12-14, 2026" value={dates} onChange={(e) => setDates(e.target.value)} required />
                      </div>
                      <div className="input-wrapper">
                        <label className="input-label">Venue timezone</label>
                        <select className="input" value={timezone} onChange={(e) => setTimezone(e.target.value)} style={{ background: 'var(--surface-1)' }}>
                          <option value="EST">EST (Eastern Time)</option>
                          <option value="PST">PST (Pacific Time)</option>
                          <option value="GMT">GMT (Greenwich Time)</option>
                          <option value="IST">IST (Indian Time)</option>
                          <option value="UTC">UTC (Universal Time)</option>
                        </select>
                      </div>
                    </div>
                    <div className="input-wrapper">
                      <label className="input-label">Expected Attendee Count</label>
                      <input className="input" type="number" min={10} max={10000} value={expectedAttendees} onChange={(e) => setExpectedAttendees(parseInt(e.target.value) || 250)} />
                    </div>
                  </div>
                )}

                {/* STEP 3: Feature Configuration */}
                {wizardStep === 2 && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <h4 style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
                      3. Feature Modules Configuration
                    </h4>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Enable or disable integrated modules for your event operating system:</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxHeight: '280px', overflowY: 'auto', paddingRight: 6 }}>
                      {[
                        { id: 'conn', title: 'Peer Networking', desc: 'Allows attendee connection matches', value: allowConnections, setter: setAllowConnections },
                        { id: 'pres', title: 'Venue Location Tracker', desc: 'Track occupant presence in zones', value: allowPresence, setter: setAllowPresence },
                        { id: 'ai', title: 'AI Matchmaker Twin', desc: 'Automates profile goal-match score', value: allowAiMatching, setter: setAllowAiMatching },
                        { id: 'reg', title: 'Open Registration', desc: 'Let participants sign up freely', value: allowRegistration, setter: setAllowRegistration },
                        { id: 'msg', title: 'Direct Messaging Chats', desc: 'Realtime chat feeds for connections', value: allowMessaging, setter: setAllowMessaging },
                        { id: 'spon', title: 'Sponsor Hub directory', desc: 'Firms can highlight booth details', value: allowSponsorDiscovery, setter: setAllowSponsorDiscovery },
                        { id: 'recs', title: 'Session matches', desc: 'Recommends matches for schedules', value: allowSessionRecs, setter: setAllowSessionRecs },
                        { id: 'game', title: 'Gamified Milestones', desc: 'Awards badges for completed goals', value: allowGamification, setter: setAllowGamification },
                        { id: 'mission', title: 'Mission Goals Tracker', desc: 'Attendee outcomes checklist board', value: allowMissionTracking, setter: setAllowMissionTracking },
                        { id: 'feed', title: 'Community Activity Feed', desc: 'Public message board for event updates', value: allowCommunityFeed, setter: setAllowCommunityFeed }
                      ].map((mod) => (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => mod.setter(!mod.value)}
                          className={`card card-interactive ${mod.value ? 'goal-option-selected' : ''}`}
                          style={{ padding: '10px 12px', textAlign: 'left', display: 'block', width: '100%', border: '1px solid var(--border-subtle)', background: mod.value ? 'var(--primary-subtle)' : 'var(--surface-1)' }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600, fontSize: 12 }}>{mod.title}</span>
                            <input type="checkbox" checked={mod.value} onChange={() => {}} style={{ pointerEvents: 'none' }} />
                          </div>
                          <p style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4 }}>{mod.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 4: Role Configuration (RBAC designer) */}
                {wizardStep === 3 && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <h4 style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
                      4. Participant Roles & RBAC System
                    </h4>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Define user categories that can register, along with their permission bounds:</p>
                    
                    {/* Add Role Form */}
                    <div style={{ background: 'var(--surface-2)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input className="input" style={{ flex: 1, height: 32 }} placeholder="Role Title (e.g. volunteer)" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} />
                        <button type="button" className="btn btn-primary btn-sm" onClick={handleAddRole}>
                          Add Role
                        </button>
                      </div>
                      <div>
                        <label style={{ fontSize: 9, color: 'var(--text-secondary)' }}>Assign Initial Permissions:</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 4 }}>
                          {[
                            { key: 'create_sessions', label: 'Create Sessions' },
                            { key: 'manage_slides', label: 'Manage Slides' },
                            { key: 'accept_meetings', label: 'Accept Meetings' },
                            { key: 'view_analytics', label: 'View Analytics' },
                            { key: 'moderate_users', label: 'Moderate Users' }
                          ].map((perm) => (
                            <label key={perm.key} style={{ fontSize: 10, display: 'inline-flex', alignItems: 'center', gap: 4, marginRight: 8, cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={newRolePermissions.includes(perm.key)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewRolePermissions([...newRolePermissions, perm.key]);
                                  } else {
                                    setNewRolePermissions(newRolePermissions.filter(k => k !== perm.key));
                                  }
                                }}
                              />
                              {perm.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Roles list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: '150px', overflowY: 'auto', marginTop: 8 }}>
                      {rolesList.map((r) => (
                        <div key={r.name} className="card" style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ fontSize: 12, textTransform: 'capitalize' }}>{r.name}</strong>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
                              {r.permissions.map(p => (
                                <span key={p} className="tag" style={{ fontSize: 8, padding: '1px 4px' }}>{p.replace('_', ' ')}</span>
                              ))}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn btn-icon btn-ghost btn-sm"
                            onClick={() => handleRemoveRole(r.name)}
                            disabled={['organizer', 'attendee', 'speaker'].includes(r.name.toLowerCase())}
                            style={{ color: 'var(--error)' }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 5: Venue Builder */}
                {wizardStep === 4 && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <h4 style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
                      5. Venue Builder (Physical Spaces Map)
                    </h4>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Create rooms and lounges in the physical venue to map check-in and crowding:</p>
                    
                    {/* Add Zone Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 30px', gap: 6, background: 'var(--surface-2)', padding: 8, borderRadius: 'var(--radius-md)' }}>
                      <input className="input" style={{ height: 30, fontSize: 11 }} placeholder="Zone Name (e.g. AI Lounge)" value={newZoneName} onChange={(e) => setNewZoneName(e.target.value)} />
                      <input className="input" style={{ height: 30, fontSize: 11 }} type="number" placeholder="Cap" value={newZoneCapacity} onChange={(e) => setNewZoneCapacity(parseInt(e.target.value) || 50)} />
                      <select className="input" style={{ height: 30, fontSize: 11, background: 'var(--surface-1)' }} value={newZoneIcon} onChange={(e) => setNewZoneIcon(e.target.value)}>
                        <option value="award">Stage / Presenter</option>
                        <option value="coffee">Lounge / Cafe</option>
                        <option value="home">Exhibition / Expo</option>
                        <option value="shield">VIP / Executive Room</option>
                        <option value="settings">Workshop / Tools Area</option>
                      </select>
                      <button type="button" className="btn btn-primary btn-sm btn-icon" onClick={handleAddZone} style={{ height: 30 }}>
                        +
                      </button>
                    </div>

                    {/* Map Layout Preview & List */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10, marginTop: 6 }}>
                      <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {venueZones.map(z => (
                          <div key={z.name} style={{ display: 'flex', justifyItems: 'center', alignItems: 'center', gap: 8, padding: '4px 8px', background: 'var(--surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 4 }}>
                            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: z.color }} />
                            <span style={{ fontSize: 11, flex: 1, fontWeight: 600 }}>{z.name}</span>
                            <span style={{ fontSize: 9, color: 'var(--text-tertiary)' }}>{z.capacity} pax</span>
                            <button type="button" onClick={() => handleRemoveZone(z.name)} style={{ color: 'var(--error)', fontSize: 10 }}>✕</button>
                          </div>
                        ))}
                      </div>

                      {/* Visual Spatial Map Grid */}
                      <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', padding: 8, minHeight: '140px', border: '1px dashed var(--border-strong)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                        {venueZones.map((z) => (
                          <div key={z.name} style={{ background: `${z.color}15`, border: `1px solid ${z.color}`, borderRadius: 4, display: 'flex', flexDirection: 'column', justifyItems: 'center', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: z.color }}>{getZoneIconSvg(z.icon, 16)}</span>
                            <span style={{ fontSize: 9, fontWeight: 'bold', color: 'var(--text-primary)', textAlign: 'center', marginTop: 2 }}>{z.name.slice(0, 10)}...</span>
                            <span style={{ fontSize: 8, color: 'var(--text-tertiary)' }}>Max: {z.capacity}</span>
                          </div>
                        ))}
                        {venueZones.length < 4 && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--border-subtle)', color: 'var(--text-quaternary)', fontSize: 9 }}>
                            Add Spaces...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6: Networking & Privacy Rules */}
                {wizardStep === 5 && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <h4 style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 'var(--text-sm)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
                      6. Security & Peer Networking Rules
                    </h4>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Configure global communication permissions and networking defaults:</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: '240px', overflowY: 'auto', paddingRight: 6 }}>
                      {[
                        { title: 'Allow Messaging Conversations', desc: 'Can matched participants exchange text messages?', value: ruleCanMessage, setter: setRuleCanMessage },
                        { title: 'Public Profiles Searchable', desc: 'Allow members to browse complete profiles.', value: ruleCanSeeProfiles, setter: setRuleCanSeeProfiles },
                        { title: 'Link Social Accounts', desc: 'Permit users to attach LinkedIn links to cards.', value: ruleShareLinkedIn, setter: setRuleShareLinkedIn },
                        { title: 'Attach Code Portfolios', desc: 'Permit users to link GitHub pages.', value: ruleShareGitHub, setter: setRuleShareGitHub },
                        { title: 'Broadcasting Presence Location', desc: 'Let others see current checked-in room.', value: ruleCanSeeLocation, setter: setRuleCanSeeLocation },
                        { title: 'Request Handshake Meetings', desc: 'Allow scheduling calendar connection requests.', value: ruleCanScheduleMeetings, setter: setRuleCanScheduleMeetings },
                        { title: 'Display in Discover Directory', desc: 'Default opt-in to browse list.', value: ruleCanAppearInDiscovery, setter: setRuleCanAppearInDiscovery },
                        { title: 'Privacy Policy Consent', desc: 'Require users to agree to GDPR data guidelines.', value: ruleCanOptOut, setter: setRuleCanOptOut }
                      ].map((rule, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                          <div>
                            <span style={{ fontSize: 11, fontWeight: 600, display: 'block' }}>{rule.title}</span>
                            <span style={{ fontSize: 9, color: 'var(--text-tertiary)' }}>{rule.desc}</span>
                          </div>
                          <label className="toggle-switch">
                            <input type="checkbox" checked={rule.value} onChange={(e) => rule.setter(e.target.checked)} />
                            <span className="toggle-slider" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 7: Success / Publish screen */}
                {wizardStep === 6 && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px 12px', gap: 16 }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--success-muted)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                      ✓
                    </div>
                    <div>
                      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Waypoint OS Tenant Ready!</h3>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 6, maxWidth: 450 }}>
                        The operating system layers have been initialized for **{eventName}** (slug: `/{eventId}`). Organizer credentials generated for **{orgName}**.
                      </p>
                    </div>

                    <div className="card" style={{ width: '100%', padding: '12px 16px', background: 'var(--surface-2)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'left' }}>
                      <div>
                        <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Workspace Slug</span>
                        <strong style={{ display: 'block', fontSize: 12, fontFamily: 'monospace' }}>/{eventId}</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Branding Theme</span>
                        <strong style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: themeColor }} />
                          {themeColor}
                        </strong>
                      </div>
                      <div>
                        <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Active Custom Roles</span>
                        <strong style={{ display: 'block', fontSize: 12 }}>{rolesList.length} Roles Registered</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Physical Venue Lounges</span>
                        <strong style={{ display: 'block', fontSize: 12 }}>{venueZones.length} Zones Pre-seeded</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%', marginTop: 8 }}
                      onClick={() => {
                        setShowCreateModal(false);
                        navigate('/organizer');
                      }}
                    >
                      Enter Organizer Studio <span style={{ marginLeft: 6 }}>→</span>
                    </button>
                  </div>
                )}

              </div>

              {/* Wizard Footer Controls */}
              {wizardStep < 6 && (
                <div className="modal-footer" style={{ borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4) var(--space-6)' }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      if (wizardStep === 0) {
                        setShowCreateModal(false);
                      } else {
                        setWizardStep(wizardStep - 1);
                      }
                    }}
                  >
                    {wizardStep === 0 ? 'Cancel' : 'Back'}
                  </button>

                  <div style={{ display: 'flex', gap: 8 }}>
                    {wizardStep < 5 ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          if (wizardStep === 0 && (!eventId || !eventName || !orgName || !orgEmail)) {
                            addToast('Slug, Name, and Admin Credentials are required.', 'error');
                            return;
                          }
                          setWizardStep(wizardStep + 1);
                        }}
                      >
                        Next Step
                      </button>
                    ) : (
                      <button type="button" className="btn btn-primary" onClick={() => handleCreateEvent()} disabled={loading}>
                        {loading ? 'Publishing OS...' : 'Initialize & Publish Tenant'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Steps section */}
      <section className="landing-section" style={{ background: 'var(--surface-2)' }}>
        <div className="landing-section-inner">
          <h2 className="landing-section-title">How Waypoint Works</h2>
          <p className="landing-section-desc">Four steps from attendee to achiever</p>
          <div className="how-it-works-grid">
            {stepsData.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="how-card card">
                  <div className="how-card-step">{item.step}</div>
                  <div className="how-card-icon" style={{ color: 'var(--primary)', display: 'flex', justifyContent: 'center' }}>
                    <Icon size={24} />
                  </div>
                  <h3 className="how-card-title">{item.title}</h3>
                  <p className="how-card-desc">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-logo">
            <span className="landing-logo-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <Icons.target size={16} color="var(--primary)" />
            </span>
            <span className="landing-logo-text">Waypoint</span>
          </div>
          <p className="landing-footer-text">Open source conference operating layer</p>
        </div>
      </footer>
    </div>
  );
}
