import React from "react";
import "./Stories.css";

function Stories() {
  const stories = [
    { id: 1, username: "alice" },
    { id: 2, username: "bob" },
    { id: 3, username: "charlie" },
    // ... add more dummy users
  ];

  return (
    <div className="stories-container">
      {stories.map((story) => (
        <div key={story.id} className="story">
          {/* Typically a circular user avatar */}
          <div className="story-img"> 
            {/* If you have an actual avatar image, replace with <img src="..." alt="..." /> */}
            <span>🧑</span>
          </div>
          <div className="story-username">{story.username}</div>
        </div>
      ))}
    </div>
  );
}

export default Stories;
