import React from 'react';
import './ui.css';
import { Icons } from './Icons';

/* ===== Progress Ring ===== */
export function ProgressRing({ value, size = 60, strokeWidth = 4, children }: { value: number; size?: number; strokeWidth?: number; children?: React.ReactNode }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="progress-ring-wrapper" style={{ width: size, height: size }}>
      <svg className="progress-ring" width={size} height={size}>
        <circle className="progress-ring__bg" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} fill="none" />
        <circle className="progress-ring__fill" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      {children && <div className="progress-ring-content">{children}</div>}
    </div>
  );
}

/* ===== Match Score ===== */
export function MatchScore({ score }: { score: number }) {
  const color = score >= 90 ? 'var(--success)' : score >= 75 ? 'var(--primary)' : score >= 60 ? 'var(--warning)' : 'var(--text-tertiary)';
  return (
    <ProgressRing value={score} size={52} strokeWidth={3}>
      <span className="match-score-value" style={{ color }}>{score}</span>
    </ProgressRing>
  );
}

/* ===== Avatar ===== */
export function Avatar({ name, size = 'md', src }: { name: string; size?: 'sm' | 'md' | 'lg' | 'xl'; src?: string }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#22C55E', '#14B8A6', '#3B82F6'];
  const colorIndex = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  const bg = colors[colorIndex];
  const cls = `avatar ${size !== 'md' ? `avatar-${size}` : ''}`;
  return (
    <div className={cls} style={{ background: src ? 'transparent' : `${bg}22`, color: bg }}>
      {src ? <img src={src} alt={name} /> : initials}
    </div>
  );
}

/* ===== Stat Card ===== */
export function StatCard({ label, value, change, changeLabel, icon }: { label: string; value: number | string; change?: number; changeLabel?: string; icon: React.ReactNode }) {
  return (
    <div className="stat-card card">
      <div className="stat-card-header">
        <span className="stat-card-icon" style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
        <span className="stat-card-label">{label}</span>
      </div>
      <div className="stat-card-value">{typeof value === 'number' && value > 999 ? value.toLocaleString() : value}{typeof value === 'number' && label.toLowerCase().includes('completion') ? '%' : ''}</div>
      {change !== undefined && (
        <div className={`stat-card-change ${change >= 0 ? 'positive' : 'negative'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% {changeLabel}
        </div>
      )}
    </div>
  );
}

/* ===== Skeleton ===== */
export function Skeleton({ width, height = 20, radius }: { width?: number | string; height?: number | string; radius?: number }) {
  return <div className="skeleton" style={{ width: width ?? '100%', height, borderRadius: radius ?? 'var(--radius-md)' }} />;
}

/* ===== Empty State ===== */
export function EmptyState({ icon, title, description, action }: { icon: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <div className="empty-state-title">{title}</div>
      <div className="empty-state-desc">{description}</div>
      {action}
    </div>
  );
}

/* ===== Availability Badge ===== */
export function AvailabilityBadge({ status }: { status: 'available' | 'busy' | 'offline' }) {
  const config = {
    available: { label: 'Available', className: 'badge-success' },
    busy: { label: 'Busy', className: 'badge-warning' },
    offline: { label: 'Offline', className: '' },
  };
  const { label, className } = config[status];
  return (
    <span className={`badge ${className}`}>
      <span className={`availability-dot ${status}`} />
      {label}
    </span>
  );
}

/* ===== Toast Container ===== */
export function ToastContainer({ toasts, onRemove }: { toasts: Array<{ id: string; message: string; type: string }>; onRemove: (id: string) => void }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`} onClick={() => onRemove(t.id)} role="alert">
          <span className="toast-icon">
            {t.type === 'success' ? <Icons.check size={14} /> : <Icons.alertCircle size={14} />}
          </span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

/* ===== Tag Input ===== */
export function TagInput({ tags, onAdd, onRemove, placeholder = 'Add a tag...' }: { tags: string[]; onAdd: (tag: string) => void; onRemove: (tag: string) => void; placeholder?: string }) {
  const [value, setValue] = React.useState('');
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault();
      if (!tags.includes(value.trim())) onAdd(value.trim());
      setValue('');
    }
    if (e.key === 'Backspace' && !value && tags.length) {
      onRemove(tags[tags.length - 1]);
    }
  };
  return (
    <div className="tag-input-wrapper">
      <div className="tag-input-tags">
        {tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
            <button className="tag-remove" onClick={() => onRemove(tag)} aria-label={`Remove ${tag}`}>×</button>
          </span>
        ))}
        <input className="tag-input-field" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} placeholder={tags.length ? '' : placeholder} />
      </div>
    </div>
  );
}

/* ===== Command Palette ===== */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) onClose(); else onClose(); // toggle is handled in parent
      }
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const commands = [
    { icon: <Icons.home size={16} />, label: 'Go to Dashboard', shortcut: 'G D' },
    { icon: <Icons.compass size={16} />, label: 'View Recommendations', shortcut: 'G R' },
    { icon: <Icons.map size={16} />, label: 'Open Networking Map', shortcut: 'G N' },
    { icon: <Icons.calendar size={16} />, label: 'View Schedule', shortcut: 'G S' },
    { icon: <Icons.search size={16} />, label: 'Search People', shortcut: '/' },
    { icon: <Icons.wifi size={16} />, label: 'Set Available to Network', shortcut: 'A N' },
    { icon: <Icons.target size={16} />, label: 'Update Mission', shortcut: 'U M' },
    { icon: <Icons.settings size={16} />, label: 'Settings', shortcut: 'G ,' },
  ].filter((c) => !query || c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <div className="command-palette-input-wrapper">
          <span className="command-palette-search-icon">⌘</span>
          <input ref={inputRef} className="command-palette-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type a command or search..." />
          <kbd className="command-palette-kbd">ESC</kbd>
        </div>
        <div className="command-palette-list">
          {commands.map((cmd, i) => (
            <button key={i} className="command-palette-item" onClick={onClose}>
              <span className="command-palette-item-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>{cmd.icon}</span>
              <span className="command-palette-item-label">{cmd.label}</span>
              <kbd className="command-palette-item-shortcut">{cmd.shortcut}</kbd>
            </button>
          ))}
          {commands.length === 0 && <div className="command-palette-empty">No commands found</div>}
        </div>
      </div>
    </div>
  );
}
