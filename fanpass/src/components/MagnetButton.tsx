import React, { useRef, useEffect, useState } from 'react';

interface MagnetButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  strength?: number; // Force de l'effet magnétique (0-1)
  distance?: number; // Distance d'activation de l'effet
}

const MagnetButton: React.FC<MagnetButtonProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  strength = 0.3,
  distance = 100
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (disabled) return;

      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distanceFromCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distanceFromCenter < distance) {
        setIsHovered(true);
        const moveX = deltaX * strength;
        const moveY = deltaY * strength;
        setTransform({ x: moveX, y: moveY });
      } else {
        setIsHovered(false);
        setTransform({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setTransform({ x: 0, y: 0 });
    };

    document.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [disabled, strength, distance]);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      className={`transition-all duration-300 ease-out ${className}`}
      style={{
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        transition: isHovered ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      {children}
    </button>
  );
};

export default MagnetButton;
