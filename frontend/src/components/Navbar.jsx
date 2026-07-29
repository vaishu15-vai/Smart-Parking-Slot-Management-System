import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Car, 
  MapPin, 
  Navigation, 
  LayoutDashboard, 
  Clock, 
  Building2, 
  CheckSquare, 
  Grid,
  User, 
  ShieldCheck, 
  Users,
  LogOut, 
  LogIn,
  Sun,
  Moon,
  Key
} from 'lucide-react';

export default function Navbar() {
  const { 
    currentUser, 
    logout, 
    switchRole, 
    userLocation, 
    detectLiveLocation,
    setIsAuthModalOpen,
    setAuthMode,
    activeTab,
    setActiveTab,
    requests,
    themeMode,
    toggleTheme
  } = useApp();

  const pendingRequestsCount = requests.filter(r => r.status === 'pending').length;

  return (
    <nav className="navbar">
      {/* Brand Logo */}
      <div 
        className="logo-container" 
        onClick={() => {
          if (currentUser?.role === 'admin') setActiveTab('admin-dashboard');
          else if (currentUser?.role === 'manager') setActiveTab('manager-dashboard');
          else setActiveTab('explore');
        }} 
        style={{ cursor: 'pointer' }}
      >
        <div className="logo-icon">
          <Car size={24} />
        </div>
        <div>
          <span>ParkSmart</span>
          <span style={{ fontSize: '0.725rem', display: 'block', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.05em' }}>
            SMART PARKING & PAYTM QR
          </span>
        </div>
      </div>

      {/* Live GPS Location Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.4rem 0.85rem', borderRadius: '9999px', border: '1px solid var(--border-glass)' }}>
        <MapPin size={16} color="var(--accent-cyan)" />
        <span style={{ fontSize: '0.825rem', color: 'var(--text-main)', fontWeight: 600 }}>
          {userLocation.name}
        </span>
        <button 
          onClick={detectLiveLocation}
          className="btn btn-sm btn-secondary"
          style={{ padding: '0.2rem 0.55rem', fontSize: '0.725rem', borderRadius: '9999px' }}
          disabled={userLocation.isDetecting}
          title="Auto-detect current location via GPS"
        >
          <Navigation size={12} className={userLocation.isDetecting ? 'animate-spin' : ''} />
          {userLocation.isDetecting ? 'Locating...' : 'GPS Detect'}
        </button>
      </div>

      {/* Role Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {currentUser?.role === 'admin' ? (
          <>
            <button 
              className={`btn ${activeTab === 'admin-dashboard' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setActiveTab('admin-dashboard')}
            >
              <LayoutDashboard size={14} /> Analytics
            </button>
            <button 
              className={`btn ${activeTab === 'admin-requests' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setActiveTab('admin-requests')}
              style={{ position: 'relative' }}
            >
              <CheckSquare size={14} /> Approvals
              {pendingRequestsCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--accent-rose)',
                  color: 'white',
                  borderRadius: '9999px',
                  fontSize: '0.65rem',
                  padding: '2px 6px',
                  fontWeight: 800
                }}>
                  {pendingRequestsCount}
                </span>
              )}
            </button>
            <button 
              className={`btn ${activeTab === 'admin-managers' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setActiveTab('admin-managers')}
            >
              <Users size={14} /> Slot Managers
            </button>
            <button 
              className={`btn ${activeTab === 'admin-centers' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setActiveTab('admin-centers')}
            >
              <Building2 size={14} /> Centers
            </button>
            <button 
              className={`btn ${activeTab === 'admin-slots' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setActiveTab('admin-slots')}
            >
              <Grid size={14} /> Slot Grid
            </button>
          </>
        ) : currentUser?.role === 'manager' ? (
          <>
            <button 
              className={`btn ${activeTab === 'manager-dashboard' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setActiveTab('manager-dashboard')}
            >
              <Key size={14} /> Manager Control & Visit ID
            </button>
            <button 
              className={`btn ${activeTab === 'admin-slots' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setActiveTab('admin-slots')}
            >
              <Grid size={14} /> Visual Slot Grid
            </button>
            <button 
              className={`btn ${activeTab === 'explore' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setActiveTab('explore')}
            >
              <MapPin size={14} /> Explore Network
            </button>
          </>
        ) : (
          <>
            <button 
              className={`btn ${activeTab === 'explore' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setActiveTab('explore')}
            >
              <MapPin size={14} /> Nearest Centers
            </button>
            <button 
              className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setActiveTab('bookings')}
            >
              <Clock size={14} /> My Bookings & Pass
            </button>
          </>
        )}
      </div>

      {/* User Actions, Theme Toggle & Role Switcher */}
      <div className="nav-actions">
        {/* Light / Dark Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.4rem 0.6rem' }}
          title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {themeMode === 'light' ? <Moon size={16} color="var(--primary)" /> : <Sun size={16} color="#FBBF24" />}
        </button>

        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Quick Role Switcher Pills */}
            <div 
              style={{
                display: 'flex',
                background: 'var(--bg-card)',
                padding: '3px',
                borderRadius: '9999px',
                border: '1px solid var(--border-glass)'
              }}
            >
              <button
                onClick={() => switchRole('user')}
                style={{
                  padding: '3px 9px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: currentUser.role === 'user' ? 'var(--accent-cyan)' : 'transparent',
                  color: currentUser.role === 'user' ? '#FFF' : 'var(--text-muted)'
                }}
              >
                <User size={11} style={{ display: 'inline', marginRight: '3px' }} /> User
              </button>
              <button
                onClick={() => switchRole('manager')}
                style={{
                  padding: '3px 9px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: currentUser.role === 'manager' ? 'var(--accent-purple)' : 'transparent',
                  color: currentUser.role === 'manager' ? '#FFF' : 'var(--text-muted)'
                }}
              >
                <Key size={11} style={{ display: 'inline', marginRight: '3px' }} /> Manager
              </button>
              <button
                onClick={() => switchRole('admin')}
                style={{
                  padding: '3px 9px',
                  borderRadius: '9999px',
                  border: 'none',
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: currentUser.role === 'admin' ? 'var(--primary)' : 'transparent',
                  color: currentUser.role === 'admin' ? '#FFF' : 'var(--text-muted)'
                }}
              >
                <ShieldCheck size={11} style={{ display: 'inline', marginRight: '3px' }} /> Admin
              </button>
            </div>

            <div style={{ fontSize: '0.825rem', textAlign: 'right' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{currentUser.name}</div>
              <span className={`badge ${currentUser.role === 'admin' ? 'badge-admin' : currentUser.role === 'manager' ? 'badge-manager' : 'badge-user'}`}>
                {currentUser.role}
              </span>
            </div>

            <button onClick={logout} className="btn btn-secondary btn-sm" title="Sign Out">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
              className="btn btn-secondary btn-sm"
            >
              <LogIn size={14} /> Sign In
            </button>
            <button 
              onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}
              className="btn btn-primary btn-sm"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
