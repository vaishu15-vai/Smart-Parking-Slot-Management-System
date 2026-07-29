import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Grid, 
  Car, 
  Zap, 
  ShieldAlert, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Filter, 
  RefreshCw, 
  Building2 
} from 'lucide-react';

export default function SlotManager() {
  const { centers, updateSlotLayoutStatus, fetchSlotLayout } = useApp();
  const [selectedCenterId, setSelectedCenterId] = useState(centers[0]?.id || 'center-1');
  const [slotLayout, setSlotLayout] = useState([]);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [selectedSlotForAction, setSelectedSlotForAction] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedCenter = centers.find(c => c.id === selectedCenterId) || centers[0];

  const loadLayout = async (centerId) => {
    setLoading(true);
    const layout = await fetchSlotLayout(centerId);
    setSlotLayout(layout || []);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedCenterId) {
      loadLayout(selectedCenterId);
    }
  }, [selectedCenterId]);

  // Statistics calculation
  const totalBays = slotLayout.length;
  const availableBays = slotLayout.filter(s => s.status === 'available').length;
  const occupiedBays = slotLayout.filter(s => s.status === 'occupied').length;
  const reservedBays = slotLayout.filter(s => s.status === 'reserved').length;
  const maintenanceBays = slotLayout.filter(s => s.status === 'maintenance').length;

  const filteredSlots = slotLayout.filter(s => {
    if (selectedTypeFilter === 'all') return true;
    return s.type === selectedTypeFilter;
  });

  const handleStatusChange = async (newStatus) => {
    if (!selectedSlotForAction) return;
    await updateSlotLayoutStatus(selectedCenterId, selectedSlotForAction.slotNumber, newStatus);
    setSelectedSlotForAction(null);
    loadLayout(selectedCenterId);
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-admin" style={{ marginBottom: '0.35rem' }}>
            <Grid size={13} /> Visual Parking Grid & Bay Control
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Admin Slot Manager</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Monitor and manage individual parking bays live across floor layouts
          </p>
        </div>

        {/* Center Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Building2 size={16} /> Select Facility:
          </span>
          <select 
            className="form-select"
            value={selectedCenterId}
            onChange={e => setSelectedCenterId(e.target.value)}
            style={{ minWidth: '220px', fontWeight: 600 }}
          >
            {centers.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.availableSlots}/{c.totalSlots} free)
              </option>
            ))}
          </select>

          <button 
            onClick={() => loadLayout(selectedCenterId)}
            className="btn btn-secondary btn-sm"
            title="Refresh Slot Layout"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Real-time KPI Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ textAlign: 'center', borderLeft: '4px solid #10B981' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AVAILABLE BAYS</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34D399', marginTop: '0.2rem' }}>
            {availableBays}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Ready for entry</span>
        </div>

        <div className="glass-card" style={{ textAlign: 'center', borderLeft: '4px solid #F43F5E' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OCCUPIED BAYS</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F87171', marginTop: '0.2rem' }}>
            {occupiedBays}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Parked vehicles</span>
        </div>

        <div className="glass-card" style={{ textAlign: 'center', borderLeft: '4px solid #F59E0B' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>RESERVED BAYS</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FBBF24', marginTop: '0.2rem' }}>
            {reservedBays}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Confirmed bookings</span>
        </div>

        <div className="glass-card" style={{ textAlign: 'center', borderLeft: '4px solid #8B5CF6' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>MAINTENANCE</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#A78BFA', marginTop: '0.2rem' }}>
            {maintenanceBays}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Out of service</span>
        </div>
      </div>

      {/* Bay Category Filters */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Filter size={14} /> Filter Bay Type:
          </span>
          {['all', 'Standard', 'EV Charging', 'VIP'].map(t => (
            <button
              key={t}
              onClick={() => setSelectedTypeFilter(t)}
              style={{
                background: selectedTypeFilter === t ? 'var(--primary-light)' : 'rgba(255,255,255,0.04)',
                color: selectedTypeFilter === t ? 'var(--primary)' : 'var(--text-muted)',
                border: selectedTypeFilter === t ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} /> Available
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F43F5E' }} /> Occupied
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} /> Reserved
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8B5CF6' }} /> Maintenance
          </span>
        </div>
      </div>

      {/* Visual Slot Layout Grid Canvas */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Layers size={18} color="var(--accent-cyan)" /> {selectedCenter?.name} — Floor Plan Grid
        </h3>

        {filteredSlots.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No parking bays matching the filter criteria.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '1rem'
          }}>
            {filteredSlots.map(slot => {
              const isAvailable = slot.status === 'available';
              const isOccupied = slot.status === 'occupied';
              const isReserved = slot.status === 'reserved';
              const isMaintenance = slot.status === 'maintenance';

              return (
                <div
                  key={slot.slotNumber}
                  onClick={() => setSelectedSlotForAction(slot)}
                  style={{
                    background: isAvailable ? 'rgba(16, 185, 129, 0.08)' :
                                isOccupied ? 'rgba(244, 63, 94, 0.08)' :
                                isReserved ? 'rgba(245, 158, 11, 0.08)' : 'rgba(139, 92, 246, 0.08)',
                    border: `1.5px solid ${
                      isAvailable ? 'rgba(16, 185, 129, 0.35)' :
                      isOccupied ? 'rgba(244, 63, 94, 0.35)' :
                      isReserved ? 'rgba(245, 158, 11, 0.35)' : 'rgba(139, 92, 246, 0.35)'
                    }`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {/* Slot Number */}
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>
                    {slot.slotNumber}
                  </div>

                  {/* Bay Type Pill */}
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '0.2rem 0' }}>
                    {slot.type === 'EV Charging' ? '⚡ EV Charging' : slot.type}
                  </div>

                  {/* Status Indicator Badge */}
                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: isAvailable ? '#34D399' : isOccupied ? '#F87171' : isReserved ? '#FBBF24' : '#A78BFA',
                    textTransform: 'uppercase'
                  }}>
                    {slot.status}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bay Status Action Modal */}
      {selectedSlotForAction && (
        <div className="modal-overlay" onClick={() => setSelectedSlotForAction(null)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              Manage Parking Bay {selectedSlotForAction.slotNumber}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Change operational status for facility: <strong>{selectedCenter.name}</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button 
                onClick={() => handleStatusChange('available')}
                className="btn btn-success"
                style={{ justifyContent: 'flex-start', padding: '0.75rem' }}
              >
                <CheckCircle2 size={18} /> Mark as AVAILABLE (Free)
              </button>

              <button 
                onClick={() => handleStatusChange('occupied')}
                className="btn btn-danger"
                style={{ justifyContent: 'flex-start', padding: '0.75rem' }}
              >
                <Car size={18} /> Mark as OCCUPIED (Vehicle Parked)
              </button>

              <button 
                onClick={() => handleStatusChange('reserved')}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '0.75rem', borderColor: '#F59E0B', color: '#FBBF24' }}
              >
                <Clock size={18} /> Mark as RESERVED
              </button>

              <button 
                onClick={() => handleStatusChange('maintenance')}
                className="btn btn-secondary"
                style={{ justifyContent: 'flex-start', padding: '0.75rem', borderColor: '#8B5CF6', color: '#A78BFA' }}
              >
                <Wrench size={18} /> Mark as MAINTENANCE (Out of Service)
              </button>
            </div>

            <button 
              onClick={() => setSelectedSlotForAction(null)}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
