import React from "react";
import passeportChiliz from "../image/passeport-chiliz.png";

interface PassportCoverProps {
  isOpen: boolean;
  onOpen: () => void;
}

const PassportCover: React.FC<PassportCoverProps> = ({ onOpen }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
      onClick={onOpen}
    >
      <img
        src={passeportChiliz}
        alt="Passeport Chiliz"
        style={{
          maxWidth: "340px",
          width: "100%",
          height: "auto",
          borderRadius: "18px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          cursor: "pointer",
          transition: "transform 0.2s",
        }}
      />
    </div>
  );
};

export default PassportCover;
