"use client";

import React, { useState, useEffect } from "react";
import InfiniteScrollPapers from "./Components/InfiniteScrollPapers";
import { FaSpinner } from "react-icons/fa";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
          <p className="ml-2 text-lg text-gray-600">Loading...</p>
        </div>
      ) : (
        <>
          
          <main className="flex-1 w-full min-h-screen overflow-hidden">
            <InfiniteScrollPapers />
          </main>
          
        </>
      )}
    </div>
  );
}

export default App;
