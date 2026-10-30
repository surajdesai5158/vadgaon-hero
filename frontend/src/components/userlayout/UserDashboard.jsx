
import React from 'react';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  let user = {};

  try {
    user = JSON.parse(localStorage.getItem('vh_user') || '{}');
  } catch {
    user = {};
  }

  const userName = user.name || 'Member';

  const cards = [
    {
      icon: '👤',
      title: 'My Profile',
      description: 'View your account information and membership details.',
      link: '/user/profile',
      button: 'View Profile',
      color: '#e8f1ff'
    },
    {
      icon: '✉️',
      title: 'Contact Support',
      description: 'Send a message if you need help with your account.',
      link: '/user/contact',
      button: 'Contact Us',
      color: '#e7f8ef'
    },
    {
      icon: '🛡️',
      title: 'Account Security',
      description: 'Keep your login details private and secure.',
      link: '/profile',
      button: 'My Account',
      color: '#fff2dc'
    }
  ];

  return (
    <>
      <style>{`
        .vh-dashboard {
          min-height: 70vh;
          padding: 35px 24px 55px;
          background: #f4f7fa;
          color: #17212b;
          font-family: Arial, sans-serif;
        }

        .vh-dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .vh-dashboard-welcome {
          position: relative;
          overflow: hidden;
          padding: 38px;
          border-radius: 18px;
          background: linear-gradient(120deg, #101820, #253b50);
          color: #ffffff;
          box-shadow: 0 8px 25px rgba(16, 24, 32, 0.12);
        }

        .vh-dashboard-welcome::after {
          content: '';
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          border: 35px solid rgba(255, 200, 87, 0.12);
          right: -45px;
          top: -90px;
          pointer-events: none;
        }

        .vh-dashboard-label {
          display: inline-block;
          padding: 7px 12px;
          margin-bottom: 15px;
          border-radius: 20px;
          background: rgba(255, 200, 87, 0.15);
          color: #ffc857;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .vh-dashboard-welcome h1 {
          margin: 0 0 13px;
          font-size: clamp(26px, 4vw, 38px);
          line-height: 1.2;
        }

        .vh-dashboard-welcome h1 span {
          color: #ffc857;
        }

        .vh-dashboard-welcome p {
          max-width: 620px;
          margin: 0;
          color: #d5dce2;
          font-size: 15px;
          line-height: 1.8;
        }

        .vh-dashboard-section {
          margin-top: 35px;
        }

        .vh-dashboard-section-heading {
          margin-bottom: 20px;
        }

        .vh-dashboard-section-heading h2 {
          margin: 0 0 8px;
          font-size: 23px;
          color: #17212b;
        }

        .vh-dashboard-section-heading p {
          margin: 0;
          color: #647180;
          font-size: 14px;
          line-height: 1.7;
        }

        .vh-dashboard-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .vh-dashboard-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 25px;
          border: 1px solid #e5eaf0;
          border-radius: 15px;
          background: #ffffff;
          box-shadow: 0 4px 15px rgba(16, 24, 32, 0.04);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .vh-dashboard-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(16, 24, 32, 0.09);
        }

        .vh-dashboard-card-icon {
          display: grid;
          place-items: center;
          width: 56px;
          height: 56px;
          margin-bottom: 18px;
          border-radius: 14px;
          font-size: 26px;
        }

        .vh-dashboard-card h3 {
          margin: 0 0 10px;
          font-size: 18px;
        }

        .vh-dashboard-card p {
          flex: 1;
          margin: 0 0 22px;
          color: #647180;
          font-size: 14px;
          line-height: 1.8;
        }

        .vh-dashboard-card a {
          display: inline-block;
          padding: 11px 16px;
          border-radius: 7px;
          background: #101820;
          color: #ffffff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          transition: background 0.2s ease;
        }

        .vh-dashboard-card a:hover {
          background: #34495e;
        }

        .vh-dashboard-help {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-top: 30px;
          padding: 24px 26px;
          border: 1px solid #f0d89c;
          border-radius: 13px;
          background: #fffaf0;
        }

        .vh-dashboard-help h3 {
          margin: 0 0 8px;
          font-size: 17px;
        }

        .vh-dashboard-help p {
          margin: 0;
          color: #647180;
          font-size: 14px;
          line-height: 1.7;
        }

        .vh-dashboard-help a {
          flex-shrink: 0;
          padding: 12px 17px;
          border-radius: 7px;
          background: #ffc857;
          color: #101820;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
        }

        @media (max-width: 850px) {
          .vh-dashboard-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .vh-dashboard-welcome {
            padding: 30px;
          }
        }

        @media (max-width: 560px) {
          .vh-dashboard {
            padding: 22px 15px 35px;
          }

          .vh-dashboard-welcome {
            padding: 26px 21px;
          }

          .vh-dashboard-grid {
            grid-template-columns: 1fr;
          }

          .vh-dashboard-card {
            padding: 22px;
          }

          .vh-dashboard-help {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>

      <div className="vh-dashboard">
        <div className="vh-dashboard-container">
          <section className="vh-dashboard-welcome">
            <span className="vh-dashboard-label">
              Member Dashboard
            </span>

            <h1>
              Welcome back, <span>{userName}!</span>
            </h1>

            <p>
              Welcome to VADGAON HERO'S. Manage your account,
              view your profile, and contact our team whenever
              you need assistance.
            </p>
          </section>

          <section className="vh-dashboard-section">
            <div className="vh-dashboard-section-heading">
              <h2>Your Quick Access</h2>
              <p>
                Choose an option below to manage your account.
              </p>
            </div>

            <div className="vh-dashboard-grid">
              {cards.map((card) => (
                <article className="vh-dashboard-card" key={card.title}>
                  <div
                    className="vh-dashboard-card-icon"
                    style={{ background: card.color }}
                  >
                    {card.icon}
                  </div>

                  <h3>{card.title}</h3>
                  <p>{card.description}</p>

                  <Link to={card.link}>
                    {card.button}
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="vh-dashboard-help">
            <div>
              <h3>Need assistance?</h3>
              <p>
                Send a message to the VADGAON HERO'S team
                through the contact page.
              </p>
            </div>

            <Link to="/contact">Get Help</Link>
          </section>
        </div>
      </div>
    </>
  );
}
