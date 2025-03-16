import React, { useState, useEffect } from "react";
import UseAnimations from 'react-useanimations';
import mail from 'react-useanimations/lib/mail';
import edit from 'react-useanimations/lib/edit';
import whatsapp from 'react-useanimations/lib/instagram';
import email from 'react-useanimations/lib/mail';
import instagram from 'react-useanimations/lib/instagram';
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

  const handleFeedbackClick = (e) => {
    // go to the feedback page https://playingwithpencil.canny.io/feature-requests
    // window.open('https://playingwithpencil.canny.io/feature-requests', '_blank');
    setShowFeedbackMessage(!showFeedbackMessage);
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
        className="flex flex-row items-center justify-between gap-2"
      >
        <div>WhatsApp</div>
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
        <div>Email</div>
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
        <div>Instagram</div>
        <UseAnimations
          animation={instagram}
          size={24}
        />
      </a>
    </div>
  );


  //for feedback
  const [showFeedbackMessage, setShowFeedbackMessage] = useState(true);
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
        <div className="nav-center flex flex-row gap-4">
          <div className="contact-icon-mobile cursor-pointer">
            <UseAnimations
              animation={mail}
              size={32}
              onClick={handleContactClick}
              reverse={checked}
            />
            {checked && renderContactPopup()}
          </div>
          <div className="feedback-icon">
            <div className="contact-icon-mobile cursor-pointer">
                <UseAnimations
                  animation={edit}
                  size={32}
                  onClick={handleFeedbackClick}
                />
                {showFeedbackMessage && (
                  <div className="feedback-dropdown">
                    <p>Website under development! 🚀</p>
                    <p>Thank you for supporting me as both an artist and software engineer.</p>
                    <a 
                      href="https://playingwithpencil.canny.io/feature-requests" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="feedback-link"
                    >
                      Share your feedback →
                    </a>
                  </div>
                )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
