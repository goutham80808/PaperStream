import { motion } from "framer-motion";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";

export default function ResearchPaperCard({ paper, isActive, onLike }) {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
    onLike(paper, !liked); // Notify parent component
  };

  const handleReload = () => {
    window.location.reload(); // Reload the page
  };

  return (
    <>
      {/* Header Button */}
      <header className="fixed top-0 left-0 w-full p-6 z-50">
        <button
          onClick={handleReload}
          className="text-lg font-semibold text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600 transition-all"
        >
          PaperStream
        </button>
      </header>

      {/* Card */}
      <motion.div
        className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center p-6 overflow-y-auto transition-opacity duration-300 bg-white dark:bg-gray-900 shadow-lg rounded-lg ${
          isActive ? "opacity-100 z-10" : "opacity-0 z-0"
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.9 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* Title */}
        <h2 className="text-3xl font-bold mb-3 text-gray-800 dark:text-white">
          {paper.title}
        </h2>

        {/* Date & Authors */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          {new Date(paper.published).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {paper.authors.join(", ")}
        </p>

        {/* Summary */}
        <p className="text-base text-gray-700 dark:text-gray-300 mb-4 px-4">
          {paper.summary}
        </p>

        {/* Read More & Like Button */}
        <div className="flex items-center gap-4 mt-4">
          <a
            href={`https://arxiv.org/abs/${paper.id.split("/").pop()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600 transition-all"
          >
            Read full paper →
          </a>

          {/* Like Button */}
          <button
            onClick={toggleLike}
            className="text-2xl transition-all hover:scale-110"
          >
            <FaHeart className={liked ? "text-red-500" : "text-gray-400"} />
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Made with 💗 goutham_808
        </footer>
      </motion.div>
    </>
  );
}