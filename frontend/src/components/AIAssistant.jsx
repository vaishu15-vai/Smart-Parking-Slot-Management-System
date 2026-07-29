import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  X, 
  Sparkles, 
  Car, 
  MapPin, 
  QrCode, 
  Key, 
  MessageSquare,
  HelpCircle,
  Clock,
  RotateCcw
} from 'lucide-react';

export default function AIAssistant() {
  const { centers, userLocation, requests, currentUser } = useApp();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello ${currentUser ? currentUser.name : 'there'}! 👋 I am **ParkSmart AI Voice Assistant**. I can help you find nearest parking centers, explain Paytm QR payments, track your Visit ID, or check slot availability. How can I assist you today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition if supported by browser
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        handleSend(transcript);
        setIsListening(false);
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Speech Synthesis (Text to Speech) Helper
  const speakText = (text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Clean markdown text for voice
    const cleanText = text.replace(/[*#_`]/g, '').replace(/\[.*?\]\(.*?\)/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. You can type your question!');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // AI Logic Engine with Live Context Awareness
  const generateAIResponse = (userQuery) => {
    const query = userQuery.toLowerCase();

    // 1. Nearest centers query
    if (query.includes('nearest') || query.includes('closest') || query.includes('location') || query.includes('near me')) {
      const nearest = [...centers].sort((a, b) => a.distanceKm - b.distanceKm)[0];
      if (nearest) {
        return `The nearest slot center to **${userLocation.name}** is **${nearest.name}**, located **${nearest.distanceKm} km** away (${nearest.estimatedMinutes} mins drive). It currently has **${nearest.availableSlots} available slots** at **$${nearest.hourlyRate}/hr**.`;
      }
      return `Your current GPS pin is at **${userLocation.name}**. You can view all nearby centers on the interactive radar map!`;
    }

    // 2. EV Charging query
    if (query.includes('ev') || query.includes('electric') || query.includes('charger')) {
      const evCenters = centers.filter(c => c.facilities.some(f => f.toLowerCase().includes('ev')));
      if (evCenters.length > 0) {
        const names = evCenters.map(c => `**${c.name}** (${c.availableSlots} slots free)`).join(', ');
        return `We have **${evCenters.length} centers** with EV Charging facilities: ${names}.`;
      }
      return `EV Charging facilities are available at Metro Central Smart Hub and Tech Park Automated Garage!`;
    }

    // 3. Paytm QR Payment query
    if (query.includes('paytm') || query.includes('qr') || query.includes('pay') || query.includes('payment')) {
      return `To pay via **Paytm QR Code**:\n1. Submit a booking request for your chosen center.\n2. Once the manager/admin confirms your request, go to **"My Bookings"**.\n3. Click **"Show Paytm QR Code & Pay"**.\n4. Scan the QR code with Paytm app (Paytm number connected to manager) and confirm payment. You will instantly get your unique **Visit ID**!`;
    }

    // 4. Visit ID query
    if (query.includes('visit id') || query.includes('visit') || query.includes('vst') || query.includes('code')) {
      const userReqWithVisit = requests.find(r => r.visitId && (r.userEmail === currentUser?.email || currentUser?.email === 'alex@user.com'));
      if (userReqWithVisit) {
        return `Your active **Visit ID** is **${userReqWithVisit.visitId}** for **${userReqWithVisit.centerName}** (Slot: ${userReqWithVisit.slotNumber}). Present this ID to the Slot Center Manager upon arrival!`;
      }
      return `Your **Visit ID** (e.g. VST-9812) is automatically generated as soon as you complete your Paytm QR payment. It allows the Manager to verify your arrival and physically allocate your slot!`;
    }

    // 5. Navigation & Map unlocking
    if (query.includes('map') || query.includes('navigate') || query.includes('direction') || query.includes('unlock')) {
      return `Once the Slot Center Manager checks your Visit ID and clicks **"Confirm Physical Slot"**, your screen will automatically unlock the **Interactive Radar Map** with step-by-step navigation guidance to your specific slot bay!`;
    }

    // 6. Operating hours query
    if (query.includes('hours') || query.includes('time') || query.includes('open') || query.includes('close')) {
      const centerHours = centers.map(c => `• **${c.name}**: ${c.operatingHours || '08:00 AM - 10:00 PM'}`).join('\n');
      return `Here are the operating hours for our network centers:\n${centerHours}`;
    }

    // 7. Manager or Admin help
    if (query.includes('manager') || query.includes('admin') || query.includes('id') || query.includes('role')) {
      return `Managers can log in using their **Unique Manager ID** (e.g. MGR-1001) generated by the Admin. Managers can update operating hours, connect Paytm phone numbers, and verify Visit IDs!`;
    }

    // Default intelligent response
    return `I am here to assist you with ParkSmart AI! You can ask me to find nearest parking centers, guide you through Paytm QR payments, check operating hours, or locate your Visit ID. Try clicking one of the quick question buttons below!`;
  };

  const handleSend = (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Generate AI response
    setTimeout(() => {
      const aiReplyText = generateAIResponse(text);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      speakText(aiReplyText);
    }, 400);
  };

  return (
    <>
      {/* Floating Launcher Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 150,
          background: 'linear-gradient(135deg, var(--primary) 0%, #3730A3 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '9999px',
          padding: '0.85rem 1.35rem',
          boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontWeight: 700,
          fontSize: '0.9rem',
          transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <div style={{ position: 'relative' }}>
          <Bot size={22} />
          {isSpeaking && (
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              background: '#34D399',
              borderRadius: '50%',
              animation: 'pulseGlow 1.5s infinite'
            }} />
          )}
        </div>
        <span>Ask ParkSmart AI</span>
        <span style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '2px 7px',
          borderRadius: '9999px',
          fontSize: '0.7rem',
          fontWeight: 800
        }}>
          VOICE 🎙️
        </span>
      </button>

      {/* Floating Chatbot Modal Window */}
      {isOpen && (
        <div 
          className="glass-panel"
          style={{
            position: 'fixed',
            bottom: '88px',
            right: '24px',
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '520px',
            maxHeight: '80vh',
            zIndex: 160,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '2px solid var(--border-glow)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }}
        >
          {/* Header Bar */}
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, #3730A3 100%)',
            color: 'white',
            padding: '1rem 1.25rem',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '0.4rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  ParkSmart AI Assistant <Sparkles size={13} color="#FBBF24" />
                </div>
                <div style={{ fontSize: '0.725rem', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ width: '6px', height: '6px', background: '#34D399', borderRadius: '50%' }} />
                  Voice Enabled Assistant
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {/* Voice Mute/Unmute Toggle */}
              <button 
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  if (voiceEnabled) window.speechSynthesis.cancel();
                }}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: 'white',
                  padding: '0.35rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                title={voiceEnabled ? 'Mute AI Voice Speech' : 'Enable AI Voice Speech'}
              >
                {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <button 
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: 'white',
                  padding: '0.35rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div style={{
            background: 'var(--bg-card-hover)',
            padding: '0.5rem 0.85rem',
            display: 'flex',
            gap: '0.35rem',
            overflowX: 'auto',
            borderBottom: '1px solid var(--border-glass)'
          }}>
            {[
              { label: 'Nearest Center', query: 'Which is the nearest slot center?' },
              { label: 'Paytm QR Help', query: 'How to pay via Paytm QR Code?' },
              { label: 'Visit ID Help', query: 'Where is my Visit ID?' },
              { label: 'EV Charging', query: 'Which centers have EV charging?' }
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-main)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            background: 'var(--bg-main)'
          }}>
            {messages.map((msg) => {
              const isAI = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isAI ? 'flex-start' : 'flex-end',
                    maxWidth: '84%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isAI ? 'flex-start' : 'flex-end'
                  }}
                >
                  <div style={{
                    background: isAI ? 'var(--bg-card)' : 'linear-gradient(135deg, var(--primary) 0%, #3730A3 100%)',
                    color: isAI ? 'var(--text-main)' : '#FFF',
                    padding: '0.75rem 0.95rem',
                    borderRadius: isAI ? '14px 14px 14px 2px' : '14px 14px 2px 14px',
                    fontSize: '0.825rem',
                    lineHeight: '1.45',
                    border: isAI ? '1px solid var(--border-glass)' : 'none',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                    whiteSpace: 'pre-line'
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.2rem', padding: '0 4px' }}>
                    {msg.time}
                  </span>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Voice Listening Animation Bar */}
          {isListening && (
            <div style={{
              background: 'rgba(5, 150, 105, 0.12)',
              borderTop: '1px solid #059669',
              padding: '0.4rem 0.85rem',
              fontSize: '0.75rem',
              color: '#059669',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Mic size={14} className="animate-pulse" /> Listening to your voice... Speak now!
              </span>
              <button 
                onClick={toggleListening}
                style={{ background: 'transparent', border: 'none', color: '#059669', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 800 }}
              >
                Stop
              </button>
            </div>
          )}

          {/* Input Controls Bar */}
          <div style={{
            padding: '0.75rem 0.85rem',
            background: 'var(--bg-card)',
            borderTop: '1px solid var(--border-glass)',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            {/* Microphone Button */}
            <button
              onClick={toggleListening}
              style={{
                background: isListening ? '#E11D48' : 'var(--bg-card-hover)',
                color: isListening ? 'white' : 'var(--primary)',
                border: '1px solid var(--border-glass)',
                padding: '0.6rem',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              title={isListening ? 'Stop Listening' : 'Speak using Voice Assistant'}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              className="form-input"
              placeholder={isListening ? 'Listening...' : 'Type or speak your question...'}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              style={{ flex: 1, padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
            />

            <button
              onClick={() => handleSend()}
              className="btn btn-primary"
              style={{ padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-md)', flexShrink: 0 }}
              disabled={!inputValue.trim()}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
