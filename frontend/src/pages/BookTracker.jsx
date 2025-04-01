import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const BooklistPage = () => {
  const books = [
    {
      id: 1,
      title: "The Spanish Love Deception",
      image: "book1.jpg",
      rating: 5,
      chapter: 1,
      tags: "don't forget page 10",
      status: "current"
    },
    {
      id: 2,
      title: "Project Hail Mary",
      image: "book2.jpg",
      rating: 4,
      chapter: 15,
      tags: "science fiction",
      status: "completed"
    },
    // More books...
  ];

  const statusCategories = [
    { id: "current", name: "Current Read", count: 1 },
    { id: "completed", name: "Completed", count: 1 },
    { id: "on-hold", name: "On Hold", count: 0 },
    { id: "dropped", name: "Dropped", count: 0 },
    { id: "plan-to-read", name: "Plan to Read", count: 0 },
  ];

  return (
    <div className="min-h-screen bg-silver">
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
              className="bg-white px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
            >
              <span className="font-medium text-gray-800">{category.name}</span>
              <span className="ml-2 bg-[#865DFF] text-white px-2 py-1 rounded-full text-xs">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chapter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book, index) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-12 bg-gray-200 rounded-sm overflow-hidden">
                        {/* Book cover image would go here */}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{book.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-yellow-400">
                        {'★'.repeat(book.rating)}{'☆'.repeat(5 - book.rating)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.chapter}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.tags}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-[#865DFF] hover:text-[#6a3fd3]">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BooklistPage;