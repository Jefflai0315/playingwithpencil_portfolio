import React, { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  // const navigate = useNavigate();

  const [showContactMenu, setShowContactMenu] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const handleContactClick = (e) => {
    e.stopPropagation();
    const buttonRect = e.currentTarget.getBoundingClientRect();
    setPopupPosition({
      top: buttonRect.bottom + window.scrollY,
      left: buttonRect.left + window.scrollX
    });
    setShowContactMenu(!showContactMenu);
  };

  const handleContactWAClick = (e) => {
    e.stopPropagation();
    window.open('https://wa.me/+6591866059', '_blank');
  };

 


  // Close popup when clicking outside
  React.useEffect(() => {
    const closePopup = () => setShowContactMenu(false);
    if (showContactMenu) {
      document.addEventListener('click', closePopup);
    }
    return () => document.removeEventListener('click', closePopup);
  }, [showContactMenu]);

  const services = [
    { id: 1, title: "Event Sketches", price: "" },
    { id: 2, title: "Portrait Commissions", price: "" },
    { id: 3, title: "Live Portrait Events", price: "" }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah M.",
      text: "Captured my personality perfectly in just 15 minutes!",
      service: "Live Event Portrait"
    },
    {
      id: 2,
      name: "John D.",
      text: "Amazing attention to detail. Highly recommend!",
      service: "Commission Work"
    }
  ];

  const handlePortfolioClick = () => {
    // navigate('/profile');
  };

  // Render contact popup
  const renderContactPopup = () => (
    <div 
      className="contact-popup"
      style={{
        position: 'fixed',
        top: `${popupPosition.top}px`,
        left: `${popupPosition.left}px`,
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
    <div className="sidebar">
      <div className="sidebar-profile">
        <div className="avatar">🎨</div>
        <div>
          <strong>Jeff Lai</strong>
          <p>Portrait Artist</p>
        </div>
        <button 
          ref={buttonRef}
          className="contact-icon" 
          onClick={handleContactClick} 
          style={{marginLeft: 'auto'}}
        >
          📞
        </button>
      </div>
      <div className="suggestions">
        <h3>Suggestions for you</h3>
        {/* <p>See all</p> */}
    
      {/* <div className="portfolio-section">
        <h3>Portfolio Highlights</h3>
        <p>Live Portraits • Commission Work • Event Sketches</p>
        <button 
          className="view-portfolio"
          onClick={handlePortfolioClick}
        >
          View Full Portfolio
        </button>
      </div> */}

      <div className="services-section">
        <h3>Services</h3>
        {services.map(service => (
          <div key={service.id} className="service-item">
            <span className="service-title">{service.title}</span>
            <span className="service-price">{service.price}</span>
          </div>
        ))}
      </div>

      <div className="testimonials-section">
        <h3>Client Feedback</h3>
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="testimonial-item">
            <p>"{testimonial.text}"</p>
            <small>{testimonial.name} - {testimonial.service}</small>
          </div>
        ))}
      </div>

      <div className="contact-section">
        <h3>Commission a Portrait</h3>
        <button 
          className="contact-button" 
          onClick={handleContactWAClick}
        >
          Contact Me
        </button>
      </div>

      {/* Render popup outside of nested divs */}
      {showContactMenu && renderContactPopup()}
      </div>
    </div>
  );
}

export default Sidebar;
