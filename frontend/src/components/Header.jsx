import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = () => {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return null; // or a loading spinner
  }

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between p-4 bg-white/5 backdrop-blur-lg z-50 border-b border-pink/10">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/">
          <img src={logo} alt="LitVerse Logo" className="h-10 w-auto" />
        </Link>
      </div>

      {/* Center Navbar Links */}
      <div className="hidden md:flex space-x-8 text-white text-lg font-semibold">
        <Link to="/bestsellers" className="hover:text-bubble-gum transition">
          Best Sellers
        </Link>
        <Link to="/genres" className="hover:text-bubble-gum transition">
          Genres
        </Link>
        <Link to="/recommendations" className="hover:text-bubble-gum transition">
          Recommendations
        </Link>
      </div>

      {/* Right Side - Booklist Button and User Button */}
      <div className="flex items-center gap-4">
        <Link
          to="/ai-search"
          className="relative overflow-hidden group transition-transform duration-200 hover:scale-105"
        >
          <span className="relative z-10 block px-4 py-2 font-medium text-white rounded-lg bg-[#865DFF] hover:bg-[#6a3fd3] text-white">
            AI Search
          </span>
          <span
            className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
            aria-hidden="true"
          ></span>
        </Link>
        {/* User Button from Clerk */}
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10 border-2 border-white shadow-lg",
                userButtonPopoverCard: "bg-gray-800 text-white",
                userButtonPopoverActionButton: "hover:bg-gray-700",
              },
            }}
          />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Header;