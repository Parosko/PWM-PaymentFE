import React, { useState } from 'react';
import './PaymentForm.css';
import { formatCardNumber, formatExpiry, validateCardForm } from '../utils/cardValidation';
import type { CardValidationErrors } from '../utils/cardValidation';
import { TEST_CARDS } from '../data/testCards';
import type { TestCard } from '../data/testCards';

interface PaymentFormProps {
  cardNumber: string;
  setCardNumber: (val: string) => void;
  cardHolder: string;
  setCardHolder: (val: string) => void;
  expiryDate: string;
  setExpiryDate: (val: string) => void;
  cvv: string;
  setCvv: (val: string) => void;
  cardType: 'VISA' | 'MASTERCARD' | 'CARD';
  isFlipped: boolean;
  setIsFlipped: (flipped: boolean) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  cardNumber,
  setCardNumber,
  cardHolder,
  setCardHolder,
  expiryDate,
  setExpiryDate,
  cvv,
  setCvv,
  cardType,
  setIsFlipped
}) => {
  const [errors, setErrors] = useState<CardValidationErrors>({});
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error'; message: string; title: string } | null>(null);
  const [showTestCards, setShowTestCards] = useState<boolean>(true);

  // Handler Perubahan Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);

    // Hapus error jika ada perubahan input
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: undefined }));
    }
  };

  // Handler Perubahan Card Holder
  const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardHolder(e.target.value);
    if (errors.cardHolder) {
      setErrors((prev) => ({ ...prev, cardHolder: undefined }));
    }
  };

  // Handler Perubahan Expiry Date
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setExpiryDate(formatted);
    if (errors.expiryDate) {
      setErrors((prev) => ({ ...prev, expiryDate: undefined }));
    }
  };

  // Handler Perubahan CVV (Hanya Angka, Max 3 Digit)
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvv(digitsOnly);
    if (errors.cvv) {
      setErrors((prev) => ({ ...prev, cvv: undefined }));
    }
  };

  // Fokus pada input CVV otomatis membalik kartu ke belakang
  const handleCvvFocus = () => {
    setIsFlipped(true);
  };

  // Lepas fokus dari input CVV mengembalikan kartu ke depan
  const handleCvvBlur = () => {
    setIsFlipped(false);
  };

  // Handler Klik Dummy Test Card
  const handleSelectTestCard = (testCard: TestCard) => {
    setCardNumber(testCard.cardNumber);
    setCardHolder(testCard.cardHolder);
    setExpiryDate(testCard.expiryDate);
    setCvv(testCard.cvv);
    setErrors({});
    setFormStatus(null);
  };

  // Handler Submit Form / Payment Validation
  const handleSubmit = (e: React.FormEvent) => {
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
        title: 'Validation Successful!',
        message: `Card number (${cardNumber}) is valid and passed the Luhn Algorithm check.`
      });
    } else {
      setFormStatus({
        type: 'error',
        title: 'Validation Failed',
        message: 'Please check the errors highlighted in red below and try again.'
      });
    }
  };

  return (
    <div className="payment-form-card">
      <div className="form-header">
        <h2 className="form-title">Payment Details</h2>
        <p className="form-subtitle">Enter your card credentials to validate details</p>
      </div>

      {/* Widget Dummy Test Cards Helper */}
      <div className="test-cards-section">
        <div className="test-cards-header">
          <span className="test-cards-title">
            <span>🧪</span> Test Cards (Quick Fill)
          </span>
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#38bdf8',
              fontSize: '0.72rem',
              cursor: 'pointer'
            }}
            onClick={() => setShowTestCards(!showTestCards)}
          >
            {showTestCards ? 'Hide' : 'Show'}
          </button>
        </div>

        {showTestCards && (
          <div className="test-cards-grid">
            {TEST_CARDS.map((card) => (
              <button
                key={card.id}
                type="button"
                className="test-card-btn"
                onClick={() => handleSelectTestCard(card)}
              >
                <div className="test-card-btn-name">
                  <span>{card.name}</span>
                  <span className={card.valid ? 'badge-valid' : 'badge-invalid'}>
                    {card.valid ? 'Valid' : 'Invalid'}
                  </span>
                </div>
                <div className="test-card-btn-desc">{card.cardNumber}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Form Input Pembayaran */}
      <form onSubmit={handleSubmit} className="payment-form" noValidate>
        {/* Field Card Number */}
        <div className="form-field">
          <label htmlFor="cardNumber" className="form-label">
            <span>Card Number</span>
            {cardType !== 'CARD' && (
              <span className={`input-brand-badge brand-${cardType.toLowerCase()}`}>
                {cardType}
              </span>
            )}
          </label>
          <div className="form-input-wrapper">
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              className={`form-input ${errors.cardNumber ? 'has-error' : ''}`}
              placeholder="4532 1234 5678 9012"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              autoComplete="off"
            />
          </div>
          {errors.cardNumber && (
            <div className="error-message">
              <span>⚠️</span>
              <span>{errors.cardNumber}</span>
            </div>
          )}
        </div>

        {/* Field Card Holder */}
        <div className="form-field">
          <label htmlFor="cardHolder" className="form-label">
            Card Holder Name
          </label>
          <div className="form-input-wrapper">
            <input
              id="cardHolder"
              name="cardHolder"
              type="text"
              className={`form-input ${errors.cardHolder ? 'has-error' : ''}`}
              placeholder="e.g. FARIZKY AULIA"
              value={cardHolder}
              onChange={handleCardHolderChange}
              autoComplete="off"
            />
          </div>
          {errors.cardHolder && (
            <div className="error-message">
              <span>⚠️</span>
              <span>{errors.cardHolder}</span>
            </div>
          )}
        </div>

        {/* Baris Expiry Date & CVV */}
        <div className="form-row">
          {/* Expiry Date */}
          <div className="form-field">
            <label htmlFor="expiryDate" className="form-label">
              Valid Thru
            </label>
            <div className="form-input-wrapper">
              <input
                id="expiryDate"
                name="expiryDate"
                type="text"
                className={`form-input ${errors.expiryDate ? 'has-error' : ''}`}
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryChange}
                maxLength={5}
                autoComplete="off"
              />
            </div>
            {errors.expiryDate && (
              <div className="error-message">
                <span>⚠️</span>
                <span>{errors.expiryDate}</span>
              </div>
            )}
          </div>

          {/* CVV Input */}
          <div className="form-field">
            <label htmlFor="cvv" className="form-label">
              CVV Code
            </label>
            <div className="form-input-wrapper">
              <input
                id="cvv"
                name="cvv"
                type="password"
                className={`form-input ${errors.cvv ? 'has-error' : ''}`}
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
                <span>⚠️</span>
                <span>{errors.cvv}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tombol Submit */}
        <button type="submit" className="submit-btn">
          <span>Validate Card</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        {/* Banner Status Hasil Validasi */}
        {formStatus && (
          <div className={`status-banner ${formStatus.type === 'success' ? 'status-success' : 'status-error'}`}>
            <span className="status-icon">
              {formStatus.type === 'success' ? '✅' : '❌'}
            </span>
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
