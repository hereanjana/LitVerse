// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../assets/logo.png"; 

// const genresList = [
//   "mystery",
//   "horror",
//   "romance",
//   "fantasy",
//   "science-fiction",
//   "history",
//   "self-help",
//   "adventure",
//   "thriller",
//   "non-fiction",
//   "poetry",
//   "crime",
//   "dystopian",
//   "paranormal",
//   "humor",
// ];

// const OnboardingRate = () => {
//   const [selectedGenre, setSelectedGenre] = useState("romance"); // Default genre
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(false); // Loading state
//   const [selectedBooks, setSelectedBooks] = useState([]); // Track selected books
//   const navigate = useNavigate(); // Hook for navigation

//   useEffect(() => {
//     const fetchBooks = async () => {
//       setLoading(true);
//       const url = `https://openlibrary.org/subjects/${selectedGenre}.json?limit=10`;

//       try {
//         const response = await axios.get(url);
//         setBooks(response.data.works || []);
//       } catch (error) {
//         console.error(`Error fetching books for ${selectedGenre}:`, error);
//       }

//       setTimeout(() => setLoading(false), 1000); // Simulated loading delay for better UX
//     };

//     fetchBooks();
//   }, [selectedGenre]);

//   // Toggle book selection
//   const handleBookSelect = (book) => {
//     setSelectedBooks((prev) =>
//       prev.some((b) => b.key === book.key)
//         ? prev.filter((b) => b.key !== book.key) // Deselect if already selected
//         : [...prev, book]
//     );
//   };

//   // Handle skip button click
//   const handleSkip = () => {
//     navigate("/landing-page"); // Redirect to landing page
//   };

//   return (
//     <div className="h-screen w-screen bg-black text-white flex overflow-hidden">
//       {/* Sidebar */}
//       <div className="w-1/4 bg-gray-900 p-6 border-r border-gray-700 overflow-y-auto">
//         {/* Logo */}
//         <div className="mb-6">
//           <img src={logo} alt="LitVerse Logo" className="h-12 w-auto" />
//         </div>

//         <h1 className="text-lg font-bold mb-4">Books</h1>
//         {genresList.map((genre) => (
//           <p
//             key={genre}
//             onClick={() => setSelectedGenre(genre)}
//             className={`cursor-pointer p-2 mb-2 rounded-md transition-all duration-200 ease-in-out ${
//               selectedGenre === genre
//                 ? "bg-bubble-gum text-white font-bold shadow-lg transform scale-105"
//                 : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
//             }`}
//           >
//             {genre}
//           </p>
//         ))}
//       </div>

//       {/* Books Display */}
//       <div className="flex-1 p-8 overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-3xl text-left font-bold">Select Books You Have Already Read</h2>
//           {/* Skip Button */}
//           <button
//             onClick={handleSkip}
//             className="bg-black text-bubble-gum px-4 py-2 rounded-md btnbtn-outline transition-all"
//           >
//             Next
//           </button>
//         </div>

//         <h2 className="text-2xl font-semibold mb-6 text-left">{selectedGenre.toUpperCase()}</h2>

//         {/* Show Loading Screen When Fetching */}
//         {loading ? (
//           <div className="text-xl font-semibold mt-12 animate-pulse">
//             <span className="loader"></span> Loading books...
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {books.length > 0 ? (
//               books.map((book) => (
//                 <div
//                   key={book.key}
//                   onClick={() => handleBookSelect(book)}
//                   className={`bg-gray-800 p-4 rounded-lg shadow-md hover:scale-105 transition-transform cursor-pointer ${
//                     selectedBooks.some((b) => b.key === book.key)
//                       ? "border-2 border-blue-500 shadow-lg"
//                       : ""
//                   }`}
//                 >
//                   <img
//                     src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
//                     alt={book.title}
//                     className="w-32 h-48 mx-auto rounded-md"
//                   />
//                   <p className="mt-2 font-bold">{book.title}</p>
//                   <p className="text-gray-400 text-sm">
//                     {book.authors ? book.authors[0]?.name : "Unknown Author"}
//                   </p>

//                   {/* Show "Selected" text if book is chosen */}
//                   {selectedBooks.some((b) => b.key === book.key) && (
//                     <p className="text-bubble-gum mt-2 font-semibold">Selected</p>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p>No books found for this genre.</p>
//             )}
//           </div>
//         )}

//         {/* Show selected books count */}
//         {selectedBooks.length > 0 && (
//           <div className="mt-6 text-lg text-center font-semibold">
//            You’ve selected {selectedBooks.length} book(s)
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OnboardingRate;