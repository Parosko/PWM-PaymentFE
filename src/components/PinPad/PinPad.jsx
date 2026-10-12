import React from 'react';
import './PinPad.css';

// Clean SVG Icons for ATM Keypad
const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const BackspaceIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
    <line x1="18" y1="9" x2="12" y2="15" />
    <line x1="12" y1="9" x2="18" y2="15" />
  </svg>
);

const EnterCheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const PinPad = ({ onKeyPress, onDelete, onSubmit, onCancel, disabled, pinLength }) => {
  const numpadLayout = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];

  return (
    <div className="atm-pinpad-unit">
      {/* 3x4 Keypad Matrix + ATM Functional Action Keys */}
      <div className="atm-keypad-frame">
        {/* Number keys */}
        <div className="atm-numeric-grid">
          {numpadLayout.map((row, rowIdx) => (
            <div key={rowIdx} className="atm-numpad-row">
              {row.map((num) => (
                <button
                  key={num}
                  type="button"
                  className="atm-key-btn num-key"
                  disabled={disabled}
                  onClick={() => onKeyPress(num.toString())}
                >
                  <span className="key-cap">{num}</span>
                  {num === 5 && <span className="braille-dot" title="Tactile indicator"></span>}
                </button>
              ))}
            </div>
          ))}

          {/* Bottom row: Blank, 0, Blank */}
          <div className="atm-numpad-row">
            <button type="button" className="atm-key-btn blank-key" disabled></button>
            <button
              type="button"
              className="atm-key-btn num-key"
              disabled={disabled}
              onClick={() => onKeyPress('0')}
            >
              <span className="key-cap">0</span>
            </button>
            <button type="button" className="atm-key-btn blank-key" disabled></button>
          </div>
        </div>

        {/* Vertical Function Keys Bar (CANCEL, CLEAR, ENTER) as seen on real ATMs */}
        <div className="atm-function-keys">
          {/* Cancel button (Red) */}
          <button
            type="button"
            className="atm-func-btn func-cancel"
            disabled={disabled}
            onClick={onCancel}
            title="Batal / Cancel"
          >
            <span className="func-indicator">
              <CloseIcon />
            </span>
            <span className="func-text">BATAL</span>
          </button>

          {/* Clear / Correction button (Yellow) */}
          <button
            type="button"
            className="atm-func-btn func-clear"
            disabled={disabled || pinLength === 0}
            onClick={onDelete}
            title="Koreksi / Clear"
          >
            <span className="func-indicator">
              <BackspaceIcon />
            </span>
            <span className="func-text">KOREKSI</span>
          </button>

          {/* Enter button (Green) */}
          <button
            type="button"
            className="atm-func-btn func-enter"
            disabled={disabled || pinLength < 4}
            onClick={onSubmit}
            title="Enter / Benar"
          >
            <span className="func-indicator">
              <EnterCheckIcon />
            </span>
            <span className="func-text">BENAR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
