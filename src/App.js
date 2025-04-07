import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Feed from "./components/Feed";
import Sidebar from "./components/Sidebar";
import LoadingScreen from "./components/LoadingScreen";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading of resources
    const loadResources = async () => {
      try {
        // Wait for a minimum time to show the loading animation
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading resources:", error);
        setIsLoading(false);
      }
    };

    loadResources();
  }, []);
  return (
    <Router>
      <div className="App">
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            <Navbar />
            <div className="main-content">
              <div className="feed-section">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/series" element={<Feed />} />
                </Routes>
              </div>
              <Sidebar />
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
