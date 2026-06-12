import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { TagInput } from '../components/ui';
import { Icons } from '../components/Icons';
import './Onboarding.css';

const stepperItems = [
  { label: 'Profile' },
  { label: 'Details' },
  { label: 'Mission' },
  { label: 'AI Twin' }
];


export default function Onboarding() {
  const navigate = useNavigate();
  const { registerUser } = useStore();
  const [step, setStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [aiTwin, setAiTwin] = React.useState<any>(null);
  const [form, setForm] = React.useState({
    name: '', email: '', role: 'attendee', title: '', company: '', bio: '',
    linkedin_url: '', github_url: '', twitter_url: '', website: '',
    skills: [] as string[], interests: [] as string[],
    goalType: '', goalDescription: '', goalTarget: 5,
  });

  const GOAL_TYPES = [
    { value: 'job', label: 'Find a Job', desc: 'Looking for new career opportunities', icon: Icons.briefcase },
    { value: 'hiring', label: 'Hire Engineers', desc: 'Recruiting talent for your team', icon: Icons.target },
    { value: 'networking', label: 'Build Network', desc: 'Make meaningful professional connections', icon: Icons.users },
    { value: 'cofounder', label: 'Find Co-founder', desc: 'Looking for a co-founding partner', icon: Icons.zap },
    { value: 'customer', label: 'Find Customers', desc: 'Discover design partners and users', icon: Icons.barChart },
    { value: 'learning', label: 'Learn Skills', desc: 'Deepen technical knowledge', icon: Icons.compass },
  ];

  const updateForm = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

  const handleNext = () => {
    if (step < stepperItems.length - 1) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const user = await registerUser({
        name: form.name,
        email: form.email || `${form.name.toLowerCase().replace(/\s/g, '.')}@demo.com`,
        role: form.role,
        title: form.title,
        company: form.company,
        bio: form.bio,
        linkedin_url: form.linkedin_url,
        github_url: form.github_url,
        twitter_url: form.twitter_url,
        website: form.website,
        skills: form.skills,
        interests: form.interests,
        goals: [{
          goal_type: form.goalType,
          description: form.goalDescription || form.goalType,
          target_count: form.goalTarget,
          priority: 10,
        }],
      }) as any;
      setAiTwin(user?.ai_twin);
      setStep(3); // Show AI Twin
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  const canProceed = () => {
    if (step === 0) return form.name.trim() && form.title.trim();
    if (step === 1) return form.skills.length > 0;
    if (step === 2) return form.goalType;
    return true;
  };

  return (
    <div className="onboarding">
      <div className="onboarding-card">
        {/* Header */}
        <div className="onboarding-header">
          <div className="onboarding-logo">
            <span className="sidebar-logo-icon">◆</span>
            <span className="sidebar-logo-text">Waypoint</span>
          </div>
          <div className="onboarding-steps" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', width: '380px' }}>
            {stepperItems.map((item, idx) => (
              <React.Fragment key={idx}>
                <button
                  className={`custom-step ${idx === step ? 'active' : idx < step ? 'done' : ''}`}
                  onClick={() => idx <= step && setStep(idx)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    cursor: idx <= step ? 'pointer' : 'default',
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
                      background: idx === step 
                        ? 'var(--primary)' 
                        : idx < step 
                          ? 'var(--primary-muted)' 
                          : 'var(--surface-3)',
                      color: idx === step 
                        ? 'white' 
                        : idx < step 
                          ? 'var(--primary)' 
                          : 'var(--text-secondary)',
                      border: `1px solid ${
                        idx === step || idx < step 
                          ? 'var(--primary)' 
                          : 'var(--border-default)'
                      }`,
                      boxShadow: idx === step ? '0 0 10px rgba(99, 102, 241, 0.4)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {idx < step ? <Icons.check size={10} /> : idx + 1}
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: idx === step ? 700 : 500,
                      color: idx === step 
                        ? 'var(--text-primary)' 
                        : 'var(--text-secondary)',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
                {idx < stepperItems.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      background: idx < step ? 'var(--primary)' : 'var(--border-default)',
                      transition: 'background 0.2s ease',
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="onboarding-body animate-fade-in" key={step}>
          {step === 0 && (
            <>
              <h2 className="onboarding-title">Create your profile</h2>
              <p className="onboarding-desc">Tell us about yourself so we can find the best matches for you.</p>
              <div className="onboarding-form">
                <div className="onboarding-row">
                  <div className="input-wrapper" style={{ flex: 2 }}>
                    <label className="input-label">Full Name *</label>
                    <input className="input" placeholder="Alex Chen" value={form.name} onChange={(e) => updateForm('name', e.target.value)} autoFocus />
                  </div>
                  <div className="input-wrapper" style={{ flex: 1 }}>
                    <label className="input-label">Requested Role *</label>
                    <select className="input" value={form.role} onChange={(e) => updateForm('role', e.target.value)}>
                      <option value="attendee">Attendee</option>
                      <option value="speaker">Speaker</option>
                      <option value="moderator">Moderator</option>
                      <option value="panelist">Panelist</option>
                    </select>
                  </div>
                </div>
                <div className="input-wrapper">
                  <label className="input-label">Email</label>
                  <input className="input" placeholder="alex@company.com" value={form.email} onChange={(e) => updateForm('email', e.target.value)} />
                </div>
                <div className="onboarding-row">
                  <div className="input-wrapper" style={{ flex: 1 }}>
                    <label className="input-label">Title *</label>
                    <input className="input" placeholder="Senior Engineer" value={form.title} onChange={(e) => updateForm('title', e.target.value)} />
                  </div>
                  <div className="input-wrapper" style={{ flex: 1 }}>
                    <label className="input-label">Company</label>
                    <input className="input" placeholder="Acme Inc" value={form.company} onChange={(e) => updateForm('company', e.target.value)} />
                  </div>
                </div>
                <div className="input-wrapper">
                  <label className="input-label">Bio</label>
                  <textarea className="input textarea" placeholder="Tell us about yourself, your work, and what excites you..." value={form.bio} onChange={(e) => updateForm('bio', e.target.value)} />
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="onboarding-title">Skills & Interests</h2>
              <p className="onboarding-desc">Help us understand your expertise and what you're passionate about.</p>
              <div className="onboarding-form">
                <div className="input-wrapper">
                  <label className="input-label">Skills (press Enter to add)</label>
                  <TagInput tags={form.skills} onAdd={(t) => updateForm('skills', [...form.skills, t])} onRemove={(t) => updateForm('skills', form.skills.filter((s) => s !== t))} placeholder="React, TypeScript, AI/ML..." />
                </div>
                <div className="input-wrapper">
                  <label className="input-label">Interests</label>
                  <TagInput tags={form.interests} onAdd={(t) => updateForm('interests', [...form.interests, t])} onRemove={(t) => updateForm('interests', form.interests.filter((s) => s !== t))} placeholder="Developer Tools, Startups, Open Source..." />
                </div>
                <div className="onboarding-row">
                  <div className="input-wrapper" style={{ flex: 1 }}>
                    <label className="input-label">LinkedIn URL</label>
                    <input className="input" placeholder="linkedin.com/in/..." value={form.linkedin_url} onChange={(e) => updateForm('linkedin_url', e.target.value)} />
                  </div>
                  <div className="input-wrapper" style={{ flex: 1 }}>
                    <label className="input-label">GitHub</label>
                    <input className="input" placeholder="github.com/..." value={form.github_url} onChange={(e) => updateForm('github_url', e.target.value)} />
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="onboarding-title">Define your mission</h2>
              <p className="onboarding-desc">What do you want to achieve at this conference?</p>
              <div className="goal-grid">
                {GOAL_TYPES.map((g) => {
                  const Icon = g.icon;
                  return (
                    <button key={g.value} className={`goal-option card ${form.goalType === g.value ? 'goal-option-selected' : ''}`} onClick={() => updateForm('goalType', g.value)}>
                      <div className="goal-option-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Icon size={16} />
                        {g.label}
                      </div>
                      <div className="goal-option-desc">{g.desc}</div>
                    </button>
                  );
                })}
              </div>
              {form.goalType && (
                <div className="onboarding-form" style={{ marginTop: 'var(--space-6)' }}>
                  <div className="input-wrapper">
                    <label className="input-label">Describe your goal</label>
                    <input className="input" placeholder="e.g. Find 5 startup founders to network with" value={form.goalDescription} onChange={(e) => updateForm('goalDescription', e.target.value)} />
                  </div>
                  <div className="input-wrapper">
                    <label className="input-label">Target count</label>
                    <input className="input" type="number" min={1} max={20} value={form.goalTarget} onChange={(e) => updateForm('goalTarget', parseInt(e.target.value) || 5)} style={{ width: 100 }} />
                  </div>
                </div>
              )}
            </>
          )}

          {step === 3 && aiTwin && (
            <>
              <h2 className="onboarding-title">Your AI Twin is ready</h2>
              <p className="onboarding-desc">We've analyzed your profile and created an AI representation of your goals and expertise.</p>
              <div className="ai-twin-card card">
                <div className="ai-twin-section">
                  <h4>Summary</h4>
                  <p>{aiTwin.summary}</p>
                </div>
                <div className="ai-twin-section">
                  <h4>Skills</h4>
                  <div className="ai-twin-tags">{(aiTwin.skills || []).map((s: string) => <span key={s} className="tag">{s}</span>)}</div>
                </div>
                <div className="ai-twin-section">
                  <h4>Interests</h4>
                  <div className="ai-twin-tags">{(aiTwin.interests || []).map((i: string) => <span key={i} className="tag">{i}</span>)}</div>
                </div>
                <div className="ai-twin-section">
                  <h4>Seeking</h4>
                  <div className="ai-twin-tags">{(aiTwin.seeking || []).map((s: string) => <span key={s} className="badge badge-primary">{s}</span>)}</div>
                </div>
                <div className="ai-twin-section">
                  <h4>Networking Intent</h4>
                  <ul className="ai-twin-intents">{(aiTwin.networkingIntent || []).map((n: string, i: number) => <li key={i}>{n}</li>)}</ul>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="onboarding-footer">
          {step > 0 && step < 3 && (
            <button className="btn btn-secondary" onClick={handleBack}>
              <span style={{ display: 'inline-flex', transform: 'rotate(180deg)', marginRight: 6 }}><Icons.arrowRight size={14} /></span> Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < 2 && (
            <button className="btn btn-primary" onClick={handleNext} disabled={!canProceed()}>
              Continue <span style={{ display: 'inline-flex', marginLeft: 6 }}><Icons.arrowRight size={14} /></span>
            </button>
          )}
          {step === 2 && (
            <button className="btn btn-primary" onClick={handleSubmit} disabled={!canProceed() || loading}>
              {loading ? 'Generating AI Twin...' : 'Generate AI Twin'} <span style={{ display: 'inline-flex', marginLeft: 6 }}><Icons.zap size={14} /></span>
            </button>
          )}
          {step === 3 && (
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
              <Icons.zap size={18} /> Launch Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
