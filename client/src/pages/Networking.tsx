import React from 'react';
import { useStore } from '../store';
import { api } from '../api/client';
import { Avatar, AvailabilityBadge } from '../components/ui';
import { Icons } from '../components/Icons';
import './Networking.css';

export default function Networking() {
  const { currentUser, currentEvent, addToast } = useStore();
  const [zones, setZones] = React.useState<any[]>([]);
  const [selectedZone, setSelectedZone] = React.useState<string | null>(null);
  const [zoneUsers, setZoneUsers] = React.useState<any[]>([]);
  const [status, setStatus] = React.useState(currentUser?.networkingStatus?.status || 'offline');
  const [myZone, setMyZone] = React.useState(currentUser?.networkingStatus?.location || '');
  const [myTopics, setMyTopics] = React.useState('');

  React.useEffect(() => {
    api.getZoneStats(currentEvent?.id || 'default').then(setZones).catch(() => {});
  }, [currentEvent]);

  React.useEffect(() => {
    if (selectedZone) {
      api.getAvailableInZone(selectedZone).then(setZoneUsers).catch(() => setZoneUsers([]));
    }
  }, [selectedZone]);

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

  const handleUpdateStatus = async (newStatus: string) => {
    setStatus(newStatus);
    try {
      await api.updatePresence({
        user_id: currentUser!.id,
        status: newStatus,
        zone: newStatus === 'available' ? myZone : undefined,
        topics: myTopics || undefined,
        duration_minutes: 30,
      });
      addToast(newStatus === 'available' ? 'You\'re now available to network!' : 'Status updated', 'success');
    } catch { addToast('Failed to update status', 'error'); }
  };

  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Networking Map</h1>
          <p className="page-subtitle">See who's available and where they are</p>
        </div>
      </div>

      {/* My Status */}
      <div className="card networking-my-status">
        <h3 className="section-title">Your Status</h3>
        <div className="status-controls">
          <div className="status-buttons">
            {(['available', 'busy', 'offline'] as const).map((s) => (
              <button key={s} className={`btn btn-sm ${status === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => handleUpdateStatus(s)}>
                <span className={`availability-dot ${s}`} /> {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          {status === 'available' && (
            <div className="status-details">
              <div className="input-wrapper" style={{ flex: 1 }}>
                <label className="input-label">Zone</label>
                <select className="input" value={myZone} onChange={(e) => setMyZone(e.target.value)} style={{ background: 'var(--surface-1)' }}>
                  <option value="">Select zone...</option>
                  {zones.map((z: any) => <option key={z.zone} value={z.zone}>{z.zone}</option>)}
                </select>
              </div>
              <div className="input-wrapper" style={{ flex: 1 }}>
                <label className="input-label">Topics</label>
                <input className="input" placeholder="e.g. AI, React, Hiring" value={myTopics} onChange={(e) => setMyTopics(e.target.value)} />
              </div>
              <button className="btn btn-primary" style={{ alignSelf: 'flex-end' }} onClick={() => handleUpdateStatus('available')}>
                Update
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Zone Grid */}
      <h3 className="section-title" style={{ marginTop: 'var(--space-8)', marginBottom: 'var(--space-4)' }}>Venue Zones</h3>
      <div className="zones-grid stagger">
        {zones.map((zone: any) => (
          <div
            key={zone.zone}
            className={`zone-card card card-interactive ${selectedZone === zone.zone ? 'zone-card-selected' : ''}`}
            onClick={() => setSelectedZone(zone.zone)}
            style={{ borderColor: selectedZone === zone.zone ? zone.color : undefined }}
          >
            <div className="zone-card-header">
              <span className="zone-card-icon" style={{ background: `${zone.color}22`, color: zone.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {getZoneIconSvg(zone.icon, 16)}
              </span>
              <div>
                <div className="zone-card-name">{zone.zone}</div>
                <div className="zone-card-count">{zone.count} available</div>
              </div>
            </div>
            <div className="zone-card-topics">
              {(zone.topics || []).map((t: string) => (
                <span key={t} className="tag">{t}</span>
              ))}
              {(!zone.topics || zone.topics.length === 0) && (
                <span className="zone-card-no-topics">No trending topics</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Zone Detail */}
      {selectedZone && (
        <div className="zone-detail animate-fade-in-up">
          <div className="section-header">
            <h3 className="section-title">People in {selectedZone}</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setSelectedZone(null)}>
              <Icons.x size={14} /> Close
            </button>
          </div>
          <div className="zone-users">
            {zoneUsers.length === 0 ? (
              <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                No one available in this zone right now
              </div>
            ) : (
              zoneUsers.map((p: any) => (
                <div key={p.id} className="zone-user card">
                  <Avatar name={p.user?.name || 'User'} />
                  <div className="zone-user-info">
                    <div className="zone-user-name">{p.user?.name || 'Unknown'}</div>
                    <div className="zone-user-role">{p.user?.title} at {p.user?.company}</div>
                    {p.topics && <div className="zone-user-topics">{p.topics}</div>}
                  </div>
                  <AvailabilityBadge status="available" />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
