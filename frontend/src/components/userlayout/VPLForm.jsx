
import React, { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../../api';

function VPLForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    position: '',
    paymentMethod: ''
  });

  const [qrCode, setQrCode] = useState('');
  const [loadingQR, setLoadingQR] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;

    const loadQRCode = async () => {
      try {
        const response = await api.get('/vpl/payment-qr');

        if (active) {
          setQrCode(response.data.qrCode || '');
        }
      } catch {
        if (active) {
          setQrCode('');
        }
      } finally {
        if (active) {
          setLoadingQR(false);
        }
      }
    };

    loadQRCode();

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const age = Number(formData.age);

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Please enter your name and email.');
      return;
    }

    if (!Number.isInteger(age) || age < 10 || age > 100) {
      setError('Please enter a valid age between 10 and 100.');
      return;
    }

    if (!formData.position || !formData.paymentMethod) {
      setError('Please select your playing position and payment method.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post('/vpl/register', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        age,
        position: formData.position,
        paymentMethod: formData.paymentMethod
      });

      setSuccess(
        response.data.message || 'Your VPL registration was submitted successfully!'
      );

      setFormData({
        name: '',
        email: '',
        age: '',
        position: '',
        paymentMethod: ''
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="vpl-page">
      <style>{`
        .vpl-page {
          min-height: 85vh;
          padding: 35px 18px 55px;
          box-sizing: border-box;
          background: linear-gradient(135deg, #eff6ff, #f8fafc, #ecfdf5);
          font-family: Arial, sans-serif;
          color: #172033;
        }

        .vpl-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .vpl-hero {
          padding: 32px 20px;
          border-radius: 18px;
          background: linear-gradient(120deg, #102746, #1d4ed8);
          color: white;
          text-align: center;
          box-shadow: 0 10px 25px rgba(16, 39, 70, 0.18);
        }

        .vpl-hero .vpl-icon {
          font-size: 45px;
        }

        .vpl-hero h1 {
          margin: 10px 0;
          font-size: clamp(27px, 5vw, 40px);
        }

        .vpl-hero p {
          margin: 8px 0 0;
          line-height: 1.6;
          color: #dbeafe;
        }

        .vpl-card {
          margin-top: 25px;
          padding: 28px;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          background: white;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.07);
        }

        .vpl-card h2 {
          margin: 0 0 8px;
          color: #173b70;
          font-size: 24px;
        }

        .vpl-description {
          margin: 0 0 24px;
          color: #64748b;
          line-height: 1.6;
        }

        .vpl-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .vpl-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .vpl-field.full-width {
          grid-column: 1 / -1;
        }

        .vpl-field label {
          font-size: 14px;
          font-weight: 700;
          color: #334155;
        }

        .vpl-field input,
        .vpl-field select {
          width: 100%;
          min-height: 46px;
          box-sizing: border-box;
          padding: 11px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: #fff;
          color: #172033;
          font-size: 15px;
          outline: none;
        }

        .vpl-field input:focus,
        .vpl-field select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .vpl-position-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .vpl-position-option {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 54px;
          padding: 12px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }

        .vpl-position-option.selected {
          border-color: #2563eb;
          background: #eff6ff;
        }

        .vpl-position-option input {
          width: 17px;
          height: 17px;
          accent-color: #1d4ed8;
        }

        .vpl-position-emoji {
          font-size: 24px;
        }

        .vpl-position-label {
          font-size: 14px;
          font-weight: 600;
        }

        .vpl-payment-options {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .vpl-payment-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          cursor: pointer;
        }

        .vpl-payment-option.selected {
          border-color: #15803d;
          background: #f0fdf4;
        }

        .vpl-payment-option input {
          accent-color: #15803d;
        }

        .vpl-payment-option span {
          font-size: 14px;
          font-weight: 700;
        }

        .vpl-qr-section {
          margin-top: 20px;
          padding: 20px;
          border: 1px dashed #94a3b8;
          border-radius: 12px;
          background: #f8fafc;
          text-align: center;
        }

        .vpl-qr-section h3 {
          margin-top: 0;
          color: #173b70;
        }

        .vpl-qr-image {
          display: block;
          width: 220px;
          max-width: 100%;
          max-height: 280px;
          object-fit: contain;
          margin: 15px auto;
          padding: 8px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
        }

        .vpl-qr-note {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.6;
        }

        .vpl-alert {
          margin-bottom: 18px;
          padding: 13px 15px;
          border-radius: 8px;
          line-height: 1.5;
        }

        .vpl-alert.error {
          border: 1px solid #fecaca;
          background: #fef2f2;
          color: #b91c1c;
        }

        .vpl-alert.success {
          border: 1px solid #bbf7d0;
          background: #f0fdf4;
          color: #166534;
        }

        .vpl-submit-button {
          width: 100%;
          margin-top: 24px;
          padding: 15px;
          border: none;
          border-radius: 9px;
          background: #173b70;
          color: white;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .vpl-submit-button:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .vpl-submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .vpl-security-note {
          margin: 18px 0 0;
          text-align: center;
          color: #64748b;
          font-size: 13px;
          line-height: 1.6;
        }

        @media (max-width: 600px) {
          .vpl-page {
            padding: 20px 12px 35px;
          }

          .vpl-card {
            padding: 20px 15px;
          }

          .vpl-form-grid,
          .vpl-position-grid,
          .vpl-payment-options {
            grid-template-columns: 1fr;
          }

          .vpl-field.full-width {
            grid-column: auto;
          }
        }
      `}</style>

      <div className="vpl-container">
        <header className="vpl-hero">
          <div className="vpl-icon">🏏</div>
          <h1>VPL PLAYER REGISTRATION</h1>
          <p>VADGAON HERO'S — Vadgaon Premier League</p>
          <p>Register now and be part of our village cricket tournament!</p>
        </header>

        <section className="vpl-card">
          <h2>Player Registration Form</h2>
          <p className="vpl-description">
            Enter your details carefully to register for the tournament.
          </p>

          {error && (
            <div className="vpl-alert error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="vpl-alert success" role="status">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="vpl-form-grid">
              <div className="vpl-field">
                <label htmlFor="vpl-name">Full Name *</label>
                <input
                  id="vpl-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  maxLength={100}
                  required
                />
              </div>

              <div className="vpl-field">
                <label htmlFor="vpl-email">Email Address *</label>
                <input
                  id="vpl-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  maxLength={254}
                  required
                />
              </div>

              <div className="vpl-field">
                <label htmlFor="vpl-age">Age *</label>
                <input
                  id="vpl-age"
                  name="age"
                  type="number"
                  min="10"
                  max="100"
                  step="1"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  required
                />
              </div>

              <div className="vpl-field">
                <label>Playing Position *</label>
                <div className="vpl-position-grid">
                  {[
                    { value: 'Batsman', icon: '🏏', label: 'Batsman' },
                    { value: 'Bowler', icon: '🎯', label: 'Bowler' },
                    {
                      value: 'Wicket Keeper',
                      icon: '🧤',
                      label: 'Wicket Keeper'
                    },
                    {
                      value: 'All-Rounder',
                      icon: '⭐',
                      label: 'All-Rounder'
                    }
                  ].map((position) => (
                    <label
                      key={position.value}
                      className={
                        'vpl-position-option' +
                        (formData.position === position.value
                          ? ' selected'
                          : '')
                      }
                    >
                      <input
                        type="radio"
                        name="position"
                        value={position.value}
                        checked={formData.position === position.value}
                        onChange={handleChange}
                        required
                      />
                      <span className="vpl-position-emoji">
                        {position.icon}
                      </span>
                      <span className="vpl-position-label">
                        {position.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="vpl-field full-width">
                <label>Payment Method *</label>
                <div className="vpl-payment-options">
                  <label
                    className={
                      'vpl-payment-option' +
                      (formData.paymentMethod === 'Cash' ? ' selected' : '')
                    }
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash"
                      checked={formData.paymentMethod === 'Cash'}
                      onChange={handleChange}
                      required
                    />
                    <span>💵 Cash Payment</span>
                  </label>

                  <label
                    className={
                      'vpl-payment-option' +
                      (formData.paymentMethod === 'Online' ? ' selected' : '')
                    }
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online"
                      checked={formData.paymentMethod === 'Online'}
                      onChange={handleChange}
                      required
                    />
                    <span>📱 Online Payment</span>
                  </label>
                </div>
              </div>
            </div>

            {formData.paymentMethod === 'Cash' && (
              <div className="vpl-qr-section">
                <h3>💵 Cash Payment</h3>
                <p className="vpl-qr-note">
                  Please give your registration payment to the authorised
                  VPL tournament organiser. Keep your payment confirmation.
                </p>
              </div>
            )}

            {formData.paymentMethod === 'Online' && (
              <div className="vpl-qr-section">
                <h3>📱 Scan to Pay Online</h3>

                {loadingQR ? (
                  <p>Loading payment QR code...</p>
                ) : qrCode ? (
                  <>
                    <img
                      className="vpl-qr-image"
                      src={
                        qrCode.startsWith('http://') ||
                        qrCode.startsWith('https://')
                          ? qrCode
                          : `http://localhost:7000${qrCode.startsWith('/') ? '' : '/'}${qrCode}`
                      }
                      alt="VPL online payment QR code"
                    />
                    <p className="vpl-qr-note">
                      Scan this QR code using your payment app. Verify the
                      recipient and amount before paying.
                    </p>
                  </>
                ) : (
                  <p className="vpl-qr-note">
                    The payment QR code has not been added by the admin yet.
                    Please contact the tournament organiser.
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="vpl-submit-button"
              disabled={submitting}
            >
              {submitting ? 'Submitting Registration...' : 'Submit VPL Form'}
            </button>

            <p className="vpl-security-note">
              Your registration will be saved for tournament administration.
              Online payment selection does not itself verify payment.
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}

export default VPLForm;
