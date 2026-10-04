/**
 * Dummy Data Kartu untuk Pengujian (Testing)
 * Menyediakan 4 contoh kartu: 2 Visa (Valid & Invalid) dan 2 Mastercard (Valid & Invalid).
 */

export interface TestCard {
  id: string;
  name: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  type: 'VISA' | 'MASTERCARD';
  valid: boolean;
  description: string;
}

export const TEST_CARDS: TestCard[] = [
  {
    id: 'valid-visa',
    name: 'Valid Visa',
    cardNumber: '4111 1111 1111 1111',
    cardHolder: 'FARIZKY AULIA',
    expiryDate: '12/28',
    cvv: '123',
    type: 'VISA',
    valid: true,
    description: 'Luhn Valid (Passes checksum)'
  },
  {
    id: 'invalid-visa',
    name: 'Invalid Visa',
    cardNumber: '4111 1111 1111 1112',
    cardHolder: 'FARIZKY AULIA',
    expiryDate: '12/28',
    cvv: '123',
    type: 'VISA',
    valid: false,
    description: 'Luhn Invalid (Fails checksum)'
  },
  {
    id: 'valid-mastercard',
    name: 'Valid Mastercard',
    cardNumber: '5555 5555 5555 4444',
    cardHolder: 'FARIZKY AULIA',
    expiryDate: '12/28',
    cvv: '456',
    type: 'MASTERCARD',
    valid: true,
    description: 'Luhn Valid (Passes checksum)'
  },
  {
    id: 'invalid-mastercard',
    name: 'Invalid Mastercard',
    cardNumber: '5555 5555 5555 4445',
    cardHolder: 'FARIZKY AULIA',
    expiryDate: '12/28',
    cvv: '456',
    type: 'MASTERCARD',
    valid: false,
    description: 'Luhn Invalid (Fails checksum)'
  }
];
