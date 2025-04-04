// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";
// import Footer from "../components/Footer";

// const genresList = [
//   "fiction",
//   "mystery",
//   "thriller",
//   "romance",
//   "fantasy",
//   "science fiction",
//   "biography",
//   "history",
//   "self-help",
//   "business",
//   "technology",
//   "science",
//   "art",
//   "poetry",
//   "young adult",
//   "children",
//   "cooking",
//   "travel",
//   "health",
//   "sports"
// ];

// const Genres = () => {
//   const [selectedGenre, setSelectedGenre] = useState("fiction");
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const API_KEY ="AIzaSyD8tijLS3jcvhLN_K7menejbhQxqOc1Vio";

//   useEffect(() => {
//     const fetchBooks = async () => {
//       setLoading(true);
//       try {
//         // First try Google Books API
//         const response = await axios.get(
//           `https://www.googleapis.com/books/v1/volumes?q=subject:${selectedGenre}&maxResults=12&key=${API_KEY}`
//         );
        
//         if (response.data.items && response.data.items.length > 0) {
//           setBooks(response.data.items);
//         } else {
//           // Fallback to Open Library if no results
//           const fallbackResponse = await axios.get(
//             `https://openlibrary.org/subjects/${selectedGenre.replace(/\s+/g, '-')}.json?limit=12`
//           );
//           setBooks(fallbackResponse.data.works || []);
//         }
//       } catch (error) {
//         console.error(`Error fetching books for ${selectedGenre}:`, error);
//         // Final fallback to Open Library if API fails
//         const fallbackResponse = await axios.get(
//           `https://openlibrary.org/subjects/${selectedGenre.replace(/\s+/g, '-')}.json?limit=12`
//         );
//         setBooks(fallbackResponse.data.works || []);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, [selectedGenre]);

//   const handleViewDetails = (bookId) => {
//     navigate(`/book/${bookId}`);
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       <Header />
      
//       <div className="flex flex-col md:flex-row flex-grow mt-16">
//         {/* Genre Sidebar */}
//         <div className="w-full md:w-64 bg-indigo-800 p-4 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)]">
//           <h1 className="text-xl font-bold text-white mb-4">Browse Genres</h1>
//           <div className="space-y-2">
//             {genresList.map((genre) => (
//               <button
//                 key={genre}
//                 onClick={() => setSelectedGenre(genre)}
//                 className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
//                   selectedGenre === genre
//                     ? "bg-[#865DFF] text-white font-medium shadow-md"
//                     : "text-indigo-200 hover:bg-[#865DFF] hover:text-white"
//                 }`}
//               >
//                 {genre.split(" ").map(word => 
//                   word.charAt(0).toUpperCase() + word.slice(1)
//                 ).join(" ")}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 p-6">
//           <div className="mb-8">
//             <h2 className="text-3xl font-bold text-[#865DFF] mb-2">
//               {selectedGenre.split(" ").map(word => 
//                 word.charAt(0).toUpperCase() + word.slice(1)
//               ).join(" ")} Books
//             </h2>
//             <p className="text-lg text-gray-600">Discover amazing books in this genre</p>
//           </div>

//           {loading ? (
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//               {[...Array(12)].map((_, index) => (
//                 <div key={index} className="animate-pulse">
//                   <div className="bg-gray-200 h-64 rounded-lg"></div>
//                   <div className="h-4 bg-gray-200 rounded mt-3 w-3/4"></div>
//                   <div className="h-3 bg-gray-200 rounded mt-2 w-1/2"></div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//               {books.length > 0 ? (
//                 books.map((book) => {
//                   // Handle both Google Books and Open Library data structures
//                   const bookData = book.volumeInfo || book;
//                   const bookId = book.id || book.key?.split("/").pop() || Math.random().toString(36).substring(2);
//                   const coverImg = bookData.imageLinks?.thumbnail || 
//                     (book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` : null);
                  
