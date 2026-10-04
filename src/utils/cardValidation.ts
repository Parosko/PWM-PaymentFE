/**
 * Utility untuk Validasi Kartu Pembayaran dan Algoritma Luhn
 */

export interface CardFormValues {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface CardValidationErrors {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
}

/**
 * Menentukan jenis kartu (VISA / MASTERCARD / CARD) berdasarkan digit pertama.
 * Aturan sederhana:
 * - Dimulai dengan '4' => VISA
 * - Dimulai dengan '5' => MASTERCARD
 * - Selain itu => CARD
 */
export const getCardType = (cardNumber: string): 'VISA' | 'MASTERCARD' | 'CARD' => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
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
export const formatCardNumber = (value: string): string => {
  const rawDigits = value.replace(/\D/g, '').slice(0, 16);
  const groups = rawDigits.match(/.{1,4}/g);
  return groups ? groups.join(' ') : rawDigits;
};

/**
 * Memformat input tanggal kadaluarsa menjadi format MM/YY.
 * Maksimal 4 digit input (contoh: "1228" menjadi "12/28").
 */
export const formatExpiry = (value: string): string => {
  const clean = value.replace(/\D/g, '').slice(0, 4);
  if (clean.length >= 3) {
    return `${clean.slice(0, 2)}/${clean.slice(2)}`;
  }
  return clean;
};

/**
 * ALGORITMA LUHN (Modulus 10 Check Digit Algorithm)
 * --------------------------------------------------
 * Mengapa Algoritma Luhn digunakan?
 * Algoritma Luhn adalah rumus checksum standar industri keuangan (ISO/IEC 7812-1)
 * yang digunakan untuk memverifikasi validitas matematis dari berbagai nomor identifikasi,
 * termasuk nomor kartu kredit/debit. Algoritma ini berguna untuk mencegah kesalahan
 * pengetikan (typo) atau digit palsu tanpa harus langsung menghubungi server bank.
 * 
 * Cara kerja langkah demi langkah:
 * 1. Balik urutan digit nomor kartu dari kanan ke kiri.
 * 2. Untuk setiap digit di posisi genap (posisi 2, 4, 6, dst dari kanan):
 *    - Kalikan digit tersebut dengan 2.
 *    - Jika hasil perkalian > 9, kurangi dengan 9 (contoh: 6 * 2 = 12 -> 12 - 9 = 3).
 * 3. Digit di posisi ganjil tetap sama.
 * 4. Jumlahkan seluruh digit tersebut.
 * 5. Jika total penjumlahan habis dibagi 10 (total % 10 === 0), nomor kartu valid!
 */
export const validateLuhn = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length !== 16) return false;

  let sum = 0;
  let shouldDouble = false;

  // Loop dari digit paling kanan (paling belakang) ke kiri
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

/**
 * Memvalidasi seluruh field form kartu pembayaran.
 * Mengembalikan objek errors yang berisi pesan kesalahan untuk masing-masing field
 * serta status isValid (true jika tidak ada error).
 */
export const validateCardForm = (data: CardFormValues): { errors: CardValidationErrors; isValid: boolean } => {
  const errors: CardValidationErrors = {};
  const cleanCardNumber = data.cardNumber.replace(/\D/g, '');

  // 1. Validasi Nomor Kartu
  if (!cleanCardNumber) {
    errors.cardNumber = 'Card number is required.';
  } else if (cleanCardNumber.length !== 16) {
    errors.cardNumber = 'Card number must be exactly 16 digits.';
  } else if (!cleanCardNumber.startsWith('4') && !cleanCardNumber.startsWith('5')) {
    errors.cardNumber = 'Card must start with 4 (Visa) or 5 (Mastercard).';
  } else if (!validateLuhn(cleanCardNumber)) {
    errors.cardNumber = 'Invalid card number (Failed Luhn check).';
  }

  // 2. Validasi Card Holder
  if (!data.cardHolder || data.cardHolder.trim() === '') {
    errors.cardHolder = 'Card holder name is required.';
  }

  // 3. Validasi Expiry Date (MM/YY)
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

  // 4. Validasi CVV
  const cleanCvv = data.cvv.replace(/\D/g, '');
  if (!cleanCvv) {
    errors.cvv = 'CVV is required.';
  } else if (cleanCvv.length !== 3) {
    errors.cvv = 'CVV must be exactly 3 digits.';
  }

  const isValid = Object.keys(errors).length === 0;

  return { errors, isValid };
};
