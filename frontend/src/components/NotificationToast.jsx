import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function NotificationToast() {
  const { notifications } = useApp();

  if (!notifications.length) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '380px',
      pointerEvents: 'none'
    }}>
      {notifications.map(n => (
        <div
          key={n.id}
          className="glass-panel"
          style={{
            pointerEvents: 'auto',
            padding: '0.85rem 1.1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: n.type === 'success' ? 'rgba(6, 78, 59, 0.9)' :
                        n.type === 'warning' ? 'rgba(120, 53, 15, 0.9)' : 'rgba(30, 41, 59, 0.95)',
            borderLeft: `4px solid ${n.type === 'success' ? '#10B981' : n.type === 'warning' ? '#F59E0B' : '#6366F1'}`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            color: '#FFF'
          }}
        >
          {n.type === 'success' && <CheckCircle2 size={20} color="#10B981" />}
          {n.type === 'warning' && <AlertTriangle size={20} color="#F59E0B" />}
          {n.type === 'info' && <Info size={20} color="#6366F1" />}
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{n.msg}</span>
        </div>
      ))}
    </div>
  );
}
