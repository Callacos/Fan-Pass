import React from "react";

interface Stamp {
  id: string;
  country: string;
  date: string;
  type: string;
  color?: string;
  image?: string;
}

interface PassportPageProps {
  pageNumber: number;
  stamps: Stamp[];
  onAddStamp: (slotIndex: number, stamp: Stamp) => void;
  onStampClick?: (stamp: Stamp) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  isCurrentPage?: boolean;
  // Suppression des props de navigation
}

const PassportPage: React.FC<PassportPageProps> = ({
  pageNumber,
  stamps,
  onAddStamp,
  onStampClick,
  onPrevious,
  onNext,
  isCurrentPage = false,
  // Suppression des props de navigation
}) => {
  // --- HEADER ---
  return (
    <div
      className="passport-museum-container"
      style={{
        position: "relative",
        width: 440,
        height: 600,
        borderRadius: 24,
        overflow: "hidden",
        boxShadow:
          "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 0 2px #ff007a55, 0 0 40px 0 #ff007a22",
        background:
          "linear-gradient(135deg, rgba(24,18,34,0.7) 0%, rgba(36,20,50,0.8) 60%, rgba(255,0,122,0.10) 100%)",
        backdropFilter: "blur(16px)",
        border: "1.5px solid rgba(255,255,255,0.13)",
      }}
    >
      {/* Effet holo + reflets */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 80% 10%, rgba(255,0,60,0.10) 0%, transparent 60%), " +
            "radial-gradient(circle at 20% 90%, rgba(0,255,255,0.08) 0%, transparent 60%), " +
            "linear-gradient(120deg, rgba(255,255,255,0.07) 0%, transparent 60%)",
        }}
      />
      {/* Navigation flèches */}
      {isCurrentPage && onPrevious && (
        <div
          className="page-click-zone left"
          onClick={onPrevious}
          title="Page précédente"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: 40,
            zIndex: 10,
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 32, color: "#ff007a88" }}>&#8592;</span>
        </div>
      )}
      {isCurrentPage && onNext && (
        <div
          className="page-click-zone right"
          onClick={onNext}
          title="Page suivante"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            width: 40,
            zIndex: 10,
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 32, color: "#ff007a88" }}>&#8594;</span>
        </div>
      )}
      {/* Logo Chiliz au centre en haut */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
          width: 56,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/pims.png"
          alt="Logo Chiliz"
          style={{
            width: 48,
            height: 48,
            objectFit: "contain",
            filter: "drop-shadow(0 0 12px #ff007a88)",
          }}
        />
      </div>
      {/* Boutons Home et Quests verticaux à droite */}
      {/* (SUPPRIMÉ: Les boutons de navigation sont maintenant gérés dans App.tsx) */}
      {/* Section tampons 3D */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          width: "100%",
          height: 360,
          zIndex: 3,
          display: "block",
        }}
      >
        {stamps.map((stamp, idx) => {
          const isFilled = !!stamp.image;
          // Positionnement asymétrique et effet Z
          let slotStyle =
            idx === 0
              ? {
                  left: 32,
                  top: 10,
                  transform: "scale(1.08) rotate(-8deg)",
                  zIndex: 10,
                }
              : idx === 1
              ? {
                  right: 44,
                  bottom: 60,
                  transform: "scale(1.35) rotate(7deg)",
                  zIndex: 12,
                }
              : {
                  left: 80,
                  bottom: -60,
                  transform: "scale(1.12) rotate(-4deg)",
                  zIndex: 9,
                };
          return (
            <div
              key={stamp.id || idx}
              className="museum-stamp-slot"
              style={{
                width: idx === 1 ? 160 : 130,
                height: idx === 1 ? 160 : 130,
                borderRadius: "50%",
                background: "transparent",
                boxShadow: "none",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "absolute",
                overflow: "visible",
                ...slotStyle,
              }}
              onClick={() => onStampClick && onStampClick(stamp)}
            >
              {isFilled ? (
                <img
                  src={stamp.image}
                  alt={stamp.country}
                  style={{
                    width: idx === 1 ? 140 : 110,
                    height: idx === 1 ? 140 : 110,
                    borderRadius: "50%",
                    objectFit: "cover",
                    boxShadow: "0 0 0 2px #fff8",
                    filter:
                      "drop-shadow(0 0 18px #ff007a88) drop-shadow(0 0 24px #00fff755) drop-shadow(0 0 12px #6d28d955)",
                    zIndex: 2,
                    position: "relative",
                  }}
                />
              ) : (
                <img
                  src="/pims.png"
                  alt="Chiliz logo"
                  style={{
                    width: idx === 1 ? 54 : 40,
                    height: idx === 1 ? 54 : 40,
                    opacity: 0.18,
                    filter: "drop-shadow(0 0 12px #ff007a88)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Numéro de page en bas à droite */}
      <div
        style={{
          position: "absolute",
          bottom: 18,
          right: 28,
          fontFamily: "Orbitron, sans-serif",
          fontWeight: 700,
          fontSize: 18,
          color: "#fff",
          opacity: 0.7,
          letterSpacing: 1,
          textShadow: "0 0 8px #ff007a55",
          zIndex: 10,
        }}
      >
        {pageNumber.toString().padStart(2, "0")}
      </div>
    </div>
  );
};

export default PassportPage;

/* Ajout des animations CSS globales */
<style>{`
@keyframes badgePop {
  0% { transform: scale(0.2) rotate(-30deg); opacity: 0; }
  60% { transform: scale(1.15) rotate(8deg); opacity: 1; }
  80% { transform: scale(0.95) rotate(-4deg); }
  100% { transform: scale(1) rotate(0deg); }
}
@keyframes badgeHaloSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes badgeNeonBorder {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}
@keyframes badgeAppear {
  0% { transform: scale(0.2) rotate(-30deg); opacity: 0; }
  60% { transform: scale(1.15) rotate(8deg); opacity: 1; }
  80% { transform: scale(0.95) rotate(-4deg); }
  100% { transform: scale(1) rotate(0deg); }
}
@keyframes badgeGlowPulse {
  0%, 100% { opacity: 0.18; }
  50% { opacity: 0.38; }
}
@keyframes badgeEmptyNeon {
  0% { box-shadow: 0 0 16px #ff007a88, 0 0 32px #00fff744; }
  50% { box-shadow: 0 0 32px #ff007a88, 0 0 48px #00fff744; }
  100% { box-shadow: 0 0 16px #ff007a88, 0 0 32px #00fff744; }
}
`}</style>;
