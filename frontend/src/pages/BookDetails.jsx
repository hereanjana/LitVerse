// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import { StarIcon } from '@heroicons/react/24/solid';

// const BookDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [book, setBook] = useState(null);
//   const [authorBooks, setAuthorBooks] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState('');
//   const [reviews, setReviews] = useState([]);
//   const [newReview, setNewReview] = useState('');
//   const [rating, setRating] = useState(0);
//   const [loading, setLoading] = useState(true);

//   // Mock data - replace with actual API calls
//   useEffect(() => {
//     const fetchBookDetails = async () => {
//       try {
//         // Fetch book details
//         const bookResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
//         setBook(bookResponse.data);
        
//         // Fetch author's other books
//         if(bookResponse.data.volumeInfo.authors) {
//           const author = bookResponse.data.volumeInfo.authors[0];
//           const authorBooksResponse = await axios.get(
//             `https://www.googleapis.com/books/v1/volumes?q=inauthor:"${author}"&maxResults=4`
//           );
//           setAuthorBooks(authorBooksResponse.data.items);
//         }
//       } catch (error) {
//         console.error('Error fetching book details:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookDetails();
//   }, [id]);

//   const handleAddToBooklist = (status) => {
//     setSelectedStatus(status);
//     // Add your booklist logic here
//   };

//   const handleSubmitReview = (e) => {
//     e.preventDefault();
//     if (newReview.trim() && rating > 0) {
//       setReviews([...reviews, {
//         id: Date.now(),
//         user: 'Current User',
//         rating,
//         comment: newReview,
//         date: new Date().toLocaleDateString()
//       }]);
//       setNewReview('');
//       setRating(0);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Header />
//         <div className="max-w-7xl mx-auto py-12 px-4">Loading...</div>
//       </div>
//     );
//   }

//   if (!book) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Header />
//         <div className="max-w-7xl mx-auto py-12 px-4">Book not found</div>
//       </div>
//     );
//   }

//   const { volumeInfo } = book;
//   const averageRating = volumeInfo.averageRating || 4.5;
//   const ratingsCount = volumeInfo.ratingsCount || 120;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
      
//       <main className="max-w-7xl mx-auto px-4 py-8">
//         {/* Book Header Section */}
//         <div className="flex flex-col md:flex-row gap-8 mb-12">
//           <div className="w-full md:w-1/3 lg:w-1/4">
//             <img
//               src={volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/300x450?text=No+Cover'}
//               alt={volumeInfo.title}
//               className="w-full rounded-xl shadow-lg"
//             />
//           </div>
          
//           <div className="flex-1">
//             <h1 className="text-4xl font-bold text-primary-800 mb-4">
//               {volumeInfo.title}
//             </h1>
//             <p className="text-xl text-primary-600 mb-4">
//               by {volumeInfo.authors?.join(', ') || 'Unknown Author'}
//             </p>
            
//             <div className="flex items-center gap-2 mb-6">
//               <div className="flex">
//                 {[...Array(5)].map((_, i) => (
//                   <StarIcon
//                     key={i}
//                     className={`h-6 w-6 ${
//                       i < averageRating ? 'text-yellow-400' : 'text-gray-300'
//                     }`}
//                   />
//                 ))}
//               </div>
//               <span className="text-gray-600">({ratingsCount} ratings)</span>
//             </div>

//             {/* Book Status Dropdown */}
//             <div className="relative mb-8">
//               <select
//                 value={selectedStatus}
//                 onChange={(e) => handleAddToBooklist(e.target.value)}
//                 className="w-full md:w-64 px-4 py-2 rounded-lg border-2 border-primary-500 bg-white text-primary-800 font-medium focus:outline-none focus:ring-2 focus:ring-primary-300"
//               >
//                 <option value="">Add to Booklist</option>
//                 <option value="current">Currently Reading</option>
//                 <option value="hold">On Hold</option>
//                 <option value="plan">Plan to Read</option>
//               </select>
//             </div>

//             {/* Book Details */}
//             <div className="prose max-w-none mb-8">
//               <h3 className="text-2xl font-bold text-primary-800 mb-4">Description</h3>
//               <p className="text-gray-700">
//                 {volumeInfo.description || 'No description available'}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Books by Author Section */}
//         {volumeInfo.authors && (
//           <section className="mb-12">
//             <h2 className="text-3xl font-bold text-primary-800 mb-6">
//               More by {volumeInfo.authors[0]}
//             </h2>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//               {authorBooks.map((book) => (
//                 <div
//                   key={book.id}
//                   className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer"
//                   onClick={() => navigate(`/book/${book.id}`)}
//                 >
//                   <img
//                     src={book.volumeInfo.imageLinks?.thumbnail}
//                     alt={book.volumeInfo.title}
//                     className="w-full aspect-[2/3] object-cover"
//                   />
//                   <div className="p-4">
//                     <h3 className="font-bold text-primary-800 line-clamp-2">
//                       {book.volumeInfo.title}
//                     </h3>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* Reviews Section */}
//         <section className="mb-12">
//           <h2 className="text-3xl font-bold text-primary-800 mb-6">Reviews</h2>
          
//           {/* Review Form */}
//           <form onSubmit={handleSubmitReview} className="bg-white p-6 rounded-xl shadow-md mb-8">
//             <div className="mb-4">
//               <label className="block text-primary-800 font-medium mb-2">Your Rating</label>
//               <div className="flex gap-1">
//                 {[...Array(5)].map((_, i) => (
//                   <StarIcon
//                     key={i}
//                     className={`h-8 w-8 cursor-pointer ${
//                       i < rating ? 'text-yellow-400' : 'text-gray-300'
//                     }`}
//                     onClick={() => setRating(i + 1)}
//                   />
//                 ))}
//               </div>
//             </div>
            
