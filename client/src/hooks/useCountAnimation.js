// Hook for animating numbers when they come into view
import { useEffect, useRef, useState } from 'react';

const useCountAnimation = (end, duration = 2000, suffix = '', prefix = '') => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Extract numeric value from end string
    const numericEnd = parseFloat(end.toString().replace(/[^0-9.]/g, ''));
    
    if (isNaN(numericEnd)) {
      setCount(end);
      return;
    }

    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Ease out cubic function for smooth animation
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeProgress * numericEnd);

      if (progress < 1) {
        setCount(currentCount);
        requestAnimationFrame(updateCount);
      } else {
        setCount(numericEnd);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isVisible, end, duration]);

  // Format the display value
  const getDisplayValue = () => {
    if (typeof end === 'string') {
      // Handle special formats
      if (end.includes('M')) {
        return `${prefix}${count}M${suffix}`;
      } else if (end.includes('K')) {
        return `${prefix}${count}K${suffix}`;
      } else if (end.includes('%')) {
        return `${count}%`;
      } else if (end.includes('+')) {
        return `${prefix}${count}+${suffix}`;
      } else if (end.includes('.')) {
        return `${prefix}${count.toFixed(1)}${suffix}`;
      }
    }
    return `${prefix}${count}${suffix}`;
  };

  return { ref: elementRef, value: getDisplayValue() };
};

export default useCountAnimation;
