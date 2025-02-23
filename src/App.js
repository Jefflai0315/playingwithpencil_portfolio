import React from "react";
import Navbar from "./components/Navbar";
import Stories from "./components/Stories";
import Feed from "./components/Feed";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="main-content">
        <div className="feed-section">
          {/* <Stories /> */}
          <Feed />
        </div>
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
