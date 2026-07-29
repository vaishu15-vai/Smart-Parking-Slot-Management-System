import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Import qrcode library dynamically or fallback to SVG QR generator
let qrcodeLib = null;
try {
  qrcodeLib = await import('qrcode');
} catch (e) {
  console.log('Using native SVG QR renderer fallback');
}

// ----------------------------------------------------
// SQL & FILE PERSISTENCE SETUP
// ----------------------------------------------------
const DB_FILE = path.join(__dirname, 'db.json');
const SQL_SCHEMA_FILE = path.join(__dirname, 'schema.sql');

const INITIAL_DB = {
  managers: [
    {
      id: 'MGR-1001',
      name: 'David Miller',
      email: 'manager1@parksmart.com',
      password: 'mgr123',
      centerId: 'center-1',
      centerName: 'Metro Central Smart Hub',
      paytmPhone: '9876543210',
      createdAt: new Date().toISOString()
    },
    {
      id: 'MGR-1002',
      name: 'Sarah Connor',
      email: 'manager2@parksmart.com',
      password: 'mgr123',
      centerId: 'center-2',
      centerName: 'Tech Park Automated Garage',
      paytmPhone: '9876500112',
      createdAt: new Date().toISOString()
    }
  ],
  centers: [
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
  ],
  requests: [
    {
      id: 'req-101',
      visitId: 'VST-9812',
      userEmail: 'alex@user.com',
      userName: 'Alex Johnson',
      userPhone: '+91 98765 11111',
      centerId: 'center-1',
      centerName: 'Metro Central Smart Hub',
      vehicleNo: 'KA-05-EV-4421',
      startTime: '14:00',
      durationHours: 3,
      totalPrice: 15.0,
      status: 'paid',
      paymentStatus: 'paid',
      physicalStatus: 'unconfirmed',
      paytmPhone: '9876543210',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      slotNumber: 'A-05'
    },
    {
      id: 'req-102',
      visitId: 'VST-4509',
      userEmail: 'sarah@user.com',
      userName: 'Sarah Jenkins',
      userPhone: '+91 98765 22222',
      centerId: 'center-2',
      centerName: 'Tech Park Automated Garage',
      vehicleNo: 'NY-889-X',
      startTime: '11:00',
      durationHours: 2,
      totalPrice: 9.0,
      status: 'physically_confirmed',
      paymentStatus: 'paid',
      physicalStatus: 'physically_confirmed',
      paytmPhone: '9876500112',
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      slotNumber: 'EV-02'
    }
  ],
  slotsLayout: {}
};

function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2));
    return INITIAL_DB;
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (!parsed.managers) parsed.managers = INITIAL_DB.managers;
    return parsed;
  } catch (err) {
    return INITIAL_DB;
  }
}

function saveDB(dbData) {
  fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2));
}

let db = loadDB();

