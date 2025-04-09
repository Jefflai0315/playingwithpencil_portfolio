import React from 'react';
import './LandingPage.css';
import Com_1 from '../assets/images/Com_1.jpg';
import Com_2 from '../assets/images/Com_2.jpg';
import Com_3 from '../assets/images/Com_3.jpg';
import Com_4 from '../assets/images/Com_4.jpg';
import Com_5 from '../assets/images/Com_5.jpg';
import Com_6 from '../assets/images/Com_6.jpg';


function LandingPage() {
  const portfolioItems = [
    {
      id: 1,
      image: Com_1,
      sketch: "/path/to/sketch1.jpg",
      title: "Sketched this woman in Tokyo.",
      likes: 33,
      comments: 8
    },
    {
        id: 2,
        image: Com_2,
        sketch: "/path/to/sketch1.jpg",
        title: "Sketched this woman in Tokyo.",
        likes: 33,
        comments: 8
      },
      {
        id: 3,
        image: Com_3,
        sketch: Com_1,
        title: "Sketched this woman in Tokyo.",
        likes: 33,
        comments: 8
      },
      {
        id: 4,
        image: Com_4,
        sketch: Com_1,
        title: "Sketched this woman in Tokyo.",
        likes: 33,
        comments: 8
      },
      {
        id: 5,
        image: Com_5,
        sketch: Com_1,
        title: "Sketched this woman in Tokyo.",
        likes: 33,
        comments: 8
      },
      {
        id: 6,  
        image: Com_6,
        sketch: Com_1,
        title: "Sketched this woman in Tokyo.",
        likes: 33,
        comments: 8
      },
    
    // Add more portfolio items...
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl">
            🎨
          </div>
          <h1 className="text-3xl font-bold">Jeff Lai</h1>
        </div>
      </header> */}

      <div className="mb-10">
        <p className="text-3xl font-bold  text-gray-700">
         Moments I sketched.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {portfolioItems.map(item => (
          <div key={item.id}>
            <div className="relative portrait-container bg-gray-100"> 
              <img 
                src={item.image} 
                alt="Portrait" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandingPage; 