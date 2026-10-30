
import React, { useState } from 'react';
import api, { getErrorMessage } from '../../api.js';

export default function UserContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem('vh_user') || '{}');
  } catch {
    user = {};
  }

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess('');
    setError('');

    if (!formData.name.trim() || !formData.email.trim() ||
        !formData.message.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);

      await api.post('/contact', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim()
      });

      setSuccess('Your message has been sent successfully.');

      setFormData({
        name: user.name || '',
        email: user.email || '',
        message: ''
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .vh-user-contact-page {
          min-height: 70vh;
          padding: 40px 20px 55px;
          background: #f4f7fa;
          color: #17212b;
          font-family: Arial, sans-serif;
        }

        .vh-user-contact-container {
          max-width: 1050px;
          margin: 0 auto;
        }

        .vh-user-contact-heading {
          text-align: center;
          margin-bottom: 30px;
        }

        .vh-user-contact-heading h1 {
          margin: 0 0 12px;
          font-size: 32px;
        }

        .vh-user-contact-heading p {
          margin: 0;
          color: #647180;
          font-size: 14px;
          line-height: 1.8;
        }

        .vh-user-contact-grid {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 25px;
          align-items: start;
        }

        .vh-user-contact-info {
          padding: 30px;
          border-radius: 15px;
          background: #101820;
          color: #ffffff;
        }

        .vh-user-contact-info h2 {
          margin: 0 0 15px;
          color: #ffc857;
          font-size: 23px;
        }

        .vh-user-contact-info > p {
          margin: 0 0 25px;
          color: #d5dce2;
          font-size: 14px;
          line-height: 1.9;
        }

        .vh-user-contact-info-item {
          padding: 16px 0;
          border-top: 1px solid #34404a;
        }

        .vh-user-contact-info-item strong {
          display: block;
          margin-bottom: 7px;
          color: #ffc857;
          font-size: 14px;
        }

        .vh-user-contact-info-item span {
          color: #d5dce2;
          font-size: 13px;
          line-height: 1.7;
        }

        .vh-user-contact-form-card {
          padding: 30px;
          border: 1px solid #e5eaf0;
          border-radius: 15px;
          background: #ffffff;
          box-shadow: 0 5px 20px rgba(16, 24, 32, 0.05);
        }

        .vh-user-contact-form-card h2 {
          margin: 0 0 22px;
          font-size: 22px;
        }

        .vh-user-contact-field {
          margin-bottom: 18px;
        }

        .vh-user-contact-field label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 700;
        }

        .vh-user-contact-field input,
        .vh-user-contact-field textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 13px 14px;
          border: 1px solid #d6dee6;
          border-radius: 8px;
          outline: none;
          color: #17212b;
          background: #ffffff;
          font-family: inherit;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .vh-user-contact-field input:focus,
        .vh-user-contact-field textarea:focus {
          border-color: #c18a16;
          box-shadow: 0 0 0 3px rgba(255, 200, 87, 0.2);
        }

        .vh-user-contact-field textarea {
          min-height: 140px;
          resize: vertical;
        }

        .vh-user-contact-submit {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 8px;
          background: #ffc857;
          color: #101820;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .vh-user-contact-submit:hover {
          background: #ffda85;
        }

        .vh-user-contact-submit:disabled {
          cursor: not-allowed;
          opacity: 0.65;
        }

        .vh-user-contact-alert {
          margin-bottom: 18px;
          padding: 12px 14px;
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.6;
        }

        .vh-user-contact-success {
          background: #dcfce7;
          color: #166534;
        }

        .vh-user-contact-error {
          background: #fee2e2;
          color: #991b1b;
        }

        @media (max-width: 750px) {
          .vh-user-contact-grid {
            grid-template-columns: 1fr;
          }

          .vh-user-contact-info,
          .vh-user-contact-form-card {
            padding: 23px;
          }

          .vh-user-contact-heading h1 {
            font-size: 27px;
          }
        }

        @media (max-width: 450px) {
          .vh-user-contact-page {
            padding: 27px 14px 38px;
          }
        }
      `}</style>

      <div className="vh-user-contact-page">
        <div className="vh-user-contact-container">
          <div className="vh-user-contact-heading">
            <h1>Contact Us</h1>
            <p>
              Have a question or need assistance? Send a message
              to the VADGAON HERO'S team.
            </p>
          </div>

          <div className="vh-user-contact-grid">
            <section className="vh-user-contact-info">
              <h2>We're Here to Help</h2>

              <p>
                Use the form to send your question or feedback.
                Our team can review your message through the
                administration panel.
              </p>

              <div className="vh-user-contact-info-item">
                <strong>Member Support</strong>
                <span>Help with your account and membership.</span>
              </div>

              <div className="vh-user-contact-info-item">
                <strong>Questions and Feedback</strong>
                <span>Share your questions, suggestions, or concerns.</span>
              </div>

              <div className="vh-user-contact-info-item">
                <strong>Message Status</strong>
                <span>
                  Your submitted message will be available to
                  administrators in the contact messages section.
                </span>
              </div>
            </section>

            <section className="vh-user-contact-form-card">
              <h2>Send a Message</h2>

              {success && (
                <div className="vh-user-contact-alert vh-user-contact-success"
                  role="status">
                  {success}
                </div>
              )}

              {error && (
                <div className="vh-user-contact-alert vh-user-contact-error"
                  role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="vh-user-contact-field">
                  <label htmlFor="user-contact-name">Full Name</label>
                  <input
                    id="user-contact-name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="vh-user-contact-field">
                  <label htmlFor="user-contact-email">Email Address</label>
                  <input
                    id="user-contact-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={254}
                    required
                  />
                </div>

                <div className="vh-user-contact-field">
                  <label htmlFor="user-contact-message">Your Message</label>
                  <textarea
                    id="user-contact-message"
                    name="message"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    maxLength={3000}
                    required
                  />
                </div>

                <button
                  className="vh-user-contact-submit"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
