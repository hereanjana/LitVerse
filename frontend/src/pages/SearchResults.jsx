// import { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import axios from "axios";

// const SearchResults = () => {
//   const [searchParams] = useSearchParams();
//   const query = searchParams.get("q") || "";
//   const [books, setBooks] = useState([]);
//   const [filter, setFilter] = useState(""); // Filter by author, year, etc.

//   useEffect(() => {
//     if (!query) return;

//     const fetchBooks = async () => {
//       try {
//         const response = await axios.get(
//           `https://openlibrary.org/search.json?q=${query}&limit=20`
//         );
//         setBooks(response.data.docs);
//       } catch (error) {
//         console.error("Error fetching books:", error);
//       }
//     };

//     fetchBooks();
//   }, [query]);

//   // Filter books based on author name or year
//   const filteredBooks = books.filter((book) => {
//     if (!filter) return true;
//     return (
//       book.author_name?.some((author) => author.toLowerCase().includes(filter.toLowerCase())) ||
//       (book.first_publish_year && book.first_publish_year.toString().includes(filter))
//     );
//   });

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>

//       {/* Filter Input */}
//       <input
//         type="text"
//         placeholder="Filter by author or year..."
//         className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
//         value={filter}
//         onChange={(e) => setFilter(e.target.value)}
//       />

//       {/* Books Grid */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//         {filteredBooks.length > 0 ? (
//           filteredBooks.map((book) => {
//             const coverUrl = book.cover_i
//               ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
//               : "https://via.placeholder.com/128x190?text=No+Cover";

//             return (
//               <div key={book.key} className="text-center">
//                 <img
//                   src={coverUrl}
//                   alt={book.title}
//                   className="w-32 h-48 mx-auto rounded-lg shadow"
//                 />
//                 <p className="mt-2 text-sm font-medium">{book.title}</p>
//                 <p className="text-xs text-gray-500">
//                   {book.author_name ? book.author_name.join(", ") : "Unknown Author"}
//                 </p>
//                 <p className="text-xs text-gray-400">
//                   {book.first_publish_year ? `Published: ${book.first_publish_year}` : ""}
//                 </p>
//               </div>
//             );
//           })
//         ) : (
//           <p className="col-span-4 text-gray-500 text-center">No books found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchResults;




// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import Header from "../components/Header";
// import Footer from "../components/Footer";

// const SearchResults = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const query = searchParams.get("q") || "";
//   const [searchTerm, setSearchTerm] = useState(query);
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const API_KEY = "AIzaSyD8tijLS3jcvhLN_K7menejbhQxqOc1Vio";

//   useEffect(() => {
//     if (!query) return;

//     const fetchBooks = async () => {
//       setLoading(true);
//       try {
//         // Try Google Books API first
//         const response = await axios.get(
//           `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=12&key=${API_KEY}`
//         );

//         if (response.data.items && response.data.items.length > 0) {
//           setBooks(response.data.items);
//         } else {
//           // Fallback to Open Library API
//           const fallbackResponse = await axios.get(
//             `https://openlibrary.org/search.json?q=${query}&limit=12`
//           );
//           setBooks(fallbackResponse.data.docs || []);
//         }
//       } catch (error) {
//         console.error("Error fetching books:", error);
//         // Final fallback to Open Library API
//         const fallbackResponse = await axios.get(
//           `https://openlibrary.org/search.json?q=${query}&limit=12`
//         );
//         setBooks(fallbackResponse.data.docs || []);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, [query]);

//   const handleViewDetails = (bookId) => {
//     navigate(`/book/${bookId}`);
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchTerm.trim()) {
//       setSearchParams({ q: searchTerm.trim() });
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50 p-10">
//       <Header />

//       <div className="p-6 max-w-6xl mx-auto">
//         {/* Search Bar */}
//         <form onSubmit={handleSearch} className="flex justify-center mb-6">
//           <div className="relative w-full max-w-2xl">
//             <input
//               type="text"
//               placeholder="Search for books, genres, or authors..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full px-6 py-4 pr-16 text-lg bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-bubble-gum/50 focus:border-transparent transition-all duration-200"
//             />
//             <button
//               type="submit"
//               className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-bubble-gum to-pink-500 text-white p-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//             </button>
//           </div>
//         </form>

//         <h2 className="text-3xl font-bold text-[#865DFF] mb-2">Search Results</h2>
//         <p className="text-lg text-gray-600">Showing results for: <strong>{query}</strong></p>

//         {loading ? (
//           <div className="flex justify-center items-center h-40">
//             <p className="text-xl font-medium text-gray-600 animate-pulse">Loading...</p>
//           </div>
//         ) : books.length === 0 ? (
//           <div className="flex justify-center items-center h-40">
//             <p className="text-xl font-medium text-gray-500">No books found for "{query}"</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
//             {books.map((book) => {
//               // Handle both Google Books and Open Library data structures
//               const bookData = book.volumeInfo || book;
//               const bookId = book.id || book.key?.split("/").pop() || Math.random().toString(36).substring(2);
//               const coverImg = bookData.imageLinks?.thumbnail ||
//                 (book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null);

//               return (
//                 <div
//                   key={bookId}
//                   className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
//                 >
//                   <div className="aspect-[2/3] bg-gray-100 flex items-center justify-center">
//                     {coverImg ? (
//                       <img
//                         src={coverImg}
//                         alt={bookData.title}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = "https://via.placeholder.com/150x200?text=No+Cover";
//                         }}
//                       />
//                     ) : (
//                       <div className="text-gray-400 p-4 text-center flex items-center justify-center h-full">
//                         No cover available
//                       </div>
//                     )}
//                   </div>
//                   <div className="p-4">
//                     <h3 className="font-bold text-gray-800 line-clamp-2 h-12">
//                       {bookData.title}
//                     </h3>
//                     <p className="text-gray-600 text-sm mt-1 line-clamp-1">
//                       {bookData.authors?.[0] || bookData.authors?.[0]?.name || "Unknown Author"}
//                     </p>
//                     <button
//                       onClick={() => handleViewDetails(bookId)}
//                       className="mt-3 w-full py-2 bg-indigo-600 hover:bg-[#865DFF] text-white rounded-md transition-colors text-sm font-medium"
//                     >
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default SearchResults;



import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(query);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) return;

    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://openlibrary.org/search.json?q=${query}&limit=12`
        );
        setBooks(response.data.docs || []);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query]);

  const handleViewDetails = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="p-6 max-w-6xl mx-auto">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex justify-center mb-6">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder="Search for books, genres, or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pr-16 text-lg bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-bubble-gum/50 focus:border-transparent transition-all duration-200"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-bubble-gum to-pink-500 text-white p-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>

        <h2 className="text-3xl font-bold text-[#865DFF] mb-2">Search Results</h2>
        <p className="text-lg text-gray-600">Showing results for: <strong>{query}</strong></p>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-xl font-medium text-gray-600 animate-pulse">Loading...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-xl font-medium text-gray-500">No books found for "{query}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6">
            {books.map((book) => {
              const bookId = book.key?.split("/").pop();
              const coverImg = book.cover_i 
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : "https://via.placeholder.com/150x200?text=No+Cover";

              return (
                <div
                  key={bookId}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="aspect-[2/3] bg-gray-100 flex items-center justify-center">
                    <img
                      src={coverImg}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 line-clamp-2 h-12">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                      {book.author_name?.[0] || "Unknown Author"}
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
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
