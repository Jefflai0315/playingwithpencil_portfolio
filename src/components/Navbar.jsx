import React, { useState, useEffect } from "react";
import UseAnimations from 'react-useanimations';
import mail from 'react-useanimations/lib/mail';
import edit from 'react-useanimations/lib/edit';
import youtube2 from 'react-useanimations/lib/youtube2';
import home from 'react-useanimations/lib/home';
import whatsapp from 'react-useanimations/lib/instagram';
import email from 'react-useanimations/lib/mail';
import instagram from 'react-useanimations/lib/instagram';
import menu from 'react-useanimations/lib/menu4';
import pwpLogo from "../assets/images/pwp.PNG";
import "./Navbar.css";
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [checked, setChecked] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [welcomeMessageShown, setWelcomeMessageShown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show welcome message only once per session
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setTimeout(() => {
        setWelcomeMessageShown(true);
        setTimeout(() => {
          setWelcomeMessageShown(false);
          sessionStorage.setItem('hasSeenWelcome', 'true');
        }, 5000);
      }, 1500);
    }
  }, []);

  const handleContactClick = (e) => {
    e.stopPropagation();
    const buttonRect = e.currentTarget.getBoundingClientRect();
    setPopupPosition({
      top: buttonRect.bottom + window.scrollY,
      left: buttonRect.left + window.scrollX
    });
    setChecked(!checked);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const handleFeedbackClick = (e) => {
    setShowFeedbackMessage(!showFeedbackMessage);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  // Add click outside handler
  React.useEffect(() => {
    const closePopup = () => setChecked(false);
    if (checked) {
      document.addEventListener('click', closePopup);
    }
    return () => document.removeEventListener('click', closePopup);
  }, [checked]);

  // Handle navbar visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

      setPrevScrollPos(currentScrollPos);
      setVisible(visible);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
   
  }, [prevScrollPos]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const renderContactPopup = () => (
    <div 
      className="contact-popup"
      style={{
        position: 'fixed',
        top: `${popupPosition.top}px`,
        left: `${popupPosition.left -150}px `,
        transform: 'translateY(10px)'
      }}
    >
      <a 
        href="https://wa.me/+6591866059" 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="flex flex-row items-center justify-between gap-2"
      >
        <div className="flex items-center">
          <span className="contact-emoji mr-2">💬</span>
          <span>Chat with me</span>
        </div>
        <UseAnimations
          animation={whatsapp}
          size={24}
        />
      </a>
      <a 
        href="mailto:playingwithpencil@gmail.com"
        onClick={(e) => e.stopPropagation()}
        className="flex flex-row items-center justify-between gap-2"
      >
        <div className="flex items-center">
          <span className="contact-emoji mr-2">✉️</span>
          <span>Send an email</span>
        </div>
        <UseAnimations
          animation={email}
          size={24}
        />
      </a>
      <a 
        href="https://www.instagram.com/playingwithpencil/"
        target="_blank" 
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="flex flex-row items-center justify-between gap-2"
      >
        <div className="flex items-center">
          <span className="contact-emoji mr-2">📸</span>
          <span>Follow me</span>
        </div>
        <UseAnimations
          animation={instagram}
          size={24}
        />
      </a>
    </div>
  );

  //for feedback
  const [showFeedbackMessage, setShowFeedbackMessage] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(Date.now());
  
  useEffect(() => {
    let scrollTimer;
    
    const handleScroll = () => {
      setShowFeedbackMessage(false);
      setLastScrollTime(Date.now());
      
      // Clear existing timer
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      
      // Set new timer
      scrollTimer = setTimeout(() => {
        const timeElapsed = Date.now() - lastScrollTime;
        if (timeElapsed >= 5000) { // 5 seconds
          setShowFeedbackMessage(true);
        }
      }, 5000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
    };
  }, [lastScrollTime]);
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <>
      <div className={`navbar-container ${visible ? 'navbar-visible' : 'navbar-hidden'}`}>
        <nav className="navbar">
          <div className="nav-content">
            {/* Left section - Logo */}
            <div className="nav-left">
              <Link to="/" className="logo-container">
                <img 
                  src={pwpLogo} 
                  alt="Playing With Pencil" 
                  className="logo"
                />
              </Link>
            </div>

            {/* Navigation menu - Desktop only */}
            <div className="hidden md:flex gap-4">
              <Link 
                to="/" 
                className={`nav-item ${isActive('/') ? 'nav-active' : ''}`}
                title="Explore my sketches"
              >
                <UseAnimations
                  animation={home}
                  size={26}
                  className="nav-icon"
                />
                <span className="nav-label">Gallery</span>
              </Link>

              <Link 
                to="/services" 
                className={`nav-item ${isActive('/services') ? 'nav-active' : ''}`}
                title="Browse my sketch series"
              >
                <UseAnimations
                  animation={youtube2}
                  size={26}
                  className="nav-icon"
                />
                <span className="nav-label">Series</span>
              </Link>

              <div 
                className={`nav-item ${checked ? 'nav-active' : ''}`} 
                onClick={handleContactClick} 
                title="Get in touch"
              >
                <UseAnimations
                  animation={mail}
                  size={26}
                  className="nav-icon"
                  reverse={checked}
                />
                <span className="nav-label">Contact</span>
              </div>

              <div 
                className={`nav-item ${showFeedbackMessage ? 'nav-active' : ''}`} 
                onClick={handleFeedbackClick}
                title="Share your thoughts"
              >
                <UseAnimations
                  animation={edit}
                  size={26}
                  className="nav-icon"
                />
                <span className="nav-label">Feedback</span>
              </div>
            </div>

            {/* Mobile menu button - Mobile only */}
            <div className=" block md:hidden">
              <div 
                className="nav-item block" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <UseAnimations
                  animation={menu}
                  size={26}
                  className="nav-icon"
                  reverse={mobileMenuOpen}
                />
              </div>
            </div>
          </div>
        </nav>

     {/* setMobileMenuOpen */}
     {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-container">
            <div className="mobile-menu-header">
              <h3>Menu</h3>
              <button 
                className="mobile-menu-close" 
                onClick={() => setMobileMenuOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="mobile-menu-content">
              <div className="mobile-menu-item">
                <Link 
                  to="/" 
                  className={isActive('/') ? 'active' : ''}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="mobile-menu-icon" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  Gallery
                </Link>
              </div>
              <div className="mobile-menu-item">
                <Link 
                  to="/services" 
                  className={isActive('/services') ? 'active' : ''}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="mobile-menu-icon" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none">
                    <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
                    <polyline points="10 9 15 12 10 15"></polyline>
                  </svg>
                  Series
                </Link>
              </div>
              <div className="mobile-menu-item">
                <div 
                  className="mobile-menu-button"
                  onClick={(e) => {
                    handleContactClick(e);
                    setMobileMenuOpen(false);
                  }}
                >
                  <svg className="mobile-menu-icon" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Contact
                </div>
              </div>
              <div className="mobile-menu-item">
                <div 
                  className="mobile-menu-button"
                  onClick={() => {
                    handleFeedbackClick();
                    setMobileMenuOpen(false);
                  }}
                >
                  <svg className="mobile-menu-icon" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Feedback
                </div>
              </div>
            </div>
            <div className="mobile-menu-footer">
              <p>© 2025 Playing With Pencil</p>
            </div>
          </div>
        </div>
      )}
     
      </div>

      {/* Popups */}
      {checked && renderContactPopup()}
      
      {/* Welcome message */}
      {welcomeMessageShown && (
        <div className="welcome-message">
          <div className="welcome-content">
            <div className="welcome-header">
              <span className="welcome-emoji">👋</span>
              <h3>Hello there!</h3>
            </div>
            <p>Welcome to my sketch portfolio. I'm delighted to share my art with you.</p>
            <button 
              onClick={() => setWelcomeMessageShown(false)}
              className="welcome-close"
            >
              Got it
            </button>
          </div>
        </div>
      )}
      
      {/* Feedback message */}
      {showFeedbackMessage && (
        <div className="feedback-message">
          <div className="feedback-content">
            <div className="flex items-center mb-2">
              <span className="feedback-emoji mr-2">💭</span>
              <h3>Any thoughts?</h3>
            </div>
            <p>I'd love to hear your feedback on my sketches or website!</p>
            <div className="flex justify-between items-center mt-3">
              <button 
                onClick={() => setShowFeedbackMessage(false)}
                className="feedback-dismiss"
              >
                Maybe later
              </button>
              <a 
                href="https://playingwithpencil.canny.io/feature-requests" 
                target="_blank" 
                rel="noopener noreferrer"
                className="feedback-link"
              >
                Share feedback
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
