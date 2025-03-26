import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import logo from "../assets/logo.png";

const genresList = [
  "Fantasy", "Science Fiction", "Mystery", "Thriller",
  "Romance", "Horror", "Historical Fiction", "Young Adult",
  "Non-Fiction", "Poetry", "Self-Help", "Biography",
  "Contemporary", "Crime", "Adventure", "Dystopian",
  "Paranormal", "Western", "Children's", "Graphic Novel",
  "Cookbook", "Travel", "Religious", "Humor"
];

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("romance");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const navigate = useNavigate();

  // Fetch books when selectedGenre changes
  useEffect(() => {
    if (currentStep === 2) {
      const fetchBooks = async () => {
        setLoading(true);
        const url = `https://openlibrary.org/subjects/${selectedGenre.toLowerCase()}.json?limit=10`;

        try {
          const response = await axios.get(url);
          setBooks(response.data.works || []);
        } catch (error) {
          console.error(`Error fetching books for ${selectedGenre}:`, error);
        }

        setTimeout(() => setLoading(false), 1000);
      };

      fetchBooks();
    }
  }, [selectedGenre, currentStep]);

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  const handleBookSelect = (book) => {
    setSelectedBooks((prev) =>
      prev.some((b) => b.key === book.key)
        ? prev.filter((b) => b.key !== book.key)
        : [...prev, book]
    );
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedGenres.length === 0) {
      toast.error("Please select at least one genre before proceeding!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      navigate("/landing-page");
    }
  };

  const renderGenreSelection = () => (
    <div className="flex flex-col items-center">
      <h1 className="text-white text-4xl font-bold mt-20">Select your favorite genres</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        {genresList.map((genre, index) => (
          <button
            key={index}
            onClick={() => toggleGenre(genre)}
            className={`px-6 py-3 font-semibold rounded-lg transition duration-300 
            ${
              selectedGenres.includes(genre)
                ? "bg-white text-bubble-gum shadow-md scale-105 btnbtn-outline"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
      <div className="absolute bottom-12 flex flex-col items-center">
        <h1 className="text-white text-xl mb-4">Select at least one genre</h1>
        <button
          onClick={handleNext}
          className="px-8 py-3 font-semibold rounded-lg transition duration-300 bg-blue-500 hover:bg-blue-600 text-white"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderBookSelection = () => (
    <div className="h-screen w-screen bg-black text-white flex overflow-hidden">
      <div className="w-1/4 bg-gray-900 p-6 border-r border-gray-700 overflow-y-auto">
        <div className="mb-6">
          <img src={logo} alt="LitVerse Logo" className="h-12 w-auto" />
        </div>
        <h1 className="text-lg font-bold mb-4">Books</h1>
        {selectedGenres.map((genre) => (
          <p
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`cursor-pointer p-2 mb-2 rounded-md transition-all duration-200 ease-in-out ${
              selectedGenre === genre
                ? "bg-bubble-gum text-white font-bold shadow-lg transform scale-105"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {genre}
          </p>
        ))}
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl text-left font-bold">Select Books You Have Already Read</h2>
          <button
            onClick={handleNext}
            className="bg-black text-bubble-gum px-4 py-2 rounded-md btnbtn-outline transition-all"
          >
            Next
          </button>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-left">{selectedGenre.toUpperCase()}</h2>

        {loading ? (
          <div className="text-xl font-semibold mt-12 animate-pulse">
            <span className="loader"></span> Loading books...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.length > 0 ? (
              books.map((book) => (
                <div
                  key={book.key}
                  onClick={() => handleBookSelect(book)}
                  className={`bg-gray-800 p-4 rounded-lg shadow-md hover:scale-105 transition-transform cursor-pointer ${
                    selectedBooks.some((b) => b.key === book.key)
                      ? "border-2 border-blue-500 shadow-lg"
                      : ""
                  }`}
                >
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                    alt={book.title}
                    className="w-32 h-48 mx-auto rounded-md"
                  />
                  <p className="mt-2 font-bold">{book.title}</p>
                  <p className="text-gray-400 text-sm">
                    {book.authors ? book.authors[0]?.name : "Unknown Author"}
                  </p>
                  {selectedBooks.some((b) => b.key === book.key) && (
                    <p className="text-bubble-gum mt-2 font-semibold">Selected</p>
                  )}
                </div>
              ))
            ) : (
              <p>No books found for this genre.</p>
            )}
          </div>
        )}

        {selectedBooks.length > 0 && (
          <div className="mt-6 text-lg text-center font-semibold">
            You've selected {selectedBooks.length} book(s)
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-black">
      <ToastContainer />
      <div className="absolute top-6 left-6">
        <img src={logo} alt="LitVerse Logo" className="h-12 w-auto" />
      </div>
      {currentStep === 1 ? renderGenreSelection() : renderBookSelection()}
    </div>
  );
};

export default OnboardingFlow;