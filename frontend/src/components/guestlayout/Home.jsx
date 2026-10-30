
import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Home = () => {
    return (
        <>
            <style>{`
                .home-page {
                    color: #eaf2ff;
                    background: #080d1d;
                    overflow: hidden;
                }

                /* Hero Section */
                .home-hero {
                    position: relative;
                    min-height: 620px;
                    display: flex;
                    align-items: center;
                    background:
                        radial-gradient(ellipse at 80% 30%, rgba(68, 130, 255, 0.18), transparent 45%),
                        radial-gradient(ellipse at 15% 80%, rgba(97, 228, 255, 0.12), transparent 45%),
                        linear-gradient(135deg, #080d1d, #111d36 60%, #080d1d);
                }

                .home-hero::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    opacity: 0.17;
                    background-image: radial-gradient(#7de8ff 1px, transparent 1px);
                    background-size: 32px 32px;
                    mask-image: linear-gradient(to bottom, black, transparent);
                }

                .hero-content {
                    position: relative;
                    z-index: 2;
                    padding-top: 70px;
                    padding-bottom: 70px;
                    animation: homeFadeUp 0.9s ease both;
                }

                .home-badge {
                    display: inline-block;
                    padding: 9px 16px;
                    border: 1px solid rgba(97, 228, 255, 0.35);
                    border-radius: 30px;
                    background: rgba(97, 228, 255, 0.08);
                    color: #7de8ff;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    margin-bottom: 25px;
                }

                .home-title {
                    font-size: clamp(38px, 6vw, 72px);
                    font-weight: 900;
                    line-height: 1.12;
                    letter-spacing: -2px;
                    margin-bottom: 22px;
                }

                .home-title span {
                    display: block;
                    color: #67e5ff;
                    text-shadow: 0 0 30px rgba(103, 229, 255, 0.22);
                }

                .home-description {
                    max-width: 570px;
                    color: #aabbd5;
                    font-size: 17px;
                    line-height: 1.9;
                    margin-bottom: 30px;
                }

                .home-primary-btn {
                    display: inline-block;
                    padding: 13px 25px;
                    border: 1px solid #70e5ff;
                    border-radius: 30px;
                    color: #08111f;
                    background: linear-gradient(120deg, #70e5ff, #a5b4fc);
                    font-weight: 800;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .home-primary-btn:hover {
                    color: #08111f;
                    transform: translateY(-4px);
                    box-shadow: 0 10px 30px rgba(97, 228, 255, 0.25);
                }

                .home-secondary-btn {
                    display: inline-block;
                    padding: 13px 25px;
                    border: 1px solid rgba(174, 195, 225, 0.3);
                    border-radius: 30px;
                    color: #eaf2ff;
                    background: rgba(255, 255, 255, 0.04);
                    font-weight: 700;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .home-secondary-btn:hover {
                    color: #70e5ff;
                    border-color: #70e5ff;
                    transform: translateY(-4px);
                }

                /* Hero Artwork */
                .hero-visual {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                    animation: homeFloat 5s ease-in-out infinite;
                }

                .hero-orbit {
                    position: absolute;
                    width: min(340px, 80vw);
                    height: min(340px, 80vw);
                    border: 1px solid rgba(103, 229, 255, 0.32);
                    border-radius: 50%;
                    box-shadow:
                        0 0 45px rgba(103, 229, 255, 0.06),
                        inset 0 0 45px rgba(103, 229, 255, 0.04);
                    animation: homeSpin 20s linear infinite;
                }

                .hero-orbit::before,
                .hero-orbit::after {
                    content: "";
                    position: absolute;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: #70e5ff;
                    box-shadow: 0 0 20px #70e5ff;
                }

                .hero-orbit::before {
                    top: 45px;
                    left: 40px;
                }

                .hero-orbit::after {
                    right: 15px;
                    bottom: 90px;
                    background: #a78bfa;
                    box-shadow: 0 0 20px #a78bfa;
                }

                .hero-emblem {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: min(245px, 65vw);
                    height: min(245px, 65vw);
                    border-radius: 50%;
                    border: 1px solid rgba(103, 229, 255, 0.4);
                    background: radial-gradient(circle, #1d3455, #0b1428 72%);
                    box-shadow:
                        0 0 60px rgba(103, 229, 255, 0.12),
                        inset 0 0 35px rgba(103, 229, 255, 0.1);
                }

                .hero-emblem img {
                    width: 75%;
                    height: 75%;
                    object-fit: contain;
                    border-radius: 50%;
                    filter: drop-shadow(0 0 18px rgba(103, 229, 255, 0.2));
                }

                .hero-emblem-text {
                    position: absolute;
                    bottom: -44px;
                    left: 50%;
                    transform: translateX(-50%);
                    white-space: nowrap;
                    color: #7de8ff;
                    font-size: 13px;
                    font-weight: 800;
                    letter-spacing: 3px;
                }

                /* Feature Strip */
                .home-features {
                    position: relative;
                    z-index: 3;
                    padding: 0 0 65px;
                    margin-top: -15px;
                }

                .feature-box {
                    height: 100%;
                    padding: 25px 18px;
                    text-align: center;
                    border: 1px solid rgba(103, 229, 255, 0.15);
                    border-radius: 18px;
                    background: rgba(17, 29, 54, 0.94);
                    transition: all 0.35s ease;
                }

                .feature-box:hover {
                    transform: translateY(-8px);
                    border-color: rgba(103, 229, 255, 0.6);
                    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
                }

                .feature-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 54px;
                    height: 54px;
                    margin-bottom: 15px;
                    border-radius: 16px;
                    color: #70e5ff;
                    background: rgba(103, 229, 255, 0.1);
                    font-size: 25px;
                }

                .feature-box h5 {
                    color: #fff;
                    font-size: 17px;
                    font-weight: 800;
                    margin-bottom: 10px;
                }

                .feature-box p {
                    color: #aabbd5;
                    font-size: 13px;
                    line-height: 1.8;
                    margin: 0;
                }

                /* Events Section */
                .home-section {
                    padding: 75px 0;
                }

                .section-eyebrow {
                    color: #70e5ff;
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    margin-bottom: 14px;
                }

                .section-title {
                    color: #fff;
                    font-size: clamp(29px, 4vw, 43px);
                    font-weight: 900;
                    margin-bottom: 16px;
                }

                .section-description {
                    max-width: 620px;
                    margin: 0 auto 40px;
                    color: #aabbd5;
                    font-size: 15px;
                    line-height: 1.8;
                }

                .event-card {
                    height: 100%;
                    overflow: hidden;
                    border: 1px solid rgba(103, 229, 255, 0.15);
                    border-radius: 20px;
                    background: linear-gradient(145deg, #14223d, #0c1529);
                    transition: all 0.35s ease;
                }

                .event-card:hover {
                    transform: translateY(-8px);
                    border-color: rgba(103, 229, 255, 0.55);
                    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
                }

                .event-card-top {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 175px;
                    background:
                        radial-gradient(circle at 50% 40%, rgba(103, 229, 255, 0.18), transparent 60%),
                        #101d35;
                    font-size: 55px;
                }

                .event-card-body {
                    padding: 25px;
                }

                .event-label {
                    display: inline-block;
                    padding: 6px 10px;
                    margin-bottom: 15px;
                    border-radius: 20px;
                    color: #70e5ff;
                    background: rgba(103, 229, 255, 0.1);
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 1px;
                }

                .event-card h4 {
                    color: #fff;
                    font-size: 19px;
                    font-weight: 800;
                    margin-bottom: 12px;
                }

                .event-card p {
                    color: #aabbd5;
                    font-size: 14px;
                    line-height: 1.8;
                    margin-bottom: 0;
                }

                /* Call to Action */
                .home-cta {
                    padding: 65px 25px;
                    border: 1px solid rgba(103, 229, 255, 0.24);
                    border-radius: 25px;
                    text-align: center;
                    background:
                        radial-gradient(ellipse at top, rgba(103, 229, 255, 0.12), transparent 65%),
                        #101b32;
                }

                .home-cta h2 {
                    color: #fff;
                    font-size: clamp(26px, 4vw, 40px);
                    font-weight: 900;
                    margin-bottom: 18px;
                }

                .home-cta p {
                    max-width: 600px;
                    margin: 0 auto 28px;
                    color: #aabbd5;
                    line-height: 1.8;
                }

                @keyframes homeFadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(25px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes homeFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                }

                @keyframes homeSpin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 991px) {
                    .home-hero {
                        min-height: auto;
                    }

                    .hero-content {
                        text-align: center;
                    }

                    .home-description {
                        margin-left: auto;
                        margin-right: auto;
                    }

                    .hero-visual {
                        min-height: 360px;
                        margin-top: 10px;
                    }

                    .home-features {
                        margin-top: 0;
                    }
                }

                @media (max-width: 576px) {
                    .home-title {
                        letter-spacing: -1px;
                    }

                    .home-description {
                        font-size: 15px;
                    }

                    .home-section {
                        padding: 55px 0;
                    }

                    .home-features {
                        padding-bottom: 35px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .home-page *,
                    .home-page *::before,
                    .home-page *::after {
                        animation: none !important;
                        transition: none !important;
                    }
                }
            `}</style>

            <main className="home-page">

                {/* Hero Section */}
                <section className="home-hero">
                    <Container>
                        <Row className="align-items-center">

                            <Col lg={7}>
                                <div className="hero-content">
                                    <div className="home-badge">
                                        ✦ WELCOME TO OUR COMMUNITY
                                    </div>

                                    <h1 className="home-title">
                                        Together We Are
                                        <span>VADGAON HERO'S</span>
                                    </h1>

                                    <p className="home-description">
                                        One community, countless memories.
                                        Discover local events, celebrate
                                        our culture, participate in activities
                                        and stay connected with the people
                                        who make Vadgaon special.
                                    </p>

                                    <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                                        <Button
                                            as={NavLink}
                                            to="/register"
                                            className="home-primary-btn"
                                        >
                                            Join Our Community ↗
                                        </Button>

                                        <Button
                                            as={NavLink}
                                            to="/contact"
                                            className="home-secondary-btn"
                                        >
                                            Contact Us
                                        </Button>
                                    </div>
                                </div>
                            </Col>

                            <Col lg={5}>
                                <div className="hero-visual">
                                    <div className="hero-orbit"></div>

                                    <div className="hero-emblem">
                                        <img
                                            src="https://res.cloudinary.com/dc7py007/image/upload/v1793369674/VadgaonLogo.jpg"
                                            alt="Vadgaon Hero's Emblem"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />

                                        <div className="hero-emblem-text">
                                            VADGAON HERO'S
                                        </div>
                                    </div>
                                </div>
                            </Col>

                        </Row>
                    </Container>
                </section>

                {/* Community Features */}
                <section className="home-features">
                    <Container>
                        <Row className="g-3">

                            <Col md={4}>
                                <div className="feature-box">
                                    <div className="feature-icon">🤝</div>
                                    <h5>Strong Community</h5>
                                    <p>
                                        Build friendships, connect with
                                        people and grow together.
                                    </p>
                                </div>
                            </Col>

                            <Col md={4}>
                                <div className="feature-box">
                                    <div className="feature-icon">🎉</div>
                                    <h5>Events & Celebrations</h5>
                                    <p>
                                        Celebrate traditions and create
                                        unforgettable memories together.
                                    </p>
                                </div>
                            </Col>

                            <Col md={4}>
                                <div className="feature-box">
                                    <div className="feature-icon">🏆</div>
                                    <h5>Culture & Talent</h5>
                                    <p>
                                        Encourage local talent, cultural
                                        programs and competitions.
                                    </p>
                                </div>
                            </Col>

                        </Row>
                    </Container>
                </section>

                {/* Events Section */}
                <section className="home-section">
                    <Container>
                        <div className="text-center">
                            <div className="section-eyebrow">
                                WHAT BRINGS US TOGETHER
                            </div>

                            <h2 className="section-title">
                                Explore Our Activities
                            </h2>

                            <p className="section-description">
                                From cultural celebrations to community
                                activities, discover opportunities to
                                participate, connect and make a difference.
                            </p>
                        </div>

                        <Row className="g-4">

                            <Col md={4}>
                                <Card className="event-card">
                                    <div className="event-card-top">
                                        🎭
                                    </div>
                                    <div className="event-card-body">
                                        <span className="event-label">
                                            CULTURE
                                        </span>
                                        <h4>Cultural Programs</h4>
                                        <p>
                                            Celebrate our traditions with
                                            music, dance, performances and
                                            local cultural activities.
                                        </p>
                                    </div>
                                </Card>
                            </Col>

                            <Col md={4}>
                                <Card className="event-card">
                                    <div className="event-card-top">
                                        🏅
                                    </div>
                                    <div className="event-card-body">
                                        <span className="event-label">
                                            PARTICIPATE
                                        </span>
                                        <h4>Competitions</h4>
                                        <p>
                                            Discover opportunities to show
                                            your skills, encourage talent
                                            and celebrate achievements.
                                        </p>
                                    </div>
                                </Card>
                            </Col>

                            <Col md={4}>
                                <Card className="event-card">
                                    <div className="event-card-top">
                                        ❤️
                                    </div>
                                    <div className="event-card-body">
                                        <span className="event-label">
                                            TOGETHER
                                        </span>
                                        <h4>Community Activities</h4>
                                        <p>
                                            Join hands to support local
                                            initiatives and create positive
                                            memories for everyone.
                                        </p>
                                    </div>
                                </Card>
                            </Col>

                        </Row>
                    </Container>
                </section>

                {/* Call to Action */}
                <section className="home-section pt-0">
                    <Container>
                        <div className="home-cta">
                            <div className="section-eyebrow">
                                BE A PART OF SOMETHING SPECIAL
                            </div>

                            <h2>
                                Your Community. Your Pride.
                            </h2>

                            <p>
                                Connect with Vadgaon Hero's and become
                                part of a community built on unity,
                                participation and shared experiences.
                            </p>

                            <Button
                                as={NavLink}
                                to="/register"
                                className="home-primary-btn"
                            >
                                Register Now ↗
                            </Button>
                        </div>
                    </Container>
                </section>

            </main>
        </>
    );
};

export default Home;
