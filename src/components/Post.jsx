import React, { useState, useRef, useEffect } from "react";
import UseAnimations from 'react-useanimations';
import heart from 'react-useanimations/lib/heart';
import Slider from "react-slick";
import volume from 'react-useanimations/lib/volume';
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
  const [showPlayButton, setShowPlayButton] = useState(false);
  const videoRefs = useRef({});

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.7
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          // Ensure video is muted before attempting autoplay
          video.muted = true;
          // Use play().catch to handle autoplay rejection gracefully
          video.play().catch(error => {
            console.log("Autoplay prevented:", error);
            // You could show a play button here if needed
          });
        } else {
          video.pause();
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
    if (videoRefs.current[currentSlide]) {
      if (videoRefs.current[currentSlide].paused) {
        videoRefs.current[currentSlide].play();
      } else {
        videoRefs.current[currentSlide].pause();
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRefs.current[currentSlide]) {
      setIsMuted(!isMuted);
      videoRefs.current[currentSlide].muted = !isMuted;
    }
  };

  const handleTimeUpdate = (index) => {
    if (videoRefs.current[index]) {
      setCurrentTime(videoRefs.current[index].currentTime);
    }
  };

  const handleLoadedMetadata = (index) => {
    if (videoRefs.current[index]) {
      setDuration(videoRefs.current[index].duration);
    }
  };

  const handleTimelineClick = (e) => {
    e.stopPropagation();
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    if (videoRefs.current[currentSlide]) {
      videoRefs.current[currentSlide].currentTime = percent * videoRefs.current[currentSlide].duration;
    }
  };

  const isSquareImage = (mediaUrl) => {
    if (!mediaUrl || getMediaType(mediaUrl) === 'video') return false;
    const img = new Image();
    img.src = mediaUrl;
    return img.width === img.height;
  };

  const renderMedia = (mediaUrl, index) => {
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
              ref={el => videoRefs.current[index] = el}
              className="post-video"
              playsInline
              loop
              muted={isMuted}
              preload="metadata"
              onClick={handleVideoClick}
              onTimeUpdate={() => handleTimeUpdate(index)}
              onLoadedMetadata={() => handleLoadedMetadata(index)}
            >
              <source src={mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {showPlayButton && (
              <div 
                className="play-button-overlay"
                onClick={() => {
                  const video = videoRefs.current[index];
                  video.muted = true;
                  video.play().catch(console.error);
                  setShowPlayButton(false);
                }}
              >
                <button className="play-button">
                  Play Video
                </button>
              </div>
            )}
            
            {showControls && currentSlide === index && (
              <div className="video-controls"  onClick={(e) => {
                e.stopPropagation();
                toggleMute(e);
              }}>
                <UseAnimations
                  animation={volume}
                  size={24}
                  strokeColor="white"
                  className="mute-button"
                  reverse={!isMuted}
                />
                
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
     
      
      <div className="post-media">
        {Array.isArray(media) ? (
          media.length > 1 ? (
            <Slider {...settings}>
              {media.map((mediaUrl, index) => (
                <div key={index} className="media-slide">
                  {renderMedia(mediaUrl, index)}
                </div>
              ))}
            </Slider>
          ) : (
            renderMedia(media[0], 0)
          )
        ) : (
          renderMedia(media, 0)
        )}
      </div>
       <div className="post-header absolute top-0 left-0">
        <div className="post-user">
          <div className="avatar">🧑</div>
          <span className="username">{username}</span>
        </div>
        {/* Optionally: more icon or follow button */}
      </div>

      <div className="post-actions" onClick={() => setIsLiked(!isLiked)}>
        <UseAnimations
          animation={heart}
          size={28}
          reverse={!isLiked}
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
