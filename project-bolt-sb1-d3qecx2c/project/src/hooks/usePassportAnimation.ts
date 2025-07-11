import { useState, useCallback } from 'react';

export const usePassportAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward');

  const startAnimation = useCallback((direction: 'forward' | 'backward') => {
    if (isAnimating) return; // Empêche les animations multiples
    
    setIsAnimating(true);
    setAnimationDirection(direction);
    
    // Animation plus courte et plus fluide
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  }, [isAnimating]);

  return {
    isAnimating,
    animationDirection,
    startAnimation,
  };
};