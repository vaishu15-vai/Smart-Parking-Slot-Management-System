import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import BookingModal from './components/User/BookingModal';
import NotificationToast from './components/NotificationToast';
import AIAssistant from './components/AIAssistant';

import NearestCenters from './components/User/NearestCenters';
import UserDashboard from './components/User/UserDashboard';

import ManagerDashboard from './components/Manager/ManagerDashboard';

import AdminDashboard from './components/Admin/AdminDashboard';
import RequestManagement from './components/Admin/RequestManagement';
import ManagerManagement from './components/Admin/ManagerManagement';
import ManageCenters from './components/Admin/ManageCenters';
import SlotManager from './components/Admin/SlotManager';

function AppContent() {
  const { activeTab } = useApp();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main className="main-container" style={{ flex: 1 }}>
        {activeTab === 'explore' && <NearestCenters />}
        {activeTab === 'bookings' && <UserDashboard />}
        {activeTab === 'manager-dashboard' && <ManagerDashboard />}
        {activeTab === 'admin-dashboard' && <AdminDashboard />}
        {activeTab === 'admin-requests' && <RequestManagement />}
        {activeTab === 'admin-managers' && <ManagerManagement />}
        {activeTab === 'admin-slots' && <SlotManager />}
        {activeTab === 'admin-centers' && <ManageCenters />}
      </main>

      {/* Shared Modals, AI Assistant & Toast Alerts */}
      <AuthModal />
      <BookingModal />
      <NotificationToast />
      <AIAssistant />

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        borderTop: '1px solid var(--border-glass)',
        color: 'var(--text-muted)',
        fontSize: '0.825rem',
        marginTop: '3rem',
        background: 'var(--bg-card)'
      }}>
        <div style={{ fontWeight: 600 }}>Smart Parking Management System • Voice AI Chatbot & Paytm QR Network</div>
        <div style={{ fontSize: '0.75rem', marginTop: '0.2rem', color: 'var(--text-dim)' }}>
          Powered by Express REST API, React 19 & Web Speech Voice Assistant
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
