import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const AISearchPage = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchesLeft, setSearchesLeft] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchesLeft <= 0) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockResults = [
        { id: 1, title: 'The Midnight Library', author: 'Matt Haig', match: '92%' },
        { id: 2, title: 'Project Hail Mary', author: 'Andy Weir', match: '88%' },
        { id: 3, title: 'Klara and the Sun', author: 'Kazuo Ishiguro', match: '85%' }
      ];
      setSearchResults(mockResults);
      setSearchesLeft(prev => prev - 1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-silver">
      {/* Header */}
      <header className="bg-black shadow-sm w-full">
        <div className="mx-auto px-4 py-4 flex justify-between items-center w-full">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="LitVerse Logo" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center space-x-4">
            <div className="bg-[#865DFF] text-white px-4 py-1 rounded-full text-sm font-medium">
              Searches left: {searchesLeft}/5
            </div>
            <Link to="/book-tracker" className="text-[#865DFF] hover:text-bubble-gum font-medium">
              Your Booklist
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - now using flex-grow to fill space */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 w-full">
        <div className="w-full max-w-2xl text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#010A43] mb-4">AI-Powered Book Discovery</h1>
          <p className="text-lg text-[#4A5568]">
            Describe what you're looking for, and our AI will find the perfect books for you.
          </p>
        </div>

        {/* Search Bar */}
        <form 
          onSubmit={handleSearch} 
          className="w-full max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. 'A fantasy book with dragons and adventure'"
              className="w-full px-6 py-4 pr-24 text-lg border-0 focus:ring-2 focus:ring-[#865DFF] rounded-full shadow-md"
              disabled={searchesLeft <= 0}
            />
            <button
              type="submit"
              disabled={!searchQuery || searchesLeft <= 0 || isLoading}
              className={`absolute right-2 top-2 px-6 py-2 rounded-full font-medium ${
                searchesLeft <= 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#865DFF] hover:bg-[#6a3fd3] text-white'
              } transition-colors`}
            >
              {isLoading ? 'Searching...' : 'Find Books'}
            </button>
          </div>
        </form>

        {/* Empty State */}
        {searchResults.length === 0 && (
          <div className="w-full max-w-2xl text-center py-12">
            <h2 className="text-2xl font-medium text-[#010A43] mb-2">Start your search</h2>
            <p className="text-[#1d1132]">
              Describe your perfect book above, and our AI will help find the best recommendations for you.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 w-full">
        <div className="mx-auto text-center text-[#0d1728] text-sm">
          <p>© {new Date().getFullYear()} LitVerse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AISearchPage;