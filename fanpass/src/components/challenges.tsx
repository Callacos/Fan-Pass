import React from "react";
import { useWeb3 } from "../hooks/useWeb3";
import ParticlesBackground from "./background";

const NFT_QUESTS = [
  {
    key: "bronze",
    name: "Bronze Star",
    description: "Reward for your first steps as a supporter.",
  },
  {
    key: "welcome",
    name: "Welcome, young supporter!",
    description: "For joining the PSG community.",
  },
  {
    key: "carte_postale",
    name: "Welcome to the USA!",
    description: "For following PSG internationally.",
  },
  {
    key: "compulsive_buyer",
    name: "Why so many jerseys?!",
    description: "For the jersey collectors.",
  },
  {
    key: "first_match",
    name: "First time at the Parc!",
    description: "For your first visit to Parc des Princes.",
  },
  {
    key: "tenth_match",
    name: "10th time at Parc des Princes!",
    description: "For the loyal fans of the Parc.",
  },
];

const FILTERS = [
  { key: "all", label: "All", emoji: "🌐" },
  { key: "completed", label: "Completed", emoji: "✅" },
  { key: "active", label: "Active", emoji: "🔥" },
  { key: "locked", label: "Locked", emoji: "🔒" },
  { key: "xp", label: "+500xp", emoji: "💎" },
];

interface ChallengesProps {
  onBackToMenu?: () => void;
  onOpenCollection?: () => void;
}

const Challenges: React.FC<ChallengesProps> = ({
  onBackToMenu,
  onOpenCollection,
}) => {
  const { mintNftForUser, userAddress, connectWallet } = useWeb3();
  const [loading, setLoading] = React.useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = React.useState("all");

  const handleMint = async (key: string) => {
    if (!userAddress) {
      await connectWallet();
      return;
    }
    setLoading(key);
    await mintNftForUser(key);
    setLoading(null);
  };

  // Mock de statut pour la démo (à remplacer par la vraie logique métier)
  const getQuestStatus = (q: any) => {
    if (q.key === "bronze" || q.key === "welcome") return "completed";
    if (q.key === "carte_postale" || q.key === "compulsive_buyer")
      return "active";
    if (q.key === "first_match") return "locked";
    if (q.key === "tenth_match") return "xp";
    return "active";
  };

  const filteredQuests = NFT_QUESTS.filter((q) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "completed")
      return getQuestStatus(q) === "completed";
    if (selectedFilter === "active") return getQuestStatus(q) === "active";
    if (selectedFilter === "locked") return getQuestStatus(q) === "locked";
    if (selectedFilter === "xp") return getQuestStatus(q) === "xp";
    return true;
  });

  return (
    <div className="w-full flex flex-col items-center justify-center font-orbitron py-8 relative min-h-screen overflow-hidden">
      <ParticlesBackground />
      {/* Navigation Buttons */}
      <div className="absolute top-4 left-4 flex gap-4 z-20">
        {onBackToMenu && (
          <button
            onClick={onBackToMenu}
            className="cyber-action-button primary"
            style={{
              minWidth: 110,
              padding: "0.5rem 1.2rem",
              fontSize: "0.95rem",
            }}
          >
            HOME
            <div className="button-glow"></div>
            <div className="button-border"></div>
          </button>
        )}
        {onOpenCollection && (
          <button
            onClick={onOpenCollection}
            className="cyber-action-button secondary"
            style={{
              minWidth: 110,
              padding: "0.5rem 1.2rem",
              fontSize: "0.95rem",
            }}
          >
            PASSPORT
            <div className="button-glow"></div>
            <div className="button-border"></div>
          </button>
        )}
      </div>
      <h1 className="text-4xl font-bold mb-6 text-pink-500 drop-shadow-lg tracking-widest uppercase">
        NFT Quests
      </h1>
      {/* Filtres de quêtes */}
      <div className="flex flex-row gap-4 mb-10">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setSelectedFilter(f.key)}
            className={`cyber-action-button ${
              selectedFilter === f.key ? "primary" : "secondary"
            } px-4 py-2 flex items-center gap-2`}
            style={{
              fontSize: "1rem",
              minWidth: 110,
              opacity: selectedFilter === f.key ? 1 : 0.7,
            }}
          >
            <span>{f.emoji}</span>
            <span>{f.label}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-8 justify-center w-full max-w-4xl">
        {filteredQuests.map((q) => (
          <div
            key={q.key}
            className="bg-gradient-to-br from-[#181222] via-[#241432] to-[#ff007a22] border-2 border-pink-500 rounded-2xl shadow-2xl p-8 min-w-[260px] flex flex-col items-center transition-transform duration-300 hover:scale-105 relative group"
          >
            <div className="text-2xl font-bold mb-2 text-white text-center group-hover:text-pink-300 transition-colors duration-300">
              {q.name}
            </div>
            <div className="text-base text-pink-100 mb-6 text-center max-w-xs">
              {q.description}
            </div>
            <button
              className={`cyber-action-button secondary w-full mt-2 ${
                loading === q.key ? "opacity-60 cursor-not-allowed" : ""
              }`}
              style={{
                minWidth: 110,
                padding: "0.5rem 1.2rem",
                fontSize: "0.95rem",
              }}
              disabled={loading === q.key}
              onClick={() => handleMint(q.key)}
            >
              {loading === q.key
                ? "Minting in progress..."
                : "Validate & Get the NFT"}
              <div className="button-glow"></div>
              <div className="button-border"></div>
            </button>
            <div className="absolute -inset-1 rounded-2xl pointer-events-none group-hover:shadow-pink-400/40 group-hover:shadow-2xl transition-all duration-300" />
          </div>
        ))}
      </div>
      <div className="mt-10 text-sm text-red-200">
        {userAddress ? (
          <span className="bg-gray-800 px-3 py-1 rounded-lg border border-red-500 text-red-200 font-mono">
            Connected: {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
          </span>
        ) : (
          <span className="bg-gray-800 px-3 py-1 rounded-lg border border-red-500 text-red-200">
            Connect your wallet to mint
          </span>
        )}
      </div>
    </div>
  );
};

export default Challenges;
