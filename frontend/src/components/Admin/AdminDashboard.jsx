import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  CheckSquare, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Clock, 
  Activity, 
  Plus, 
  Car 
} from 'lucide-react';

export default function AdminDashboard() {
  const { centers, requests, setActiveTab, setIsAuthModalOpen, setAuthMode, currentUser } = useApp();

  // Metric calculations
  const totalCenters = centers.length;
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const confirmedRequests = requests.filter(r => r.status === 'confirmed');

  const totalSlots = centers.reduce((acc, c) => acc + c.totalSlots, 0);
  const totalFreeSlots = centers.reduce((acc, c) => acc + c.availableSlots, 0);
  const occupiedSlots = totalSlots - totalFreeSlots;
  const occupancyRate = totalSlots > 0 ? ((occupiedSlots / totalSlots) * 100).toFixed(1) : 0;

  const totalRevenue = confirmedRequests.reduce((acc, r) => acc + Number(r.totalPrice), 0).toFixed(2);

  return (
    <div>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-admin" style={{ marginBottom: '0.35rem' }}>
            <Activity size={13} /> Admin Command Center
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Analytics & System Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Real-time analytics, revenue tracking, and parking slot management
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setActiveTab('admin-centers')}
          >
            <Plus size={16} /> Add Slot Center
          </button>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('admin-requests')}
          >
            <CheckSquare size={16} /> Review Requests ({pendingRequests.length})
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="dashboard-grid">
        <div className="glass-panel kpi-card">
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL REVENUE</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '0.2rem' }}>
              ${totalRevenue}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.3rem' }}>
              <TrendingUp size={12} /> +18.4% this week
            </span>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
            <DollarSign size={24} />
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>OCCUPANCY RATE</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
              {occupancyRate}%
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>
              {occupiedSlots} occupied / {totalSlots} total
            </span>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' }}>
            <Car size={24} />
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>PENDING REQUESTS</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '0.2rem' }}>
              {pendingRequests.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', marginTop: '0.3rem', display: 'block' }}>
              Requires Admin action
            </span>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>
            <Clock size={24} />
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>SLOT CENTERS</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>
              {totalCenters}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>
              Active Managed Facilities
            </span>
          </div>
          <div className="kpi-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Building2 size={24} />
          </div>
        </div>
      </div>

      {/* Visual Peak Usage Chart & Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Hourly Peak Usage Graph Visualizer */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Hourly Occupancy & Traffic Trend</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>24-Hour peak activity analysis</p>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', background: 'rgba(6,182,212,0.1)', padding: '4px 10px', borderRadius: '9999px' }}>
              Live System Telemetry
            </span>
          </div>

          {/* Bar chart canvas visualization */}
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '180px', gap: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-glass)' }}>
            {[
              { hour: '06:00', val: 20 },
              { hour: '08:00', val: 55 },
              { hour: '10:00', val: 85 },
              { hour: '12:00', val: 95 },
              { hour: '14:00', val: 78 },
              { hour: '16:00', val: 90 },
              { hour: '18:00', val: 82 },
              { hour: '20:00', val: 45 },
              { hour: '22:00', val: 25 }
            ].map((item, idx) => (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{
                  width: '100%',
                  height: `${item.val}%`,
                  background: item.val > 80 
                    ? 'linear-gradient(180deg, #F43F5E 0%, #BE123C 100%)' 
                    : 'linear-gradient(180deg, #6366F1 0%, #4338CA 100%)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.5s ease',
                  position: 'relative'
                }}>
                  <div style={{ position: 'absolute', top: '-18px', width: '100%', textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {item.val}%
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{item.hour}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center Occupancy Breakdown */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Slot Availability Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {centers.slice(0, 4).map(center => {
              const freePct = Math.round((center.availableSlots / center.totalSlots) * 100);
              return (
                <div key={center.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>{center.name}</span>
                    <span style={{ color: 'var(--accent-cyan)' }}>{center.availableSlots} free ({freePct}%)</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${100 - freePct}%`, 
                      height: '100%', 
                      background: freePct < 20 ? 'var(--accent-rose)' : 'var(--primary)' 
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
