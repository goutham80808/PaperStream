"use client";

import { useState } from "react";
import { Heart, MessageSquare, Share2, Bookmark } from "lucide-react";

export default function PaperCard({ paper, isActive }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(paper.link).then(() => {
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 2000);
    });
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full min-h-screen bg-white dark:bg-gray-900 p-6 overflow-y-auto transition-opacity duration-300 flex flex-col ${
        isActive ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}
    >
      {/* Content */}
      <div className="flex-grow overflow-y-auto">
        <div className="flex flex-wrap gap-2 mb-4">
          {paper.categories.map((category, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {category}
            </span>
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{paper.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm italic">
          {paper.authors.join(", ")}
        </p>
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
          {paper.summary}
        </p>
      </div>

      {/* Interaction Section */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <button
              onClick={() => setIsLiked((prev) => !prev)}
              className={`flex items-center gap-1 ${
                isLiked ? "text-red-500" : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-sm">{isLiked ? "Liked" : "Like"}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm">Comment</span>
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setIsBookmarked((prev) => !prev)}
              className={`flex items-center gap-1 ${
                isBookmarked ? "text-blue-500" : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={handleShare}
              className="text-gray-600 dark:text-gray-400 relative"
            >
              <Share2 className="w-5 h-5" />
              {showCopiedMessage && (
                <span
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded"
                  aria-live="polite"
                >
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>
        <a
          href={paper.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Read Full Paper
        </a>
      </div>

    </div>
  );
}
