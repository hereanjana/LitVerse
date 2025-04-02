import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { StarIcon } from '@heroicons/react/24/solid';
import { useUser } from "@clerk/clerk-react";
import { toast, ToastContainer } from "react-toastify";


const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [authorBooks, setAuthorBooks] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('planToRead');
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        // Fetch book details
        const bookResponse = await axios.get(`https://openlibrary.org/works/${id}.json`);
        const bookData = bookResponse.data;
        setBook(bookData);

        // Fetch author details
        if (bookData.authors && bookData.authors.length > 0) {
          const authorKey = bookData.authors[0].author.key;
          const authorResponse = await axios.get(`https://openlibrary.org${authorKey}.json`);
          const authorName = authorResponse.data.name;
          setBook((prevBook) => ({ ...prevBook, authorName }));

          // Fetch author's other books
          const authorBooksResponse = await axios.get(`https://openlibrary.org/search.json?author=${authorName}&limit=4`);
          setAuthorBooks(authorBooksResponse.data.docs);
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [id]);

  const handleAddToWaitlist = async () => {
    try {
      // First get user id using email from clerk
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      if (!userEmail) {
        toast.error('Please login to add books to your list');
        return;
      }

      // Get user id from backend using email
      const usersResponse = await axios.get('http://localhost:8000/users');
      const currentUser = usersResponse.data.find(user => user.email === userEmail);
      
      if (!currentUser) {
        toast.error('User not found. Please try again.');
        return;
      }

      // Prepare book data according to the database schema
      const bookData = {
        user_id: currentUser.id,
        open_library_id: id,
        title: book.title,
        author: book.authorName || 'Unknown Author',
        cover_url: book.covers 
          ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg` 
          : 'https://via.placeholder.com/300x450?text=No+Cover',
        status: selectedStatus,
        chapter: 0,  // Default value as per schema
        start_date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        finished_date: selectedStatus === 'completed' 
          ? new Date().toISOString().split('T')[0] 
          : null
      };

      // Add to waitlist
      await axios.post(`http://localhost:8000/users/${currentUser.id}/waitlist`, bookData);
      
      toast.success('Book successfully added to your list!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

    } catch (error) {
      console.error('Error adding book to waitlist:', error);
      toast.error(error.response?.data?.detail || 'Failed to add book to list. Please try again.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const renderAddToListSection = () => (
    <div className="flex items-center gap-4 mb-8">
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="px-4 py-2 rounded-lg border-2 border-primary-500 bg-white text-primary-800 font-medium focus:outline-none focus:ring-2 focus:ring-primary-300"
      >
        <option value="planToRead">Plan to Read</option>
        <option value="currentRead">Currently Reading</option>
        <option value="completed">Completed</option>
        <option value="onHold">On Hold</option>
        <option value="dropped">Dropped</option>
      </select>

      <button 
        onClick={handleAddToWaitlist}
        className="btn btn-secondary"
      >
        Add to Book list
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer 
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Header />
        <div className="max-w-7xl mx-auto py-12 px-4">Loading...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer 
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Header />
        <div className="max-w-7xl mx-auto py-12 px-4">Book not found</div>
      </div>
    );
  }

  const getRating = () => {
    // Assuming a static rating, replace with dynamic data if available
    return 4; // Replace with dynamic logic if needed
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8 mb-12 py-10">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <img
              src={book.covers ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg` : 'https://via.placeholder.com/300x450?text=No+Cover'}
              alt={book.title}
              className="w-full rounded-xl shadow-lg"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-primary-800 mb-4">{book.title}</h1>
            <p className="text-xl text-primary-600 mb-4">by {book.authorName || 'Unknown Author'}</p>
            
            {/* Rating Section */}
            <div className="mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    className={`h-5 w-5 ${index < getRating() ? 'text-yellow-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm">{getRating()} out of 5 stars</p>
            </div>

            {renderAddToListSection()}

            <div className="prose max-w-none mb-8">
              <h3 className="text-2xl font-bold text-primary-800 mb-4">Description</h3>
              <p className="text-gray-700">{book.description?.value || 'No description available'}</p>
            </div>
          </div>
        </div>
        {book.authorName && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-primary-800 mb-6">More by {book.authorName}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {authorBooks.map((book) => (
                <div
                  key={book.key}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => navigate(`/book/${book.key.replace('/works/', '')}`)}
                >
                  <img
                    src={book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 'https://via.placeholder.com/150x200?text=No+Cover'}
                    alt={book.title}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-primary-800 line-clamp-2">{book.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BookDetails;
