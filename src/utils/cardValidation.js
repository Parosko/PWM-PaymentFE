/**
 * Utility untuk Validasi Kartu Pembayaran dan Deteksi Kartu (JavaScript)
 */

/**
 * Menentukan jenis kartu (VISA / MASTERCARD / CARD) berdasarkan digit pertama.
 * Aturan:
 * - Dimulai dengan '4' => VISA
 * - Dimulai dengan '5' => MASTERCARD
 * - Selain itu => CARD
 */
export const getCardType = (cardNumber) => {
  const cleanNumber = (cardNumber || '').replace(/\D/g, '');
  if (cleanNumber.startsWith('4')) {
    return 'VISA';
  }
  if (cleanNumber.startsWith('5')) {
    return 'MASTERCARD';
  }
  return 'CARD';
};

/**
 * Memformat nomor kartu menjadi kelompok 4 digit (contoh: "4532 1234 5678 9012").
 * Maksimal 16 digit angka.
 */
export const formatCardNumber = (value) => {
  const rawDigits = (value || '').replace(/\D/g, '').slice(0, 16);
  const groups = rawDigits.match(/.{1,4}/g);
  return groups ? groups.join(' ') : rawDigits;
};

/**
 * Memformat input tanggal kadaluarsa menjadi format MM/YY.
 * Maksimal 4 digit input (contoh: "1228" menjadi "12/28").
 */
export const formatExpiry = (value) => {
  const clean = (value || '').replace(/\D/g, '').slice(0, 4);
  if (clean.length >= 3) {
    return `${clean.slice(0, 2)}/${clean.slice(2)}`;
  }
  return clean;
};

/**
 * Memvalidasi seluruh field form kartu pembayaran.
 * Semua kartu 16 digit yang diawali 4 atau 5 dianggap valid, 
 * KECUALI jika tanggal expired-nya sudah lewat dari bulan/tahun saat ini.
 */
export const validateCardForm = (data) => {
  const errors = {};
  const cleanCardNumber = (data.cardNumber || '').replace(/\D/g, '');

  // 1. Validasi Nomor Kartu (16 digit & diawali 4 atau 5)
  if (!cleanCardNumber) {
    errors.cardNumber = 'Card number is required.';
  } else if (cleanCardNumber.length !== 16) {
    errors.cardNumber = 'Card number must be exactly 16 digits.';
  } else if (!cleanCardNumber.startsWith('4') && !cleanCardNumber.startsWith('5')) {
    errors.cardNumber = 'Card must start with 4 (Visa) or 5 (Mastercard).';
  }

  // 2. Validasi Card Holder
  if (!data.cardHolder || data.cardHolder.trim() === '') {
    errors.cardHolder = 'Card holder name is required.';
  }

  // 3. Validasi Expiry Date (MM/YY) - Memastikan tidak kadaluarsa
  if (!data.expiryDate) {
    errors.expiryDate = 'Expiry date is required.';
  } else {
    const expiryRegex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
    const match = data.expiryDate.match(expiryRegex);

    if (!match) {
      errors.expiryDate = 'Format must be MM/YY (Month 01-12).';
    } else {
      const month = parseInt(match[1], 10);
      const year = parseInt(`20${match[2]}`, 10);

      const now = new Date();
      const currentMonth = now.getMonth() + 1; // 1-12
      const currentYear = now.getFullYear();

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.expiryDate = 'Card has expired.';
      }
    }
  }

  // 4. Validasi CVV (3 digit)
  const cleanCvv = (data.cvv || '').replace(/\D/g, '');
  if (!cleanCvv) {
    errors.cvv = 'CVV is required.';
  } else if (cleanCvv.length !== 3) {
    errors.cvv = 'CVV must be exactly 3 digits.';
  }

  const isValid = Object.keys(errors).length === 0;

  return { errors, isValid };
};
