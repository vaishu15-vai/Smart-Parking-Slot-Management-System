import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Navigation, Car, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function InteractiveMap({ centers, onSelectCenter, highlightSlot }) {
  const { userLocation } = useApp();
  const [hoveredCenter, setHoveredCenter] = useState(null);

  return (
    <div className="map-canvas">
      {/* Road Grids */}
      <div className="map-road" style={{ top: '35%', left: 0, right: 0, height: '14px' }} />
      <div className="map-road" style={{ top: '65%', left: 0, right: 0, height: '10px' }} />
      <div className="map-road" style={{ top: 0, bottom: 0, left: '30%', width: '12px' }} />
      <div className="map-road" style={{ top: 0, bottom: 0, left: '70%', width: '16px' }} />
      
      {/* Route Navigation Line if highlightSlot is active */}
      {highlightSlot && centers[0] && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 12 }}>
          <line 
            x1="50%" 
            y1="50%" 
            x2={`${centers[0].mapX}%`} 
            y2={`${centers[0].mapY}%`} 
            stroke="#059669" 
            strokeWidth="3" 
            strokeDasharray="6 4"
          />
        </svg>
      )}

      {/* User Live Location Pinpoint */}
      <div 
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 15,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: 'rgba(2, 132, 199, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <div className="map-pin-pulse" style={{ border: '2px solid var(--accent-cyan)' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-cyan)' }} />
        </div>
        <div style={{
          background: 'var(--bg-card)',
          padding: '2px 8px',
          borderRadius: '9999px',
          fontSize: '0.675rem',
          color: 'var(--accent-cyan)',
          fontWeight: 700,
          border: '1px solid var(--accent-cyan)',
          marginTop: '4px',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}>
          YOU (GPS Center)
        </div>
      </div>

      {/* Parking Centers Pins */}
      {centers.map(center => {
        const isWithin1Hr = center.estimatedMinutes <= 60;
        const isHovered = hoveredCenter?.id === center.id;

        return (
          <div
            key={center.id}
            className="map-pin"
            style={{
              left: `${center.mapX}%`,
              top: `${center.mapY}%`,
              opacity: isWithin1Hr ? 1 : 0.4
            }}
            onMouseEnter={() => setHoveredCenter(center)}
            onMouseLeave={() => setHoveredCenter(null)}
            onClick={() => onSelectCenter && onSelectCenter(center)}
          >
            <div style={{
              background: highlightSlot
                ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                : center.availableSlots > 0 
                ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' 
                : 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
              color: 'white',
              padding: '0.4rem 0.65rem',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.75rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              border: isHovered || highlightSlot ? '2px solid white' : '1px solid rgba(255,255,255,0.3)'
            }}>
              <Car size={14} />
              <span>${center.hourlyRate}/h</span>
              <span style={{
                background: 'rgba(0,0,0,0.25)',
                padding: '1px 5px',
                borderRadius: '4px',
                fontSize: '0.7rem'
              }}>
                {highlightSlot ? `Slot ${highlightSlot}` : `${center.availableSlots} free`}
              </span>
            </div>

            {/* Callout Badge when Physically Confirmed */}
            {highlightSlot && (
              <div style={{
                position: 'absolute',
                top: '-32px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#059669',
                color: '#FFF',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '0.675rem',
                fontWeight: 800,
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
              }}>
                <CheckCircle2 size={10} style={{ display: 'inline', marginRight: '2px' }} /> PHYSICAL SLOT {highlightSlot} READY
              </div>
            )}

            {/* Hover Tooltip */}
            {isHovered && !highlightSlot && (
              <div 
                className="glass-panel"
                style={{
                  position: 'absolute',
                  bottom: '125%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '220px',
                  padding: '0.85rem',
                  zIndex: 50,
                  fontSize: '0.8rem',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
                  border: '1px solid var(--primary)'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.2rem', color: 'var(--text-main)' }}>
                  {center.name}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
                  {center.address}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0.4rem 0', fontWeight: 600 }}>
                  <span style={{ color: 'var(--accent-cyan)' }}>
                    📍 {center.distanceKm} km ({center.estimatedMinutes} min drive)
                  </span>
                </div>

                {onSelectCenter && (
                  <button 
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%', marginTop: '0.4rem', fontSize: '0.75rem', padding: '0.35rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCenter(center);
                    }}
                  >
                    Book Slot <ArrowRight size={12} />
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Map Legend Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        background: 'var(--bg-card)',
        padding: '0.4rem 0.8rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-glass)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
          Available Slots
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#E11D48' }} />
          Full / Occupied
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0284C7' }} />
          Your GPS Pin
        </div>
      </div>
    </div>
  );
}
