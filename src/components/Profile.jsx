import React from "react";
import "./Profile.css";
import kuehDadar from "../assets/images/Kueh_Dadar.jpg";
import kuehLapis from "../assets/images/Kueh_Lapis.jpg";

function Profile() {
  const profileData = {
    username: "Jeff Lai",
    bio: "Portrait Artist | Live Events Specialist",
    stats: {
      posts: 24,
      followers: 1234,
      following: 567
    },
    highlights: [
      { id: 1, title: "Live Events", image: kuehDadar },
      { id: 2, title: "Portraits", image: kuehLapis },
      { id: 3, title: "Sketches", image: kuehDadar }
    ],
    posts: [
      { id: 1, image: kuehDadar },
      { id: 2, image: kuehLapis },
      { id: 3, image: kuehDadar },
      // Add more posts as needed
    ]
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">🎨</div>
        <div className="profile-info">
          <h1>{profileData.username}</h1>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{profileData.stats.posts}</span>
              <span className="stat-label">posts</span>
            </div>
            <div className="stat">
              <span className="stat-value">{profileData.stats.followers}</span>
              <span className="stat-label">followers</span>
            </div>
            <div className="stat">
              <span className="stat-value">{profileData.stats.following}</span>
              <span className="stat-label">following</span>
            </div>
          </div>
          <div className="profile-bio">
            <p>{profileData.bio}</p>
          </div>
          <button className="edit-profile-btn">Edit Profile</button>
        </div>
      </div>

      <div className="profile-highlights">
        {profileData.highlights.map(highlight => (
          <div key={highlight.id} className="highlight">
            <div className="highlight-image">
              <img src={highlight.image} alt={highlight.title} />
            </div>
            <span>{highlight.title}</span>
          </div>
        ))}
      </div>

      <div className="profile-posts">
        <div className="posts-grid">
          {profileData.posts.map(post => (
            <div key={post.id} className="post-thumbnail">
              <img src={post.image} alt="Post" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
