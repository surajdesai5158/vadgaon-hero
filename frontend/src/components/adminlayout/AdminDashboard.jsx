
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: 'Total Users',
      value: '—',
      description: 'Registered accounts',
      icon: '👥',
      color: '#2563eb',
      link: '/admin/users'
    },
    {
      title: 'Pending Approvals',
      value: '—',
      description: 'Awaiting review',
      icon: '⏳',
      color: '#d97706',
      link: '/admin/users'
    },
    {
      title: 'Approved Users',
      value: '—',
      description: 'Active accounts',
      icon: '✅',
      color: '#059669',
      link: '/admin/users'
    },
    {
      title: 'Contact Messages',
      value: '—',
      description: 'Messages received',
      icon: '✉️',
      color: '#7c3aed',
      link: '/admin/contacts'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'Review registrations and manage user accounts.',
      icon: '👥',
      link: '/admin/users',
      button: 'View Users'
    },
    {
      title: 'Pending Approvals',
      description: 'Review accounts waiting for administrator approval.',
      icon: '⏳',
      link: '/admin/users',
      button: 'Review Accounts'
    },
    {
      title: 'Contact Messages',
      description: 'Review messages submitted through the contact form.',
      icon: '✉️',
      link: '/admin/contacts',
      button: 'View Messages'
    }
  ];

  return (
    <>
      <style>{`
        .ad-dashboard {
          min-height: 100%;
          padding: 30px;
          box-sizing: border-box;
          background: #f4f7fb;
          color: #1f2937;
          font-family: Arial, sans-serif;
        }

        .ad-dashboard-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .ad-dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 18px;
          margin-bottom: 28px;
        }

        .ad-dashboard-heading h1 {
          margin: 0 0 9px;
          color: #173b70;
          font-size: 30px;
        }

        .ad-dashboard-heading p {
          margin: 0;
          color: #667085;
          line-height: 1.6;
        }

        .ad-dashboard-date {
          padding: 12px 16px;
          border: 1px solid #e4e7ec;
          border-radius: 10px;
          background: #ffffff;
          color: #475467;
          font-size: 14px;
        }

        .ad-dashboard-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          padding: 6px;
          width: fit-content;
          max-width: 100%;
          border-radius: 10px;
          background: #e8edf5;
        }

        .ad-dashboard-tab {
          padding: 11px 18px;
          border: none;
          border-radius: 7px;
          background: transparent;
          color: #475467;
          font-weight: 600;
          cursor: pointer;
        }

        .ad-dashboard-tab.active {
          background: #ffffff;
          color: #173b70;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.07);
        }

        .ad-dashboard-section-title {
          margin: 0 0 18px;
          color: #173b70;
          font-size: 21px;
        }

        .ad-dashboard-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .ad-stat-card {
          display: block;
          padding: 22px;
          border: 1px solid #e4e7ec;
          border-radius: 14px;
          background: #ffffff;
          color: inherit;
          text-decoration: none;
          box-shadow: 0 3px 12px rgba(16, 39, 70, 0.04);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .ad-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 22px rgba(16, 39, 70, 0.09);
        }

        .ad-stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .ad-stat-title {
          color: #667085;
          font-size: 14px;
          font-weight: 600;
        }

        .ad-stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          border-radius: 12px;
          background: #f2f4f7;
          font-size: 22px;
        }

        .ad-stat-value {
          margin-bottom: 8px;
          color: #173b70;
          font-size: 30px;
          font-weight: 700;
        }

        .ad-stat-description {
          color: #667085;
          font-size: 13px;
        }

        .ad-dashboard-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.6fr) minmax(260px, 1fr);
          gap: 24px;
          margin-bottom: 30px;
        }

        .ad-dashboard-panel {
          padding: 24px;
          border: 1px solid #e4e7ec;
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 0 3px 12px rgba(16, 39, 70, 0.04);
        }

        .ad-dashboard-panel h2 {
          margin: 0 0 8px;
          color: #173b70;
          font-size: 20px;
        }

        .ad-panel-subtitle {
          margin: 0 0 22px;
          color: #667085;
          font-size: 14px;
          line-height: 1.6;
        }

        .ad-activity-empty {
          padding: 28px 15px;
          border: 1px dashed #d0d5dd;
          border-radius: 10px;
          color: #667085;
          text-align: center;
          line-height: 1.7;
        }

        .ad-activity-empty span {
          display: block;
          margin-bottom: 10px;
          font-size: 30px;
        }

        .ad-quick-actions {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .ad-action-card {
          padding: 23px;
          border: 1px solid #e4e7ec;
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 0 3px 12px rgba(16, 39, 70, 0.04);
        }

        .ad-action-icon {
          margin-bottom: 15px;
          font-size: 30px;
        }

        .ad-action-card h3 {
          margin: 0 0 10px;
          color: #173b70;
          font-size: 18px;
        }

        .ad-action-card p {
          min-height: 60px;
          margin: 0 0 18px;
          color: #667085;
          font-size: 14px;
          line-height: 1.7;
        }

        .ad-action-link {
          display: inline-block;
          padding: 10px 14px;
          border-radius: 7px;
          background: #173b70;
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
        }

        .ad-action-link:hover {
          background: #24549a;
        }

        .ad-dashboard-note {
          margin-top: 25px;
          padding: 15px 18px;
          border: 1px solid #f2d6a0;
          border-radius: 10px;
          background: #fffaeb;
          color: #854d0e;
          font-size: 13px;
          line-height: 1.7;
        }

        .ad-dashboard-note strong {
          display: block;
          margin-bottom: 4px;
        }

        @media (max-width: 1100px) {
          .ad-dashboard-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ad-quick-actions {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ad-dashboard-main-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .ad-dashboard {
            padding: 20px 14px;
          }

          .ad-dashboard-heading h1 {
            font-size: 25px;
          }

          .ad-dashboard-stats,
          .ad-quick-actions {
            grid-template-columns: 1fr;
          }

          .ad-dashboard-tabs {
            width: 100%;
            box-sizing: border-box;
          }

          .ad-dashboard-tab {
            flex: 1;
            padding: 10px 8px;
            font-size: 13px;
          }

          .ad-dashboard-panel,
          .ad-action-card {
            padding: 19px;
          }

          .ad-action-card p {
            min-height: 0;
          }
        }
      `}</style>

      <main className="ad-dashboard">
        <div className="ad-dashboard-container">

          <header className="ad-dashboard-header">
            <div className="ad-dashboard-heading">
              <h1>Admin Dashboard</h1>
              <p>
                Welcome to the VADGAON HERO'S administration panel.
                Manage users and contact messages from here.
              </p>
            </div>

            <div className="ad-dashboard-date">
              {new Date().toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </div>
          </header>

          <div className="ad-dashboard-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'overview'}
              className={`ad-dashboard-tab ${
                activeTab === 'overview' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'actions'}
              className={`ad-dashboard-tab ${
                activeTab === 'actions' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('actions')}
            >
              Quick Actions
            </button>
          </div>

          {activeTab === 'overview' && (
            <>
              <h2 className="ad-dashboard-section-title">
                Platform Overview
              </h2>

              <section className="ad-dashboard-stats">
                {stats.map((stat) => (
                  <Link
                    to={stat.link}
                    className="ad-stat-card"
                    key={stat.title}
                  >
                    <div className="ad-stat-top">
                      <span className="ad-stat-title">
                        {stat.title}
                      </span>

                      <span
                        className="ad-stat-icon"
                        style={{ color: stat.color }}
                      >
                        {stat.icon}
                      </span>
                    </div>

                    <div className="ad-stat-value">
                      {stat.value}
                    </div>

                    <div className="ad-stat-description">
                      {stat.description}
                    </div>
                  </Link>
                ))}
              </section>

              <section className="ad-dashboard-main-grid">
                <div className="ad-dashboard-panel">
                  <h2>Recent Activity</h2>

                  <p className="ad-panel-subtitle">
                    Latest registrations, approvals, and messages.
                  </p>

                  <div className="ad-activity-empty">
                    <span>📋</span>
                    <strong>No activity data connected yet</strong>
                    <br />
                    Recent activity will appear here after we connect
                    the dashboard to your backend API.
                  </div>
                </div>

                <div className="ad-dashboard-panel">
                  <h2>Admin Checklist</h2>

                  <p className="ad-panel-subtitle">
                    Common tasks for managing the platform.
                  </p>

                  <p>👥 Review new user registrations.</p>
                  <p>✅ Approve or reject pending accounts.</p>
                  <p>✉️ Check incoming contact messages.</p>
                  <p>🔐 Keep administrator access secure.</p>
                </div>
              </section>
            </>
          )}

          {activeTab === 'actions' && (
            <>
              <h2 className="ad-dashboard-section-title">
                Quick Actions
              </h2>

              <section className="ad-quick-actions">
                {quickActions.map((action) => (
                  <div
                    className="ad-action-card"
                    key={action.title}
                  >
                    <div className="ad-action-icon">
                      {action.icon}
                    </div>

                    <h3>{action.title}</h3>

                    <p>{action.description}</p>

                    <Link
                      to={action.link}
                      className="ad-action-link"
                    >
                      {action.button}
                    </Link>
                  </div>
                ))}
              </section>
            </>
          )}

          <div className="ad-dashboard-note">
            <strong>Dashboard data status</strong>
            The statistics currently display placeholders because the
            live dashboard API has not been connected. We will connect
            these cards to your MongoDB-backed backend in a later step.
          </div>

        </div>
      </main>
    </>
  );
}

export default AdminDashboard;
