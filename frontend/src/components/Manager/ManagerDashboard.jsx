import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Clock, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Search, 
  ShieldCheck, 
  MapPin, 
  Grid, 
  Edit3, 
  Save, 
  QrCode, 
  Car, 
  Key,
  Check,
  AlertCircle
} from 'lucide-react';

export default function ManagerDashboard() {
  const { 
    currentUser, 
    centers, 
    requests, 
    approveBookingRequest, 
    rejectBookingRequest, 
    confirmPhysicalArrival, 
    updateCenterDetails,
    setActiveTab
  } = useApp();

  // Find center assigned to logged in manager
  const assignedCenter = centers.find(c => c.id === currentUser?.centerId || c.managerId === currentUser?.id || c.managerId === currentUser?.managerId) || centers[0];

  const [searchVisitId, setSearchVisitId] = useState('');
  const [searchedRequest, setSearchedRequest] = useState(null);
  const [searchError, setSearchError] = useState('');

  // Editable center state
  const [isEditingCenter, setIsEditingCenter] = useState(false);
  const [editOperatingHours, setEditOperatingHours] = useState(assignedCenter?.operatingHours || '08:00 AM - 10:00 PM');
  const [editPaytmPhone, setEditPaytmPhone] = useState(assignedCenter?.paytmPhone || '9876543210');
  const [editTotalSlots, setEditTotalSlots] = useState(assignedCenter?.totalSlots || 20);
  const [editHourlyRate, setEditHourlyRate] = useState(assignedCenter?.hourlyRate || 5.0);

  // Filter requests for manager's center
  const centerRequests = requests.filter(r => r.centerId === assignedCenter?.id);
  const pendingRequests = centerRequests.filter(r => r.status === 'pending');
  const paidRequestsAwaitingArrival = centerRequests.filter(r => r.status === 'paid' && r.physicalStatus !== 'physically_confirmed');
  const physicallyConfirmedRequests = centerRequests.filter(r => r.physicalStatus === 'physically_confirmed');

  const handleSaveCenter = async (e) => {
    e.preventDefault();
    if (!assignedCenter) return;

    await updateCenterDetails(assignedCenter.id, {
      operatingHours: editOperatingHours,
      paytmPhone: editPaytmPhone,
      totalSlots: Number(editTotalSlots),
      hourlyRate: Number(editHourlyRate)
    });

    setIsEditingCenter(false);
  };

  const handleSearchVisitId = (e) => {
    e.preventDefault();
    setSearchError('');
    setSearchedRequest(null);

    const cleanInput = searchVisitId.trim().toUpperCase();
    if (!cleanInput) return;

    const found = centerRequests.find(r => r.visitId && r.visitId.toUpperCase() === cleanInput);
    if (found) {
      setSearchedRequest(found);
    } else {
      // Search across all requests as fallback
      const foundGlobal = requests.find(r => r.visitId && r.visitId.toUpperCase() === cleanInput);
      if (foundGlobal) {
        setSearchedRequest(foundGlobal);
      } else {
        setSearchError(`No booking request found matching Visit ID: "${cleanInput}"`);
      }
    }
  };

  const handleConfirmPhysical = async (reqIdOrVisitId) => {
    await confirmPhysicalArrival(reqIdOrVisitId);
    setSearchedRequest(prev => prev ? { ...prev, status: 'physically_confirmed', physicalStatus: 'physically_confirmed' } : null);
  };

  return (
    <div>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-manager">
              <ShieldCheck size={13} /> Slot Center Manager
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, fontFamily: 'monospace' }}>
              Unique ID: {currentUser?.id || currentUser?.managerId || 'MGR-1001'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{assignedCenter?.name} Control Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Manage operating hours, Paytm QR code connection, confirm bookings & verify Visit IDs
          </p>
        </div>

        <button 
          onClick={() => setActiveTab('admin-slots')}
          className="btn btn-secondary btn-sm"
        >
          <Grid size={15} /> Visual Bay Grid
        </button>
      </div>

      {/* Quick KPI Stats Row */}
      <div className="dashboard-grid">
        <div className="glass-panel kpi-card">
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>FREE SLOTS</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
              {assignedCenter?.availableSlots} / {assignedCenter?.totalSlots}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>
              Real-time Capacity
            </span>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(2, 132, 199, 0.12)', color: '#0284C7' }}>
            <Car size={24} />
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>PENDING APPROVALS</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '0.2rem' }}>
              {pendingRequests.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', marginTop: '0.3rem', display: 'block' }}>
              Requires Confirmation
            </span>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(217, 119, 6, 0.12)', color: '#D97706' }}>
            <Clock size={24} />
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>AWAITING ARRIVAL</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>
              {paidRequestsAwaitingArrival.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.3rem', display: 'block' }}>
              Paid & Issued Visit IDs
            </span>
          </div>
          <div className="kpi-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Key size={24} />
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>PHYSICALLY PARKED</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '0.2rem' }}>
              {physicallyConfirmedRequests.length}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '0.3rem', display: 'block' }}>
              Physical Slot Verified
            </span>
          </div>
          <div className="kpi-icon" style={{ background: 'rgba(5, 150, 105, 0.12)', color: '#059669' }}>
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      {/* Main Grid: Visit ID Verification Scanner & Center Config */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Visit ID Check Status & Physical Slot Allocation Tool */}
        <div className="glass-panel" style={{ padding: '1.5rem', border: '2px solid var(--primary-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.4rem', borderRadius: '8px' }}>
              <Key size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Visit ID Status Check & Physical Slot Provider</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Enter user's Visit ID (e.g. VST-9812) to verify payment & confirm physical arrival
              </p>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchVisitId} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter Visit ID (e.g. VST-9812)..."
              value={searchVisitId}
              onChange={e => setSearchVisitId(e.target.value)}
              style={{ fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase' }}
            />
            <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
              <Search size={16} /> Check Status
            </button>
          </form>

          {searchError && (
            <div style={{ background: 'rgba(225, 29, 72, 0.1)', color: '#E11D48', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertCircle size={16} /> {searchError}
            </div>
          )}

          {/* Search Result Card */}
          {searchedRequest && (
            <div style={{
              background: 'var(--bg-card-hover)',
              border: '1.5px solid var(--border-glow)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <span className="badge badge-confirmed" style={{ fontSize: '0.85rem' }}>
                    Visit ID: {searchedRequest.visitId}
                  </span>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.35rem' }}>{searchedRequest.userName}</h4>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{searchedRequest.userEmail} • {searchedRequest.userPhone}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Slot Number</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>{searchedRequest.slotNumber}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '1rem' }}>
                <div>Vehicle No: <strong>{searchedRequest.vehicleNo}</strong></div>
                <div>Duration: <strong>{searchedRequest.durationHours} Hours</strong></div>
                <div>Total Fee: <strong style={{ color: '#059669' }}>${searchedRequest.totalPrice}</strong></div>
                <div>Status: <strong style={{ color: 'var(--primary)' }}>{searchedRequest.status}</strong></div>
              </div>

              {searchedRequest.physicalStatus === 'physically_confirmed' ? (
                <div style={{ background: 'rgba(5, 150, 105, 0.1)', color: '#059669', padding: '0.65rem', borderRadius: '6px', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={16} /> Physical Slot Already Confirmed & Map Unlocked!
                </div>
              ) : (
                <button 
                  onClick={() => handleConfirmPhysical(searchedRequest.id)}
                  className="btn btn-success"
                  style={{ width: '100%', padding: '0.75rem', fontWeight: 700 }}
                >
                  <CheckCircle2 size={18} /> Provide Physical Slot & Confirm Arrival
                </button>
              )}
            </div>
          )}

          {/* Quick List of Recent Paid Bookings Awaiting Physical Arrival */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Pending Physical Arrival ({paidRequestsAwaitingArrival.length})
            </div>
            {paidRequestsAwaitingArrival.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                No active bookings awaiting physical arrival right now.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {paidRequestsAwaitingArrival.map(req => (
                  <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card-hover)', padding: '0.6rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                    <div>
                      <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{req.visitId}</strong> • {req.userName} ({req.vehicleNo})
                    </div>
                    <button 
                      onClick={() => handleConfirmPhysical(req.id)}
                      className="btn btn-success btn-sm"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                    >
                      <Check size={12} /> Confirm Physical
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Slot Center Config & Paytm Phone Manager */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Building2 size={20} color="var(--accent-cyan)" /> Facility Details & Paytm Config
            </h3>
            <button 
              onClick={() => setIsEditingCenter(!isEditingCenter)}
              className="btn btn-secondary btn-sm"
            >
              <Edit3 size={14} /> {isEditingCenter ? 'Cancel Edit' : 'Edit Center Info'}
            </button>
          </div>

          {!isEditingCenter ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-card-hover)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Facility Address</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.15rem' }}>{assignedCenter?.address}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div style={{ background: 'var(--bg-card-hover)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={13} /> Operating Hours
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
                    {assignedCenter?.operatingHours || '08:00 AM - 10:00 PM'}
                  </div>
                </div>

                <div style={{ background: 'rgba(0, 185, 241, 0.08)', border: '1px solid #00B9F1', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#002E6E', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Phone size={13} /> Paytm Connected Phone
                  </div>
                  <div style={{ fontWeight: 900, color: '#002E6E', fontSize: '1.05rem', marginTop: '0.2rem' }}>
                    +91 {assignedCenter?.paytmPhone || '9876543210'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div style={{ background: 'var(--bg-card-hover)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hourly Rate</div>
                  <div style={{ fontWeight: 800, color: 'var(--accent-emerald)', fontSize: '1.1rem' }}>
                    ${assignedCenter?.hourlyRate} / hr
                  </div>
                </div>

                <div style={{ background: 'var(--bg-card-hover)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Slots</div>
                  <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>
                    {assignedCenter?.totalSlots} Slots
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveCenter}>
              <div className="form-group">
                <label className="form-label">Operating Hours / Time Slot</label>
                <input 
                  type="text"
                  className="form-input"
                  value={editOperatingHours}
                  onChange={e => setEditOperatingHours(e.target.value)}
                  placeholder="e.g. 08:00 AM - 10:00 PM"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Paytm Connected Phone Number</label>
                <input 
                  type="text"
                  className="form-input"
                  value={editPaytmPhone}
                  onChange={e => setEditPaytmPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div className="form-group">
                  <label className="form-label">Total Parking Slots</label>
                  <input 
                    type="number"
                    className="form-input"
                    value={editTotalSlots}
                    onChange={e => setEditTotalSlots(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hourly Rate ($)</label>
                  <input 
                    type="number"
                    step="0.5"
                    className="form-input"
                    value={editHourlyRate}
                    onChange={e => setEditHourlyRate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                <Save size={16} /> Save Center Settings
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Pending User Booking Requests Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
          Incoming User Booking Requests ({centerRequests.length})
        </h3>

        {centerRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No booking requests received for this slot center yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>User Details</th>
                  <th>Vehicle No</th>
                  <th>Slot & Start Time</th>
                  <th>Total Fee</th>
                  <th>Booking Status</th>
                  <th>Visit ID</th>
                  <th style={{ textAlign: 'right' }}>Manager Controls</th>
                </tr>
              </thead>
              <tbody>
                {centerRequests.map(req => {
                  const isPending = req.status === 'pending';
                  const isConfirmed = req.status === 'confirmed';
                  const isPaid = req.status === 'paid';
                  const isPhysicallyConfirmed = req.status === 'physically_confirmed';

                  return (
                    <tr key={req.id}>
                      <td style={{ fontWeight: 600, fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>
                        {req.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{req.userName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.userEmail}</div>
                      </td>
                      <td>
                        <span style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-glass)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 700 }}>
                          {req.vehicleNo}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>Slot: {req.slotNumber}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.startTime} ({req.durationHours} hrs)</div>
                      </td>
                      <td style={{ fontWeight: 900, color: 'var(--accent-emerald)' }}>
                        ${req.totalPrice}
                      </td>
                      <td>
                        <span className={`badge ${isPhysicallyConfirmed ? 'badge-confirmed' : isPaid ? 'badge-confirmed' : isConfirmed ? 'badge-pending' : 'badge-pending'}`}>
                          {isPhysicallyConfirmed ? 'Physical Slot Confirmed' : isPaid ? 'Paid - Visit ID Active' : isConfirmed ? 'Confirmed (Pending Pay)' : req.status}
                        </span>
                      </td>
                      <td style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--primary)' }}>
                        {req.visitId || '—'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                          {isPending && (
                            <>
                              <button 
                                onClick={() => approveBookingRequest(req.id)}
                                className="btn btn-success btn-sm"
                              >
                                <Check size={14} /> Confirm
                              </button>
                              <button 
                                onClick={() => rejectBookingRequest(req.id)}
                                className="btn btn-danger btn-sm"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {(isConfirmed || isPaid) && !isPhysicallyConfirmed && (
                            <button 
                              onClick={() => handleConfirmPhysical(req.id)}
                              className="btn btn-success btn-sm"
                            >
                              <CheckCircle2 size={14} /> Confirm Physical
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
