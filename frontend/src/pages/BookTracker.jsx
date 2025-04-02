import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BooklistPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [statusCounts, setStatusCounts] = useState({
    currentRead: 0,
    completed: 0,
    onHold: 0,
    dropped: 0,
    planToRead: 0
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [editForm, setEditForm] = useState({
    status: '',
    chapter: 0,
    rating: 0,
    tags: '',
    start_date: '',
    finished_date: ''
  });
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        if (!user?.primaryEmailAddress?.emailAddress) return;

        // First get user id using email
        const usersResponse = await axios.get('http://localhost:8000/users');
        const currentUser = usersResponse.data.find(
          u => u.email === user.primaryEmailAddress.emailAddress
        );

        if (!currentUser) {
          toast.error('User not found');
          return;
        }

        // Fetch user's waitlist
        const waitlistResponse = await axios.get(`http://localhost:8000/users/${currentUser.id}/waitlist`);
        setBooks(waitlistResponse.data);

        // Calculate status counts
        const counts = waitlistResponse.data.reduce((acc, book) => {
          acc[book.status] = (acc[book.status] || 0) + 1;
          return acc;
        }, {});

        setStatusCounts({
          currentRead: counts.currentRead || 0,
          completed: counts.completed || 0,
          onHold: counts.onHold || 0,
          dropped: counts.dropped || 0,
          planToRead: counts.planToRead || 0
        });

      } catch (error) {
        console.error('Error fetching books:', error);
        toast.error('Failed to load your books');
      } finally {
        setLoading(false);
      }
    };

    fetchUserBooks();
  }, [user]);

  const getFilteredBooks = () => {
    if (selectedStatus === 'all') {
      return books;
    }
    return books.filter(book => book.status === selectedStatus);
  };

  const statusCategories = [
    { id: "all", name: "All Books", count: books.length },
    { id: "currentRead", name: "Current Read", count: statusCounts.currentRead },
    { id: "completed", name: "Completed", count: statusCounts.completed },
    { id: "onHold", name: "On Hold", count: statusCounts.onHold },
    { id: "dropped", name: "Dropped", count: statusCounts.dropped },
    { id: "planToRead", name: "Plan to Read", count: statusCounts.planToRead },
  ];

  const handleEditClick = (book) => {
    setEditingBook(book);
    setEditForm({
      status: book.status || 'planToRead',
      chapter: book.chapter || 0,
      rating: book.rating || 0,
      tags: book.tags || '',
      start_date: book.start_date || '',
      finished_date: book.finished_date || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      const usersResponse = await axios.get('http://localhost:8000/users');
      const currentUser = usersResponse.data.find(u => u.email === userEmail);

      if (!currentUser) {
        toast.error('User not found');
        return;
      }

      await axios.patch(
        `http://localhost:8000/users/${currentUser.id}/waitlist/${editingBook.id}`,
        editForm
      );

      // Update the books list with edited data
      setBooks(books.map(book => 
        book.id === editingBook.id 
          ? { ...book, ...editForm }
          : book
      ));

      toast.success('Book updated successfully!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error(error.response?.data?.detail || 'Failed to update book');
    }
  };

  const renderEditModal = () => (
    isModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-black rounded-lg p-8 w-[600px] max-w-[90%] max-h-[90vh] overflow-y-auto shadow-xl border border-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-white">Edit Book: {editingBook?.title}</h2>
          
          <div className="space-y-6">
            {/* Status Dropdown */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Status</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="w-full p-3 border rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-[#865DFF] focus:border-transparent"
              >
                <option value="planToRead">Plan to Read</option>
                <option value="currentRead">Currently Reading</option>
                <option value="completed">Completed</option>
                <option value="onHold">On Hold</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>

            {/* Chapter Input */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Chapter</label>
              <input
                type="number"
                value={editForm.chapter}
                onChange={(e) => setEditForm({ ...editForm, chapter: parseInt(e.target.value) })}
                className="w-full p-3 border rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-[#865DFF] focus:border-transparent"
                min="0"
              />
            </div>

            {/* Rating Stars */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setEditForm({ ...editForm, rating: star })}
                    className={`text-3xl ${
                      star <= editForm.rating 
                        ? 'text-[#865DFF]'
                        : 'text-gray-600'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Date Inputs */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Start Date</label>
              <input
                type="date"
                value={editForm.start_date}
                onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })}
                className="w-full p-3 border rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-[#865DFF] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Finish Date</label>
              <input
                type="date"
                value={editForm.finished_date}
                onChange={(e) => setEditForm({ ...editForm, finished_date: e.target.value })}
                className="w-full p-3 border rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-[#865DFF] focus:border-transparent"
              />
            </div>

            {/* Tags Textarea */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Tags</label>
              <textarea
                value={editForm.tags}
                onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                className="w-full p-3 border rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-[#865DFF] focus:border-transparent"
                rows="3"
                placeholder="Add tags separated by commas..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 text-white hover:text-gray-300 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-6 py-3 bg-[#865DFF] text-white rounded-md hover:bg-[#6a3fd3] font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-silver">
      <ToastContainer />
      {/* Header with User */}
      <header className="bg-black shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="LitVerse Logo" className="h-12 w-auto" />
          </Link>
          <div className="flex items-center space-x-4">
            <UserButton appearance={{
              elements: {
                avatarBox: "w-10 h-10 border-2 border-[#865DFF]",
              }
            }} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 text-black py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#010A43] mb-2">LITVERSE</h1>
          <h2 className="text-2xl text-[#865DFF] font-medium mb-6">
            Organize · Discuss · Discover
          </h2>
        </div>

        {/* Status Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {statusCategories.map((category) => (
            <div 
              key={category.id}
              onClick={() => setSelectedStatus(category.id)}
              className={`bg-white px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border-2 
                ${selectedStatus === category.id 
                  ? 'border-[#865DFF] bg-[#865DFF] bg-opacity-10' 
                  : 'border-gray-200'
                }`}
            >
              <span className={`font-medium ${selectedStatus === category.id ? 'text-[#865DFF]' : 'text-gray-800'}`}>
                {category.name}
              </span>
              <span className={`ml-2 ${
                selectedStatus === category.id 
                  ? 'bg-[#865DFF]' 
                  : 'bg-[#865DFF]'
                } text-white px-2 py-1 rounded-full text-xs`}>
                {category.count}
              </span>
            </div>
          ))}
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">ALL BOOKS</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chapter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">Loading...</td>
                  </tr>
                ) : getFilteredBooks().length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      {books.length === 0 
                        ? "No books in your list yet" 
                        : `No books found with status: ${selectedStatus}`}
                    </td>
                  </tr>
                ) : (
                  getFilteredBooks().map((book, index) => (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img 
                          src={book.cover_url} 
                          alt={book.title}
                          className="h-16 w-12 object-cover rounded-sm"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                        <div className="text-sm text-gray-500">{book.author}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-lg">
                              {i < (book.rating || 0) ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.chapter}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.tags || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleEditClick(book)}
                          className="text-[#865DFF] hover:text-[#6a3fd3]"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      {renderEditModal()}
    </div>
  );
};

export default BooklistPage;