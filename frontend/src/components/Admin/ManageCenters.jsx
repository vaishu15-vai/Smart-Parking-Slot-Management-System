import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import CreateCenterModal from './CreateCenterModal';
import { Building2, Plus, Trash2, ShieldCheck, Clock, MapPin, PlusCircle, MinusCircle } from 'lucide-react';

export default function ManageCenters() {
  const { centers, deleteCenter, updateCenterSlots } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-admin" style={{ marginBottom: '0.35rem' }}>
            <Building2 size={13} /> Network Management
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Parking Slot Centers</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Create new slot centers and modify real-time slot capacities
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus size={18} /> Create New Slot Center
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {centers.map(center => {
          const isWithin1Hr = center.estimatedMinutes <= 60;

          return (
            <div key={center.id} className="glass-panel" style={{ padding: '1.25rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{center.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                    <MapPin size={13} /> {center.address}
                  </div>
                </div>
                <button 
                  onClick={() => deleteCenter(center.id)}
                  className="btn btn-danger btn-sm"
                  style={{ padding: '0.3rem 0.5rem' }}
                  title="Remove Center"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Distance and Rates */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: '#FFF' }}>
                  <Clock size={11} /> {center.estimatedMinutes} mins ({center.distanceKm} km)
                </span>
                <span className="badge badge-confirmed">
                  ${center.hourlyRate} / hr
                </span>
              </div>

              {/* Real-time Live Slot Capacity Controls */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Available Capacity</span>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--accent-cyan)' }}>
                    {center.availableSlots} / {center.totalSlots} Slots
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button 
                    onClick={() => updateCenterSlots(center.id, -1)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, padding: '0.35rem' }}
                    disabled={center.availableSlots <= 0}
                  >
                    <MinusCircle size={14} /> Occupy (-1)
                  </button>
                  <button 
                    onClick={() => updateCenterSlots(center.id, 1)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, padding: '0.35rem' }}
                    disabled={center.availableSlots >= center.totalSlots}
                  >
                    <PlusCircle size={14} /> Release (+1)
                  </button>
                </div>
              </div>

              {/* Amenities */}
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {center.facilities.map((fac, idx) => (
                  <span key={idx} style={{ background: 'rgba(255,255,255,0.04)', fontSize: '0.675rem', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                    {fac}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <CreateCenterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
