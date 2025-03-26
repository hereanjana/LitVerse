import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";


const Select = () => {
  const user = useUser();
  const navigate = useNavigate();
  console.log("user", user);

  return(
    <div className="h-screen w-screen bg-black text-white flex flex-col items-center p-6">
      {/* Logo at Top Left */}
      <div className="absolute top-6 left-6">
        <img src={logo} alt="LitVerse Logo" className="h-12 w-auto" />
      </div>

      {/* Page Title */}
      <h1 className="text-3xl font-bold mt-16">Select Your Favourite Genres</h1>
      <div className="flex gap-4 mt-7">
            <button onClick={() => navigate("/landing-page")} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg">
              Skip
            </button>
      </div>      



    
    </div>
    
  );
};

export default Select;  