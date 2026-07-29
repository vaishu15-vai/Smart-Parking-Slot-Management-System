import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
const API_BASE = 'http://localhost:5000/api';

const INITIAL_CENTERS = [
  {
    id: 'center-1',
    name: 'Metro Central Smart Hub',
    address: '452 Park Avenue, Downtown',
    distanceKm: 2.4,
    estimatedMinutes: 8,
    totalSlots: 20,
    availableSlots: 14,
    hourlyRate: 5.0,
    mapX: 32,
    mapY: 38,
    facilities: ['EV Charging', 'Covered Parking', '24/7 Security', 'Valet'],
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
    contact: '+91 98765 43210',
    paytmPhone: '9876543210',
    operatingHours: '06:00 AM - 11:00 PM',
    managerId: 'MGR-1001'
  },
  {
    id: 'center-2',
    name: 'Tech Park Automated Garage',
    address: '88 Innovation Boulevard',
    distanceKm: 8.5,
    estimatedMinutes: 18,
    totalSlots: 15,
    availableSlots: 6,
    hourlyRate: 4.5,
    mapX: 68,
    mapY: 28,
    facilities: ['EV Charging', 'Automated Barrier', 'CCTV Surveillance'],
    image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80',
    contact: '+91 98765 00112',
    paytmPhone: '9876500112',
    operatingHours: '08:00 AM - 10:00 PM',
    managerId: 'MGR-1002'
  },
  {
    id: 'center-3',
    name: 'Grand Plaza Underground Parking',
    address: '102 City Center Mall',
    distanceKm: 14.2,
    estimatedMinutes: 32,
    totalSlots: 25,
    availableSlots: 18,
    hourlyRate: 6.0,
    mapX: 45,
    mapY: 68,
    facilities: ['Underground', 'Car Wash Service', 'Valet'],
    image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=600&q=80',
    contact: '+91 98111 22233',
    paytmPhone: '9811122233',
    operatingHours: '07:00 AM - 12:00 AM',
    managerId: null
  },
  {
    id: 'center-4',
    name: 'Skyline Airport Express Deck',
    address: 'Terminal 2 Entrance Rd',
    distanceKm: 24.8,
    estimatedMinutes: 48,
    totalSlots: 30,
    availableSlots: 12,
    hourlyRate: 8.0,
    mapX: 82,
    mapY: 80,
    facilities: ['24/7 Security', 'Airport Shuttle', 'Long Term Parking'],
    image: 'https://images.unsplash.com/photo-1543465077-db45d34b88a5?auto=format&fit=crop&w=600&q=80',
    contact: '+91 99887 76655',
    paytmPhone: '9988776655',
    operatingHours: '24 Hours Open',
    managerId: null
  }
];

