import React from 'react';
import { useStore } from '../store';
import { Avatar } from '../components/ui';
import { api } from '../api/client';
import { Icons } from '../components/Icons';

export default function Profile() {
  const { currentUser } = useStore();
  const [goals, setGoals] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (currentUser) api.getGoals(currentUser.id).then(setGoals).catch(() => {});
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 'var(--space-6)' }}>
        {/* Left - Profile Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'var(--space-4)' }}>
          <Avatar name={currentUser.name} size="xl" />
          <div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{currentUser.name}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{currentUser.title}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>{currentUser.company}</div>
          </div>
          {currentUser.bio && <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>{currentUser.bio}</p>}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', justifyContent: 'center' }}>
            {(currentUser.skills || []).map((s: string) => <span key={s} className="tag">{s}</span>)}
          </div>
        </div>

        {/* Right - Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* AI Twin */}
          {currentUser.ai_twin && (
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Icons.activity size={18} /> AI Twin
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>{currentUser.ai_twin.summary}</p>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {(currentUser.ai_twin.seeking || []).map((s: string) => <span key={s} className="badge badge-primary">{s}</span>)}
              </div>
            </div>
          )}

          {/* Goals */}
          <div className="card">
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Icons.target size={18} /> Goals
            </h3>
            {goals.map((g: any) => (
              <div key={g.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{g.description}</div>
                  <span className="badge" style={{ marginTop: 4 }}>{g.goal_type}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>{g.current_count}/{g.target_count}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>completed</div>
                </div>
              </div>
            ))}
          </div>

          {/* Links */}
          <div className="card">
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Icons.link size={18} /> Links
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {currentUser.linkedin_url && <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>LinkedIn: {currentUser.linkedin_url}</div>}
              {currentUser.github_url && <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>GitHub: {currentUser.github_url}</div>}
              {currentUser.twitter_url && <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Twitter: {currentUser.twitter_url}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
