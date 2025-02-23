import React, { useState, useRef, useEffect } from "react";
import UseAnimations from 'react-useanimations';
import heart from 'react-useanimations/lib/heart';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Post.css";

function Post({ username, media, caption }) {
  const [isLiked, setIsLiked] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    // Create intersection observer
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.7 // 70% of the video must be visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Video is in view
          entry.target.play();
        } else {
          // Video is out of view
          entry.target.pause();
        }
      });
    }, options);

    // Get all videos in this post
    const videos = document.querySelectorAll('.post-video');
    videos.forEach(video => observer.observe(video));

    return () => {
      videos.forEach(video => observer.unobserve(video));
    };
  }, []);

  // Debug logs
  useEffect(() => {
    console.log('Post component media prop:', media);
  }, [media]);

  const getMediaType = (url) => {
    if (!url) return 'image'; // Default to image if url is undefined
    if (typeof url !== 'string') {
      console.log('Invalid media URL:', url);
      return 'image';
    }
    return url.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image';
  };

  const handleVideoClick = (e) => {
    e.preventDefault();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      setIsMuted(!isMuted);
      videoRef.current.muted = !isMuted;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimelineClick = (e) => {
    e.stopPropagation();
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = percent * videoRef.current.duration;
    }
  };

  const isSquareImage = (mediaUrl) => {
    if (!mediaUrl || getMediaType(mediaUrl) === 'video') return false;
    const img = new Image();
    img.src = mediaUrl;
    return img.width === img.height;
  };

  const renderMedia = (mediaUrl) => {
    if (!mediaUrl) {
      console.log('No media URL provided');
      return null;
    }

    const mediaType = getMediaType(mediaUrl);
    const isSquare = isSquareImage(mediaUrl);

    return (
      <div className={`post-media ${isSquare ? 'square-media' : ''}`}>
        {mediaType === 'video' ? (
          <div 
            className="video-container"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <video 
              ref={videoRef}
              className="post-video"
              playsInline
              loop
              muted={isMuted}
              preload="metadata"
              onClick={handleVideoClick}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            >
              <source src={mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {showControls && (
              <div className="video-controls">
                <button 
                  className="mute-button"
                  onClick={toggleMute}
                >
                  {isMuted ? "🔇" : "🔊"}
                </button>
                
                <div 
                  className="video-timeline"
                  onClick={handleTimelineClick}
                >
                  <div 
                    className="timeline-progress"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="image-container">
            <img 
              src={mediaUrl} 
              alt={`${username}'s post`} 
              className="post-img"
              onError={(e) => {
                console.log('Image failed to load:', mediaUrl);
                e.target.style.display = 'none';
              }}
              onLoad={() => console.log('Image loaded successfully:', mediaUrl)}
            />
          </div>
        )}
      </div>
    );
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    beforeChange: (current, next) => setCurrentSlide(next),
  };

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-user">
          <div className="avatar">🧑</div>
          <span className="username">{username}</span>
        </div>
        {/* Optionally: more icon or follow button */}
      </div>
      
      <div className="post-media">
        {Array.isArray(media) ? (
          media.length > 1 ? (
            <Slider {...settings}>
              {media.map((mediaUrl, index) => (
                <div key={index} className="media-slide">
                  {renderMedia(mediaUrl)}
                </div>
              ))}
            </Slider>
          ) : (
            renderMedia(media[0])
          )
        ) : (
          renderMedia(media)
        )}
      </div>

      <div className="post-actions">
        <UseAnimations
          animation={heart}
          size={28}
          reverse={isLiked}
          onClick={() => setIsLiked(!isLiked)}
          strokeColor={isLiked ? '#ed4956' : undefined}
          fillColor={isLiked ? '#ed4956' : undefined}
        />
       
      </div>
      
      <div className="post-caption">
        <strong>{username}</strong> {caption}
      </div>
    </div>
  );
}

export default Post;
