
import React from 'react';
import { Link } from 'react-router-dom';

export default function UserProfile() {
  let user = {};

  try {
    user = JSON.parse(localStorage.getItem('vh_user') || '{}');
  } catch {
    user = {};
  }

  const initials = (user.name || 'Member')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  const profileFields = [
    { label: 'Full Name', value: user.name || 'Not available' },
    { label: 'Email Address', value: user.email || 'Not available' },
    { label: 'Phone Number', value: user.phone || 'Not available' },
    { label: 'Account Role', value: user.role || 'user' },
    { label: 'Account Status', value: user.status || 'Not available' }
  ];

  const statusClass =
    user.status === 'approved'
      ? 'vh-profile-status-approved'
      : user.status === 'rejected'
        ? 'vh-profile-status-rejected'
        : 'vh-profile-status-pending';

  return (
    <>
      <style>{`
        .vh-profile-page {
          min-height: 70vh;
          padding: 38px 20px 55px;
          background: #f4f7fa;
          color: #17212b;
          font-family: Arial, sans-serif;
        }

        .vh-profile-container {
          max-width: 950px;
          margin: 0 auto;
        }

        .vh-profile-heading {
          margin-bottom: 25px;
        }

        .vh-profile-heading h1 {
          margin: 0 0 9px;
          font-size: 30px;
        }

        .vh-profile-heading p {
          margin: 0;
          color: #647180;
          line-height: 1.7;
          font-size: 14px;
        }

        .vh-profile-card {
          overflow: hidden;
          border: 1px solid #e3e9ef;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 7px 25px rgba(16, 24, 32, 0.06);
        }

        .vh-profile-banner {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 30px;
          background: #101820;
          color: #ffffff;
        }

        .vh-profile-avatar {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 76px;
          height: 76px;
          border: 3px solid #ffc857;
          border-radius: 50%;
          background: #253b50;
          color: #ffc857;
          font-size: 27px;
          font-weight: 700;
        }

        .vh-profile-banner h2 {
          margin: 0 0 8px;
          font-size: 23px;
          overflow-wrap: anywhere;
        }

        .vh-profile-banner p {
          margin: 0;
          color: #d5dce2;
          font-size: 14px;
          overflow-wrap: anywhere;
        }

        .vh-profile-details {
          padding: 28px 30px;
        }

        .vh-profile-details h3 {
          margin: 0 0 20px;
          font-size: 18px;
        }

        .vh-profile-fields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .vh-profile-field {
          min-width: 0;
          padding: 16px;
          border: 1px solid #e8edf2;
          border-radius: 10px;
          background: #f9fbfd;
        }

        .vh-profile-field-label {
          display: block;
          margin-bottom: 9px;
          color: #647180;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .vh-profile-field-value {
          display: block;
          color: #17212b;
          font-size: 15px;
          font-weight: 600;
          overflow-wrap: anywhere;
          text-transform: capitalize;
        }

        .vh-profile-status-approved,
        .vh-profile-status-pending,
        .vh-profile-status-rejected {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        .vh-profile-status-approved {
          background: #dcfce7;
          color: #166534;
        }

        .vh-profile-status-pending {
          background: #fff2cc;
          color: #8a5b00;
        }

        .vh-profile-status-rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .vh-profile-note {
          margin-top: 22px;
          padding: 15px;
          border-radius: 9px;
          background: #fff8e8;
          color: #75520c;
          font-size: 13px;
          line-height: 1.7;
        }

        .vh-profile-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 25px;
        }

        .vh-profile-button {
          display: inline-block;
          padding: 12px 18px;
          border: none;
          border-radius: 7px;
          background: #101820;
          color: #ffffff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
        }

        .vh-profile-button:hover {
          background: #34495e;
        }

        .vh-profile-button-secondary {
          background: #ffc857;
          color: #101820;
        }

        .vh-profile-button-secondary:hover {
          background: #ffda85;
        }

        @media (max-width: 600px) {
          .vh-profile-page {
            padding: 25px 14px 38px;
          }

          .vh-profile-heading h1 {
            font-size: 25px;
          }

          .vh-profile-banner {
            padding: 22px 18px;
            gap: 14px;
          }

          .vh-profile-avatar {
            width: 58px;
            height: 58px;
            font-size: 22px;
          }

          .vh-profile-banner h2 {
            font-size: 19px;
          }

          .vh-profile-details {
            padding: 23px 18px;
          }

          .vh-profile-fields {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .vh-profile-actions {
            flex-direction: column;
          }

          .vh-profile-button {
            text-align: center;
          }
        }
      `}</style>

      <div className="vh-profile-page">
        <div className="vh-profile-container">
          <div className="vh-profile-heading">
            <h1>My Profile</h1>
            <p>
              View your account information and membership status.
            </p>
          </div>

          <section className="vh-profile-card">
            <div className="vh-profile-banner">
              <div className="vh-profile-avatar">
                {initials || 'M'}
              </div>

              <div>
                <h2>{user.name || 'Member'}</h2>
                <p>{user.email || 'Email not available'}</p>
              </div>
            </div>

            <div className="vh-profile-details">
              <h3>Account Information</h3>

              <div className="vh-profile-fields">
                {profileFields.map((field) => (
                  <div className="vh-profile-field" key={field.label}>
                    <span className="vh-profile-field-label">
                      {field.label}
                    </span>

                    <span className="vh-profile-field-value">
                      {field.label === 'Account Status' ? (
                        <span className={statusClass}>
                          {field.value}
                        </span>
                      ) : (
                        field.value
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {user.status === 'pending' && (
                <div className="vh-profile-note">
                  Your account is waiting for administrator approval.
                  Some member features may not be available yet.
                </div>
              )}

              {user.status === 'rejected' && (
                <div className="vh-profile-note">
                  Your account registration was rejected. Please contact
                  the administrator for assistance.
                </div>
              )}

              <div className="vh-profile-actions">
                <Link
                  to="/user/dashboard"
                  className="vh-profile-button"
                >
                  Back to Dashboard
                </Link>

                <Link
                  to="/user/contact"
                  className="vh-profile-button vh-profile-button-secondary"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
