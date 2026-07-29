import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Car, Clock, ShieldCheck, MapPin, DollarSign, CheckCircle2 } from 'lucide-react';

export default function BookingModal() {
  const { 
    selectedCenterForBooking, 
    setSelectedCenterForBooking, 
    submitBookingRequest,
    currentUser,
    setIsAuthModalOpen,
    setAuthMode
  } = useApp();

  const [vehicleNo, setVehicleNo] = useState('KA-05-EV-4421');
  const [startTime, setStartTime] = useState('14:30');
  const [durationHours, setDurationHours] = useState(2);
  const [phone, setPhone] = useState('+1 (555) 888-9999');

  if (!selectedCenterForBooking) return null;

  const center = selectedCenterForBooking;
  const totalPrice = (center.hourlyRate * durationHours).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    submitBookingRequest({
      centerId: center.id,
      centerName: center.name,
      vehicleNo,
      startTime,
      durationHours,
      totalPrice,
      phone
    });
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedCenterForBooking(null)}>
      <div 
        className="modal-content glass-panel" 
        onClick={e => e.stopPropagation()}
        style={{ border: '1px solid var(--border-glow)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Request Parking Slot</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}>
              <MapPin size={14} /> {center.name}
            </div>
          </div>
          <button 
            onClick={() => setSelectedCenterForBooking(null)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Center Quick Stats */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          padding: '0.85rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          textAlign: 'center',
          border: '1px solid var(--border-glass)'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Distance</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF' }}>{center.distanceKm} km</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Drive Time</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>~{center.estimatedMinutes} mins</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hourly Rate</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-emerald)' }}>${center.hourlyRate}/hr</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Vehicle Registration Number</label>
            <input 
              type="text" 
              className="form-input"
              value={vehicleNo}
              onChange={e => setVehicleNo(e.target.value)}
              placeholder="e.g. KA-05-EV-4421"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Arrival Time</label>
              <input 
                type="time" 
                className="form-input"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Duration (Hours)</label>
              <select 
                className="form-select"
                value={durationHours}
                onChange={e => setDurationHours(Number(e.target.value))}
              >
                <option value={1}>1 Hour</option>
                <option value={2}>2 Hours</option>
                <option value={3}>3 Hours</option>
                <option value={4}>4 Hours</option>
                <option value={6}>6 Hours</option>
                <option value={12}>12 Hours (Full Day)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone Number</label>
            <input 
              type="tel" 
              className="form-input"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              required
            />
          </div>

          {/* Pricing Summary */}
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Estimated Fee</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                ${totalPrice}
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', textAlign: 'right' }}>
              <ShieldCheck size={16} style={{ display: 'inline', marginRight: '4px' }} />
              Requires Admin Approval
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
            Submit Booking Request
          </button>
        </form>
      </div>
    </div>
  );
}
