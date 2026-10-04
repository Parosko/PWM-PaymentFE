import React from 'react';
import './CardPreview.css';

export const CardPreview = ({
  cardNumber,
  cardHolder,
  expiryDate,
  cvv,
  cardType,
  isFlipped,
  onFlipToggle
}) => {
  // Format tampilan nomor kartu di bagian depan
  const renderCardNumber = () => {
    if (!cardNumber) {
      return <span className="card-number-placeholder">•••• •••• •••• ••••</span>;
    }
    const cleanDigits = cardNumber.replace(/\D/g, '');
    const padded = cleanDigits.padEnd(16, '•');
    const formatted = padded.match(/.{1,4}/g)?.join(' ') || padded;

    return formatted.split('').map((char, idx) => (
      <span
        key={idx}
        className={char === '•' ? 'card-number-placeholder' : ''}
      >
        {char}
      </span>
    ));
  };

  // Nomor kartu termask pada bagian belakang kartu
  const renderMaskedBackNumber = () => {
    const clean = (cardNumber || '').replace(/\D/g, '');
    if (clean.length === 16) {
      return `XXXX XXXX XXXX ${clean.slice(12)}`;
    }
    return 'XXXX XXXX XXXX XXXX';
  };

  return (
    <div className="card-preview-container">
      {/* Petunjuk Klik Kartu */}
      <div className="card-hint" onClick={onFlipToggle} role="button" tabIndex={0}>
        <span>Click card to flip ({isFlipped ? 'Back View' : 'Front View'})</span>
      </div>

      {/* Kartu 3D Flip */}
      <div
        className={`payment-card ${isFlipped ? 'flipped' : ''}`}
        onClick={onFlipToggle}
        title="Klik untuk membalik kartu"
        aria-label="Interactive Payment Card Preview"
      >
        {/* SISI DEPAN KARTU */}
        <div className="card-face card-front">
          {/* Header Kartu: Chip & Logo */}
          <div className="card-header-row">
            <div className="chip-and-wave">
              <div className="card-chip">
                <div className="chip-inner-line"></div>
              </div>
              {/* Contactless Signal Icon SVG */}
              <svg
                className="contactless-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12A2.5 2.5 0 0 0 8.5 9.5" />
                <path d="M5 18a7 7 0 0 0 7-7 7 7 0 0 0-7-7" />
                <path d="M12 21a11 11 0 0 0 11-11 11 11 0 0 0-11-11" />
              </svg>
            </div>

            {/* Indicator Card Type Logo */}
            <div className="card-brand">
              {cardType === 'VISA' && (
                <div className="visa-logo">VISA</div>
              )}
              {cardType === 'MASTERCARD' && (
                <div className="mastercard-logo">
                  <div className="mc-circle mc-red"></div>
                  <div className="mc-circle mc-yellow"></div>
                  <span className="mc-label">mastercard</span>
                </div>
              )}
              {cardType === 'CARD' && (
                <div className="generic-logo">CARD</div>
              )}
            </div>
          </div>

          {/* Nomor Kartu */}
          <div className="card-number-display">
            {renderCardNumber()}
          </div>

          {/* Footer Kartu: Nama & Valid Thru */}
          <div className="card-footer-row">
            <div className="card-holder-group">
              <div className="card-label">CARD HOLDER</div>
              <div className="card-value">
                {cardHolder && cardHolder.trim() ? cardHolder.toUpperCase() : 'CARD HOLDER'}
              </div>
            </div>

            <div className="expiry-group">
              <div className="card-label">VALID THRU</div>
              <div className="card-value">
                {expiryDate && expiryDate.trim() ? expiryDate : 'MM/YY'}
              </div>
            </div>
          </div>
        </div>

        {/* SISI BELAKANG KARTU */}
        <div className="card-face card-back">
          {/* Pita Magnetik Hitam */}
          <div className="card-magnetic-strip"></div>

          <div className="card-back-body">
            {/* Signature & Strip CVV */}
            <div className="cvv-strip-container">
              <div className="card-label">CVV / CVC</div>
              <div className="signature-strip">
                <span className="cvv-display">
                  {cvv ? cvv : '•••'}
                </span>
              </div>
            </div>

            {/* Footer Belakang: Masked Card Number & Logo */}
            <div className="card-back-footer">
              <span className="masked-number-back">{renderMaskedBackNumber()}</span>
              <div className="card-brand">
                {cardType === 'VISA' && <div className="visa-logo" style={{ fontSize: '1rem' }}>VISA</div>}
                {cardType === 'MASTERCARD' && (
                  <div className="mastercard-logo">
                    <div className="mc-circle mc-red" style={{ width: '16px', height: '16px' }}></div>
                    <div className="mc-circle mc-yellow" style={{ width: '16px', height: '16px' }}></div>
                  </div>
                )}
                {cardType === 'CARD' && <div className="generic-logo" style={{ fontSize: '0.7rem' }}>CARD</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
