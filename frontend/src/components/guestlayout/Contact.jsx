
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../../api';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/contact', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim()
      });

      setSuccess(
        response.data.message ||
        'Your message has been sent successfully!'
      );

      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .contact-page {
          min-height: 100vh;
          padding: 50px 18px;
          box-sizing: border-box;
          background: linear-gradient(135deg, #eaf2ff, #f7f9fc);
          font-family: Arial, sans-serif;
        }

        .contact-container {
          max-width: 1050px;
          margin: 0 auto;
        }

        .contact-heading {
          margin-bottom: 35px;
          text-align: center;
        }

        .contact-heading h1 {
          margin: 0 0 12px;
          color: #173b70;
          font-size: 36px;
        }

        .contact-heading p {
          margin: 0;
          color: #667085;
          font-size: 16px;
          line-height: 1.7;
        }

        .contact-content {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 28px;
          align-items: stretch;
        }

        .contact-info,
        .contact-form-card {
          padding: 30px;
          box-sizing: border-box;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.09);
        }

        .contact-info h2,
        .contact-form-card h2 {
          margin: 0 0 20px;
          color: #173b70;
        }

        .contact-info p {
          color: #667085;
          line-height: 1.7;
        }

        .contact-detail {
          margin-top: 24px;
          padding: 15px;
          background: #f7f9fc;
          border-radius: 10px;
        }

        .contact-detail strong {
          display: block;
          margin-bottom: 6px;
          color: #173b70;
        }

        .contact-detail span {
          color: #667085;
          overflow-wrap: anywhere;
        }

        .contact-form-group {
          margin-bottom: 20px;
        }

        .contact-form-group label {
          display: block;
          margin-bottom: 8px;
          color: #344054;
          font-weight: 600;
        }

        .contact-form-group input,
        .contact-form-group textarea {
          width: 100%;
          padding: 13px;
          box-sizing: border-box;
          border: 1px solid #d0d5dd;
          border-radius: 8px;
          font-family: inherit;
          font-size: 15px;
          outline: none;
        }

        .contact-form-group input:focus,
        .contact-form-group textarea:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .contact-form-group textarea {
          min-height: 140px;
          resize: vertical;
        }

        .contact-submit {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 8px;
          background: #173b70;
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        .contact-submit:hover {
          background: #24549a;
        }

        .contact-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .contact-error,
        .contact-success {
          margin-bottom: 18px;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          line-height: 1.5;
        }

        .contact-error {
          color: #b42318;
          background: #fef3f2;
        }

        .contact-success {
          color: #067647;
          background: #ecfdf3;
        }

        .contact-back {
          display: block;
          margin-top: 28px;
          text-align: center;
          color: #24549a;
          font-weight: 600;
          text-decoration: none;
        }

        .contact-back:hover {
          text-decoration: underline;
        }

        @media (max-width: 700px) {
          .contact-content {
            grid-template-columns: 1fr;
          }

          .contact-heading h1 {
            font-size: 29px;
          }

          .contact-info,
          .contact-form-card {
            padding: 22px;
          }
        }
      `}</style>

      <main className="contact-page">
        <div className="contact-container">
          <div className="contact-heading">
            <h1>Contact Us</h1>
            <p>
              Have a question or suggestion?
              <br />
              Send a message to the VADGAON HERO'S team.
            </p>
          </div>

          <div className="contact-content">
            <section className="contact-info">
              <h2>Get in Touch</h2>

              <p>
                We welcome your questions, feedback, and suggestions.
                Complete the contact form and our team can review your message.
              </p>

              <div className="contact-detail">
                <strong>Organization</strong>
                <span>VADGAON HERO'S</span>
              </div>

              <div className="contact-detail">
                <strong>Contact</strong>
                <span>Use the message form on this page.</span>
              </div>

              <div className="contact-detail">
                <strong>Response</strong>
                <span>We will review your submitted message.</span>
              </div>
            </section>

            <section className="contact-form-card">
              <h2>Send a Message</h2>

              {error && (
                <div className="contact-error" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="contact-success" role="status">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="contact-form-group">
                  <label htmlFor="contact-name">Full Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="contact-email">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="contact-message">Your Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    maxLength={2000}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="contact-submit"
                  disabled={loading}
                >
                  {loading ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            </section>
          </div>

          <Link to="/" className="contact-back">
            ← Back to Home
          </Link>
        </div>
      </main>
    </>
  );
}

export default Contact;
