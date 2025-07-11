import React from 'react';
import { Shield, Star } from 'lucide-react';

interface PassportCoverProps {
  isOpen: boolean;
  onOpen: () => void;
}

const PassportCover: React.FC<PassportCoverProps> = ({ isOpen, onOpen }) => {
  return (
    <div 
      className={`passport-cover relative w-80 h-96 rounded-lg shadow-2xl cursor-pointer transition-all duration-700 ${
        isOpen ? 'transform -translate-x-4 rotate-y-12' : 'hover:scale-105'
      }`}
      onClick={onOpen}
      style={{ 
        transform: isOpen ? 'perspective(1000px) rotateY(-12deg) translateX(-20px)' : 'none',
        transformOrigin: 'right center'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-700 rounded-lg" />
      
      <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-white/90" />
          <h1 className="text-2xl font-bold mb-2">PASSEPORT</h1>
          <div className="flex justify-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current text-yellow-300" />
            ))}
          </div>
          <p className="text-sm text-white/80 font-medium">RÉPUBLIQUE FRANÇAISE</p>
        </div>
        
        <div className="text-center">
          <div className="border-2 border-white/30 rounded-lg p-4 bg-white/10 backdrop-blur-sm">
            <p className="text-lg font-semibold mb-1">VOYAGE</p>
            <p className="text-sm text-white/80">Collection de Tampons</p>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-white/60">Cliquez pour ouvrir</p>
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
        <div className="w-4 h-4 bg-white rounded-full" />
      </div>
    </div>
  );
};

export default PassportCover;