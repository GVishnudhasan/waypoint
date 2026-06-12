import React from 'react';
import { useStore } from '../store';
import { api } from '../api/client';
import { MatchScore, Avatar } from '../components/ui';
import { Icons } from '../components/Icons';
import './Recommendations.css';

export default function Recommendations() {
  const { currentUser, addToast } = useStore();
  const [matches, setMatches] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedMatch, setSelectedMatch] = React.useState<any>(null);
  const [filter, setFilter] = React.useState('all');

  React.useEffect(() => {
    if (!currentUser) return;
    api.getMatches(currentUser.id).then(setMatches).catch(() => {}).finally(() => setLoading(false));
  }, [currentUser]);

  const handleConnect = async (userId: string) => {
    try {
      await api.sendConnection({ sender_id: currentUser!.id, receiver_id: userId });
      addToast('Connection request sent!', 'success');
    } catch { addToast('Failed to send request', 'error'); }
  };

  const filteredMatches = filter === 'all' ? matches
    : matches.filter((m: any) => m.score >= (filter === 'high' ? 85 : filter === 'medium' ? 70 : 0));

  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Discover People</h1>
          <p className="page-subtitle">AI-matched recommendations based on your goals and profile</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rec-filters">
        {['all', 'high', 'medium'].map((f) => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All Matches' : f === 'high' ? '85%+ Match' : '70%+ Match'}
          </button>
        ))}
        <span className="rec-count">{filteredMatches.length} people found</span>
      </div>

      <div className="rec-layout">
        {/* List */}
        <div className="rec-list">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 140, marginBottom: 12 }} />
            ))
          ) : (
            filteredMatches.map((match: any) => (
              <div
                key={match.user.id}
                className={`rec-card card card-interactive ${selectedMatch?.user.id === match.user.id ? 'rec-card-selected' : ''}`}
                onClick={() => setSelectedMatch(match)}
              >
                <div className="rec-card-top">
                  <Avatar name={match.user.name} size="lg" />
                  <div className="rec-card-info">
                    <div className="rec-card-name">{match.user.name}</div>
                    <div className="rec-card-role">{match.user.title} at {match.user.company}</div>
                    <div className="rec-card-tags">
                      {(match.user.skills || []).slice(0, 4).map((s: string) => (
                        <span key={s} className="tag">{s}</span>
                      ))}
                    </div>
                  </div>
                  <MatchScore score={match.score} />
                </div>
                <div className="rec-card-reasons">
                  <div className="rec-card-reasons-label">Why this match:</div>
                  {match.reasoning.map((r: string, i: number) => (
                    <span key={i} className="rec-reason">✓ {r}</span>
                  ))}
                </div>
                <div className="rec-card-actions">
                  <span className="rec-suggested-action">{match.suggestedAction}</span>
                  <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); handleConnect(match.user.id); }}>
                    <Icons.send size={14} /> Connect
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Panel */}
        {selectedMatch && (
          <div className="rec-detail card animate-fade-in">
            <div className="rec-detail-header">
              <Avatar name={selectedMatch.user.name} size="xl" />
              <h2 className="rec-detail-name">{selectedMatch.user.name}</h2>
              <p className="rec-detail-role">{selectedMatch.user.title} at {selectedMatch.user.company}</p>
              <div className="rec-detail-score">
                <MatchScore score={selectedMatch.score} />
                <span>{selectedMatch.score}% Match</span>
              </div>
            </div>

            <div className="divider" />

            <div className="rec-detail-section">
              <h4>Why You Should Connect</h4>
              {selectedMatch.reasoning.map((r: string, i: number) => (
                <div key={i} className="rec-detail-reason">
                  <span className="rec-detail-reason-icon">✓</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>

            <div className="rec-detail-section">
              <h4>Conversation Starter</h4>
              <div className="rec-conversation-starter">
                <Icons.messageCircle size={16} />
                <p>{selectedMatch.conversationStarter}</p>
              </div>
            </div>

            <div className="rec-detail-section">
              <h4>Skills</h4>
              <div className="rec-detail-tags">
                {(selectedMatch.user.skills || []).map((s: string) => (
                  <span key={s} className="tag">{s}</span>
                ))}
              </div>
            </div>

            <div className="rec-detail-section">
              <h4>Interests</h4>
              <div className="rec-detail-tags">
                {(selectedMatch.user.interests || []).map((i: string) => (
                  <span key={i} className="tag">{i}</span>
                ))}
              </div>
            </div>

            <div className="rec-detail-actions">
              <button className="btn btn-primary" onClick={() => handleConnect(selectedMatch.user.id)}>
                <Icons.send size={16} /> Connect
              </button>
              <button className="btn btn-secondary">
                <Icons.bookmark size={16} /> Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
