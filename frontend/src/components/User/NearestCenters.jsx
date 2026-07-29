import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import InteractiveMap from './InteractiveMap';
import { 
  MapPin, 
  Clock, 
  Car, 
  Filter, 
  SlidersHorizontal, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  Map as MapIcon,
  List,
  Check
} from 'lucide-react';

export default function NearestCenters() {
  const { centers, setSelectedCenterForBooking, userLocation, detectLiveLocation } = useApp();

  const [onlyWithinOneHour, setOnlyWithinOneHour] = useState(true);
  const [viewMode, setViewMode] = useState('both'); // 'grid' | 'map' | 'both'
  const [selectedAmenity, setSelectedAmenity] = useState('all');
  const [sortBy, setSortBy] = useState('distance'); // 'distance' | 'price' | 'slots'

  // Filter centers based on 1 hour distance (< 30 km / <= 60 minutes travel time)
  let filteredCenters = centers.filter(c => {
    if (onlyWithinOneHour && c.estimatedMinutes > 60) return false;
    if (selectedAmenity !== 'all' && !c.facilities.includes(selectedAmenity)) return false;
    return true;
  });

  // Sort centers
  filteredCenters.sort((a, b) => {
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    if (sortBy === 'price') return a.hourlyRate - b.hourlyRate;
    if (sortBy === 'slots') return b.availableSlots - a.availableSlots;
    return 0;
  });

  const withinHourCount = centers.filter(c => c.estimatedMinutes <= 60).length;

  return (
    <div>
      {/* Search Header Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-user">
                <Sparkles size={13} /> Auto Location Smart Filter
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                {withinHourCount} Centers Available within 1 Hr Drive
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Nearest Available Parking Centers</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
              Showing real-time availability near <strong style={{ color: 'var(--accent-cyan)' }}>{userLocation.name}</strong>
            </p>
          </div>

          {/* View Mode & Filter Controls */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* 1-Hour Distance Filter Toggle */}
            <button
              onClick={() => setOnlyWithinOneHour(!onlyWithinOneHour)}
              className={`btn ${onlyWithinOneHour ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              style={{ padding: '0.5rem 0.9rem' }}
            >
              <Clock size={15} />
              {onlyWithinOneHour ? 'Filtered: ≤ 1 Hr Distance' : 'Show All Distances'}
            </button>

            {/* View Switcher */}
            <div className="tab-group" style={{ margin: 0 }}>
              <button 
                className={`tab-btn ${viewMode === 'both' ? 'active' : ''}`}
                onClick={() => setViewMode('both')}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem' }}
              >
                Split View
              </button>
              <button 
                className={`tab-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem' }}
              >
                <List size={14} /> Cards
              </button>
              <button 
                className={`tab-btn ${viewMode === 'map' ? 'active' : ''}`}
                onClick={() => setViewMode('map')}
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem' }}
              >
                <MapIcon size={14} /> Map
              </button>
            </div>
          </div>
        </div>

        {/* Amenity & Sort Controls */}
        <div style={{ 
          marginTop: '1.25rem', 
          paddingTop: '1rem', 
          borderTop: '1px solid var(--border-glass)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Filter size={14} /> Amenity Filter:
            </span>
            {['all', 'EV Charging', 'Covered Parking', 'Valet', '24/7 Security'].map(amenity => (
              <button
                key={amenity}
                onClick={() => setSelectedAmenity(amenity)}
                style={{
                  background: selectedAmenity === amenity ? 'var(--primary-light)' : 'rgba(255,255,255,0.04)',
                  color: selectedAmenity === amenity ? 'var(--primary)' : 'var(--text-muted)',
                  border: selectedAmenity === amenity ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {amenity === 'all' ? 'All Amenities' : amenity}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <SlidersHorizontal size={14} /> Sort By:
            </span>
            <select 
              className="form-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{ padding: '0.25rem 0.65rem', fontSize: '0.775rem', width: 'auto' }}
            >
              <option value="distance">Nearest Distance</option>
              <option value="price">Lowest Price ($/hr)</option>
              <option value="slots">Most Available Slots</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: viewMode === 'both' ? '1fr 1fr' : '1fr',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Visual Map Canvas */}
        {(viewMode === 'map' || viewMode === 'both') && (
          <div style={{ position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapIcon size={18} color="var(--accent-cyan)" /> Real-Time Interactive Radar Map
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Click pins to quick book
              </span>
            </div>
            <InteractiveMap centers={filteredCenters} onSelectCenter={setSelectedCenterForBooking} />
          </div>
        )}

        {/* Center Cards List */}
        {(viewMode === 'grid' || viewMode === 'both') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredCenters.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <Clock size={48} color="var(--accent-amber)" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Centers Found</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  No parking slot centers match your 1-hour radius or amenity criteria.
                </p>
                <button 
                  onClick={() => { setOnlyWithinOneHour(false); setSelectedAmenity('all'); }}
                  className="btn btn-secondary btn-sm" 
                  style={{ marginTop: '1rem' }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredCenters.map(center => {
                const isWithin1Hr = center.estimatedMinutes <= 60;
                return (
                  <div key={center.id} className="glass-panel" style={{ padding: '1.25rem', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                      {/* Thumbnail Image */}
                      <img 
                        src={center.image} 
                        alt={center.name}
                        style={{
                          width: '130px',
                          height: '110px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-glass)'
                        }}
                      />

                      {/* Info & Details */}
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{center.name}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                              {center.address}
                            </p>
                          </div>
                          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                            ${center.hourlyRate}<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/hr</span>
                          </span>
                        </div>

                        {/* Distance & Travel time pill */}
                        <div style={{ display: 'flex', gap: '0.75rem', margin: '0.75rem 0', flexWrap: 'wrap' }}>
                          <span style={{ 
                            background: isWithin1Hr ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)', 
                            color: isWithin1Hr ? '#34D399' : '#FBBF24',
                            border: `1px solid ${isWithin1Hr ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <Clock size={12} /> {center.estimatedMinutes} mins drive ({center.distanceKm} km)
                          </span>

                          <span style={{
                            background: center.availableSlots > 10 ? 'rgba(6, 182, 212, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                            color: center.availableSlots > 10 ? '#22D3EE' : '#F87171',
                            border: `1px solid ${center.availableSlots > 10 ? 'rgba(6, 182, 212, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            {center.availableSlots} / {center.totalSlots} Slots Free
                          </span>
                        </div>

                        {/* Facilities tags */}
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                          {center.facilities.map((fac, i) => (
                            <span key={i} style={{ 
                              background: 'rgba(255, 255, 255, 0.05)', 
                              border: '1px solid var(--border-glass)',
                              padding: '2px 8px', 
                              borderRadius: '6px', 
                              fontSize: '0.7rem',
                              color: 'var(--text-muted)'
                            }}>
                              {fac}
                            </span>
                          ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            Call: {center.contact}
                          </span>
                          <button 
                            className="btn btn-primary btn-sm"
                            disabled={center.availableSlots === 0}
                            onClick={() => setSelectedCenterForBooking(center)}
                          >
                            {center.availableSlots > 0 ? 'Request Booking' : 'Fully Occupied'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
