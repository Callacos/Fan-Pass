import React from "react";
import meta from "../image/meta.png";

interface PassportVachetteProps {
  onOpen?: () => void;
  onConnect?: () => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

const PassportVachette: React.FC<PassportVachetteProps> = ({
  onOpen,
  onConnect,
  title = "Passeport Vachette",
  subtitle = "Document officiel",
  className = "",
}) => {
  return (
    <div
      className={`passport-vachette ${className}`}
      onClick={onOpen}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onKeyDown={onOpen ? (e) => e.key === "Enter" && onOpen() : undefined}
    >
      <div className="passport-vachette-content">
        <div className="passport-vachette-header"></div>

        <div className="passport-vachette-image">
          {/* Remplacement de l'image par un design futuriste */}
          <div className="futuristic-vachette-bg">
            <div className="vachette-logo">CHILIZ</div>
            <div className="vachette-pattern"></div>
          </div>

          {/* Bouton Se connecter au centre */}
          <div className="passport-vachette-connect-overlay">
            <button
              onClick={onConnect}
              className="passport-vachette-connect-button"
            >
              <img src={meta} alt="MetaMask Logo" className="w-6 h-6 mr-2" />
              Se connecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassportVachette;