export const AppProvider = ({ children }) => {
  // Theme State (Default: light)
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('parksmart_theme') || 'light';
  });

  const toggleTheme = () => {
    const nextTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextTheme);
    localStorage.setItem('parksmart_theme', nextTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  // Current User State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('parksmart_user');
    return saved ? JSON.parse(saved) : { id: 'u1', name: 'Alex Johnson', email: 'alex@user.com', role: 'user' };
  });

  const [centers, setCenters] = useState(INITIAL_CENTERS);
  const [requests, setRequests] = useState([]);
  const [managers, setManagers] = useState([]);
  const [userLocation, setUserLocation] = useState({
    name: 'Downtown City Center',
    lat: 12.9716,
    lng: 77.5946,
    isDetecting: false
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [selectedCenterForBooking, setSelectedCenterForBooking] = useState(null);
  const [activeTab, setActiveTab] = useState('explore'); 
  const [notifications, setNotifications] = useState([]);

  // API Fetch Helpers
  const fetchCenters = async () => {
    try {
      const res = await fetch(`${API_BASE}/centers`);
      const data = await res.json();
      if (data.success && data.centers.length) {
        setCenters(data.centers);
      }
    } catch (err) {
      console.warn('Backend API offline, using local fallback dataset');
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/requests`);
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.warn('Backend API offline');
    }
  };

  const fetchManagers = async () => {
    try {
      const res = await fetch(`${API_BASE}/managers`);
      const data = await res.json();
      if (data.success) {
        setManagers(data.managers);
      }
    } catch (err) {
      console.warn('Backend API offline');
    }
  };

  useEffect(() => {
    fetchCenters();
    fetchRequests();
    fetchManagers();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('parksmart_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('parksmart_user');
    }
  }, [currentUser]);

  const addNotification = (msg, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [{ id, msg, type }, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4500);
  };

  // Authentication System
  const login = async (email, password, role) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        addNotification(`Logged in as ${data.user.role.toUpperCase()}`, 'success');
        if (data.user.role === 'admin') setActiveTab('admin-dashboard');
        else if (data.user.role === 'manager') setActiveTab('manager-dashboard');
        else setActiveTab('explore');
      }
    } catch (err) {
      // Fallback offline login
      const name = email.split('@')[0];
      const isMgr = role === 'manager' || email.toLowerCase().startsWith('mgr-');
      const user = {
        id: isMgr ? 'MGR-1001' : role === 'admin' ? 'admin-1' : 'user-' + Date.now(),
        name: name.toUpperCase(),
        email,
        role: isMgr ? 'manager' : role,
        centerId: 'center-1'
      };
      setCurrentUser(user);
      addNotification(`Logged in offline as ${user.role.toUpperCase()}`, 'info');
      setActiveTab(user.role === 'admin' ? 'admin-dashboard' : user.role === 'manager' ? 'manager-dashboard' : 'explore');
    }
    setIsAuthModalOpen(false);
  };

  const signUp = async (name, email, role) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
      }
    } catch (err) {
      setCurrentUser({ id: 'user-' + Date.now(), name, email, role: role || 'user' });
    }
    setIsAuthModalOpen(false);
    addNotification(`Account created! Logged in as ${role.toUpperCase()}`, 'success');
    setActiveTab(role === 'admin' ? 'admin-dashboard' : 'explore');
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('explore');
    addNotification('Logged out successfully', 'info');
  };

  const switchRole = (newRole) => {
    if (!currentUser) return;
    const updated = { ...currentUser, role: newRole };
    if (newRole === 'manager' && !updated.centerId) {
      updated.centerId = 'center-1';
      updated.managerId = 'MGR-1001';
    }
    setCurrentUser(updated);
    addNotification(`Switched role to ${newRole.toUpperCase()}`, 'info');
    if (newRole === 'admin') setActiveTab('admin-dashboard');
    else if (newRole === 'manager') setActiveTab('manager-dashboard');
    else setActiveTab('explore');
  };

  // Browser Geolocation Detection
  const detectLiveLocation = () => {
    setUserLocation(prev => ({ ...prev, isDetecting: true }));
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({
            name: `GPS Pin (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
            lat: latitude,
            lng: longitude,
            isDetecting: false
          });
          addNotification('Live GPS Location synchronized!', 'success');
        },
        err => {
          setUserLocation({
            name: 'Metro City Sector 4',
            lat: 12.9716,
            lng: 77.5946,
            isDetecting: false
          });
          addNotification('Location set to Downtown Sector', 'info');
        },
        { timeout: 4000 }
      );
    } else {
      setUserLocation({
        name: 'Downtown City Center',
        lat: 12.9716,
        lng: 77.5946,
        isDetecting: false
      });
    }
  };

  // User Actions
  const submitBookingRequest = async (bookingDetails) => {
    const targetCenter = centers.find(c => c.id === bookingDetails.centerId);
    const payload = {
      userEmail: currentUser ? currentUser.email : 'guest@user.com',
      userName: currentUser ? currentUser.name : 'Guest User',
      userPhone: bookingDetails.phone || '+91 98765 00000',
      centerId: bookingDetails.centerId,
      centerName: bookingDetails.centerName,
      vehicleNo: bookingDetails.vehicleNo,
      startTime: bookingDetails.startTime,
      durationHours: Number(bookingDetails.durationHours),
      totalPrice: Number(bookingDetails.totalPrice),
      paytmPhone: targetCenter ? targetCenter.paytmPhone : '9876543210'
    };

    try {
      const res = await fetch(`${API_BASE}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        fetchRequests();
      }
    } catch (err) {
      const newReq = {
        ...payload,
        id: 'req-' + Date.now(),
        status: 'pending',
        paymentStatus: 'pending',
        physicalStatus: 'unconfirmed',
        createdAt: new Date().toISOString(),
        slotNumber: 'A-05'
      };
      setRequests(prev => [newReq, ...prev]);
    }

    setSelectedCenterForBooking(null);
    addNotification('Booking request submitted to Manager/Admin for confirmation!', 'success');
    setActiveTab('bookings');
  };

  // User Paytm Payment & Visit ID Generator
  const payBookingRequest = async (requestId, transactionRef) => {
    try {
      const res = await fetch(`${API_BASE}/requests/${requestId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionRef })
      });
      const data = await res.json();
      if (data.success) {
        fetchRequests();
        addNotification(`Payment Successful! Your Visit ID is ${data.visitId}`, 'success');
        return data.visitId;
      }
    } catch (err) {
      // Local fallback
      const visitId = `VST-${Math.floor(1000 + Math.random() * 9000)}`;
      setRequests(prev => prev.map(r => r.id === requestId ? {
        ...r,
        status: 'paid',
        paymentStatus: 'paid',
        visitId
      } : r));
      addNotification(`Payment Verified! Visit ID: ${visitId}`, 'success');
      return visitId;
    }
  };

  // Admin & Manager Actions
  const approveBookingRequest = async (requestId, slotNumber) => {
    try {
      await fetch(`${API_BASE}/requests/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed', slotNumber })
      });
      fetchRequests();
      fetchCenters();
    } catch (err) {
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'confirmed' } : r));
    }
    addNotification(`Booking request ${requestId} CONFIRMED! Payment QR ready.`, 'success');
  };

  const rejectBookingRequest = async (requestId) => {
    try {
      await fetch(`${API_BASE}/requests/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      });
      fetchRequests();
    } catch (err) {
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
    }
    addNotification(`Booking request ${requestId} REJECTED`, 'warning');
  };

  // Manager Physical Confirmation via Visit ID
  const confirmPhysicalArrival = async (visitIdOrReqId) => {
    try {
      const res = await fetch(`${API_BASE}/requests/${visitIdOrReqId}/confirm-physical`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        fetchRequests();
        fetchCenters();
        addNotification(`Physical Slot Confirmed for Visit ID: ${data.request.visitId}! Map unlocked for user.`, 'success');
        return data.request;
      }
    } catch (err) {
      setRequests(prev => prev.map(r => (r.id === visitIdOrReqId || r.visitId === visitIdOrReqId) ? {
        ...r,
        status: 'physically_confirmed',
        physicalStatus: 'physically_confirmed'
      } : r));
      addNotification(`Physical arrival confirmed! Map location unlocked.`, 'success');
    }
  };

  // Manager Account Creation & Management (Admin)
  const createManager = async (managerData) => {
    try {
      const res = await fetch(`${API_BASE}/managers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(managerData)
      });
      const data = await res.json();
      if (data.success) {
        fetchManagers();
        fetchCenters();
        addNotification(`Slot Manager created! Unique ID: ${data.manager.id}`, 'success');
        return data.manager;
      }
    } catch (err) {
      const uniqueId = `MGR-${Math.floor(1000 + Math.random() * 9000)}`;
      const newMgr = {
        id: uniqueId,
        name: managerData.name,
        email: managerData.email,
        centerId: managerData.centerId,
        paytmPhone: managerData.paytmPhone || '9876543210',
        createdAt: new Date().toISOString()
      };
      setManagers(prev => [newMgr, ...prev]);
      addNotification(`Manager created locally! Unique ID: ${uniqueId}`, 'success');
      return newMgr;
    }
  };

  const deleteManager = async (managerId) => {
    try {
      await fetch(`${API_BASE}/managers/${managerId}`, { method: 'DELETE' });
      fetchManagers();
      fetchCenters();
    } catch (err) {
      setManagers(prev => prev.filter(m => m.id !== managerId));
    }
    addNotification('Manager account removed', 'warning');
  };

  // Center Operations (Admin & Manager)
  const createCenter = async (newCenterData) => {
    try {
      const res = await fetch(`${API_BASE}/centers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCenterData)
      });
      const data = await res.json();
      if (data.success) {
        fetchCenters();
      }
    } catch (err) {
      const id = 'center-' + Date.now();
      setCenters(prev => [{
        ...newCenterData,
        id,
        availableSlots: Number(newCenterData.totalSlots),
        mapX: 50,
        mapY: 50,
        paytmPhone: newCenterData.paytmPhone || '9876543210',
        operatingHours: newCenterData.operatingHours || '08:00 AM - 10:00 PM',
        image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80'
      }, ...prev]);
    }
    addNotification(`New Parking Center "${newCenterData.name}" created!`, 'success');
  };

  const updateCenterDetails = async (centerId, updatedFields) => {
    try {
      const res = await fetch(`${API_BASE}/centers/${centerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      const data = await res.json();
      if (data.success) {
        fetchCenters();
        addNotification('Center details updated successfully', 'success');
      }
    } catch (err) {
      setCenters(prev => prev.map(c => c.id === centerId ? { ...c, ...updatedFields } : c));
      addNotification('Center details updated', 'info');
    }
  };

  const deleteCenter = async (centerId) => {
    try {
      await fetch(`${API_BASE}/centers/${centerId}`, { method: 'DELETE' });
      fetchCenters();
    } catch (err) {
      setCenters(prev => prev.filter(c => c.id !== centerId));
    }
    addNotification('Center removed from network', 'warning');
  };

  const updateCenterSlots = async (centerId, delta) => {
    try {
      await fetch(`${API_BASE}/centers/${centerId}/slots`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta })
      });
      fetchCenters();
    } catch (err) {
      setCenters(prev => prev.map(c => c.id === centerId ? { ...c, availableSlots: Math.max(0, c.availableSlots + delta) } : c));
    }
  };

  // Visual Slot Layout API
  const fetchSlotLayout = async (centerId) => {
    try {
      const res = await fetch(`${API_BASE}/centers/${centerId}/slots-layout`);
      const data = await res.json();
      if (data.success) return data.layout;
    } catch (err) {
      console.warn('API error fetching layout');
    }
    return null;
  };

  const updateSlotLayoutStatus = async (centerId, slotNumber, status) => {
    try {
      await fetch(`${API_BASE}/centers/${centerId}/slots-layout/${slotNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchCenters();
      addNotification(`Slot ${slotNumber} updated to ${status.toUpperCase()}`, 'info');
    } catch (err) {
      console.warn('API update error');
    }
  };

  return (
    <AppContext.Provider
      value={{
        themeMode,
        toggleTheme,
        currentUser,
        login,
        signUp,
        logout,
        switchRole,
        centers,
        requests,
        managers,
        userLocation,
        detectLiveLocation,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        selectedCenterForBooking,
        setSelectedCenterForBooking,
        activeTab,
        setActiveTab,
        submitBookingRequest,
        payBookingRequest,
        approveBookingRequest,
        rejectBookingRequest,
        confirmPhysicalArrival,
        createManager,
        deleteManager,
        createCenter,
        updateCenterDetails,
        deleteCenter,
        updateCenterSlots,
        fetchSlotLayout,
        updateSlotLayoutStatus,
        notifications
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
