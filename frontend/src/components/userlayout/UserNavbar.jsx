
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

function UserNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('vh_token');
    localStorage.removeItem('vh_user');
    closeMenu();
    navigate('/login', { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `user-nav-link ${isActive ? 'active' : ''}`;

  return (
    <>
      <style>{`
        .user-navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background: #102746;
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          font-family: Arial, sans-serif;
        }

        .user-navbar-inner {
          max-width: 1400px;
          min-height: 76px;
          margin: 0 auto;
          padding: 12px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          box-sizing: border-box;
        }

        .user-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #ffffff;
          text-decoration: none;
          flex-shrink: 0;
        }

        .user-brand img {
          width: 48px;
          height: 48px;
          object-fit: contain;
          border-radius: 50%;
          background: #ffffff;
        }

        .user-brand-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .user-brand-text strong {
          font-size: 18px;
          letter-spacing: 0.5px;
        }

        .user-brand-text span {
          color: #b9c9df;
          font-size: 11px;
          letter-spacing: 1.5px;
        }

        .user-nav-links {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .user-nav-link {
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

        .user-nav-link:hover {
          background: #24476f;
          color: #ffffff;
        }

        .user-nav-link.active {
          background: #ffffff;
          color: #173b70;
        }

        .user-logout-button {
          padding: 11px 16px;
          border: 1px solid #fca5a5;
          border-radius: 7px;
          background: #b42318;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

        .user-logout-button:hover {
          background: #912018;
        }

        .user-menu-toggle {
          display: none;
          padding: 9px 12px;
          border: 1px solid #536982;
          border-radius: 7px;
          background: transparent;
          color: #ffffff;
          font-size: 24px;
          cursor: pointer;
        }

        @media (max-width: 1250px) {
          .user-navbar-inner {
            padding: 12px 18px;
            flex-wrap: wrap;
          }

          .user-menu-toggle {
            display: block;
            margin-left: auto;
          }

          .user-nav-links {
            display: ${menuOpen ? 'flex' : 'none'};
            width: 100%;
            flex-direction: column;
            align-items: stretch;
            gap: 7px;
            padding: 12px 0 4px;
          }

          .user-nav-link {
            padding: 12px;
          }

          .user-logout-button {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .user-navbar-inner {
            gap: 12px;
            padding: 12px;
          }

          .user-brand img {
            width: 40px;
            height: 40px;
          }

          .user-brand-text strong {
            font-size: 15px;
          }

          .user-brand-text span {
            font-size: 10px;
          }
        }
      `}</style>

      <header className="user-navbar">
        <div className="user-navbar-inner">

          <Link
            to="/user/dashboard"
            className="user-brand"
            onClick={closeMenu}
          >
            <img
              src="https://res.cloudinary.com/dc7py007/image/upload/v1793369674/VadgaonLogo.jpg"
              alt="Vadgaon Hero's logo"
            />

            <div className="user-brand-text">
              <strong>VADGAON HERO'S</strong>
              <span>USER PANEL</span>
            </div>
          </Link>

          <button
            type="button"
            className="user-menu-toggle"
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? '×' : '☰'}
          </button>

          <nav className="user-nav-links" aria-label="User navigation">

            <NavLink
              to="/user/dashboard"
              className={navLinkClass}
              onClick={closeMenu}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/user/profile"
              className={navLinkClass}
              onClick={closeMenu}
            >
              My Profile
            </NavLink>

            <NavLink
              to="/user/contact"
              className={navLinkClass}
              onClick={closeMenu}
            >
              Contact
            </NavLink>

            <NavLink
              to="/user/diwali"
              className={navLinkClass}
              onClick={closeMenu}
            >
              🪔 Diwali Memories
            </NavLink>

            <NavLink
              to="/user/vpl"
              className={navLinkClass}
              onClick={closeMenu}
            >
              🏏 VPL Forms
            </NavLink>

            <NavLink
              to="/user/cricket"
              className={navLinkClass}
              onClick={closeMenu}
            >
              🏆 Cricket Memories
            </NavLink>

            <NavLink
              to="/user/village-improvement"
              className={navLinkClass}
              onClick={closeMenu}
            >
              🏡 Village Improvement
            </NavLink>

            <button
              type="button"
              className="user-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </nav>
        </div>
      </header>
    </>
  );
}

export default UserNavbar;