// ----------------------------------------------------
// DYNAMIC PAYTM QR CODE GENERATOR FUNCTION
// ----------------------------------------------------
async function generatePaytmQRCodeDataURI(upiString) {
  if (qrcodeLib && qrcodeLib.toDataURL) {
    try {
      return await qrcodeLib.toDataURL(upiString, {
        errorCorrectionLevel: 'M',
        margin: 2,
        color: { dark: '#002E6E', light: '#FFFFFF' }
      });
    } catch (e) {
      console.warn('QR Code generation library warning:', e);
    }
  }

  // Fallback SVG QR Code Generator Data URI
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="#ffffff"/>
    <path d="M10 10h60v60H10zM20 20v40h40V20zM130 10h60v60h-60zM140 20v40h40V20zM10 130h60v60H10zM20 140v40h40v-40z" fill="#002E6E"/>
    <circle cx="40" cy="40" r="10" fill="#00B9F1"/>
    <circle cx="160" cy="40" r="10" fill="#00B9F1"/>
    <circle cx="40" cy="160" r="10" fill="#00B9F1"/>
    <rect x="80" y="20" width="30" height="30" fill="#002E6E"/>
    <rect x="20" y="80" width="40" height="30" fill="#002E6E"/>
    <rect x="80" y="80" width="40" height="40" fill="#00B9F1"/>
    <rect x="140" y="80" width="40" height="30" fill="#002E6E"/>
    <rect x="80" y="140" width="50" height="40" fill="#002E6E"/>
    <rect x="140" y="140" width="40" height="40" fill="#00B9F1"/>
    <text x="100" y="105" font-family="sans-serif" font-weight="900" font-size="12" fill="#FFFFFF" text-anchor="middle">PAYTM</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// ----------------------------------------------------
// REST API ROUTES
// ----------------------------------------------------

// 1. Paytm QR Code API Endpoint
app.get('/api/qrcode', async (req, res) => {
  const { paytmPhone, amount, centerName } = req.query;
  const phone = paytmPhone || '9876543210';
  const price = amount || '15.00';
  const name = centerName || 'ParkSmart Parking';

  const upiString = `upi://pay?pa=${phone}@paytm&pn=${encodeURIComponent(name)}&am=${price}&cu=INR`;
  const qrDataUri = await generatePaytmQRCodeDataURI(upiString);

  res.json({
    success: true,
    upiString,
    qrDataUri,
    paytmPhone: phone,
    amount: price,
    centerName: name
  });
});

app.get('/api/requests/:id/qrcode', async (req, res) => {
  const { id } = req.params;
  const targetReq = db.requests.find(r => r.id === id);

  if (targetReq) {
    const upiString = `upi://pay?pa=${targetReq.paytmPhone}@paytm&pn=${encodeURIComponent(targetReq.centerName)}&am=${targetReq.totalPrice}&cu=INR`;
    const qrDataUri = await generatePaytmQRCodeDataURI(upiString);
    return res.json({
      success: true,
      request: targetReq,
      upiString,
      qrDataUri
    });
  }
  res.status(404).json({ success: false, message: 'Request not found' });
});

// 2. Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  const lowerInput = (email || '').trim().toLowerCase();

  if (role === 'manager' || lowerInput.startsWith('mgr-')) {
    const mgr = db.managers.find(
      m => m.id.toLowerCase() === lowerInput || m.email.toLowerCase() === lowerInput
    );
    if (mgr) {
      return res.json({
        success: true,
        user: {
          id: mgr.id,
          name: mgr.name,
          email: mgr.email,
          role: 'manager',
          managerId: mgr.id,
          centerId: mgr.centerId,
          centerName: mgr.centerName,
          paytmPhone: mgr.paytmPhone
        },
        token: 'jwt-manager-token-' + Date.now()
      });
    }
  }

  const user = {
    id: role === 'admin' ? 'admin-' + Date.now() : 'user-' + Date.now(),
    name: email ? email.split('@')[0].toUpperCase() : 'Guest',
    email,
    role: role || 'user'
  };

  res.json({ success: true, user, token: 'jwt-demo-token-' + Date.now() });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, role } = req.body;
  const user = {
    id: role === 'admin' ? 'admin-' + Date.now() : 'user-' + Date.now(),
    name,
    email,
    role: role || 'user'
  };
  res.json({ success: true, user, token: 'jwt-demo-token-' + Date.now() });
});

// 3. Manager API
app.get('/api/managers', (req, res) => {
  res.json({ success: true, managers: db.managers });
});

app.post('/api/managers', (req, res) => {
  const { name, email, password, centerId, paytmPhone } = req.body;
  const uniqueNum = Math.floor(1000 + Math.random() * 9000);
  const uniqueId = `MGR-${uniqueNum}`;

  const assignedCenter = db.centers.find(c => c.id === centerId);

  const newManager = {
    id: uniqueId,
    name: name || `Manager ${uniqueNum}`,
    email: email || `mgr${uniqueNum}@parksmart.com`,
    password: password || 'mgr123',
    centerId: centerId || '',
    centerName: assignedCenter ? assignedCenter.name : 'Unassigned',
    paytmPhone: paytmPhone || '9876543210',
    createdAt: new Date().toISOString()
  };

  db.managers.unshift(newManager);

  if (assignedCenter) {
    assignedCenter.managerId = uniqueId;
    if (paytmPhone) assignedCenter.paytmPhone = paytmPhone;
  }

  saveDB(db);
  res.json({ success: true, manager: newManager });
});

app.delete('/api/managers/:id', (req, res) => {
  const { id } = req.params;
  db.managers = db.managers.filter(m => m.id !== id);

  const center = db.centers.find(c => c.managerId === id);
  if (center) center.managerId = null;

  saveDB(db);
  res.json({ success: true, message: 'Manager deleted' });
});

