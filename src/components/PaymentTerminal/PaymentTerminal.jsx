import React, { useState, useEffect } from 'react';
import './PaymentTerminal.css';
import { PinPad } from '../PinPad/PinPad';

// Clean SVG Icons for ATM hardware & interface
const CreditCardIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const ReceiptIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
    <path d="M8 7h8" />
    <path d="M8 11h8" />
    <path d="M8 15h5" />
  </svg>
);

const ShieldLockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const VolumeIcon = ({ muted }) => (
  muted ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const DownArrowIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

const UpArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

// Audio Synthesizer using Web Audio API
const playAtmSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } else if (type === 'delete') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'success') {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(0.06, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.22);
      });
    } else if (type === 'card-motor') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'cash-dispense') {
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      filter.Q.setValueAtTime(3, ctx.currentTime);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    }
  } catch (err) {
    // Autoplay restrictions or audio context errors
  }
};

export const PaymentTerminal = ({ cardNumber, cardHolder, cardType, onReset }) => {
  // Steps: 'inserting' | 'reading' | 'detected' | 'pin' | 'processing' | 'success' | 'receipt' | 'ejecting'
  const [terminalStep, setTerminalStep] = useState('inserting');
  const [pin, setPin] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [frozenReceiptTime, setFrozenReceiptTime] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Live ATM Clock for Screen
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerSound = (type) => {
    if (soundEnabled) {
      playAtmSound(type);
    }
  };

  // State transitions
  useEffect(() => {
    if (terminalStep === 'inserting') {
      triggerSound('card-motor');
      const timer = setTimeout(() => {
        setTerminalStep('reading');
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (terminalStep === 'reading') {
      const timer = setTimeout(() => {
        setTerminalStep('detected');
      }, 1100);
      return () => clearTimeout(timer);
    }

    if (terminalStep === 'detected') {
      const timer = setTimeout(() => {
        setTerminalStep('pin');
      }, 900);
      return () => clearTimeout(timer);
    }

    if (terminalStep === 'processing') {
      const timer = setTimeout(() => {
        const freezeTime = new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        setFrozenReceiptTime(freezeTime);
        triggerSound('success');
        setTerminalStep('success');
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [terminalStep]);

  // Support Keyboard Fisik (Angka 0-9, Backspace, Enter, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (terminalStep !== 'pin') return;

      if (/^[0-9]$/.test(e.key)) {
        handlePinKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handlePinDelete();
      } else if (e.key === 'Enter') {
        if (pin.length === 4) {
          handlePinSubmit();
        }
      } else if (e.key === 'Escape') {
        handleCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [terminalStep, pin]);

  // Handler Input PIN
  const handlePinKeyPress = (digit) => {
    if (pin.length < 4) {
      triggerSound('beep');
      setPin((prev) => prev + digit);
    }
  };

  const handlePinDelete = () => {
    if (pin.length > 0) {
      triggerSound('delete');
      setPin((prev) => prev.slice(0, -1));
    }
  };

  const handlePinSubmit = () => {
    if (pin.length === 4) {
      triggerSound('beep');
      setTerminalStep('processing');
    }
  };

  const handleCancel = () => {
    triggerSound('delete');
    setPin('');
    setTerminalStep('ejecting');
    setTimeout(() => {
      onReset();
    }, 1500);
  };

  // Handler Print Receipt / Eject
  const handlePrintReceipt = () => {
    triggerSound('cash-dispense');
    setTerminalStep('receipt');
  };

  const handleDoneClick = () => {
    triggerSound('card-motor');
    setTerminalStep('ejecting');
    setTimeout(() => {
      onReset();
    }, 1500);
  };

  // Masked Number Mini Card
  const getMiniCardNumber = () => {
    const clean = (cardNumber || '').replace(/\D/g, '');
    if (clean.length === 16) {
      return `•••• ${clean.slice(12)}`;
    }
    return '•••• ••••';
  };

  // Masked Full Formatted for Screen
  const getMaskedScreenNumber = () => {
    const clean = (cardNumber || '').replace(/\D/g, '');
    if (clean.length === 16) {
      return `**** **** **** ${clean.slice(12)}`;
    }
    return '**** **** **** ****';
  };

  // Class untuk animasi mini card
  const getCardAnimClass = () => {
    if (terminalStep === 'inserting') return 'inserting';
    if (terminalStep === 'ejecting') return 'ejecting';
    return 'inserted';
  };

  return (
    <div className="atm-kiosk-wrapper">
      {/* ATM Machine Fascia */}
      <div className="atm-chassis">
        {/* ATM Top Marquee / Brand Header */}
        <div className="atm-top-marquee">
          <div className="atm-marquee-brand">
            <div className="atm-bank-symbol">
              <span className="bank-symbol-bars"></span>
              <span className="bank-symbol-bars"></span>
            </div>
            <div className="atm-bank-text">
              <span className="atm-bank-name">ATM</span>
            </div>
          </div>
          <div className="atm-camera-module" title="ATM Security Camera">
            <div className="atm-camera-lens">
              <span className="atm-camera-glint"></span>
            </div>
            <span className="atm-cam-label">CAM-01</span>
          </div>
        </div>

        {/* ATM CRT / TFT Monitor Screen Console */}
        <div className="atm-screen-bezel">
          {/* Side FDK Buttons (Left) */}
          <div className="atm-fdk-column left-fdk">
            <button type="button" className="atm-fdk-button" aria-label="ATM Option 1"></button>
            <button type="button" className="atm-fdk-button" aria-label="ATM Option 2"></button>
            <button type="button" className="atm-fdk-button" aria-label="ATM Option 3"></button>
            <button type="button" className="atm-fdk-button" aria-label="ATM Option 4"></button>
          </div>

          {/* Actual ATM CRT/TFT Display */}
          <div className="atm-screen-display">
            {/* Scanlines & phosphor overlay */}
            <div className="atm-scanlines"></div>
            <div className="atm-crt-curvature"></div>

            {/* Screen Top Status Bar */}
            <div className="atm-screen-topbar">
              <div className="atm-topbar-item">
                <span className="atm-live-indicator"></span>
                <span>ONLINE</span>
              </div>
              <div className="atm-topbar-item network-tag">INTERBANK EMV</div>
              <div className="atm-topbar-item atm-clock">{currentTime || '12:00:00'}</div>
            </div>

            {/* Dynamic Screen Content Based on Steps */}
            <div className="atm-screen-body">
              {terminalStep === 'inserting' && (
                <div className="atm-screen-state">
                  <div className="atm-screen-icon-box">
                    <div className="slot-visual-indicator">
                      <div className="arrow-down-anim">
                        <DownArrowIcon />
                      </div>
                    </div>
                  </div>
                  <h3 className="atm-screen-title">MOHON TUNGGU</h3>
                  <p className="atm-screen-subtitle">Kartu sedang dimasukkan ke dalam slot...</p>
                  <div className="atm-chip-read-notice">EMV SMART CHIP VERIFICATION</div>
                </div>
              )}

              {terminalStep === 'reading' && (
                <div className="atm-screen-state">
                  <div className="atm-screen-icon-box">
                    <div className="atm-spinner"></div>
                  </div>
                  <h3 className="atm-screen-title">MEMBACA KARTU</h3>
                  <p className="atm-screen-subtitle">Sedang memverifikasi data chip perbankan...</p>
                  <div className="atm-security-tag">ENCRYPTION: 256-BIT RSA</div>
                </div>
              )}

              {terminalStep === 'detected' && (
                <div className="atm-screen-state">
                  <div className="atm-cardholder-display">
                    <span className="label">PEMEGANG KARTU:</span>
                    <span className="name">{cardHolder || 'CARD MEMBER'}</span>
                  </div>
                  <div className="atm-cardnum-display">{getMaskedScreenNumber()}</div>
                </div>
              )}

              {terminalStep === 'pin' && (
                <div className="atm-screen-state pin-mode">
                  <h3 className="atm-screen-title">MASUKKAN PIN ANDA</h3>
                  <p className="atm-screen-subtitle">
                    Gunakan keypad fisik di bawah atau klik angka layar
                  </p>

                  <div className="atm-pin-input-box">
                    {[0, 1, 2, 3].map((idx) => (
                      <div
                        key={idx}
                        className={`atm-pin-cell ${idx < pin.length ? 'filled' : ''} ${
                          idx === pin.length ? 'active' : ''
                        }`}
                      >
                        {idx < pin.length ? '●' : ''}
                      </div>
                    ))}
                  </div>

                  <div className="atm-pin-warning">
                    <span className="lock-icon">
                      <ShieldLockIcon />
                    </span>
                    <span>Lindungi kerahasiaan PIN saat mengetik</span>
                  </div>
                </div>
              )}

              {terminalStep === 'processing' && (
                <div className="atm-screen-state">
                  <div className="atm-spinner"></div>
                  <h3 className="atm-screen-title">TRANSAKSI SEDANG DIPROSES</h3>
                  <p className="atm-screen-subtitle">
                    Mohon jangan tinggalkan mesin dan jangan tarik kartu...
                  </p>
                  <div className="atm-progress-track">
                    <div className="atm-progress-bar"></div>
                  </div>
                </div>
              )}

              {terminalStep === 'success' && (
                <div className="atm-screen-state success-mode">
                  <div className="atm-success-badge">
                    <div className="atm-check-ring">
                      <CheckIcon />
                    </div>
                    <span>TRANSAKSI BERHASIL</span>
                  </div>
                  <div className="atm-receipt-info">
                    <div className="receipt-line">
                      <span>NOMINAL:</span>
                      <strong>Rp 250.000</strong>
                    </div>
                    <div className="receipt-line">
                      <span>STATUS:</span>
                      <strong className="status-approved">APPROVED (00)</strong>
                    </div>
                    <div className="receipt-line">
                      <span>REFF NO:</span>
                      <span>ATM-{Math.floor(100000 + Math.random() * 900000)}</span>
                    </div>
                  </div>

                  <div className="atm-action-buttons-group">
                    <button
                      type="button"
                      className="atm-onscreen-btn receipt-btn"
                      onClick={handlePrintReceipt}
                    >
                      Cetak Struk
                    </button>
                    <button
                      type="button"
                      className="atm-onscreen-btn eject-action-btn"
                      onClick={handleDoneClick}
                    >
                      Keluarkan Kartu
                    </button>
                  </div>
                </div>
              )}

              {terminalStep === 'receipt' && (
                <div className="atm-screen-state receipt-mode">
                  <div className="atm-mini-receipt-preview">
                    <div className="receipt-head">=== STRUK TRANSAKSI ATM ===</div>
                    <div className="receipt-row">
                      <span>TANGGAL:</span>
                      <span>{new Date().toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="receipt-row">
                      <span>WAKTU:</span>
                      <span>{frozenReceiptTime || currentTime}</span>
                    </div>
                    <div className="receipt-row">
                      <span>KARTU:</span>
                      <span>{getMaskedScreenNumber()}</span>
                    </div>
                    <div className="receipt-row">
                      <span>PEMEGANG:</span>
                      <span>{cardHolder || 'CARD MEMBER'}</span>
                    </div>
                    <div className="receipt-divider">-----------------------------</div>
                    <div className="receipt-row total">
                      <span>TOTAL DEBIT:</span>
                      <strong>Rp 250.000</strong>
                    </div>
                    <div className="receipt-foot">SIMPAN STRUK INI SEBAGAI BUKTI</div>
                  </div>

                  <button
                    type="button"
                    className="atm-onscreen-btn eject-action-btn"
                    onClick={handleDoneClick}
                  >
                    Ambil Kartu & Struk
                  </button>
                </div>
              )}

              {terminalStep === 'ejecting' && (
                <div className="atm-screen-state">
                  <div className="eject-arrow-anim">
                    <UpArrowIcon />
                  </div>
                  <h3 className="atm-screen-title">SILAKAN AMBIL KARTU ANDA</h3>
                  <p className="atm-screen-subtitle">Terima kasih telah bertransaksi dengan ATM kami</p>
                  <div className="atm-security-tag warning-text">JANGAN TINGGALKAN KARTU ANDA</div>
                </div>
              )}
            </div>

            {/* Screen Bottom Bar / Instruction */}
            <div className="atm-screen-footer">
              <span>{cardType} NETWORK ID: #8821-JKT</span>
              <span>LAYANAN 24 JAM: 08xx-xxxx-xxxx</span>
            </div>
          </div>

          {/* Side FDK Buttons (Right) */}
          <div className="atm-fdk-column right-fdk">
            <button type="button" className="atm-fdk-button" aria-label="ATM Option 5"></button>
            <button type="button" className="atm-fdk-button" aria-label="ATM Option 6"></button>
            <button type="button" className="atm-fdk-button" aria-label="ATM Option 7"></button>
            <button type="button" className="atm-fdk-button" aria-label="ATM Option 8"></button>
          </div>
        </div>

        {/* ATM Console Deck (Card Slot & Receipt Dispenser) */}
        <div className="atm-console-shelf">
          {/* Card Reader Module */}
          <div className="atm-hardware-slot card-reader-module">
            <div className="module-tag">
              <span className="card-slot-icon">
                <CreditCardIcon />
              </span>
              <span>CARD / KARTU</span>
            </div>

            <div className="atm-card-slot-housing">
              {/* Animated Inserted/Ejecting Mini Card */}
              <div className={`atm-physical-card ${getCardAnimClass()}`}>
                <div className="atm-card-surface">
                  <div className="atm-card-chip-gold"></div>
                  <div className="atm-card-logo-stamp">{cardType || 'VISA'}</div>
                  <div className="atm-card-number-emboss">{getMiniCardNumber()}</div>
                </div>
              </div>

              {/* Physical front mouth/bezel of the ATM slot */}
              <div className="atm-slot-entry">
                <div className="atm-slot-green-guide"></div>
              </div>
              <div className="atm-slot-front-lip"></div>
            </div>
          </div>

          {/* Receipt Printer Module */}
          <div className="atm-hardware-slot receipt-module">
            <div className="module-tag">
              <span className="receipt-slot-icon">
                <ReceiptIcon />
              </span>
              <span>RECEIPT / STRUK</span>
            </div>
            <div className="atm-receipt-slot-housing">
              <div className="receipt-paper-entry"></div>
              {terminalStep === 'receipt' && (
                <div className="dispensed-paper-anim">
                  <div className="paper-dots"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ATM Keypad Console Deck */}
        <div className="atm-keypad-deck">
          <div className="atm-keypad-bezel">
            <div className="keypad-panel-label">
              <span>PIN PAD ENCRYPTED</span>
              <button
                type="button"
                className={`sound-toggle-btn ${soundEnabled ? 'active' : ''}`}
                onClick={() => setSoundEnabled((prev) => !prev)}
                title={soundEnabled ? 'Matikan Suara ATM' : 'Nyalakan Suara ATM'}
              >
                <VolumeIcon muted={!soundEnabled} />
                <span>{soundEnabled ? 'Sound On' : 'Muted'}</span>
              </button>
            </div>

            <PinPad
              onKeyPress={handlePinKeyPress}
              onDelete={handlePinDelete}
              onSubmit={handlePinSubmit}
              onCancel={handleCancel}
              disabled={terminalStep !== 'pin'}
              pinLength={pin.length}
            />
          </div>
        </div>

        {/* Cash Dispenser Safe Door (Decorative ATM element) */}
        <div className="atm-cash-dispenser-door">
          <div className="cash-door-bezel">
            <div className="cash-slot-slit"></div>
            <span className="cash-door-label">CASH DISPENSER / TARIK TUNAI</span>
          </div>
        </div>
      </div>
    </div>
  );
};
