import { useState } from "react";
import ResearchPaperCard from "./ResearchPaperCard";

export default function ResearchPaperList({ papers }) {
  const [likedPapers, setLikedPapers] = useState({});
  const [showFavorites, setShowFavorites] = useState(false);

  const handleLike = (paper, isLiked) => {
    setLikedPapers((prev) => {
      const updated = { ...prev };
      if (isLiked) updated[paper.id] = paper;
      else delete updated[paper.id];
      return updated;
    });
  };

  const displayedPapers = showFavorites
    ? Object.values(likedPapers)
    : papers;

  return (
    <div className="relative w-full h-screen">
      {/* Favorites Button */}
      <buttons
        onClick={() => setShowFavorites(!showFavorites)}
        className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all"
      >
        {showFavorites ? "Show All" : "Show Favorites"}
      </button>

      {/* Research Papers */}
      {displayedPapers.map((paper, index) => (
        <ResearchPaperCard
          key={paper.id}
          paper={paper}
          isActive={index === 0} // Example logic to show first paper
          onLike={handleLike}
          isLiked={!!likedPapers[paper.id]}
        />
      ))}
    </div>
  );
}
