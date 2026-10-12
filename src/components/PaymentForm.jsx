import React, { useState } from 'react';
import './PaymentForm.css';
import { formatCardNumber, formatExpiry, validateCardForm } from '../utils/cardValidation';

// Vector SVG Icons for Form Fields
const CardNumberIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export const PaymentForm = ({
  cardNumber,
  setCardNumber,
  cardHolder,
  setCardHolder,
  expiryDate,
  setExpiryDate,
  cvv,
  setCvv,
  setIsFlipped,
  onValidSubmit
}) => {
  const [errors, setErrors] = useState({});
  const [formStatus, setFormStatus] = useState(null);

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: undefined }));
    }
  };

  const handleCardHolderChange = (e) => {
    setCardHolder(e.target.value);
    if (errors.cardHolder) {
      setErrors((prev) => ({ ...prev, cardHolder: undefined }));
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setExpiryDate(formatted);
    if (errors.expiryDate) {
      setErrors((prev) => ({ ...prev, expiryDate: undefined }));
    }
  };

  const handleCvvChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvv(digitsOnly);
    if (errors.cvv) {
      setErrors((prev) => ({ ...prev, cvv: undefined }));
    }
  };

  const handleCvvFocus = () => {
    setIsFlipped(true);
  };

  const handleCvvBlur = () => {
    setIsFlipped(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { errors: validationErrors, isValid } = validateCardForm({
      cardNumber,
      cardHolder,
      expiryDate,
      cvv
    });

    setErrors(validationErrors);

    if (isValid) {
      setFormStatus({
        type: 'success',
        title: 'Verifikasi Berhasil',
        message: 'Data kartu valid, mengalihkan ke mesin ATM...'
      });
      if (onValidSubmit) {
        onValidSubmit();
      }
    } else {
      setFormStatus({
        type: 'error',
        title: 'Validasi Gagal',
        message: 'Periksa kembali data kartu yang ditandai merah.'
      });
    }
  };

  return (
    <div className="payment-form-card">
      <div className="form-header">
        <h2 className="form-title">Informasi Kartu</h2>
      </div>

      {/* Form Input Pembayaran */}
      <form onSubmit={handleSubmit} className="payment-form" noValidate>
        {/* Field Card Number */}
        <div className="form-field">
          <label htmlFor="cardNumber" className="form-label">
            Nomor Kartu
          </label>
          <div className="form-input-wrapper">
            <span className="field-icon">
              <CardNumberIcon />
            </span>
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              className={`form-input has-icon ${errors.cardNumber ? 'has-error' : ''}`}
              placeholder="4532 1234 5678 9012"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              autoComplete="off"
            />
          </div>
          {errors.cardNumber && (
            <div className="error-message">
              <AlertIcon />
              <span>{errors.cardNumber}</span>
            </div>
          )}
        </div>

        {/* Field Card Holder */}
        <div className="form-field">
          <label htmlFor="cardHolder" className="form-label">
            Nama Pemegang Kartu
          </label>
          <div className="form-input-wrapper">
            <span className="field-icon">
              <UserIcon />
            </span>
            <input
              id="cardHolder"
              name="cardHolder"
              type="text"
              className={`form-input has-icon ${errors.cardHolder ? 'has-error' : ''}`}
              placeholder="e.g. FARIZKY AULIA"
              value={cardHolder}
              onChange={handleCardHolderChange}
              autoComplete="off"
            />
          </div>
          {errors.cardHolder && (
            <div className="error-message">
              <AlertIcon />
              <span>{errors.cardHolder}</span>
            </div>
          )}
        </div>

        {/* Baris Expiry Date & CVV */}
        <div className="form-row">
          {/* Expiry Date */}
          <div className="form-field">
            <label htmlFor="expiryDate" className="form-label">
              Masa Berlaku
            </label>
            <div className="form-input-wrapper">
              <span className="field-icon">
                <CalendarIcon />
              </span>
              <input
                id="expiryDate"
                name="expiryDate"
                type="text"
                className={`form-input has-icon ${errors.expiryDate ? 'has-error' : ''}`}
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryChange}
                maxLength={5}
                autoComplete="off"
              />
            </div>
            {errors.expiryDate && (
              <div className="error-message">
                <AlertIcon />
                <span>{errors.expiryDate}</span>
              </div>
            )}
          </div>

          {/* CVV Input */}
          <div className="form-field">
            <label htmlFor="cvv" className="form-label">
              Kode CVV
            </label>
            <div className="form-input-wrapper">
              <span className="field-icon">
                <LockIcon />
              </span>
              <input
                id="cvv"
                name="cvv"
                type="password"
                className={`form-input has-icon ${errors.cvv ? 'has-error' : ''}`}
                placeholder="123"
                value={cvv}
                onChange={handleCvvChange}
                onFocus={handleCvvFocus}
                onBlur={handleCvvBlur}
                maxLength={3}
                autoComplete="off"
              />
            </div>
            {errors.cvv && (
              <div className="error-message">
                <AlertIcon />
                <span>{errors.cvv}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tombol Submit */}
        <button type="submit" className="submit-btn">
          <span>Lanjutkan ke ATM</span>
          <ArrowRightIcon />
        </button>

        {/* Banner Status Hasil Validasi */}
        {formStatus && (
          <div className={`status-banner ${formStatus.type === 'success' ? 'status-success' : 'status-error'}`}>
            <div className="status-text">
              <div className="status-title">{formStatus.title}</div>
              <div>{formStatus.message}</div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
