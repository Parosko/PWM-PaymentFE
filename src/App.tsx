import { useState } from 'react';
import './App.css';
import { CardPreview } from './components/CardPreview';
import { PaymentForm } from './components/PaymentForm';
import { getCardType } from './utils/cardValidation';

function App() {
  // State Utama Form Pembayaran
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardHolder, setCardHolder] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Jenis Kartu dideteksi secara otomatis berdasarkan prefix nomor kartu (4: VISA, 5: MASTERCARD)
  const cardType = getCardType(cardNumber);

  // Toggle manual flip kartu saat diklik
  const handleFlipToggle = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="app-container">
      {/* Header Aplikasi */}
      <header className="app-header">
        <div className="badge-tag">
          <span>💳</span> Front-End Interactive Task
        </div>
        <h1 className="main-title">Payment Card Form</h1>
        <p className="main-subtitle">
          Interactive payment form with real-time 3D credit card preview, automatic Visa/Mastercard detection, and Luhn Algorithm validation.
        </p>
      </header>

      {/* Layout Utam 2 Kolom */}
      <main className="payment-layout">
        {/* Kolom Kiri: Form Input Kartu */}
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

        {/* Kolom Kanan: Visual Preview Kartu Interactive */}
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

          {/* Diagram Singkat Alur Data React State */}
          <div className="flow-info-card">
            <div className="flow-info-title">
              <span>💡</span> State & Data Flow Summary
            </div>
            <div>
              Data dimanipulasi melalui controlled input React <code>useState</code> di parent (<code>App</code>), kemudian dikirim melalui <code>props</code> ke komponen form dan card preview.
            </div>
            <div className="flow-diagram">
              User Input ➔ React State (App) ➔ PaymentForm & CardPreview
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Front End Development Task • React + Vanilla CSS</p>
      </footer>
    </div>
  );
}

export default App;
