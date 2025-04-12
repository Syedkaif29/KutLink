import React, { useState } from 'react';
import './App.css';
import './index.css';
import { FaLink, FaCopy, FaQrcode } from 'react-icons/fa';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const shortenUrl = async (e) => {
    e.preventDefault();
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:8080/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl: url }),
      });

      if (!response.ok) {
        throw new Error('Failed to shorten URL');
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-4 text-white text-center">
            <h1 className="text-2xl font-bold flex items-center justify-center">
              <FaLink className="mr-2" /> URL Shortener-KutLink
            </h1>
            <p className="text-blue-100">Create short links with QR codes</p>
          </div>
          
          <div className="p-6">
            <form onSubmit={shortenUrl}>
              <div className="mb-4">
                <label htmlFor="url" className="block text-gray-700 text-sm font-bold mb-2">
                  Enter your URL
                </label>
                <input
                  type="text"
                  id="url"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              
              {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'KutLink URL'}
              </button>
            </form>
            
            {result && (
              <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
                <h2 className="text-lg font-semibold mb-3">Your Short URL</h2>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="truncate text-blue-600 font-medium mr-2">
                    <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">
                      {result.shortUrl}
                    </a>
                  </div>
                  <button
                    onClick={() => copyToClipboard(result.shortUrl)}
                    className="bg-gray-200 p-2 rounded hover:bg-gray-300 transition"
                    title="Copy to clipboard"
                  >
                    <FaCopy />
                  </button>
                </div>
                
                <div className="flex justify-center my-4">
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      <FaQrcode className="inline mr-1" /> QR Code
                    </h3>
                    <div className="qr-code-container mx-auto border border-gray-200 p-3 bg-white rounded">
                      <img
                        src={`data:image/png;base64,${result.qrCode}`}
                        alt="QR Code"
                        className="mx-auto"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = `data:image/png;base64,${result.qrCode}`;
                        link.download = 'qrcode.png';
                        link.click();
                      }}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Download QR Code
                    </button>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mt-3">
                  Original URL: <span className="truncate block">{result.originalUrl}</span>
                </div>
              </div>
            )}
            
            {copied && (
              <div className="fixed bottom-4 right-4 bg-green-600 text-white py-2 px-4 rounded shadow-lg">
                Copied to clipboard!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;