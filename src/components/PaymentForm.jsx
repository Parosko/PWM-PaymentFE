import React, { useState } from 'react';
import './PaymentForm.css';
import { formatCardNumber, formatExpiry, validateCardForm } from '../utils/cardValidation';

export const PaymentForm = ({
  cardNumber,
  setCardNumber,
  cardHolder,
  setCardHolder,
  expiryDate,
  setExpiryDate,
  cvv,
  setCvv,
  setIsFlipped
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
        title: 'Validation Successful!',
        message: `Card number (${cardNumber}) is valid and verified.`
      });
    } else {
      setFormStatus({
        type: 'error',
        title: 'Validation Failed',
        message: 'Please check the errors highlighted below and try again.'
      });
    }
  };

  return (
    <div className="payment-form-card">
      <div className="form-header">
        <h2 className="form-title">Payment Details</h2>
        <p className="form-subtitle">Enter your card credentials to validate details</p>
      </div>

      {/* Form Input Pembayaran */}
      <form onSubmit={handleSubmit} className="payment-form" noValidate>
        {/* Field Card Number */}
        <div className="form-field">
          <label htmlFor="cardNumber" className="form-label">
            Card Number
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
                <span>{errors.cvv}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tombol Submit */}
        <button type="submit" className="submit-btn">
          <span>Validate Card</span>
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
