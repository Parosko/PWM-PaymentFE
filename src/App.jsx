import { useState } from 'react';
import './App.css';
import { CardPreview } from './components/CardPreview';
import { PaymentForm } from './components/PaymentForm';
import { getCardType } from './utils/cardValidation';

function App() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  const cardType = getCardType(cardNumber);

  const handleFlipToggle = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="main-title">Halaman Pembayaran</h1>
        <p className="main-subtitle">
          Tolong Masukkan Data Data Pembayaran anda
        </p>
      </header>

      <main className="payment-layout">
        <section className="form-wrapper">
          <PaymentForm
            cardNumber={cardNumber}
            setCardNumber={setCardNumber}
            cardHolder={cardHolder}
            setCardHolder={setCardHolder}
            expiryDate={expiryDate}
            setExpiryDate={setExpiryDate}
            cvv={cvv}
            setCvv={setCvv}
            cardType={cardType}
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
          />
        </section>

        <section className="preview-wrapper">
          <CardPreview
            cardNumber={cardNumber}
            cardHolder={cardHolder}
            expiryDate={expiryDate}
            cvv={cvv}
            cardType={cardType}
            isFlipped={isFlipped}
            onFlipToggle={handleFlipToggle}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
