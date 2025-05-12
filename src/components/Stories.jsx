import React from "react";
import "./Stories.css";
import Com_1 from '../assets/images/Com_1.jpg';
import Com_2 from '../assets/images/Com_2.jpg';
import Com_3 from '../assets/images/Com_3.jpg';
import Com_4 from '../assets/images/Com_4.jpg';
import Com_5 from '../assets/images/Com_5.jpg';
import Com_6 from '../assets/images/Com_6.jpg';

function Stories() {
  const services = [
    {
      id: 1,
      title: "Event Sketches",
      description: "Live sketching at your events, capturing special moments in real-time.",
      image: Com_1,
      icon: "🎨"
    },
    {
      id: 2,
      title: "Portrait Commissions",
      description: "Custom portraits created with attention to detail and personal style.",
      image: Com_2,
      icon: "👤"
    },
    {
      id: 3,
      title: "Live Portrait Events",
      description: "Interactive portrait sessions at events and gatherings.",
      image: Com_3,
      icon: "🎭"
    },
    {
      id: 4,
      title: "Digital Portraits",
      description: "Modern digital artwork perfect for social media and prints.",
      image: Com_4,
      icon: "💻"
    },
    {
      id: 5,
      title: "Corporate Events",
      description: "Professional sketching services for corporate events and team building.",
      image: Com_5,
      icon: "🏢"
    },
    {
      id: 6,
      title: "Wedding Sketches",
      description: "Capture your special day with beautiful live wedding sketches.",
      image: Com_6,
      icon: "💑"
    }
  ];

  return (
    <div className="stories-container">
      {services.map((service) => (
        <div key={service.id} className="story">
          <div className="story-img">
            <img src={service.image} alt={service.title} />
            <div className="story-overlay">
              <span className="service-icon">{service.icon}</span>
            </div>
          </div>
          <div className="story-username">{service.title}</div>
        </div>
      ))}
    </div>
  );
}

export default Stories;
