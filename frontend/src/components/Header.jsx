import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = () => {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between p-4 bg-black z-50 border-b border-bubble-gum/20 shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/">
          <img src={logo} alt="LitVerse Logo" className="h-10 w-auto" />
        </Link>
      </div>

      {/* Center Navbar Links */}
      <div className="hidden md:flex space-x-8 text-silver text-lg font-semibold">
        <Link 
          to="/bestsellers" 
          className="hover:text-[#865DFF] transition-colors duration-300"
        >
          Best Sellers
        </Link>
        <Link 
          to="/genres" 
          className="hover:text-[#865DFF] transition-colors duration-300"
        >
          Genres
        </Link>
        <Link 
          to="/recommendations" 
          className="hover:text-[#865DFF] transition-colors duration-300"
        >
          Recommendations
        </Link>
      </div>

      {/* Right Side - Booklist Button and User Button */}
      <div className="flex items-center gap-4">
        <Link
          to="/ai-search"
          className="relative group"
        >
          <span className="relative z-10 block px-4 py-2 font-medium text-white rounded-lg bg-primary hover:bg-primary-dark transition-colors duration-300 shadow-lg">
            AI Search
          </span>
          <span
            className="absolute inset-0 bg-bubble-gum/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -m-1"
            aria-hidden="true"
          ></span>
        </Link>
        
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10 border-2 border-bubble-gum shadow-lg hover:border-primary",
                userButtonPopoverCard: "bg-indigo-900 text-silver border border-primary",
                userButtonPopoverActionButton: "hover:bg-primary/20 text-silver",
                userButtonPopoverActionButtonText: "text-silver",
                userButtonPopoverFooter: "bg-indigo-950",
              },
            }}
          />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Header;