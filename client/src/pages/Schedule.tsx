import React from 'react';
import { api } from '../api/client';
import { useStore } from '../store';
import { mockSessions } from '../data/mock';
import { MatchScore } from '../components/ui';
import { Icons } from '../components/Icons';

export default function Schedule() {
  const { currentEvent } = useStore();
  const [sessions, setSessions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    api.listSessions(currentEvent?.id || 'default')
      .then((data) => {
        setSessions(data);
      })
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, [currentEvent]);

  if (loading) {
    return (
      <div className="page" style={{ padding: 'var(--space-8)' }}>
        <div className="skeleton" style={{ height: 40, width: 200, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 120, width: '100%', marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 120, width: '100%' }} />
      </div>
    );
  }

  const activeSessions = sessions.length > 0 ? sessions : mockSessions.map(s => ({
    id: s.id,
    title: s.title,
    description: s.description,
    zone_name: s.location,
    type: 'talk',
    start_time: new Date(),
    speaker: { name: 'Expert Speaker' },
    isMock: true
  }));

  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Event Schedule</h1>
          <p className="page-subtitle">Personalized talk suggestions and time slot planner.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {activeSessions.map((session) => (
          <div key={session.id} className="card card-interactive" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80, padding: 'var(--space-2)', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textAlign: 'center' }}>
                  {session.start_time ? new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00 AM'}
                </span>
                <span style={{ fontSize: '9px', color: 'var(--text-tertiary)', marginTop: 2 }}>
                  {session.type ? session.type.toUpperCase() : 'TALK'}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {session.title}
                  {session.isMock && <span className="tag" style={{ fontSize: 9 }}>MOCK</span>}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>{session.description}</div>
                
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Icons.mapPin size={12} /> {session.zone_name || 'Main Hall'}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Icons.user size={12} /> Speaker: {session.speaker ? session.speaker.name : 'Unassigned'}
                  </span>
                </div>
              </div>
              <MatchScore score={session.isMock ? 95 : 88} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
