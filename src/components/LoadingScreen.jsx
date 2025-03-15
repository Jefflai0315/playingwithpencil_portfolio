import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="pencil">
        <div className="pencil__ball-point"></div>
        <div className="pencil__cap"></div>
        <div className="pencil__cap-base"></div>
        <div className="pencil__middle"></div>
        <div className="pencil__eraser"></div>
      </div>
      <div className="loading-text">Sketching your experience...</div>
    </div>
  );
};

export default LoadingScreen;