import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import Feed from "./components/Feed";
// import Sidebar from "./components/Sidebar";
import LoadingScreen from "./components/LoadingScreen";
import PlatinumExperience from "./pages/PlatinumExperience";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
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
      <div className="App flex min-h-screen flex-col">
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            <Navbar />
            <div className="main-content flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/services" element={<PlatinumExperience />} />
                <Route path="/home" element={<LandingPage />} />
                <Route
                  path="/platinum-experience"
                  element={<PlatinumExperience />}
                />
                <Route path="/booking" element={<Booking />} />
                {/* <Route path="/contact" element={<Contact />} /> */}
              </Routes>
            </div>
            <Footer />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
