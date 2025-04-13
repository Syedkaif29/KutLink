import React, { useState } from "react";
import "./App.css";
import "./index.css";
import { FaLink, FaCopy, FaQrcode } from "react-icons/fa";
import Sidebar from "./components/Sidebar";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const shortenUrl = async (e) => {
    e.preventDefault();
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:8082/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalUrl: url }),
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setUrl("");
    setResult(null);
    setError("");
    setCopied(false);
  };

  const handleSelectLink = async (link) => {
    try {
      setLoading(true);

      // Set the URL input to the original URL
      setUrl(link.originalUrl);

      // Set the result to display the selected link with the QR code
      setResult({
        originalUrl: link.originalUrl,
        shortUrl: link.shortUrl,
        shortCode: link.shortCode,
        qrCode: link.qrCode,
      });

      // Clear any errors
      setError("");

      // If we're on mobile, close the sidebar to show the result
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    } catch (err) {
      console.error("Error displaying link:", err);
      setError("Failed to display the selected link");

      // Still show the link details even if there's an error
      setResult({
        originalUrl: link.originalUrl,
        shortUrl: link.shortUrl,
        shortCode: link.shortCode,
        qrCode: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onNewLink={resetForm}
        onSelectLink={handleSelectLink}
      />
      <div
        className={`flex-1 p-4 transition-all duration-300 ${
          isSidebarOpen ? "ml-64 md:ml-72" : "ml-0"
        }`}
      >
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-indigo-700 p-4 text-white text-center">
              <h1 className="text-xl md:text-2xl font-bold flex items-center justify-center">
                <FaLink className="mr-2" /> URL Shortener-KutLink
              </h1>
              <p className="text-indigo-200 text-sm md:text-base">
                Create short links with QR codes
              </p>
            </div>

            <div className="p-4 md:p-6">
              <form onSubmit={shortenUrl}>
                <div className="mb-4">
                  <label
                    htmlFor="url"
                    className="block text-gray-200 text-sm font-bold mb-2"
                  >
                    Enter your URL
                  </label>
                  <input
                    type="text"
                    id="url"
                    className="w-full p-2 md:p-3 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm mb-4">{error}</div>
                )}

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "KutLink URL"}
                </button>
              </form>

              {result && (
                <div className="mt-6 p-3 md:p-4 bg-gray-700 rounded border border-gray-600">
                  <h2 className="text-base md:text-lg font-semibold mb-3 text-white">
                    Your Short URL
                  </h2>

                  <div className="flex items-center justify-between mb-4">
                    <div className="truncate text-indigo-300 font-medium mr-2 text-sm md:text-base">
                      <a
                        href={result.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-indigo-200"
                      >
                        {result.shortUrl}
                      </a>
                    </div>
                    <button
                      onClick={() => copyToClipboard(result.shortUrl)}
                      className="bg-gray-600 p-2 rounded hover:bg-gray-500 transition"
                      title="Copy to clipboard"
                    >
                      <FaCopy />
                    </button>
                  </div>

                  <div className="flex justify-center my-4">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-200 mb-2">
                        <FaQrcode className="inline mr-1" /> QR Code
                      </h3>
                      {result.qrCode ? (
                        <>
                          <div className="qr-code-container mx-auto border border-gray-600 p-2 md:p-3 bg-white rounded">
                            <img
                              src={`data:image/png;base64,${result.qrCode}`}
                              alt="QR Code"
                              className="mx-auto max-w-full h-auto"
                            />
                          </div>
                          <button
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = `data:image/png;base64,${result.qrCode}`;
                              link.download = "qrcode.png";
                              link.click();
                            }}
                            className="mt-3 text-sm text-indigo-300 hover:text-indigo-200"
                          >
                            Download QR Code
                          </button>
                        </>
                      ) : (
                        <div className="text-center text-gray-400 py-4">
                          QR code not available
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 mt-3">
                    Original URL:{" "}
                    <span className="truncate block">{result.originalUrl}</span>
                  </div>
                </div>
              )}

              {copied && (
                <div className="fixed bottom-4 right-4 bg-green-600 text-white py-2 px-4 rounded shadow-lg text-sm md:text-base">
                  Copied to clipboard!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
