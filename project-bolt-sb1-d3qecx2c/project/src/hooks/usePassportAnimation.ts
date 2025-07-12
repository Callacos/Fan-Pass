import { useState, useCallback } from 'react';

export const usePassportAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward');

  const startAnimation = useCallback((direction: 'forward' | 'backward') => {
    setIsAnimating(true);
    setAnimationDirection(direction);
    
    // Animation fluide et réactive - synchronisée avec le CSS
    setTimeout(() => {
      setIsAnimating(false);
    }, 400); // Durée réduite pour plus de réactivité
  }, []);

  return {
    isAnimating,
    animationDirection,
    startAnimation,
  };
};