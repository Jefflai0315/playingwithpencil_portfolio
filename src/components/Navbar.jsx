import React, { useState, useEffect } from "react";
import UseAnimations from 'react-useanimations';
import mail from 'react-useanimations/lib/mail';
import pwpLogo from "../assets/images/pwp.PNG";
import "./Navbar.css";

function Navbar() {
  const [checked, setChecked] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);


  const handleContactClick = (e) => {
    e.stopPropagation();
    const buttonRect = e.currentTarget.getBoundingClientRect();
    setPopupPosition({
      top: buttonRect.bottom + window.scrollY,
      left: buttonRect.left + window.scrollX
    });
    setChecked(!checked);
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
      console.log(visible);
      const handleScroll = () => {
        const currentScrollPos = window.pageYOffset;
        const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
  
        setPrevScrollPos(currentScrollPos);
        setVisible(visible);
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
     
    }, [prevScrollPos]);
  

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
      >
        WhatsApp 💬
      </a>
      <a 
        href="mailto:playingwithpencil@gmail.com"
        onClick={(e) => e.stopPropagation()}
      >
        Email ✉️
      </a>
      <a 
        href="https://www.instagram.com/playingwithpencil/"
        target="_blank" 
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        Instagram 📸
      </a>
    </div>
  );
  
  return (
    <div className={`navbar-container ${visible ? 'navbar-visible' : 'navbar-hidden'}`}>
      <nav className="navbar w-full h-16">
        <div className="nav-left">
          <img 
            src={pwpLogo} 
            alt="PWP Logo" 
            className="logo"
          />
        </div>
        <div className="nav-center">
          <span className="nav-icon"></span>
          <div className="contact-icon-mobile">
            <UseAnimations
              animation={mail}
              size={32}
              onClick={handleContactClick}
              reverse={checked}
            />
            {checked && renderContactPopup()}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
