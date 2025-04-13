import React, { useState, useEffect } from "react";

const Sidebar = ({ isOpen, setIsOpen, onNewLink, onSelectLink }) => {
  const [linkHistory, setLinkHistory] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchDate, setSearchDate] = useState("");
  const [searchType, setSearchType] = useState("all"); // "all", "today", "week", "month"

  useEffect(() => {
    fetchLinkHistory();
  }, []);

  useEffect(() => {
    filterLinksByDate();
  }, [linkHistory, searchDate, searchType]);

  const fetchLinkHistory = async () => {
    try {
      const response = await fetch("http://localhost:8082/api/history");
      if (!response.ok) {
        throw new Error("Failed to fetch link history");
      }
      const data = await response.json();
      setLinkHistory(data);
      setFilteredLinks(data);
    } catch (error) {
      console.error("Error fetching link history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLinksByDate = () => {
    if (searchType === "all") {
      setFilteredLinks(linkHistory);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filtered = linkHistory.filter((link) => {
      const linkDate = new Date(link.createdAt);
      linkDate.setHours(0, 0, 0, 0);

      if (searchType === "today") {
        return linkDate.getTime() === today.getTime();
      } else if (searchType === "week") {
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        return linkDate >= oneWeekAgo && linkDate <= today;
      } else if (searchType === "month") {
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);
        return linkDate >= oneMonthAgo && linkDate <= today;
      } else if (searchDate) {
        const searchDateObj = new Date(searchDate);
        searchDateObj.setHours(0, 0, 0, 0);
        return linkDate.getTime() === searchDateObj.getTime();
      }

      return true;
    });

    setFilteredLinks(filtered);
  };

  const handleNewLink = () => {
    if (onNewLink) {
      onNewLink();
    }
  };

  const handleLinkClick = (link) => {
    if (onSelectLink) {
      onSelectLink(link);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 z-50 bg-gray-900 text-white p-2 rounded-r-lg transition-all duration-300 ${
          isOpen ? "left-64 md:left-72" : "left-0"
        }`}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`w-64 md:w-72 h-screen bg-gray-900 text-white p-4 fixed left-0 top-0 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 mt-12">
          {/* New Link Button */}
          <button
            onClick={handleNewLink}
            className="w-full mb-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Link
          </button>

          <h2 className="text-xl font-bold mb-4 text-white">Link History</h2>

          {/* Date Search Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Date
            </label>
            <select
              className="w-full bg-gray-800 text-white rounded-md p-2 mb-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="all">All Links</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="custom">Custom Date</option>
            </select>

            {searchType === "custom" && (
              <input
                type="date"
                className="w-full bg-gray-800 text-white rounded-md p-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLinks.length === 0 ? (
                <div className="text-center text-gray-400 py-4">
                  No links found for the selected date filter
                </div>
              ) : (
                filteredLinks.map((link) => (
                  <div
                    key={link.id}
                    className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => handleLinkClick(link)}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate max-w-full break-all text-white">
                          {link.originalUrl}
                        </p>
                        <p className="text-xs text-gray-300 truncate max-w-full break-all">
                          {link.shortUrl}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(link.shortUrl);
                        }}
                        className="text-gray-400 hover:text-white flex-shrink-0"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      Created: {new Date(link.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
