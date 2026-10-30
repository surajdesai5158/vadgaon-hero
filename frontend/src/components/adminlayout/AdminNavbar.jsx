
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

function AdminNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('vh_token');
    localStorage.removeItem('vh_user');
    setShowLogoutModal(false);
    closeMenu();
    navigate('/login', { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `admin-nav-link ${isActive ? 'active' : ''}`;

  return (
    <>
      <style>{`
        .admin-navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background: #102746;
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          font-family: Arial, sans-serif;
        }

        .admin-navbar-inner {
          max-width: 1450px;
          min-height: 76px;
          margin: 0 auto;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          box-sizing: border-box;
        }

        .admin-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #ffffff;
          text-decoration: none;
          flex-shrink: 0;
        }

        .admin-brand img {
          width: 48px;
          height: 48px;
          object-fit: contain;
          border-radius: 50%;
          background: #ffffff;
        }

        .admin-brand-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .admin-brand-text strong {
          font-size: 18px;
          letter-spacing: 0.5px;
        }

        .admin-brand-text span {
          color: #b9c9df;
          font-size: 11px;
          letter-spacing: 1.5px;
        }

        .admin-nav-links {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .admin-nav-link {
          display: block;
          padding: 11px 12px;
          border-radius: 7px;
          color: #e2e8f0;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.2s, color 0.2s;
        }

        .admin-nav-link:hover {
          background: #24476f;
          color: #ffffff;
        }

        .admin-nav-link.active {
          background: #ffffff;
          color: #173b70;
        }

        .admin-logout-button {
          padding: 11px 15px;
          border: 1px solid #fca5a5;
          border-radius: 7px;
          background: #b42318;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

        .admin-logout-button:hover {
          background: #912018;
        }

        .admin-menu-toggle {
          display: none;
          padding: 9px 12px;
          border: 1px solid #536982;
          border-radius: 7px;
          background: transparent;
          color: #ffffff;
          font-size: 24px;
          cursor: pointer;
        }

        .admin-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.65);
        }

        .admin-logout-modal {
          width: 100%;
          max-width: 420px;
          padding: 28px;
          border-radius: 14px;
          background: #ffffff;
          color: #172b45;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
          box-sizing: border-box;
        }

        .admin-logout-modal h2 {
          margin: 0 0 12px;
          font-size: 23px;
        }

        .admin-logout-modal p {
          margin: 0 0 24px;
          color: #5b6470;
          line-height: 1.6;
        }

        .admin-modal-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .admin-modal-actions button {
          padding: 11px 18px;
          border: none;
          border-radius: 7px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .admin-cancel-button {
          background: #e8edf3;
          color: #172b45;
        }

        .admin-confirm-button {
          background: #b42318;
          color: #ffffff;
        }

        @media (max-width: 1300px) {
          .admin-navbar-inner {
            padding: 12px 18px;
            flex-wrap: wrap;
          }

          .admin-menu-toggle {
            display: block;
            margin-left: auto;
          }

          .admin-nav-links {
            display: ${menuOpen ? 'flex' : 'none'};
            width: 100%;
            flex-direction: column;
            align-items: stretch;
            gap: 7px;
            padding: 12px 0 4px;
          }

          .admin-nav-link,
          .admin-logout-button {
            width: 100%;
            box-sizing: border-box;
          }
        }

        @media (max-width: 480px) {
          .admin-navbar-inner {
            gap: 12px;
            padding: 12px;
          }

          .admin-brand img {
            width: 40px;
            height: 40px;
          }

          .admin-brand-text strong {
            font-size: 15px;
          }

          .admin-brand-text span {
            font-size: 10px;
          }

          .admin-logout-modal {
            padding: 22px;
          }
        }
      `}</style>

      <header className="admin-navbar">
        <div className="admin-navbar-inner">

          <Link
            to="/admin/dashboard"
            className="admin-brand"
            onClick={closeMenu}
          >
            <img src="https://res.cloudinary.com/dc7py007/image/upload/v1793369674/VadgaonLogo.jpg" alt="Vadgaon Hero's logo" />

            <div className="admin-brand-text">
              <strong>VADGAON HERO'S</strong>
              <span>ADMIN PANEL</span>
            </div>
          </Link>

          <button
            type="button"
            className="admin-menu-toggle"
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? '×' : '☰'}
          </button>

          <nav className="admin-nav-links" aria-label="Admin navigation">

            <NavLink
              to="/admin/dashboard"
              className={navLinkClass}
              onClick={closeMenu}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/users"
              className={navLinkClass}
              onClick={closeMenu}
            >
              Manage Users
            </NavLink>

            <NavLink
              to="/admin/contacts"
              className={navLinkClass}
              onClick={closeMenu}
            >
              Contact Messages
            </NavLink>

            <NavLink
              to="/admin/diwali"
              className={navLinkClass}
              onClick={closeMenu}
            >
              🪔 Diwali Function
            </NavLink>

            <NavLink
              to="/admin/vpl"
              className={navLinkClass}
              onClick={closeMenu}
            >
              🏏 VPL Management
            </NavLink>

            <NavLink
              to="/admin/cricket"
              className={navLinkClass}
              onClick={closeMenu}
            >
              🏆 Cricket Memories
            </NavLink>

            {/* NEW VILLAGE IMPROVEMENT LINK */}
            <NavLink
              to="/admin/village-improvement"
              className={navLinkClass}
              onClick={closeMenu}
            >
              🏡 Village Improvement
            </NavLink>

            <button
              type="button"
              className="admin-logout-button"
              onClick={() => {
                closeMenu();
                setShowLogoutModal(true);
              }}
            >
              Logout
            </button>

          </nav>
        </div>
      </header>

      {showLogoutModal && (
        <div
          className="admin-modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowLogoutModal(false);
            }
          }}
        >
          <div
            className="admin-logout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-logout-title"
          >
            <h2 id="admin-logout-title">Confirm Logout</h2>

            <p>
              Are you sure you want to log out of the VADGAON HERO'S
              admin panel?
            </p>

            <div className="admin-modal-actions">

              <button
                type="button"
                className="admin-cancel-button"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-confirm-button"
                onClick={handleLogout}
              >
                Yes, Logout
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminNavbar;
