"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import useSWRInfinite from "swr/infinite";
import PaperCard from "./ResearchPaperCard";
import { ArrowUp, ArrowDown } from "lucide-react";
import { FaSpinner } from "react-icons/fa";
import { debounce, shuffle } from "lodash";

const fetcher = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch papers");
    
    const text = await res.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    
    const entries = xmlDoc.getElementsByTagName("entry");
    let papers = Array.from(entries).map((entry) => ({
      id: entry.getElementsByTagName("id")[0]?.textContent,
      title: entry.getElementsByTagName("title")[0]?.textContent,
      summary: entry.getElementsByTagName("summary")[0]?.textContent,
      authors: Array.from(entry.getElementsByTagName("author")).map(
        (author) => author.getElementsByTagName("name")[0]?.textContent
      ),
      published: entry.getElementsByTagName("published")[0]?.textContent,
      categories: Array.from(entry.getElementsByTagName("category")).map(
        (category) => category.getAttribute("term")
      ),
      link: entry.getElementsByTagName("id")[0]?.textContent,
    }));
    return shuffle(papers);
  } catch (error) {
    console.error("Error fetching papers:", error);
    return [];
  }
};

const PAGE_SIZE = 10;

export default function InfiniteScrollPapers() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  const { data, error, size, setSize } = useSWRInfinite(
    (index) =>
      `https://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.CL+OR+cat:cs.CV&start=${
        index * PAGE_SIZE
      }&max_results=${PAGE_SIZE}&sortBy=submittedDate&sortOrder=descending`,
    fetcher
  );

  const papers = data ? data.flat() : [];
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

  // Optimize scroll event handling
  const handleScroll = useCallback(
    debounce((event) => {
      setCurrentIndex((prevIndex) => {
        if (event.deltaY > 0 && prevIndex < papers.length - 1) {
          return prevIndex + 1;
        } else if (event.deltaY < 0 && prevIndex > 0) {
          return prevIndex - 1;
        }
        return prevIndex;
      });
    }, 50),
    [papers.length]
  );

  // Optimize keyboard navigation
  const handleKeyDown = useCallback(
    debounce((event) => {
      setCurrentIndex((prevIndex) => {
        if (event.key === "ArrowDown" && prevIndex < papers.length - 1) {
          return prevIndex + 1;
        } else if (event.key === "ArrowUp" && prevIndex > 0) {
          return prevIndex - 1;
        }
        return prevIndex;
      });
    }, 50),
    [papers.length]
  );

  useEffect(() => {
    window.addEventListener("wheel", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleScroll, handleKeyDown]);

  useEffect(() => {
    if (currentIndex === papers.length - 1 && !isReachingEnd && !isLoadingMore) {
      setSize(size + 1);
    }
  }, [currentIndex, papers.length, isReachingEnd, isLoadingMore, setSize, size]);

  const scrollToTop = () => {
    if (currentIndex !== 0) {
      setCurrentIndex(0);
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Failed to load papers. Please try again later.
      </div>
    );

  if (isLoadingInitialData)
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin h-6 w-6 text-blue-500" />
        <span className="ml-2 text-lg text-gray-600">Loading papers...</span>
      </div>
    );

    return (
        <div ref={containerRef} className="w-full min-h-screen flex flex-col items-center justify-start overflow-hidden relative">
          <div className="w-full flex flex-col items-center justify-start">
            {papers.length === 0 && (
              <p className="text-gray-600 text-lg mt-10">No papers available</p>
            )}
      
            {papers.map((paper, index) => (
              <PaperCard key={paper.id} paper={paper} isActive={index === currentIndex} />
            ))}
      
            {isLoadingMore && (
              <div className="flex items-center justify-center w-full my-4">
                <FaSpinner className="animate-spin h-6 w-6 text-blue-500" />
                <span className="ml-2 text-lg text-gray-600">Loading more papers...</span>
              </div>
            )}
          </div>
      
          {/* Scroll Navigation Buttons */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
            <button
              className={`p-2 rounded-full shadow-lg ${
                currentIndex === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"
              }`}
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              aria-label="Previous paper"
            >
              <ArrowUp className="h-6 w-6" />
            </button>
            <button
              className={`p-2 rounded-full shadow-lg ${
                currentIndex === papers.length - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"
              }`}
              onClick={() => setCurrentIndex(Math.min(papers.length - 1, currentIndex + 1))}
              disabled={currentIndex === papers.length - 1}
              aria-label="Next paper"
            >
              <ArrowDown className="h-6 w-6" />
            </button>
            
          </div>
        </div>
      );
      
}