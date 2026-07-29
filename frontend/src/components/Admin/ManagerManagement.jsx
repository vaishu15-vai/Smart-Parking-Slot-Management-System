import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, UserPlus, Trash2, Key, Phone, Building2, ShieldCheck, Mail, CheckCircle, Copy } from 'lucide-react';

export default function ManagerManagement() {
  const { managers, centers, createManager, deleteManager } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('mgr123');
  const [centerId, setCenterId] = useState(centers[0]?.id || '');
  const [paytmPhone, setPaytmPhone] = useState('');
  const [createdManager, setCreatedManager] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    const mgr = await createManager({
      name,
      email,
      password,
      centerId,
      paytmPhone: paytmPhone || '9876543210'
    });

    setCreatedManager(mgr);
    setName('');
    setEmail('');
    setPaytmPhone('');
  };

  return (
    <div>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-admin" style={{ marginBottom: '0.35rem' }}>
            <ShieldCheck size={13} /> Admin Command Hub
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Slot Center Manager Accounts</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Add new slot center managers, assign facility centers, and generate unique manager login IDs
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Create Manager Form */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <UserPlus size={18} color="var(--primary)" /> Add Slot Manager
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Manager Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Robert Vance"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="robert@parksmart.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="text" 
                className="form-input" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assign Parking Center</label>
              <select 
                className="form-select"
                value={centerId}
                onChange={e => setCenterId(e.target.value)}
              >
                <option value="">-- Select Center --</option>
                {centers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.address})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Paytm Connected Phone Number</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. 9876543210"
                value={paytmPhone}
                onChange={e => setPaytmPhone(e.target.value)}
              />
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                Used to dynamically generate Paytm payment QR codes for this slot center
              </span>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
              <UserPlus size={16} /> Create & Generate Unique Login ID
            </button>
          </form>

          {/* Newly Created Manager Card Banner */}
          {createdManager && (
            <div style={{
              background: 'rgba(5, 150, 105, 0.08)',
              border: '1px solid #059669',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginTop: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#059669', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <CheckCircle size={16} /> Manager Account Generated!
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>
                <div>Unique Manager Login ID: <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>{createdManager.id}</strong></div>
                <div>Email: {createdManager.email}</div>
                <div>Assigned Center: {createdManager.centerName}</div>
                <div>Paytm Phone: +91 {createdManager.paytmPhone}</div>
              </div>
            </div>
          )}
        </div>

        {/* Existing Managers Table */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={18} color="var(--accent-purple)" /> Active Slot Center Managers ({managers.length})
          </h3>

          {managers.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No manager accounts created yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Unique Manager ID</th>
                    <th>Manager Name & Email</th>
                    <th>Assigned Center</th>
                    <th>Paytm Phone</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map(mgr => (
                    <tr key={mgr.id}>
                      <td style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--primary)' }}>
                        <span className="badge badge-manager" style={{ fontSize: '0.8rem' }}>
                          <Key size={12} /> {mgr.id}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{mgr.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{mgr.email}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{mgr.centerName || 'Unassigned'}</div>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>
                        +91 {mgr.paytmPhone}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          onClick={() => deleteManager(mgr.id)}
                          className="btn btn-danger btn-sm"
                          title="Remove Manager Account"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