//                   return (
//                     <div
//                       key={bookId}
//                       className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
//                     >
//                       <div className="aspect-[2/3] bg-gray-100 flex items-center justify-center">
//                         {coverImg ? (
//                           <img
//                             src={coverImg}
//                             alt={bookData.title}
//                             className="w-full h-full object-cover"
//                             onError={(e) => {
//                               e.target.onerror = null;
//                               e.target.src = "https://via.placeholder.com/150x200?text=No+Cover";
//                             }}
//                           />
//                         ) : (
//                           <div className="text-gray-400 p-4 text-center flex items-center justify-center h-full">
//                             No cover available
//                           </div>
//                         )}
//                       </div>
//                       <div className="p-4">
//                         <h3 className="font-bold text-gray-800 line-clamp-2 h-12">
//                           {bookData.title}
//                         </h3>
//                         <p className="text-gray-600 text-sm mt-1 line-clamp-1">
//                           {bookData.authors?.[0] || bookData.authors?.[0]?.name || "Unknown Author"}
//                         </p>
//                         <button
//                           onClick={() => handleViewDetails(bookId)}
//                           className="mt-3 w-full py-2 bg-indigo-600 hover:bg-[#865DFF] text-white rounded-md transition-colors text-sm font-medium"
//                         >
//                           View Details
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="col-span-full text-center py-12">
//                   <p className="text-gray-500">No books found for this genre</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Genres;



import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const genresList = [
  "fiction",
  "mystery",
  "thriller",
  "romance",
  "fantasy",
  "science fiction",
  "biography",
  "history",
  "self-help",
  "business",
  "technology",
  "science",
  "art",
  "poetry",
  "young adult",
  "children",
  "cooking",
  "travel",
  "health",
  "sports"
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
        // Fetch books from Open Library API based on selected genre
        const response = await axios.get(
          `https://openlibrary.org/subjects/${selectedGenre.replace(/\s+/g, '-')}.json?limit=12`
        );
        
        setBooks(response.data.works || []);
      } catch (error) {
        console.error(`Error fetching books for ${selectedGenre}:`, error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [selectedGenre]);

  const handleViewDetails = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex flex-col md:flex-row flex-grow mt-16">
        {/* Genre Sidebar */}
        <div className="w-full md:w-64 bg-indigo-800 p-4 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)]">
          <h1 className="text-xl font-bold text-white mb-4">Browse Genres</h1>
          <div className="space-y-2">
            {genresList.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  selectedGenre === genre
                    ? "bg-[#865DFF] text-white font-medium shadow-md"
                    : "text-indigo-200 hover:bg-[#865DFF] hover:text-white"
                }`}
              >
                {genre.split(" ").map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(" ")}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#865DFF] mb-2">
              {selectedGenre.split(" ").map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(" ")} Books
            </h2>
            <p className="text-lg text-gray-600">Discover amazing books in this genre</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded mt-3 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded mt-2 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {books.length > 0 ? (
                books.map((book) => {
                  // Handle Open Library data structure
                  const bookData = book;
                  const bookId = book.key?.split("/").pop() || Math.random().toString(36).substring(2);
                  const coverImg = book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` : null;
                  
                  return (
                    <div
                      key={bookId}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                      <div className="aspect-[2/3] bg-gray-100 flex items-center justify-center">
                        {coverImg ? (
                          <img
                            src={coverImg}
                            alt={bookData.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/150x200?text=No+Cover";
                            }}
                          />
                        ) : (
                          <div className="text-gray-400 p-4 text-center flex items-center justify-center h-full">
                            No cover available
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 line-clamp-2 h-12">
                          {bookData.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                          {bookData.authors?.[0]?.name || "Unknown Author"}
                        </p>
                        <button
                          onClick={() => handleViewDetails(bookId)}
                          className="mt-3 w-full py-2 bg-indigo-600 hover:bg-[#865DFF] text-white rounded-md transition-colors text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })
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
