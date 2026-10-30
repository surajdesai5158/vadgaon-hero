
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../../api';

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

    if (!formData.email.trim() || !formData.password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/auth/login', {
        email: formData.email.trim(),
        password: formData.password
      });

      const { token, user } = response.data;

      if (!token || !user || !user.role) {
        setError('Login failed: invalid login information received.');
        return;
      }

      // The backend must return an approved account.
      if (user.status !== 'approved') {
        setError(
          'Your account is not approved yet. Please contact the administrator.'
        );
        return;
      }

      if (!['admin', 'user'].includes(user.role)) {
        setError('Your account role is invalid. Please contact support.');
        return;
      }

      // Save the authenticated session.
      localStorage.setItem('vh_token', token);
      localStorage.setItem('vh_user', JSON.stringify(user));

      setSuccess('Login successful! Redirecting...');

      // Send each account to its correct protected dashboard.
      const destination =
        user.role === 'admin'
          ? '/admin/dashboard'
          : '/user/dashboard';

      navigate(destination, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px 16px;
          box-sizing: border-box;
          background: linear-gradient(135deg, #eaf2ff, #f7f9fc);
          font-family: Arial, sans-serif;
        }

        .login-card {
          width: 100%;
          max-width: 430px;
          padding: 32px;
          box-sizing: border-box;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .login-card h2 {
          margin: 0;
          color: #173b70;
          text-align: center;
          font-size: 28px;
        }

        .login-subtitle {
          margin: 10px 0 26px;
          color: #667085;
          text-align: center;
          line-height: 1.5;
        }

        .login-form-group {
          margin-bottom: 20px;
        }

        .login-form-group label {
          display: block;
          margin-bottom: 8px;
          color: #344054;
          font-weight: 600;
        }

        .login-form-group input {
          width: 100%;
          padding: 13px;
          box-sizing: border-box;
          border: 1px solid #d0d5dd;
          border-radius: 8px;
          outline: none;
          font-size: 15px;
        }

        .login-form-group input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        .login-password-wrapper {
          position: relative;
        }

        .login-password-wrapper input {
          padding-right: 75px;
        }

        .login-show-password {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          padding: 5px;
          border: none;
          background: transparent;
          color: #24549a;
          font-weight: 600;
          cursor: pointer;
        }

        .login-button {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 8px;
          background: #173b70;
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .login-button:hover {
          background: #24549a;
        }

        .login-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .login-error,
        .login-success {
          margin-bottom: 18px;
          padding: 12px;
          border-radius: 8px;
          font-size: 14px;
          line-height: 1.5;
        }

        .login-error {
          color: #b42318;
          background: #fef3f2;
        }

        .login-success {
          color: #067647;
          background: #ecfdf3;
        }

        .login-footer {
          margin: 22px 0 0;
          text-align: center;
          color: #475467;
          line-height: 1.7;
        }

        .login-footer a {
          color: #24549a;
          font-weight: 600;
          text-decoration: none;
        }

        .login-footer a:hover {
          text-decoration: underline;
        }

        .login-back-link {
          display: block;
          margin-top: 12px;
          text-align: center;
          color: #667085;
          text-decoration: none;
          font-size: 14px;
        }

        .login-back-link:hover {
          color: #173b70;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 24px 18px;
          }
        }
      `}</style>

      <div className="login-page">
        <div className="login-card">
          <h2>Welcome Back!</h2>

          <p className="login-subtitle">
            Login to your VADGAON HERO'S account
          </p>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="login-success" role="status">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="login-email">Email Address</label>

              <input
                id="login-email"
                type="email"
                name="email"
                placeholder="Enter your registered email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="login-password">Password</label>

              <div className="login-password-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="login-show-password"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="login-footer">
            Don't have an account?{' '}
            <Link to="/register">Register here</Link>
          </p>

          <Link to="/" className="login-back-link">
            ← Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}

export default Login;
