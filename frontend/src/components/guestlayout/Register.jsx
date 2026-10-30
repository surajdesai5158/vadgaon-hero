
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../../api';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
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
      !formData.phone.trim() ||
      !formData.age ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('Please fill in all fields.');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }

    if (Number(formData.age) < 1 || Number(formData.age) > 120) {
      setError('Age must be between 1 and 120.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/register', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        age: Number(formData.age),
        password: formData.password
      });

      setSuccess(
        response.data.message ||
        'Registration successful! Your account is awaiting approval.'
      );

      setFormData({
        name: '',
        email: '',
        phone: '',
        age: '',
        password: '',
        confirmPassword: ''
      });

      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px 16px;
          box-sizing: border-box;
          background: linear-gradient(135deg, #eaf2ff, #f7f9fc);
          font-family: Arial, sans-serif;
        }

        .register-card {
          width: 100%;
          max-width: 460px;
          padding: 30px;
          box-sizing: border-box;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .register-card h2 {
          margin: 0;
          color: #173b70;
          text-align: center;
        }

        .register-subtitle {
          margin: 8px 0 24px;
          text-align: center;
          color: #667085;
        }

        .register-form-group {
          margin-bottom: 16px;
        }

        .register-form-group label {
          display: block;
          margin-bottom: 7px;
          font-weight: 600;
          color: #344054;
        }

        .register-form-group input {
          width: 100%;
          padding: 12px;
          box-sizing: border-box;
          border: 1px solid #d0d5dd;
          border-radius: 8px;
          font-size: 15px;
          outline: none;
        }

        .register-form-group input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .register-button {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 8px;
          background: #173b70;
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
        }

        .register-button:hover {
          background: #24549a;
        }

        .register-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .register-error,
        .register-success {
          padding: 12px;
          margin-bottom: 16px;
          border-radius: 8px;
          font-size: 14px;
        }

        .register-error {
          color: #b42318;
          background: #fef3f2;
        }

        .register-success {
          color: #067647;
          background: #ecfdf3;
        }

        .register-footer {
          margin: 20px 0 0;
          text-align: center;
          color: #475467;
        }

        .register-footer a {
          color: #24549a;
          font-weight: 600;
          text-decoration: none;
        }

        .register-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .register-card {
            padding: 22px 18px;
          }
        }
      `}</style>

      <div className="register-page">
        <div className="register-card">
          <h2>Create Your Account</h2>

          <p className="register-subtitle">
            Join VADGAON HERO'S
          </p>

          {error && (
            <div className="register-error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="register-success" role="status">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="register-form-group">
              <label htmlFor="register-name">Full Name</label>
              <input
                id="register-name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="register-email">Email Address</label>
              <input
                id="register-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="register-phone">Mobile Number</label>
              <input
                id="register-phone"
                type="tel"
                name="phone"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel"
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="register-age">Age</label>
              <input
                id="register-age"
                type="number"
                name="age"
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleChange}
                min="1"
                max="120"
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                name="password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="register-confirm-password">
                Confirm Password
              </label>
              <input
                id="register-confirm-password"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p className="register-footer">
            Already have an account?{' '}
            <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;
