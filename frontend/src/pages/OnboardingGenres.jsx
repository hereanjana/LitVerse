import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useUser } from "@clerk/clerk-react"; // Import Clerk's useUser hook
import logo from "../assets/logo.png";

const OnboardingGenres = () => {
  const { user } = useUser(); // Get current user from Clerk
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genresList, setGenresList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('http://localhost:8000/genre');
        setGenresList(response.data);
      } catch (error) {
        console.error('Error fetching genres:', error);
        toast.error('Failed to load genres. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.some(g => g.g_id === genre.g_id)
        ? prev.filter(g => g.g_id !== genre.g_id)
        : [...prev, genre]
    );
  };

  const handleNext = async () => {
    if (selectedGenres.length === 0) {
      toast.error("Please select at least one genre before proceeding!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!user?.emailAddresses?.[0]?.emailAddress) {
      toast.error("User email not found. Please log in again.");
      return;
    }

    try {
      const userEmail = user.emailAddresses[0].emailAddress; // Get email from Clerk

      // Find user in the database
      const usersResponse = await axios.get('http://localhost:8000/users');
      const currentUser = usersResponse.data.find(u => u.email === userEmail);

      if (!currentUser) {
        toast.error('User not found. Please log in again.');
        return;
      }

      // Send each selected genre to the backend
      await Promise.all(selectedGenres.map(genre => 
        axios.post('http://localhost:8000/user/genres/', {
          user_id: currentUser.id,
          genre_id: genre.g_id
        })
      ));

      // Store genres in localStorage for future use
      localStorage.setItem('userGenres', JSON.stringify(selectedGenres));

      toast.success("Genres saved successfully!");
      navigate("/landing-page");
    } catch (error) {
      console.error('Error saving user genres:', error);
      toast.error(error.response?.data?.detail || 'Failed to save genres. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading genres...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center">
      <ToastContainer />

      <div className="absolute top-6 left-6">
        <img src={logo} alt="LitVerse Logo" className="h-12 w-auto" />
      </div>

      <h1 className="text-white text-4xl font-bold mt-20">Select your favorite genres</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
        {genresList.map((genre) => (
          <button
            key={genre.g_id}
            onClick={() => toggleGenre(genre)}
            className={`px-6 py-3 font-semibold rounded-lg transition duration-300 
            ${
              selectedGenres.some(g => g.g_id === genre.g_id)
                ? "bg-white text-bubble-gum shadow-md scale-105 btnbtn-outline"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {genre.name}
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
};

export default OnboardingGenres;
