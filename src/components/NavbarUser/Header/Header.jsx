import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { assetsUser } from '../../../assets/assetsUser';

const Header = () => {
  // Array of image URLs for the slideshow
  const images = [
    assetsUser.main1,
    assetsUser.main2,
    assetsUser.main3,
    assetsUser.main4,
    assetsUser.main5
  ];

  // State to track the current image index and slideshow state (active or paused)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // Controls whether the slideshow is paused
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);

  const sliderRef = useRef(null);

  // Preload images for smoother transitions
  useEffect(() => {
    images.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  }, []);

  // Function to change the image
  const changeImage = (direction) => {
    setCurrentImageIndex((prevIndex) => {
      if (direction === 'next') {
        return (prevIndex + 1) % images.length;
      } else if (direction === 'prev') {
        return (prevIndex - 1 + images.length) % images.length;
      }
      return prevIndex;
    });
  };

  // Set up interval for automatic image change
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => changeImage('next'), 5000); // Change image every 5 seconds
      return () => clearInterval(interval); // Clear interval on component unmount or when paused
    }
  }, [isPaused]);

  // Drag-to-slide functionality
  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStart(e.clientX || e.touches[0].clientX);
  };

  const handleDragMove = (e) => {
    if (isDragging) {
      const diff = (e.clientX || e.touches[0].clientX) - dragStart;
      if (diff > 100) {
        changeImage('prev');
        setDragStart(e.clientX || e.touches[0].clientX); // Update drag start position
        setIsDragging(false);
      } else if (diff < -100) {
        changeImage('next');
        setDragStart(e.clientX || e.touches[0].clientX); // Update drag start position
        setIsDragging(false);
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragStart(0);
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div
      className="header"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="slideshow-container"
        ref={sliderRef}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {/* Image Display */}
        <div
          className="slideshow-image"
          style={{
            backgroundImage: `url(${images[currentImageIndex]})`,
            transition: 'background-image 1s ease-in-out', // Smooth image transition
          }}
        ></div>

        {/* Navigation Arrows */}
        <div className="slideshow-nav">
          {/* Prev button */}
          <button className="prev" onClick={() => changeImage('prev')}>
            &#10094;
          </button>

          {/* Next button */}
          <button className="next" onClick={() => changeImage('next')}>
            &#10095;
          </button>
        </div>

        {/* Dots for Navigation */}
        <div className="slideshow-dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
