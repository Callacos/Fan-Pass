import React from 'react';
import passeImage from '../image/passe.png';

interface PassportCoverProps {
  isOpen: boolean;
  onOpen: () => void;
}

const PassportCover: React.FC<PassportCoverProps> = ({ isOpen, onOpen }) => {
  return (
    <div 
      className={`passport-cover relative w-80 h-96 cursor-pointer transition-all duration-700 ${
        isOpen ? 'transform -translate-x-4 rotate-y-12' : 'hover:scale-105'
      }`}
      onClick={onOpen}
      style={{ 
        transform: isOpen ? 'perspective(1000px) rotateY(-12deg) translateX(-20px)' : 'none',
        transformOrigin: 'right center'
      }}
    >
      <img 
        src={passeImage} 
        alt="Passeport" 
        className="w-full h-full object-cover"
        style={{
          filter: 'contrast(1.2) brightness(0.9)',
          backgroundColor: 'transparent'
        }}
      />
    </div>
  );
};

export default PassportCover;