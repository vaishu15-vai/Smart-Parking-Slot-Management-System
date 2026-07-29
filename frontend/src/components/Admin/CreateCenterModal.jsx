import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Building2, MapPin, DollarSign, Car, Shield } from 'lucide-react';

export default function CreateCenterModal({ isOpen, onClose }) {
  const { createCenter } = useApp();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [distanceKm, setDistanceKm] = useState(5.0);
  const [estimatedMinutes, setEstimatedMinutes] = useState(12);
  const [totalSlots, setTotalSlots] = useState(100);
  const [hourlyRate, setHourlyRate] = useState(5.0);
  const [contact, setContact] = useState('+1 (555) 000-7777');
  const [selectedFacilities, setSelectedFacilities] = useState(['EV Charging', '24/7 Security']);

  if (!isOpen) return null;

  const facilityOptions = ['EV Charging', 'Covered Parking', '24/7 Security', 'Valet', 'Car Wash Service', 'Disabled Friendly', 'Automated Barrier'];

  const toggleFacility = (fac) => {
    if (selectedFacilities.includes(fac)) {
      setSelectedFacilities(selectedFacilities.filter(f => f !== fac));
    } else {
      setSelectedFacilities([...selectedFacilities, fac]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !address) return;

    createCenter({
      name,
      address,
      distanceKm: Number(distanceKm),
      estimatedMinutes: Number(estimatedMinutes),
      totalSlots: Number(totalSlots),
      availableSlots: Number(totalSlots), // all free upon creation
      hourlyRate: Number(hourlyRate),
      contact,
      facilities: selectedFacilities
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={e => e.stopPropagation()}
        style={{ border: '1px solid var(--border-glow)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Add New Parking Center</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Expand your smart parking network</p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Center Name</label>
            <input 
              type="text"
              className="form-input"
              placeholder="e.g. Apex Tower Smart Garage"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Street Address & Location</label>
            <input 
              type="text"
              className="form-input"
              placeholder="e.g. 700 Main Street, Sector 4"
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Distance (km)</label>
              <input 
                type="number"
                step="0.1"
                className="form-input"
                value={distanceKm}
                onChange={e => {
                  const km = Number(e.target.value);
                  setDistanceKm(km);
                  setEstimatedMinutes(Math.round(km * 2.2)); // auto approx drive time
                }}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Drive Time (Minutes)</label>
              <input 
                type="number"
                className="form-input"
                value={estimatedMinutes}
                onChange={e => setEstimatedMinutes(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Total Parking Slots</label>
              <input 
                type="number"
                className="form-input"
                value={totalSlots}
                onChange={e => setTotalSlots(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Hourly Rate ($/hr)</label>
              <input 
                type="number"
                step="0.5"
                className="form-input"
                value={hourlyRate}
                onChange={e => setHourlyRate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Amenities & Features</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {facilityOptions.map(fac => {
                const isSelected = selectedFacilities.includes(fac);
                return (
                  <button
                    key={fac}
                    type="button"
                    onClick={() => toggleFacility(fac)}
                    style={{
                      background: isSelected ? 'var(--primary-light)' : 'rgba(255,255,255,0.05)',
                      color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '}{fac}
                  </button>
                );
              })}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}>
            Create & Deploy Center
          </button>
        </form>
      </div>
    </div>
  );
}