//             <textarea
//               value={newReview}
//               onChange={(e) => setNewReview(e.target.value)}
//               placeholder="Write your review..."
//               className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg mb-4 focus:outline-none focus:border-primary-500"
//               rows="4"
//             />
            
//             <button
//               type="submit"
//               className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
//             >
//               Submit Review
//             </button>
//           </form>

//           {/* Reviews List */}
//           <div className="space-y-6">
//             {reviews.map((review) => (
//               <div key={review.id} className="bg-white p-6 rounded-xl shadow-md">
//                 <div className="flex items-center gap-4 mb-2">
//                   <div className="flex">
//                     {[...Array(5)].map((_, i) => (
//                       <StarIcon
//                         key={i}
//                         className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
//                       />
//                     ))}
//                   </div>
//                   <span className="font-medium text-primary-800">{review.user}</span>
//                   <span className="text-gray-500 text-sm">{review.date}</span>
//                 </div>
//                 <p className="text-gray-700">{review.comment}</p>
//               </div>
//             ))}
            
//             {reviews.length === 0 && (
//               <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to write one!</p>
//             )}
//           </div>
//         </section>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default BookDetails;



// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import { StarIcon } from '@heroicons/react/24/solid';

// const BookDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [book, setBook] = useState(null);
//   const [authorBooks, setAuthorBooks] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBookDetails = async () => {
//       try {
//         // Fetch book details
//         const bookResponse = await axios.get(`https://openlibrary.org/works/${id}.json`);
//         const bookData = bookResponse.data;
//         setBook(bookData);

//         // Fetch author details
//         if (bookData.authors && bookData.authors.length > 0) {
//           const authorKey = bookData.authors[0].author.key;
//           const authorResponse = await axios.get(`https://openlibrary.org${authorKey}.json`);
//           const authorName = authorResponse.data.name;
//           setBook((prevBook) => ({ ...prevBook, authorName }));

//           // Fetch author's other books
//           const authorBooksResponse = await axios.get(`https://openlibrary.org/search.json?author=${authorName}&limit=4`);
//           setAuthorBooks(authorBooksResponse.data.docs);
//         }
//       } catch (error) {
//         console.error('Error fetching book details:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBookDetails();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Header />
//         <div className="max-w-7xl mx-auto py-12 px-4">Loading...</div>
//       </div>
//     );
//   }

//   if (!book) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <Header />
//         <div className="max-w-7xl mx-auto py-12 px-4">Book not found</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <div className="flex flex-col md:flex-row gap-8 mb-12">
//           <div className="w-full md:w-1/3 lg:w-1/4">
//             <img
//               src={book.covers ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg` : 'https://via.placeholder.com/300x450?text=No+Cover'}
//               alt={book.title}
//               className="w-full rounded-xl shadow-lg"
//             />
//           </div>
//           <div className="flex-1">
//             <h1 className="text-4xl font-bold text-primary-800 mb-4">{book.title}</h1>
//             <p className="text-xl text-primary-600 mb-4">by {book.authorName || 'Unknown Author'}</p>
//             <div className="relative mb-8">
//               <select
//                 value={selectedStatus}
//                 onChange={(e) => setSelectedStatus(e.target.value)}
//                 className="w-full md:w-64 px-4 py-2 rounded-lg border-2 border-primary-500 bg-white text-primary-800 font-medium focus:outline-none focus:ring-2 focus:ring-primary-300"
//               >
//                 <option value="">Add to Booklist</option>
//                 <option value="current">Currently Reading</option>
//                 <option value="hold">On Hold</option>
//                 <option value="plan">Plan to Read</option>
//               </select>
//             </div>
//             <div className="prose max-w-none mb-8">
//               <h3 className="text-2xl font-bold text-primary-800 mb-4">Description</h3>
//               <p className="text-gray-700">{book.description?.value || 'No description available'}</p>
//             </div>
//           </div>
//         </div>
//         {book.authorName && (
//           <section className="mb-12">
//             <h2 className="text-3xl font-bold text-primary-800 mb-6">More by {book.authorName}</h2>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//               {authorBooks.map((book) => (
//                 <div
//                   key={book.key}
//                   className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer"
//                   onClick={() => navigate(`/book/${book.key.replace('/works/', '')}`)}
//                 >
//                   <img
//                     src={book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 'https://via.placeholder.com/150x200?text=No+Cover'}
//                     alt={book.title}
//                     className="w-full aspect-[2/3] object-cover"
//                   />
//                   <div className="p-4">
//                     <h3 className="font-bold text-primary-800 line-clamp-2">{book.title}</h3>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default BookDetails;



import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { StarIcon } from '@heroicons/react/24/solid';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [authorBooks, setAuthorBooks] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto py-12 px-4">Loading...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50">
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
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
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

            <div className="relative mb-8">
              {/* <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full md:w-64 px-4 py-2 rounded-lg border-2 border-primary-500 bg-white text-primary-800 font-medium focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                <option value="">Add to Booklist</option>
                <option value="current">Currently Reading</option>
                <option value="hold">On Hold</option>
                <option value="plan">Plan to Read</option>
              </select> */}

              <button className='btn btn-secondary'>Add to Book list</button>
            </div>
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
