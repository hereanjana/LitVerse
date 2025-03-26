import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const genresList = [
  "fiction",
  "mystery",
  "thriller",
  "horror",
  "romance",
  "fantasy",
  "science-fiction",
  "dystopian",
  "historical-fiction",
  "biography",
  "history",
  "self-help",
  "psychology",
  "philosophy",
  "spirituality",
  "business",
  "economics",
  "technology",
  "science",
  "art",
  "poetry",
  "drama",
  "comedy",
  "crime",
  "adventure",
  "young-adult",
  "children",
  "cookbooks",
  "travel",
  "health",
  "sports",
  "education"
];

const Genres = () => {
  const [selectedGenre, setSelectedGenre] = useState("fiction");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://openlibrary.org/subjects/${selectedGenre}.json?limit=12`
        );
        setBooks(response.data.works || []);
      } catch (error) {
        console.error(`Error fetching books for ${selectedGenre}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [selectedGenre]);

  const handleViewDetails = (bookKey) => {
    const bookId = bookKey.split("/").pop();
    navigate(`/book/${bookId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <div className="flex flex-col md:flex-row flex-grow mt-20">
        {/* Genre Sidebar */}
        <div className="w-full md:w-64 bg-indigo-900 p-4 overflow-y-auto">
          <h1 className="text-xl font-bold text-white mb-4">Browse Genres</h1>
          <div className="space-y-2">
            {genresList.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  selectedGenre === genre
                    ? "bg-indigo-600 text-white font-medium shadow-md"
                    : "text-indigo-200 hover:bg-indigo-800 hover:text-white"
                }`}
              >
                {genre.split("-").map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(" ")}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 ">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {selectedGenre.split("-").map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(" ")} Books
            </h2>
            <p className="text-2xl text-gray-600 ">Discover amazing books in this genre</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 h-64 rounded-lg"></div>
                  <div className="h-4 bg-gray-300 rounded mt-3 w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded mt-2 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {books.length > 0 ? (
                books.map((book) => (
                  <div
                    key={book.key}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="aspect-[2/3] bg-gray-200 flex items-center justify-center">
                      {book.cover_id ? (
                        <img
                          src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">No cover available</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {book.authors?.[0]?.name || "Unknown Author"}
                      </p>
                      <button
                        onClick={() => handleViewDetails(book.key)}
                        className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No books found for this genre</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Genres;