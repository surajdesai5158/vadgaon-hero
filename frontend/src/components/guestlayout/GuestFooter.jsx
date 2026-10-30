import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const GuestFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <>
            <style>{`
                /* ===== Footer Main ===== */
                .hero-footer {
                    position: relative;
                    overflow: hidden;
                    padding: 65px 0 0;
                    color: #dbe5f5;
                    background: linear-gradient(
                        135deg,
                        #080d1d 0%,
                        #101b32 50%,
                        #090e20 100%
                    );
                    border-top: 1px solid rgba(91, 213, 255, 0.35);
                    font-family: Arial, sans-serif;
                }

                .hero-footer::before {
                    content: "";
                    position: absolute;
                    top: -140px;
                    left: 50%;
                    width: 400px;
                    height: 220px;
                    transform: translateX(-50%);
                    background: rgba(65, 216, 255, 0.10);
                    filter: blur(80px);
                    border-radius: 50%;
                    pointer-events: none;
                }

                .hero-footer .footer-content {
                    position: relative;
                    z-index: 1;
                }

                /* ===== Brand ===== */
                .footer-brand {
                    display: inline-block;
                    margin-bottom: 18px;
                    color: #ffffff;
                    font-size: clamp(23px, 3vw, 32px);
                    font-weight: 900;
                    letter-spacing: 1.5px;
                    text-decoration: none;
                    transition: transform 0.3s ease;
                }

                .footer-brand:hover {
                    transform: translateY(-3px);
                }

                .footer-brand .brand-highlight {
                    color: #62e5ff;
                    text-shadow: 0 0 18px rgba(98, 229, 255, 0.4);
                }

                .footer-tagline {
                    color: #a4b5d0;
                    font-size: 13px;
                    letter-spacing: 2px;
                    margin-bottom: 18px;
                }

                .footer-description {
                    max-width: 440px;
                    margin: 0 auto;
                    color: #a9b7ce;
                    font-size: 14px;
                    line-height: 1.9;
                }

                /* ===== Section Headings ===== */
                .footer-heading {
                    position: relative;
                    display: inline-block;
                    margin-bottom: 24px;
                    color: #ffffff;
                    font-size: 17px;
                    font-weight: 800;
                    letter-spacing: 0.8px;
                }

                .footer-heading::after {
                    content: "";
                    position: absolute;
                    left: 0;
                    bottom: -9px;
                    width: 35px;
                    height: 2px;
                    border-radius: 4px;
                    background: linear-gradient(
                        90deg,
                        #62e5ff,
                        #a78bfa
                    );
                    transition: width 0.3s ease;
                }

                .footer-column:hover .footer-heading::after {
                    width: 65px;
                }

                /* ===== Footer Links ===== */
                .footer-nav {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                }

                .footer-link {
                    display: inline-flex !important;
                    align-items: center;
                    gap: 9px;
                    padding: 4px 0 !important;
                    color: #aebbd0 !important;
                    font-size: 14px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .footer-link .footer-arrow {
                    color: #62e5ff;
                    transition: transform 0.3s ease;
                }

                .footer-link:hover {
                    color: #72e8ff !important;
                    transform: translateX(5px);
                }

                .footer-link:hover .footer-arrow {
                    transform: translateX(3px);
                }

                /* ===== Instagram Link ===== */
                .footer-socials {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                    margin-top: 25px;
                }

                .footer-social {
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                    width: 43px;
                    height: 43px;
                    padding: 0 !important;
                    border: 1px solid rgba(130, 160, 200, 0.25);
                    border-radius: 14px;
                    color: #ffffff !important;
                    background: rgba(255, 255, 255, 0.04);
                    font-size: 21px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .footer-social:hover {
                    color: #ffffff !important;
                    background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
                    border-color: #fd1d1d;
                    transform: translateY(-5px);
                    box-shadow: 0 7px 22px rgba(253, 29, 29, 0.3);
                }

                /* ===== Bottom Bar ===== */
                .footer-bottom {
                    position: relative;
                    z-index: 1;
                    margin-top: 55px;
                    padding: 22px 0;
                    border-top: 1px solid rgba(153, 178, 214, 0.15);
                    background: rgba(0, 0, 0, 0.12);
                }

                .footer-copyright {
                    margin: 0;
                    color: #8798b2;
                    font-size: 13px;
                    line-height: 1.8;
                }

                .footer-copyright .footer-heart {
                    display: inline-block;
                    color: #ff6384;
                    animation: heartbeat 1.5s ease-in-out infinite;
                }

                .footer-credit {
                    color: #68e5ff;
                    font-weight: 700;
                }

                .footer-bottom-links {
                    display: flex;
                    justify-content: flex-end;
                    flex-wrap: wrap;
                    gap: 20px;
                }

                .footer-bottom-links a {
                    color: #8798b2;
                    font-size: 12px;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .footer-bottom-links a:hover {
                    color: #68e5ff;
                }

                /* ===== Animations ===== */
                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }

                @keyframes footerEntrance {
                    from {
                        opacity: 0;
                        transform: translateY(18px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .footer-animate {
                    animation: footerEntrance 0.8s ease both;
                }

                .footer-delay-1 {
                    animation-delay: 0.1s;
                }

                .footer-delay-2 {
                    animation-delay: 0.2s;
                }

                .footer-delay-3 {
                    animation-delay: 0.3s;
                }

                /* ===== Responsive ===== */
                @media (max-width: 767.98px) {
                    .hero-footer {
                        padding-top: 45px;
                        text-align: center;
                    }

                    .footer-description {
                        margin-left: auto;
                        margin-right: auto;
                    }

                    .footer-column {
                        margin-top: 35px;
                    }

                    .footer-nav {
                        align-items: center;
                    }

                    .footer-heading::after {
                        left: 50%;
                        transform: translateX(-50%);
                    }

                    .footer-bottom {
                        margin-top: 35px;
                    }

                    .footer-bottom-links {
                        justify-content: center;
                        margin-top: 12px;
                        gap: 15px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .hero-footer *,
                    .hero-footer *::before,
                    .hero-footer *::after {
                        animation: none !important;
                        transition: none !important;
                    }
                }
            `}</style>

            <footer className="hero-footer">
                <Container className="footer-content">
                    <Row className="g-4">

                        {/* Brand Section */}
                        <Col
                            lg={5}
                            md={12}
                            className="footer-animate"
                        >
                            <NavLink
                                to="/home"
                                className="footer-brand"
                            >
                                VADGAON{' '}
                                <span className="brand-highlight">
                                    HERO'S
                                </span>
                            </NavLink>

                            <div className="footer-tagline">
                                COMMUNITY • EVENTS • UNITY
                            </div>

                            <p className="footer-description">
                                Bringing our community together through
                                unity, celebrations, cultural activities
                                and memorable events. Together we build
                                stronger connections and create lasting
                                memories.
                            </p>

                            <div
                                className="footer-socials"
                                aria-label="Social media links"
                            >
                                <a
                                    href="https://www.instagram.com/vadgaon__official__?xtok=MWk5M3MybnVnZXo2Yg=="
                                    className="footer-social"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Visit Vadgaon Hero's on Instagram"
                                    title="Instagram"
                                >
                                    <i className="fa fa-instagram" aria-hidden="true" />
                                </a>
                            </div>
                        </Col>

                        {/* Quick Links */}
                        <Col
                            lg={3}
                            md={6}
                            className="footer-column footer-animate footer-delay-1"
                        >
                            <h5 className="footer-heading">
                                Quick Links
                            </h5>

                            <Nav className="footer-nav">
                                <NavLink
                                    to="/home"
                                    className="footer-link"
                                >
                                    <span className="footer-arrow">›</span>
                                    Home
                                </NavLink>

                                <NavLink
                                    to="/contact"
                                    className="footer-link"
                                >
                                    <span className="footer-arrow">›</span>
                                    Contact Us
                                </NavLink>

                                <NavLink
                                    to="/register"
                                    className="footer-link"
                                >
                                    <span className="footer-arrow">›</span>
                                    Register
                                </NavLink>

                                <NavLink
                                    to="/login"
                                    className="footer-link"
                                >
                                    <span className="footer-arrow">›</span>
                                    Login
                                </NavLink>
                            </Nav>
                        </Col>

                        {/* Community Section */}
                        <Col
                            lg={4}
                            md={6}
                            className="footer-column footer-animate footer-delay-2"
                        >
                            <h5 className="footer-heading">
                                Our Community
                            </h5>

                            <p className="footer-description">
                                Celebrate local talent, participate in
                                cultural competitions, support community
                                events and stay connected with Vadgaon
                                Hero's.
                            </p>

                            <p
                                style={{
                                    marginTop: '18px',
                                    color: '#9caecb',
                                    fontSize: '13px'
                                }}
                            >
                                <span style={{ color: '#62e5ff' }}>
                                    ✦
                                </span>
                                {' '}Together in unity, stronger forever.
                            </p>
                        </Col>

                    </Row>
                </Container>

                {/* Copyright Bar */}
                <div className="footer-bottom">
                    <Container>
                        <Row className="align-items-center">
                            <Col md={7}>
                                <p className="footer-copyright">
                                    © {currentYear} VADGAON HERO'S.
                                    {' '}All rights reserved.
                                    <br />
                                    Made with{' '}
                                    <span className="footer-heart">
                                        ♥
                                    </span>
                                    {' '}for our community.
                                </p>
                            </Col>

                            <Col md={5}>
                                <div className="footer-bottom-links">
                                    <NavLink to="/home">
                                        Home
                                    </NavLink>

                                    <NavLink to="/contact">
                                        Contact
                                    </NavLink>

                                    <NavLink to="/register">
                                        Join Us
                                    </NavLink>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </footer>
        </>
    );
};

export default GuestFooter;