// 4. Center Routes
app.get('/api/centers', (req, res) => {
  res.json({ success: true, centers: db.centers });
});

app.post('/api/centers', (req, res) => {
  const newCenter = {
    ...req.body,
    id: 'center-' + Date.now(),
    availableSlots: Number(req.body.totalSlots),
    mapX: req.body.mapX || Math.floor(20 + Math.random() * 60),
    mapY: req.body.mapY || Math.floor(20 + Math.random() * 60),
    paytmPhone: req.body.paytmPhone || '9876543210',
    operatingHours: req.body.operatingHours || '08:00 AM - 10:00 PM',
    image: req.body.image || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80'
  };

  db.centers.unshift(newCenter);

  const total = Number(newCenter.totalSlots);
  db.slotsLayout[newCenter.id] = Array.from({ length: total }, (_, i) => {
    const num = i + 1;
    const code = `S-${num < 10 ? '0' + num : num}`;
    return { slotNumber: code, type: i < 3 ? 'EV Charging' : 'Standard', status: 'available', floor: 'Level 1' };
  });

  saveDB(db);
  res.json({ success: true, center: newCenter });
});

app.put('/api/centers/:id', (req, res) => {
  const { id } = req.params;
  const center = db.centers.find(c => c.id === id);
  if (center) {
    Object.assign(center, req.body);
    saveDB(db);
    res.json({ success: true, center });
  } else {
    res.status(404).json({ success: false, message: 'Center not found' });
  }
});

app.put('/api/centers/:id/slots', (req, res) => {
  const { id } = req.params;
  const { delta } = req.body;
  const center = db.centers.find(c => c.id === id);
  if (center) {
    center.availableSlots = Math.max(0, Math.min(center.totalSlots, center.availableSlots + delta));
    saveDB(db);
    res.json({ success: true, center });
  } else {
    res.status(404).json({ success: false, message: 'Center not found' });
  }
});

app.delete('/api/centers/:id', (req, res) => {
  const { id } = req.params;
  db.centers = db.centers.filter(c => c.id !== id);
  delete db.slotsLayout[id];
  saveDB(db);
  res.json({ success: true, message: 'Center deleted' });
});

// 5. Visual Slot Layout APIs
app.get('/api/centers/:id/slots-layout', (req, res) => {
  const { id } = req.params;
  let layout = db.slotsLayout[id];
  if (!layout) {
    const center = db.centers.find(c => c.id === id);
    const count = center ? center.totalSlots : 15;
    layout = Array.from({ length: count }, (_, i) => ({
      slotNumber: `A-${i < 9 ? '0' + (i + 1) : i + 1}`,
      type: i < 3 ? 'EV Charging' : 'Standard',
      status: 'available',
      floor: 'Level 1'
    }));
    db.slotsLayout[id] = layout;
    saveDB(db);
  }
  res.json({ success: true, layout });
});

app.put('/api/centers/:id/slots-layout/:slotNumber', (req, res) => {
  const { id, slotNumber } = req.params;
  const { status } = req.body;

  const layout = db.slotsLayout[id];
  if (layout) {
    const slot = layout.find(s => s.slotNumber === slotNumber);
    if (slot) {
      slot.status = status;
      const center = db.centers.find(c => c.id === id);
      if (center) {
        const freeCount = layout.filter(s => s.status === 'available').length;
        center.availableSlots = freeCount;
      }
      saveDB(db);
      return res.json({ success: true, slot, layout });
    }
  }
  res.status(404).json({ success: false, message: 'Slot not found' });
});

// 6. Booking Requests & Payment API
app.get('/api/requests', (req, res) => {
  res.json({ success: true, requests: db.requests });
});

app.post('/api/requests', (req, res) => {
  const center = db.centers.find(c => c.id === req.body.centerId);
  const paytmPhone = center ? center.paytmPhone : '9876543210';

  const newReq = {
    ...req.body,
    id: 'req-' + Date.now(),
    status: 'pending',
    paymentStatus: 'pending',
    physicalStatus: 'unconfirmed',
    paytmPhone,
    createdAt: new Date().toISOString(),
    slotNumber: req.body.slotNumber || 'S-' + Math.floor(10 + Math.random() * 89)
  };
  db.requests.unshift(newReq);
  saveDB(db);
  res.json({ success: true, request: newReq });
});

