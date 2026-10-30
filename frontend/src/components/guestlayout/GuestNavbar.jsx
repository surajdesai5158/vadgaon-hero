
import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const GuestNavbar = () => {
    return (
        <>
            <style>{`
                /* Main Navbar */
                .hero-navbar {
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    padding: 12px 0;
                    background: rgba(8, 13, 29, 0.94) !important;
                    backdrop-filter: blur(18px);
                    -webkit-backdrop-filter: blur(18px);
                    border-bottom: 1px solid rgba(91, 213, 255, 0.25);
                    box-shadow: 0 8px 35px rgba(0, 0, 0, 0.3);
                    overflow: hidden;
                }

                /* Animated neon line */
                .hero-navbar::after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: -35%;
                    width: 35%;
                    height: 2px;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        #4be4ff,
                        #a78bfa,
                        transparent
                    );
                    animation: neonLine 5s linear infinite;
                    pointer-events: none;
                }

                @keyframes neonLine {
                    to { left: 110%; }
                }

                /* Brand */
                .hero-brand {
                    display: flex !important;
                    align-items: center;
                    gap: 13px;
                    margin-right: 24px;
                }

                .logo-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 58px;
                    height: 58px;
                    flex-shrink: 0;
                }

                .hero-logo {
                    width: 49px;
                    height: 49px;
                    object-fit: cover;
                    border-radius: 50%;
                    position: relative;
                    z-index: 2;
                    border: 2px solid #63e8ff;
                    box-shadow: 0 0 14px rgba(74, 222, 255, 0.45);
                    transition: transform 0.4s ease, box-shadow 0.4s ease;
                }

                .logo-ring {
                    position: absolute;
                    inset: 0;
                    border: 2px solid transparent;
                    border-top-color: #54e6ff;
                    border-right-color: #a78bfa;
                    border-radius: 50%;
                    animation: rotateRing 4s linear infinite;
                }

                @keyframes rotateRing {
                    to { transform: rotate(360deg); }
                }

                .hero-brand:hover .hero-logo {
                    transform: scale(1.1);
                    box-shadow: 0 0 24px rgba(74, 222, 255, 0.8);
                }

                .brand-content {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .brand-title {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 7px;
                    font-size: clamp(17px, 2vw, 23px);
                    font-weight: 800;
                    letter-spacing: 1px;
                    line-height: 1.2;
                }

                .brand-vadgaon {
                    color: #fff;
                    transition: color 0.3s ease;
                }

                .brand-heroes {
                    color: #61e4ff;
                    text-shadow: 0 0 15px rgba(97, 228, 255, 0.3);
                    transition: text-shadow 0.3s ease;
                }

                .hero-brand:hover .brand-vadgaon {
                    color: #8beaff;
                }

                .hero-brand:hover .brand-heroes {
                    text-shadow: 0 0 20px #48dfff;
                }

                .brand-tagline {
                    color: #9caecb;
                    font-size: 9px;
                    font-weight: 600;
                    letter-spacing: 2px;
                }

                /* Navigation */
                .hero-nav {
                    align-items: center;
                    gap: 8px;
                }

                .hero-link {
                    position: relative;
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    padding: 12px 15px !important;
                    border-radius: 12px;
                    color: #cbd5e1 !important;
                    font-size: 15px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .nav-icon {
                    color: #64dff8;
                    font-size: 19px;
                    transition: transform 0.3s ease;
                }

                .hero-link:hover {
                    color: #fff !important;
                    background: rgba(75, 222, 255, 0.09);
                    transform: translateY(-2px);
                }

                .hero-link:hover .nav-icon {
                    transform: scale(1.2) rotate(-5deg);
                }

                .hero-link.active {
                    color: #74e7ff !important;
                    background: rgba(75, 222, 255, 0.12);
                }

                .hero-link.active::after {
                    content: "";
                    position: absolute;
                    bottom: 3px;
                    left: 25%;
                    width: 50%;
                    height: 2px;
                    border-radius: 5px;
                    background: #64e5ff;
                    box-shadow: 0 0 8px #64e5ff;
                }

                /* Login Button */
                .hero-login {
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                    gap: 9px;
                    margin-left: 8px;
                    padding: 11px 23px !important;
                    border: 1px solid rgba(115, 231, 255, 0.7);
                    border-radius: 30px;
                    color: #071321 !important;
                    background: linear-gradient(120deg, #72e7ff, #a5b4fc);
                    font-size: 15px;
                    font-weight: 800;
                    box-shadow: 0 4px 18px rgba(74, 222, 255, 0.16);
                    transition: all 0.3s ease;
                }

                .hero-login:hover {
                    color: #050b18 !important;
                    background: linear-gradient(120deg, #b0f3ff, #c4b5fd);
                    transform: translateY(-3px);
                    box-shadow: 0 8px 26px rgba(74, 222, 255, 0.38);
                }

                .hero-login.active {
                    box-shadow: 0 0 20px rgba(74, 222, 255, 0.4);
                }

                .login-arrow {
                    display: inline-block;
                    font-size: 19px;
                    transition: transform 0.3s ease;
                }

                .hero-login:hover .login-arrow {
                    transform: translate(3px, -3px);
                }

                /* Mobile Toggle */
                .hero-toggler {
                    border: 1px solid rgba(100, 229, 255, 0.5) !important;
                    border-radius: 10px;
                    padding: 8px 10px;
                }

                .hero-toggler:focus {
                    box-shadow: 0 0 0 3px rgba(100, 229, 255, 0.2);
                }

                /* Responsive */
                @media (max-width: 991.98px) {
                    .hero-navbar {
                        padding: 10px 0;
                    }

                    .hero-brand {
                        gap: 10px;
                        margin-right: 0;
                    }

                    .logo-wrapper {
                        width: 49px;
                        height: 49px;
                    }

                    .hero-logo {
                        width: 42px;
                        height: 42px;
                    }

                    .brand-title {
                        font-size: 17px;
                    }

                    .brand-tagline {
                        font-size: 8px;
                        letter-spacing: 1px;
                    }

                    .hero-nav {
                        align-items: stretch;
                        gap: 5px;
                        padding-top: 18px;
                    }

                    .hero-link {
                        justify-content: flex-start;
                        padding: 12px 14px !important;
                    }

                    .hero-link.active::after {
                        left: 14px;
                        width: 35px;
                    }

                    .hero-login {
                        align-self: flex-start;
                        margin: 8px 0 10px;
                    }
                }

                @media (max-width: 380px) {
                    .brand-title {
                        font-size: 14px;
                        gap: 4px;
                    }

                    .brand-tagline {
                        font-size: 7px;
                        letter-spacing: 0.5px;
                    }

                    .logo-wrapper {
                        width: 43px;
                        height: 43px;
                    }

                    .hero-logo {
                        width: 37px;
                        height: 37px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .hero-navbar::after,
                    .logo-ring {
                        animation: none;
                    }

                    .hero-navbar *,
                    .hero-navbar *::before,
                    .hero-navbar *::after {
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>

            <Navbar
                expand="lg"
                variant="dark"
                collapseOnSelect
                className="hero-navbar"
            >
                <Container fluid="lg">

                    {/* Brand and Logo */}
                    <Navbar.Brand
                        as={NavLink}
                        to="/home"
                        className="hero-brand"
                    >
                        <div className="logo-wrapper">
                            <div className="logo-ring"></div>
                            <img
                                src="https://res.cloudinary.com/dc7py007/image/upload/v1793369674/VadgaonLogo.jpg"
                                alt="Vadgaon Hero's Logo"
                                className="hero-logo"
                            />
                        </div>

                        <div className="brand-content">
                            <div className="brand-title">
                                <span className="brand-vadgaon">
                                    VADGAON
                                </span>
                                <span className="brand-heroes">
                                    HERO'S
                                </span>
                            </div>

                            <span className="brand-tagline">
                                COMMUNITY • EVENTS • UNITY
                            </span>
                        </div>
                    </Navbar.Brand>

                    {/* Mobile Menu */}
                    <Navbar.Toggle
                        aria-controls="hero-navbar-collapse"
                        className="hero-toggler"
                        aria-label="Toggle navigation"
                    />

                    <Navbar.Collapse id="hero-navbar-collapse">
                        <Nav className="ms-auto hero-nav">

                            <Nav.Link
                                as={NavLink}
                                to="/home"
                                end
                                className={({ isActive }) =>
                                    `hero-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <span className="nav-icon">⌂</span>
                                Home
                            </Nav.Link>

                            <Nav.Link
                                as={NavLink}
                                to="/contact"
                                className={({ isActive }) =>
                                    `hero-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <span className="nav-icon">✉</span>
                                Contact
                            </Nav.Link>

                            <Nav.Link
                                as={NavLink}
                                to="/register"
                                className={({ isActive }) =>
                                    `hero-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <span className="nav-icon">✧</span>
                                Register
                            </Nav.Link>

                            <Nav.Link
                                as={NavLink}
                                to="/login"
                                className={({ isActive }) =>
                                    `hero-login ${isActive ? 'active' : ''}`
                                }
                            >
                                Login
                                <span className="login-arrow">↗</span>
                            </Nav.Link>

                        </Nav>
                    </Navbar.Collapse>

                </Container>
            </Navbar>
        </>
    );
};

export default GuestNavbar;
