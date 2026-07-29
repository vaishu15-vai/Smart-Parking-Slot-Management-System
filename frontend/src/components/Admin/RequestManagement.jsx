import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, XCircle, Clock, Check, Trash2, Filter, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function RequestManagement() {
  const { requests, approveBookingRequest, rejectBookingRequest } = useApp();
  const [filterStatus, setFilterStatus] = useState('pending'); // 'all' | 'pending' | 'confirmed' | 'rejected'

  const filteredRequests = requests.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  return (
    <div>
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-admin" style={{ marginBottom: '0.35rem' }}>
            <ShieldCheck size={13} /> Request Control Hub
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Confirm or Remove User Slot Requests</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Review incoming user parking requests, allocate slots, and confirm or reject bookings
          </p>
        </div>

        {/* Filter Switcher */}
        <div className="tab-group">
          {['pending', 'confirmed', 'rejected', 'all'].map(st => (
            <button
              key={st}
              className={`tab-btn ${filterStatus === st ? 'active' : ''}`}
              onClick={() => setFilterStatus(st)}
              style={{ textTransform: 'capitalize' }}
            >
              {st} ({requests.filter(r => st === 'all' ? true : r.status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        {filteredRequests.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <Clock size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Requests Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.4rem' }}>
              No booking requests matching status <strong style={{ color: 'var(--accent-cyan)' }}>"{filterStatus}"</strong>
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>User Details</th>
                  <th>Parking Center</th>
                  <th>Vehicle No</th>
                  <th>Arrival & Duration</th>
                  <th>Total Fee</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Admin Controls</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(req => {
                  const isPending = req.status === 'pending';
                  const isConfirmed = req.status === 'confirmed';
                  const isRejected = req.status === 'rejected';

                  return (
                    <tr key={req.id}>
                      <td style={{ fontWeight: 600, fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>
                        {req.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#FFF' }}>{req.userName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.userEmail}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{req.centerName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>Slot: {req.slotNumber}</div>
                      </td>
                      <td>
                        <span style={{ 
                          background: 'rgba(255,255,255,0.06)', 
                          border: '1px solid var(--border-glass)', 
                          padding: '0.2rem 0.5rem', 
                          borderRadius: '4px',
                          fontFamily: 'monospace',
                          fontWeight: 700
                        }}>
                          {req.vehicleNo}
                        </span>
                      </td>
                      <td>
                        <div>{req.startTime}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.durationHours} Hours</div>
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--accent-emerald)' }}>
                        ${req.totalPrice}
                      </td>
                      <td>
                        <span className={`badge ${isConfirmed ? 'badge-confirmed' : isPending ? 'badge-pending' : 'badge-rejected'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {isPending && (
                            <>
                              <button 
                                onClick={() => approveBookingRequest(req.id)}
                                className="btn btn-success btn-sm"
                                title="Confirm and Allocate Slot"
                              >
                                <Check size={14} /> Confirm
                              </button>
                              <button 
                                onClick={() => rejectBookingRequest(req.id)}
                                className="btn btn-danger btn-sm"
                                title="Reject Request"
                              >
                                <Trash2 size={14} /> Remove
                              </button>
                            </>
                          )}

                          {isConfirmed && (
                            <button 
                              onClick={() => rejectBookingRequest(req.id)}
                              className="btn btn-danger btn-sm"
                              style={{ opacity: 0.8 }}
                            >
                              Cancel / Remove
                            </button>
                          )}

                          {isRejected && (
                            <button 
                              onClick={() => approveBookingRequest(req.id)}
                              className="btn btn-secondary btn-sm"
                            >
                              Re-Confirm
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
