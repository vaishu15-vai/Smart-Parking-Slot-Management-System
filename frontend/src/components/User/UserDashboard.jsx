import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import PaytmQRModal from './PaytmQRModal';
import InteractiveMap from './InteractiveMap';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  QrCode, 
  ShieldCheck, 
  Car, 
  Calendar, 
  MapPin, 
  X, 
  Copy, 
  Key, 
  Map as MapIcon, 
  Navigation,
  Sparkles,
  Phone
} from 'lucide-react';

export default function UserDashboard() {
  const { requests, currentUser, setIsAuthModalOpen, setAuthMode, centers } = useApp();
  const [selectedPaytmRequest, setSelectedPaytmRequest] = useState(null);
  const [selectedMapRequest, setSelectedMapRequest] = useState(null);
  const [copiedVisitId, setCopiedVisitId] = useState(null);

  if (!currentUser) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '520px', margin: '3rem auto' }}>
        <Clock size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Sign In Required</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          Please sign in to view your parking slot requests, access Paytm QR payment, and view your assigned physical slot location on the map.
        </p>
        <button 
          onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
          className="btn btn-primary"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  // Filter requests for current user (or show all in demo)
  const myRequests = requests.filter(r => r.userEmail === currentUser.email || currentUser.email === 'alex@user.com');

  const handleCopyVisitId = (visitId) => {
    navigator.clipboard.writeText(visitId);
    setCopiedVisitId(visitId);
    setTimeout(() => setCopiedVisitId(null), 2000);
  };

  return (
    <div>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-user" style={{ marginBottom: '0.35rem' }}>
              <Sparkles size={13} /> Active Parking Passes & Trackers
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Booking Requests & Digital Passes</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
              Track manager approval, pay via Paytm QR Code, get your Visit ID, and unlock exact Map locations upon arrival
            </p>
          </div>
        </div>
      </div>

      {myRequests.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <Car size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Parking Requests Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.4rem' }}>
            You haven't requested any parking slots yet. Explore nearest centers to book!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {myRequests.map(req => {
            const targetCenter = centers.find(c => c.id === req.centerId);
            const isConfirmed = req.status === 'confirmed';
            const isPaid = req.status === 'paid';
            const isPhysicallyConfirmed = req.status === 'physically_confirmed';
            const isPending = req.status === 'pending';
            const isRejected = req.status === 'rejected';

            return (
              <div key={req.id} className="glass-panel" style={{ padding: '1.5rem', position: 'relative' }}>
                {/* Header Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{req.centerName}</h3>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      Request ID: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{req.id}</span>
                    </div>
                  </div>

                  <span className={`badge ${
                    isPhysicallyConfirmed ? 'badge-confirmed' :
                    isPaid ? 'badge-confirmed' :
                    isConfirmed ? 'badge-pending' :
                    isPending ? 'badge-pending' : 'badge-rejected'
                  }`}>
                    {isPhysicallyConfirmed && <CheckCircle2 size={13} />}
                    {isPaid && <ShieldCheck size={13} />}
                    {isConfirmed && <QrCode size={13} />}
                    {isPending && <Clock size={13} />}
                    {isRejected && <XCircle size={13} />}

                    {isPhysicallyConfirmed ? 'Slot Confirmed & Map Unlocked' :
                     isPaid ? 'Paid • Visit ID Active' :
                     isConfirmed ? 'Confirmed • Pay via Paytm' :
                     isPending ? 'Pending Manager' : 'Rejected'}
                  </span>
                </div>

                {/* Progress Step Indicator */}
                <div style={{
                  display: 'flex',
                  justify: 'space-between',
                  background: 'var(--bg-card-hover)',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1rem',
                  fontSize: '0.725rem',
                  fontWeight: 700
                }}>
                  <div style={{ color: isPending || isConfirmed || isPaid || isPhysicallyConfirmed ? 'var(--primary)' : 'var(--text-dim)' }}>
                    1. Requested
                  </div>
                  <div style={{ color: isConfirmed || isPaid || isPhysicallyConfirmed ? 'var(--accent-cyan)' : 'var(--text-dim)' }}>
                    2. Confirmed
                  </div>
                  <div style={{ color: isPaid || isPhysicallyConfirmed ? '#059669' : 'var(--text-dim)' }}>
                    3. Visit ID
                  </div>
                  <div style={{ color: isPhysicallyConfirmed ? '#059669' : 'var(--text-dim)' }}>
                    4. Map Unlocked
                  </div>
                </div>

                {/* Details Box */}
                <div style={{
                  background: 'var(--bg-card-hover)',
                  padding: '0.9rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  fontSize: '0.825rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.65rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Vehicle Number:</span>
                    <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{req.vehicleNo}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Assigned Slot:</span>
                    <div style={{ fontWeight: 800, color: 'var(--accent-cyan)' }}>{req.slotNumber}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Start & Duration:</span>
                    <div style={{ fontWeight: 600 }}>{req.startTime} ({req.durationHours} hrs)</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Total Amount:</span>
                    <div style={{ fontWeight: 900, color: '#059669' }}>${req.totalPrice}</div>
                  </div>
                </div>

                {/* Paytm Connected Phone Info */}
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Phone size={13} color="#00B9F1" /> Paytm Mobile: <strong>+91 {req.paytmPhone || targetCenter?.paytmPhone || '9876543210'}</strong>
                </div>

                {/* Visit ID Display Box (Shown when paid) */}
                {req.visitId && (
                  <div style={{
                    background: 'rgba(79, 70, 229, 0.08)',
                    border: '1.5px dashed var(--primary)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1rem',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--primary)', fontWeight: 700 }}>YOUR UNIQUE VISIT ID</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 900, fontFamily: 'monospace', color: 'var(--primary)', letterSpacing: '0.05em' }}>
                        {req.visitId}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCopyVisitId(req.visitId)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      <Copy size={12} /> {copiedVisitId === req.visitId ? 'Copied!' : 'Copy ID'}
                    </button>
                  </div>
                )}

                {/* Action Buttons depending on status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {/* If confirmed by manager -> Show Paytm QR Button */}
                  {isConfirmed && (
                    <button 
                      onClick={() => setSelectedPaytmRequest(req)}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, #00B9F1 0%, #002E6E 100%)', color: '#FFF' }}
                    >
                      <QrCode size={18} /> Show Paytm QR Code & Pay (${req.totalPrice})
                    </button>
                  )}

                  {/* If paid -> Show Visit ID Instruction */}
                  {isPaid && !isPhysicallyConfirmed && (
                    <div style={{ background: 'rgba(217, 119, 6, 0.08)', border: '1px solid #D97706', padding: '0.65rem', borderRadius: '6px', fontSize: '0.775rem', color: '#D97706', textAlign: 'center' }}>
                      🔑 Present Visit ID <strong style={{ fontFamily: 'monospace' }}>{req.visitId}</strong> to the Manager upon arrival to unlock location map!
                    </div>
                  )}

                  {/* If physically confirmed by manager -> Map Unlocked! */}
                  {isPhysicallyConfirmed && (
                    <button 
                      onClick={() => setSelectedMapRequest(req)}
                      className="btn btn-success"
                      style={{ width: '100%', padding: '0.75rem', fontWeight: 700 }}
                    >
                      <MapIcon size={18} /> View Center Location & Slot Navigation Map
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Shared Modals */}
      {selectedPaytmRequest && (
        <PaytmQRModal request={selectedPaytmRequest} onClose={() => setSelectedPaytmRequest(null)} />
      )}

      {/* Map Unlocked Modal for Physically Confirmed Slot */}
      {selectedMapRequest && (
        <div className="modal-overlay" onClick={() => setSelectedMapRequest(null)}>
          <div 
            className="modal-content glass-panel" 
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '680px', border: '2px solid #059669' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-confirmed">
                  <CheckCircle2 size={14} /> LOCATION & SLOT MAP UNLOCKED
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>
                  {selectedMapRequest.visitId}
                </span>
              </div>
              <button 
                onClick={() => setSelectedMapRequest(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{selectedMapRequest.centerName}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Physical Slot: <strong style={{ color: 'var(--accent-cyan)' }}>{selectedMapRequest.slotNumber}</strong> • Vehicle: <strong>{selectedMapRequest.vehicleNo}</strong>
            </p>

            {/* Interactive Radar Map Canvas */}
            <div style={{ marginBottom: '1.25rem' }}>
              <InteractiveMap 
                centers={centers.filter(c => c.id === selectedMapRequest.centerId)} 
                highlightSlot={selectedMapRequest.slotNumber}
              />
            </div>

            <div style={{ background: 'var(--bg-card-hover)', padding: '0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem' }}>
              <div>
                <MapPin size={15} color="#059669" style={{ display: 'inline', marginRight: '4px' }} />
                <span>Center Location: <strong>{centers.find(c => c.id === selectedMapRequest.centerId)?.address}</strong></span>
              </div>
              <button 
                onClick={() => setSelectedMapRequest(null)}
                className="btn btn-secondary btn-sm"
              >
                Close Navigation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