app.put('/api/requests/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, slotNumber } = req.body;
  const targetReq = db.requests.find(r => r.id === id);

  if (targetReq) {
    targetReq.status = status;
    if (slotNumber) targetReq.slotNumber = slotNumber;

    if (status === 'confirmed') {
      const center = db.centers.find(c => c.id === targetReq.centerId);
      if (center && center.availableSlots > 0) {
        center.availableSlots -= 1;
      }
      if (db.slotsLayout[targetReq.centerId]) {
        const slotObj = db.slotsLayout[targetReq.centerId].find(s => s.slotNumber === targetReq.slotNumber);
        if (slotObj) slotObj.status = 'reserved';
      }
    }

    saveDB(db);
    res.json({ success: true, request: targetReq });
  } else {
    res.status(404).json({ success: false, message: 'Request not found' });
  }
});

// User Payment API -> Generates Unique Visit ID
app.post('/api/requests/:id/pay', (req, res) => {
  const { id } = req.params;
  const { transactionRef } = req.body;
  const targetReq = db.requests.find(r => r.id === id);

  if (targetReq) {
    const visitNum = Math.floor(1000 + Math.random() * 9000);
    targetReq.visitId = `VST-${visitNum}`;
    targetReq.status = 'paid';
    targetReq.paymentStatus = 'paid';
    targetReq.transactionRef = transactionRef || 'TXN-' + Date.now();

    saveDB(db);
    res.json({ success: true, request: targetReq, visitId: targetReq.visitId });
  } else {
    res.status(404).json({ success: false, message: 'Request not found' });
  }
});

// Manager Visit ID Lookup API
app.get('/api/requests/visit/:visitId', (req, res) => {
  const { visitId } = req.params;
  const cleanId = (visitId || '').trim().toUpperCase();
  const reqObj = db.requests.find(r => r.visitId && r.visitId.toUpperCase() === cleanId);

  if (reqObj) {
    res.json({ success: true, request: reqObj });
  } else {
    res.status(404).json({ success: false, message: 'Visit ID not found' });
  }
});

// Manager Physical Slot Confirmation API
app.post('/api/requests/:id/confirm-physical', (req, res) => {
  const { id } = req.params;
  const targetReq = db.requests.find(r => r.id === id || r.visitId === id);

  if (targetReq) {
    targetReq.status = 'physically_confirmed';
    targetReq.physicalStatus = 'physically_confirmed';
    targetReq.confirmedAt = new Date().toISOString();

    if (db.slotsLayout[targetReq.centerId]) {
      const slotObj = db.slotsLayout[targetReq.centerId].find(s => s.slotNumber === targetReq.slotNumber);
      if (slotObj) slotObj.status = 'occupied';
    }

    saveDB(db);
    res.json({ success: true, request: targetReq });
  } else {
    res.status(404).json({ success: false, message: 'Request not found' });
  }
});

// Analytics Route
app.get('/api/analytics', (req, res) => {
  const totalCenters = db.centers.length;
  const totalSlots = db.centers.reduce((a, c) => a + c.totalSlots, 0);
  const freeSlots = db.centers.reduce((a, c) => a + c.availableSlots, 0);
  const confirmedReqs = db.requests.filter(r => r.status === 'confirmed' || r.status === 'paid' || r.status === 'physically_confirmed');
  const revenue = confirmedReqs.reduce((a, r) => a + Number(r.totalPrice), 0);

  res.json({
    success: true,
    analytics: {
      totalCenters,
      totalManagers: db.managers.length,
      totalSlots,
      freeSlots,
      occupiedSlots: totalSlots - freeSlots,
      occupancyPercentage: totalSlots > 0 ? (((totalSlots - freeSlots) / totalSlots) * 100).toFixed(1) : 0,
      totalRevenue: revenue.toFixed(2),
      pendingRequestsCount: db.requests.filter(r => r.status === 'pending').length
    }
  });
});

app.listen(PORT, () => {
  console.log(`Smart Parking System Backend REST API with SQL Schema & Paytm QR running on http://localhost:${PORT}`);
});
