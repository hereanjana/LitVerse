import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import React from "react";
import { Link } from "react-router-dom";
import cover from "../assets/cover.png";
import c2 from "../assets/c2.png";
import c3 from "../assets/c3.png";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LandingPage = () => {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading.....</div>;
  }

  return (
    <div className="relative">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-screen w-screen overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={cover}
            alt="Books Background"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif">
            <span className="bg-[#865DFF] bg-clip-text text-transparent animate-gradient">
              Discover
            </span>{" "}
            your{" "}
            <span className="bg-[#865DFF] bg-clip-text text-transparent animate-gradient animation-delay-500">
              Next
            </span>{" "}
            Read
          </h1>

          {/* Search Bar */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                placeholder="Search for books, genres, or authors..."
                className="w-full px-6 py-4 pr-16 text-lg bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-bubble-gum/50 focus:border-transparent transition-all duration-200"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-bubble-gum to-pink-500 text-white p-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center">
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
          </div>
        </div>
      </div>

      {/* Book Management Section */}
      <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl bg-[#D9D9D9] mx-auto p-6 flex flex-col md:flex-row items-center">
          {/* Left Content */}
          <div className="md:w-1/2 pr-14 mb-10 md:mb-0">
            <h2 className="text-5xl font-bold text-black mb-10">
              <span className="text-[#865DFF] ">Manage</span> your Read
            </h2>
            <div className="space-y-6 text-black">
              {["Organize", "Discuss", "Discover"].map((item) => (
                <div key={item} className="flex items-start group">
                  <div className="flex-shrink-0 mr-4 mt-1">
                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-[#865DFF] to-bubble-gum group-hover:scale-125 transition-transform"></div>
                  </div>
                  <h3 className="text-3xl font-bold text-white group-hover:text-[#865DFF] transition-colors">
                    {item}
                  </h3>
                </div>
              ))}
            </div>

            <Link
              to="/book-tracker"
              className="mt-10 inline-flex items-center px-8 py-3 rounded-xl font-medium text-white bg-[#865DFF] hover:shadow-lg hover:shadow-bubble-gum/30 transition-all hover:scale-[1.02]"
            >
              Your Booklist
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </Link>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#865DFF] to-bubble-gum rounded-2xl opacity-20 blur-lg"></div>
            <img
              src={c2}
              alt="Organized books"
              className="relative rounded-xl shadow-2xl transform hover:-translate-y-2 transition-transform"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full bg-white py-8 px-4 sm:px-6 lg:px-8 text-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#F5F5F5] p-6 rounded-lg flex items-start transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-gradient-to-br from-[#F5F5F5] to-[#f0f0f0] group">
              <div className="mr-6 flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:text-[#c72a73]">
                <svg
                  className="w-12 h-12 text-bubble-gum"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-bubble-gum mb-4 group-hover:text-[#865DFF] transition-colors duration-300">
                  Personalized Book Management
                </h3>
                <p className="text-lg text-gray-700 group-hover:text-gray-800 transition-colors duration-300">
                  Effortlessly organize your reading journey with intuitive
                  tools to add, categorize, and track your books.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F5F5F5] p-6 rounded-lg flex items-start transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-gradient-to-br from-[#F5F5F5] to-[#f0f0f0] group">
              <div className="mr-6 flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:text-[#865DFF]">
                <svg
                  className="w-12 h-12 text-bubble-gum"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-bubble-gum mb-4 group-hover:text-[#865DFF] transition-colors duration-300">
                  AI-Powered Book Search
                </h3>
                <p className="text-lg text-gray-700 group-hover:text-gray-800 transition-colors duration-300">
                  Discover books that perfectly match your mood, interests, or
                  vague descriptions with our advanced AI search system.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F5F5F5] p-6 rounded-lg flex items-start transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-gradient-to-br from-[#F5F5F5] to-[#f0f0f0] group">
              <div className="mr-6 flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:text-[#865DFF]">
                <svg
                  className="w-12 h-12 text-bubble-gum"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-bubble-gum mb-4 group-hover:text-[#865DFF] transition-colors duration-300">
                  Intelligent Recommendation System
                </h3>
                <p className="text-lg text-gray-700 group-hover:text-gray-800 transition-colors duration-300">
                  Receive book recommendations tailored to your preferences,
                  behavior, and reading history.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#F5F5F5] p-6 rounded-lg flex items-start transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-gradient-to-br from-[#F5F5F5] to-[#f0f0f0] group">
              <div className="mr-6 flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:text-[#865DFF]">
                <svg
                  className="w-12 h-12 text-bubble-gum"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-bubble-gum mb-4 group-hover:text-[#865DFF] transition-colors duration-300">
                  Dynamic Book Rankings
                </h3>
                <p className="text-lg text-gray-700 group-hover:text-gray-800 transition-colors duration-300">
                  Stay updated with dynamically curated book rankings based on
                  user ratings, popularity, and trends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Book Tracking Section */}
      <div className="w-full bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative">
          {/* Background Image */}
          <div className="relative h-96 w-full rounded-xl overflow-hidden">
            <img
              src={c3}
              alt="Book collection"
              className="w-full h-full object-cover"
            />

            {/* Text Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-end pr-12">
              <div className="text-white max-w-md bg-black bg-opacity-60 p-8 rounded-lg">
                <h3 className="text-3xl font-bold mb-6">
                  Your Reading Journey
                </h3>
                <ul className="space-y-4 text-xl">
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-bubble-gum mr-3 mt-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Track books you've read
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-bubble-gum mr-3 mt-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save those you want to read
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 text-bubble-gum mr-3 mt-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Tell your friends what's good
                  </li>
                </ul>
                <button className="mt-8 px-8 py-3 rounded-xl font-medium text-white bg-[#865DFF] hover:shadow-lg hover:shadow-bubble-gum/30 transition-all hover:scale-[1.02]">
                  Start Your Journey
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage;