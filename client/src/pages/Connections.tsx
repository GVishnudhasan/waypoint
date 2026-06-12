import React from 'react';
import { useStore } from '../store';
import { api } from '../api/client';
import { Avatar } from '../components/ui';
import { Icons } from '../components/Icons';
import './Connections.css';

export default function Connections() {
  const { currentUser, addToast } = useStore();
  const [connections, setConnections] = React.useState<any[]>([]);
  const [tab, setTab] = React.useState<'all' | 'pending'>('all');
  const [loading, setLoading] = React.useState(true);

  const fetchConnections = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const conns = await api.getConnections(currentUser.id);
      setConnections(conns);
    } catch {} finally { setLoading(false); }
  };

  React.useEffect(() => { fetchConnections(); }, [currentUser]);

  const handleAccept = async (id: string) => {
    try {
      await api.acceptConnection(id);
      addToast('Connection accepted!', 'success');
      fetchConnections();
    } catch { addToast('Failed to accept', 'error'); }
  };

  const handleDecline = async (id: string) => {
    try {
      await api.declineConnection(id);
      addToast('Connection declined', 'info');
      fetchConnections();
    } catch {}
  };

  const filtered = tab === 'pending'
    ? connections.filter((c) => c.status === 'pending' && c.receiver_id === currentUser?.id)
    : connections;

  const pendingCount = connections.filter((c) => c.status === 'pending' && c.receiver_id === currentUser?.id).length;

  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Connections</h1>
          <p className="page-subtitle">Your conference network</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
        <button className={`tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>All ({connections.length})</button>
        <button className={`tab ${tab === 'pending' ? 'active' : ''}`} onClick={() => setTab('pending')}>
          Pending {pendingCount > 0 && <span className="badge badge-primary" style={{ marginLeft: 4 }}>{pendingCount}</span>}
        </button>
      </div>

      <div className="connections-list">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 100, marginBottom: 12 }} />)
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <Icons.users size={24} />
            </div>
            <div className="empty-state-title">{tab === 'pending' ? 'No pending requests' : 'No connections yet'}</div>
            <div className="empty-state-desc">Start discovering people to build your network</div>
          </div>
        ) : (
          filtered.map((conn: any) => {
            const other = conn.sender_id === currentUser?.id ? conn.receiver : conn.sender;
            if (!other) return null;
            const isPending = conn.status === 'pending';
            const isIncoming = isPending && conn.receiver_id === currentUser?.id;

            return (
              <div key={conn.id} className="connection-card card">
                <div className="connection-card-main">
                  <Avatar name={other.name} size="lg" />
                  <div className="connection-card-info">
                    <div className="connection-card-name">{other.name}</div>
                    <div className="connection-card-role">{other.title} at {other.company}</div>
                    <span className={`badge ${conn.status === 'accepted' ? 'badge-success' : conn.status === 'pending' ? 'badge-warning' : ''}`}>
                      {conn.status === 'accepted' ? 'Connected' : conn.status === 'pending' ? 'Pending' : 'Declined'}
                    </span>
                  </div>
                  {isIncoming && (
                    <div className="connection-card-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => handleAccept(conn.id)}>
                        <Icons.check size={14} /> Accept
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDecline(conn.id)}>Decline</button>
                    </div>
                  )}
                </div>

                {/* Meeting Suggestion */}
                {conn.status === 'accepted' && conn.conversation_starter && (
                  <div className="meeting-suggestion">
                    <div className="meeting-suggestion-label">
                      <Icons.messageCircle size={14} /> Suggested Conversation
                    </div>
                    <p className="meeting-suggestion-text">{conn.conversation_starter}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
