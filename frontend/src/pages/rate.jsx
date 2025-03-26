import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import React from "react";
import { useNavigate } from "react-router-dom";



const rate = () => {
    const user = useUser();
    const navigate = useNavigate();
    console.log("user", user);
  
    return( 
        <h1 className="text-3xl font-bold mt-16">Select Your Favourite Genres</h1>



    );
};

export default rate;  