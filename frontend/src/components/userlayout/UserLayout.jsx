
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import UserHeader from './UserHeader';
import UserFooter from './UserFooter';



const UserLayout = () => {
    const location = useLocation();

    return (
        <>
            <style>{`
                /* Main page layout */
                .guest-layout {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    min-height: 100dvh;
                    background: #080d1d;
                    color: #eaf2ff;
                }

                /* Sticky header */
                .guest-header-wrapper {
                    position: sticky;
                    top: 0;
                    width: 100%;
                    z-index: 1050;
                    flex-shrink: 0;
                }

                /* Main content */
                .guest-main-content {
                    flex: 1 0 auto;
                    width: 100%;
                    min-width: 0;
                    position: relative;
                }

                /* Page transition */
                .guest-page-content {
                    width: 100%;
                    animation: guestPageEnter 0.45s ease-out;
                }

                @keyframes guestPageEnter {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Footer stays after content */
                .guest-footer-wrapper {
                    position: relative;
                    width: 100%;
                    margin-top: auto;
                    flex-shrink: 0;
                }

                /* Mobile adjustments */
                @media (max-width: 768px) {
                    .guest-page-content {
                        animation-duration: 0.3s;
                    }
                }

                /* Accessibility */
                @media (prefers-reduced-motion: reduce) {
                    .guest-page-content {
                        animation: none;
                    }
                }
            `}</style>

            <div className="guest-layout">

                {/* Header */}
                <header className="guest-header-wrapper">
                    <UserHeader />
                </header>

                {/* Route content */}
                <main className="guest-main-content">
                    <div
                        key={location.pathname}
                        className="guest-page-content"
                    >
                        <Outlet />
                    </div>
                </main>

                {/* Footer */}
                <footer className="guest-footer-wrapper">
                    <UserFooter />
                </footer>

            </div>
        </>
    );
};

export default UserLayout;
