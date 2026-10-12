import { useState } from 'react';
import './App.css';
import { CardPreview } from './components/CardPreview';
import { PaymentForm } from './components/PaymentForm';
import { PaymentTerminal } from './components/PaymentTerminal/PaymentTerminal';
import { getCardType } from './utils/cardValidation';

function App() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  // Phase State: 1 (Form) | 2 (Terminal)
  const [phase, setPhase] = useState(1);

  const cardType = getCardType(cardNumber);

  const handleFlipToggle = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleValidSubmit = () => {
    // Transisi halus ke Phase 2 (Payment Terminal)
    setTimeout(() => {
      setPhase(2);
    }, 600);
  };

  const handleReset = () => {
    setCardNumber('');
    setCardHolder('');
    setExpiryDate('');
    setCvv('');
    setIsFlipped(false);
    setPhase(1);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="main-title">
          {phase === 1 ? 'Terminal Pembayaran Kartu' : 'Mesin ATM'}
        </h1>
      </header>

      {phase === 1 ? (
        <main className="payment-layout phase-transition">
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
              onValidSubmit={handleValidSubmit}
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
      ) : (
        <main className="terminal-container-layout phase-transition">
          <PaymentTerminal
            cardNumber={cardNumber}
            cardHolder={cardHolder}
            cardType={cardType}
            onReset={handleReset}
          />
        </main>
      )}
    </div>
  );
}

export default App;
