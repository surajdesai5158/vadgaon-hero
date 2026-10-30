
import React from 'react';
import { Link } from 'react-router-dom';

function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        .admin-footer {
          width: 100%;
          margin-top: auto;
          background: #102746;
          color: #ffffff;
          font-family: Arial, sans-serif;
        }

        .admin-footer-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 28px 30px 18px;
          box-sizing: border-box;
        }

        .admin-footer-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 30px;
          padding-bottom: 24px;
        }

        .admin-footer-brand {
          max-width: 360px;
        }

        .admin-footer-brand h3 {
          margin: 0 0 10px;
          color: #ffffff;
          font-size: 20px;
          letter-spacing: 0.5px;
        }

        .admin-footer-brand p {
          margin: 0;
          color: #c3d0e0;
          font-size: 14px;
          line-height: 1.8;
        }

        .admin-footer-links h4 {
          margin: 0 0 13px;
          color: #ffffff;
          font-size: 15px;
        }

        .admin-footer-links ul {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .admin-footer-links a {
          color: #c3d0e0;
          font-size: 14px;
          text-decoration: none;
          transition: color 0.2s;
        }

        .admin-footer-links a:hover {
          color: #ffffff;
          text-decoration: underline;
        }

        .admin-footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          padding-top: 18px;
          border-top: 1px solid #344d6a;
        }

        .admin-footer-bottom p {
          margin: 0;
          color: #c3d0e0;
          font-size: 13px;
          line-height: 1.6;
        }

        .admin-footer-badge {
          display: inline-block;
          padding: 6px 11px;
          border: 1px solid #4b6584;
          border-radius: 20px;
          color: #dbeafe;
          font-size: 12px;
        }

        @media (max-width: 600px) {
          .admin-footer-container {
            padding: 24px 18px 16px;
          }

          .admin-footer-main {
            flex-direction: column;
            gap: 24px;
          }

          .admin-footer-bottom {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>

      <footer className="admin-footer">
        <div className="admin-footer-container">

          <div className="admin-footer-main">
            <div className="admin-footer-brand">
              <h3>VADGAON HERO'S</h3>

              <p>
                Admin Control Panel
                <br />
                Manage your platform, review user accounts,
                and monitor contact messages from one place.
              </p>
            </div>

            <div className="admin-footer-links">
              <h4>Admin Navigation</h4>

              <ul>
                <li>
                  <Link to="/admin/dashboard">
                    Dashboard
                  </Link>
                </li>

                <li>
                  <Link to="/admin/users">
                    Manage Users
                  </Link>
                </li>

                <li>
                  <Link to="/admin/contacts">
                    Contact Messages
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="admin-footer-bottom">
            <p>
              © {currentYear} VADGAON HERO'S. All rights reserved.
            </p>

            <span className="admin-footer-badge">
              Admin Panel
            </span>
          </div>

        </div>
      </footer>
    </>
  );
}

export default AdminFooter;
