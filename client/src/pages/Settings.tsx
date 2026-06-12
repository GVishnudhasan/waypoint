export default function Settings() {
  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your preferences</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', maxWidth: 600 }}>
        <div className="card">
          <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Notifications</h3>
          {['Connection Requests', 'Meeting Reminders', 'Mission Updates', 'New Recommendations'].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 'var(--text-sm)' }}>{item}</span>
              <label style={{ position: 'relative', width: 40, height: 22, cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: 11, background: 'var(--primary)',
                  transition: 'background var(--transition-fast)',
                }}>
                  <span style={{
                    position: 'absolute', left: 20, top: 2, width: 18, height: 18,
                    borderRadius: '50%', background: 'white', transition: 'left var(--transition-fast)',
                  }} />
                </span>
              </label>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Privacy</h3>
          {['Show me as available for networking', 'Display my company name', 'Allow AI to analyze my profile'].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 'var(--text-sm)' }}>{item}</span>
              <label style={{ position: 'relative', width: 40, height: 22, cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: 11, background: 'var(--primary)',
                  transition: 'background var(--transition-fast)',
                }}>
                  <span style={{
                    position: 'absolute', left: 20, top: 2, width: 18, height: 18,
                    borderRadius: '50%', background: 'white', transition: 'left var(--transition-fast)',
                  }} />
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
