import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { api } from '../api/client';
import { ProgressRing, MatchScore, Avatar, AvailabilityBadge } from '../components/ui';
import { Icons } from '../components/Icons';
import './Dashboard.css';

export default function Dashboard() {
  const { currentUser, currentEvent, addToast } = useStore();
  const navigate = useNavigate();
  const [goals, setGoals] = React.useState<any[]>([]);
  const [matches, setMatches] = React.useState<any[]>([]);
  const [connections, setConnections] = React.useState<any[]>([]);
  const [zones, setZones] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!currentUser) return;
    Promise.all([
      api.getGoals(currentUser.id).then(setGoals).catch(() => []),
      api.getMatches(currentUser.id).then(setMatches).catch(() => []),
      api.getConnections(currentUser.id).then(setConnections).catch(() => []),
      api.getZoneStats(currentEvent?.id || 'default').then(setZones).catch(() => []),
    ]).finally(() => setLoading(false));
  }, [currentUser, currentEvent]);

  const handleConnect = async (userId: string) => {
    try {
      await api.sendConnection({ sender_id: currentUser!.id, receiver_id: userId });
      addToast('Connection request sent!', 'success');
      // Refresh matches
      const updated = await api.getMatches(currentUser!.id);
      setMatches(updated);
    } catch (e) {
      addToast('Failed to send request', 'error');
    }
  };

  const getZoneIcon = (icon: string) => {
    switch (icon) {
      case 'award':
      case '🎤':
        return <Icons.award size={14} />;
      case 'coffee':
      case '☕':
        return <Icons.coffee size={14} />;
      case 'settings':
      case '🔧':
        return <Icons.settings size={14} />;
      case 'home':
      case '🏢':
      case '🎪':
        return <Icons.home size={14} />;
      case 'users':
      case '🤝':
        return <Icons.users size={14} />;
      case 'compass':
      case '📚':
        return <Icons.compass size={14} />;
      default:
        return <Icons.mapPin size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="dashboard-skeleton">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 120 }} />
          ))}
        </div>
      </div>
    );
  }

  const primaryGoal = goals[0];
  const topMatches = matches.slice(0, 4);
  const acceptedConnections = connections.filter((c: any) => c.status === 'accepted');

  return (
    <div className="page animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="dashboard-greeting">
          <h1 className="page-title">Welcome back, {currentUser?.name.split(' ')[0]}</h1>
          <p className="page-subtitle">{currentUser?.title} at {currentUser?.company}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/recommendations')}>
          <Icons.compass size={16} /> Discover People
        </button>
      </div>

      {/* Mission Card */}
      {primaryGoal && (
        <div className="mission-card card animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="mission-card-left">
            <div className="mission-card-label">
              <Icons.target size={14} />
              Conference Mission
            </div>
            <h2 className="mission-card-title">{primaryGoal.description}</h2>
            <div className="mission-card-meta">
              <span className="badge badge-primary">{primaryGoal.goal_type}</span>
              <span className="mission-card-progress-text">
                {primaryGoal.current_count} of {primaryGoal.target_count} completed
              </span>
            </div>
            <div className="mission-progress-bar">
              <div
                className="mission-progress-fill"
                style={{ width: `${(primaryGoal.current_count / primaryGoal.target_count) * 100}%` }}
              />
            </div>
          </div>
          <div className="mission-card-right">
            <ProgressRing value={(primaryGoal.current_count / primaryGoal.target_count) * 100} size={80} strokeWidth={5}>
              <span className="mission-ring-text">{Math.round((primaryGoal.current_count / primaryGoal.target_count) * 100)}%</span>
            </ProgressRing>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid-4 stagger" style={{ marginBottom: 'var(--space-8)' }}>
        {[
          { icon: <Icons.users size={16} />, label: 'Connections', value: acceptedConnections.length },
          { icon: <Icons.compass size={16} />, label: 'Matches Found', value: matches.length },
          { icon: <Icons.target size={16} />, label: 'Goals Active', value: goals.length },
          { icon: <Icons.mapPin size={16} />, label: 'Active Zones', value: zones.filter((z: any) => z.count > 0).length },
        ].map((stat) => (
          <div key={stat.label} className="card stat-mini">
            <span className="stat-mini-icon" style={{ display: 'flex', alignItems: 'center' }}>{stat.icon}</span>
            <div>
              <div className="stat-mini-value">{stat.value}</div>
              <div className="stat-mini-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="dashboard-columns">
        {/* Left: Recommended People */}
        <div className="dashboard-col">
          <div className="section-header">
            <h3 className="section-title">Recommended for You</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/recommendations')}>View all →</button>
          </div>
          <div className="match-list stagger">
            {topMatches.map((match: any) => (
              <div key={match.user.id} className="match-card card card-interactive" onClick={() => navigate(`/recommendations/${match.user.id}`)}>
                <div className="match-card-main">
                  <Avatar name={match.user.name} />
                  <div className="match-card-info">
                    <div className="match-card-name">{match.user.name}</div>
                    <div className="match-card-role">{match.user.title} at {match.user.company}</div>
                    <div className="match-card-reasons">
                      {match.reasoning.slice(0, 2).map((r: string, i: number) => (
                        <span key={i} className="match-reason">• {r}</span>
                      ))}
                    </div>
                  </div>
                  <MatchScore score={match.score} />
                </div>
                <div className="match-card-footer">
                  <div className="match-card-tags">
                    {(match.user.skills || []).slice(0, 3).map((s: string) => (
                      <span key={s} className="tag">{s}</span>
                    ))}
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); handleConnect(match.user.id); }}>
                    Connect
                  </button>
                </div>
              </div>
            ))}

            {topMatches.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <Icons.search size={24} />
                </div>
                <div className="empty-state-title">No matches yet</div>
                <div className="empty-state-desc">Complete your profile to get AI-powered recommendations</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-col-right">
          {/* Networking Status */}
          <div className="section-header">
            <h3 className="section-title">Networking</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/networking')}>Map →</button>
          </div>
          <div className="card networking-status-card">
            <div className="networking-status-header">
              <AvailabilityBadge status={currentUser?.networkingStatus?.status || 'offline'} />
              {currentUser?.networkingStatus?.location && (
                <span className="networking-location">
                  <Icons.mapPin size={12} /> {currentUser.networkingStatus.location}
                </span>
              )}
            </div>
            <div className="venue-zones-mini">
              {zones.slice(0, 4).map((zone: any) => (
                <div key={zone.zone} className="zone-mini" onClick={() => navigate('/networking')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="zone-mini-icon" style={{ display: 'flex', alignItems: 'center' }}>
                    {getZoneIcon(zone.icon)}
                  </span>
                  <span className="zone-mini-name" style={{ flex: 1 }}>{zone.zone}</span>
                  <span className="zone-mini-count">{zone.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Connections */}
          <div className="section-header" style={{ marginTop: 'var(--space-6)' }}>
            <h3 className="section-title">Recent Connections</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/connections')}>All →</button>
          </div>
          <div className="connections-mini">
            {connections.slice(0, 4).map((conn: any) => {
              const other = conn.sender_id === currentUser?.id ? conn.receiver : conn.sender;
              if (!other) return null;
              return (
                <div key={conn.id} className="connection-mini card">
                  <Avatar name={other.name} size="sm" />
                  <div className="connection-mini-info">
                    <span className="connection-mini-name">{other.name}</span>
                    <span className="connection-mini-status">
                      {conn.status === 'accepted' ? '✓ Connected' : '⏳ Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
            {connections.length === 0 && (
              <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
                No connections yet. Start discovering people!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
