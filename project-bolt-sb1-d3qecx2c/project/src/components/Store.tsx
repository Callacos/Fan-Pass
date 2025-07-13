import React from "react";
import ParticlesBackground from "./background";
import zlatanImage from "../image/zlatan.png";
import ldcImage from "../image/LDC.png";

// Exemple d'images NFT (à remplacer par vos vraies images)
const LIMITED_NFTS = [
  {
    key: "Champions d'Europe",
    name: "Champions League NFT",
    description: "Limited edition, only 1000 copies.",
    image: ldcImage,
    price: 0,
  },
  {
    key: "The king",
    name: "Zlatan NFT",
    description: "Ultra-limited edition, only 100 copies.",
    image: zlatanImage,
    price: 8,
  },
];

interface StoreProps {
  fanTokens: number;
  onBuy: (nftKey: string) => void;
  onGoPassport: () => void;
  onGoQuests: () => void;
  onGoHome: () => void;
}

const Store: React.FC<StoreProps> = ({ fanTokens, onBuy, onGoPassport, onGoQuests, onGoHome }) => {
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleBuy = async (key: string) => {
    setLoading(key);
    await onBuy(key);
    setLoading(null);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center font-orbitron py-8 relative overflow-hidden">
      <ParticlesBackground />
      {/* Navigation */}
      <div className="absolute top-4 left-4 flex gap-4 z-20">
        <button
          onClick={onGoHome}
          className="cyber-action-button primary"
          style={{ minWidth: 110, padding: '0.5rem 1.2rem', fontSize: '0.95rem' }}
        >
          HOME
          <div className="button-glow"></div>
          <div className="button-border"></div>
        </button>
        <button
          onClick={onGoPassport}
          className="cyber-action-button secondary"
          style={{ minWidth: 110, padding: '0.5rem 1.2rem', fontSize: '0.95rem' }}
        >
          PASSPORT
          <div className="button-glow"></div>
          <div className="button-border"></div>
        </button>
        <button
          onClick={onGoQuests}
          className="cyber-action-button secondary"
          style={{ minWidth: 110, padding: '0.5rem 1.2rem', fontSize: '0.95rem' }}
        >
          QUESTS
          <div className="button-glow"></div>
          <div className="button-border"></div>
        </button>
      </div>
      <h1 className="text-4xl font-bold mb-10 text-red-500 drop-shadow-lg tracking-widest uppercase">NFT Store</h1>
      <div
        className="absolute top-6 right-6 z-50"
        style={{ marginTop: "2.5rem" }}
      >
        <div className="token-counter">
          <div className="token-info">
            <span className="token-label">FAN TOKENS</span>
            <span className="token-value">{fanTokens}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-8 justify-center w-full max-w-4xl">
        {LIMITED_NFTS.map((nft) => (
          <div
            key={nft.key}
            className="bg-gradient-to-br from-[#181222] via-[#241432] to-[#ff007a22] border-2 border-pink-500 rounded-2xl shadow-2xl p-8 min-w-[260px] flex flex-col items-center transition-transform duration-300 hover:scale-105 relative group"
          >
            <img src={nft.image} alt={nft.name} className="w-32 h-32 object-contain mb-4 rounded-xl border-2 border-pink-400 shadow-lg bg-white" />
            <div className="text-2xl font-bold mb-2 text-white text-center group-hover:text-pink-300 transition-colors duration-300">
              {nft.name}
            </div>
            <div className="text-base text-pink-100 mb-6 text-center max-w-xs">
              {nft.description}
            </div>
            <button
              className={`cyber-action-button secondary w-full mt-2 ${loading === nft.key ? 'opacity-60 cursor-not-allowed' : ''}`}
              style={{
                minWidth: 110,
                padding: '0.5rem 1.2rem',
                fontSize: '0.95rem',
              }}
              disabled={loading === nft.key || fanTokens < nft.price}
              onClick={() => handleBuy(nft.key)}
            >
              {loading === nft.key ? 'Purchase in progress...' : `Buy (${nft.price} Fan Tokens)`}
              <div className="button-glow"></div>
              <div className="button-border"></div>
            </button>
            {fanTokens < nft.price && (
              <div className="text-xs text-pink-300 mt-2">Not enough Fan Tokens</div>
            )}
            <div className="absolute -inset-1 rounded-2xl pointer-events-none group-hover:shadow-pink-400/40 group-hover:shadow-2xl transition-all duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;
