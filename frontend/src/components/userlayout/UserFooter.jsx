
import React from 'react';
import { Link } from 'react-router-dom';

export default function UserFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        .vh-user-footer {
          background: #101820;
          color: #e8edf2;
          font-family: Arial, sans-serif;
          margin-top: auto;
        }

        .vh-user-footer-main {
          max-width: 1250px;
          margin: 0 auto;
          padding: 42px 24px 30px;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 35px;
        }

        .vh-user-footer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
        }

        .vh-user-footer-logo {
          width: 48px;
          height: 48px;
          object-fit: contain;
          border-radius: 50%;
          background: #ffffff;
        }

        .vh-user-footer-brand h3 {
          margin: 0;
          color: #ffc857;
          font-size: 19px;
          letter-spacing: 1px;
        }

        .vh-user-footer-brand p {
          margin: 5px 0 0;
          color: #c3ccd4;
          font-size: 11px;
          letter-spacing: 1px;
        }

        .vh-user-footer-description {
          max-width: 370px;
          color: #c3ccd4;
          font-size: 14px;
          line-height: 1.8;
          margin: 0;
        }

        .vh-user-footer-column h4 {
          margin: 0 0 17px;
          color: #ffc857;
          font-size: 15px;
        }

        .vh-user-footer-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .vh-user-footer-links a {
          width: fit-content;
          color: #dce3e8;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s ease;
        }

        .vh-user-footer-links a:hover {
          color: #ffc857;
        }

        .vh-user-footer-contact p {
          margin: 0 0 12px;
          color: #dce3e8;
          font-size: 14px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .vh-user-footer-bottom {
          border-top: 1px solid #303b45;
          max-width: 1250px;
          margin: 0 auto;
          padding: 18px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          color: #c3ccd4;
          font-size: 12px;
        }

        .vh-user-footer-bottom p {
          margin: 0;
          line-height: 1.7;
        }

        .vh-user-footer-highlight {
          color: #ffc857;
          font-weight: 700;
        }

        @media (max-width: 800px) {
          .vh-user-footer-main {
            grid-template-columns: 1fr 1fr;
            gap: 30px;
          }

          .vh-user-footer-about {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 500px) {
          .vh-user-footer-main {
            grid-template-columns: 1fr;
            padding: 32px 20px 24px;
            gap: 27px;
          }

          .vh-user-footer-about {
            grid-column: auto;
          }

          .vh-user-footer-bottom {
            padding: 16px 20px;
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>

      <footer className="vh-user-footer">
        <div className="vh-user-footer-main">
          <section className="vh-user-footer-about">
            <div className="vh-user-footer-brand">
              <img
                className="vh-user-footer-logo"
                src="https://res.cloudinary.com/dc7py007/image/upload/v1793369674/VadgaonLogo.jpg"
                alt="Vadgaon Hero's logo"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />

              <div>
                <h3>VADGAON HERO'S</h3>
                <p>YOUR MEMBER PORTAL</p>
              </div>
            </div>

            <p className="vh-user-footer-description">
              Welcome to the VADGAON HERO'S member portal.
              Access your dashboard, manage your profile, and
              stay connected with our community.
            </p>
          </section>

          <section className="vh-user-footer-column">
            <h4>Quick Links</h4>

            <div className="vh-user-footer-links">
              <Link to="/user/dashboard">Dashboard</Link>
              <Link to="/user/profile">My Profile</Link>
              <Link to="/user/contact">Contact Us</Link>
            </div>
          </section>

          <section className="vh-user-footer-column vh-user-footer-contact">
            <h4>Member Support</h4>

            <p>
              Need help with your account? Visit our Contact Us
              page to send a message to the team.
            </p>

            <div className="vh-user-footer-links">
              <Link to="/user/contact">Get Support</Link>
            </div>
          </section>
        </div>

        <div className="vh-user-footer-bottom">
          <p>
            © {currentYear} <span className="vh-user-footer-highlight">
              VADGAON HERO'S
            </span>. All rights reserved.
          </p>

          <p>Designed for our community.</p>
        </div>
      </footer>
    </>
  );
}
