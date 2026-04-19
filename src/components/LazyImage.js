import React, { useState, useEffect, useRef } from 'react';

function LazyImage({ src, alt, className, placeholder }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`lazy-image-wrapper ${className}`}>
      {!isLoaded && <div className="lazy-placeholder">{placeholder || <i className="fas fa-spinner fa-spin"></i>}</div>}
      {isVisible && <img src={src} alt={alt} onLoad={() => setIsLoaded(true)} style={{ display: isLoaded ? 'block' : 'none' }} />}
    </div>
  );
}

export default LazyImage;
