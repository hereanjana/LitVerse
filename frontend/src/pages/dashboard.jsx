import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import f1 from "../assets/f1.png";
import logo from "../assets/logo.png";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      const createdAt = new Date(user.createdAt).getTime(); //always same
      const updatedAt = new Date(user.updatedAt).getTime(); //updated everytime user logs in
      const timeDifference = (updatedAt - createdAt) / 1000;
      console.log("timeDiffe", timeDifference);
      if (timeDifference < 10) {
        navigate("/onboarding-genres");
      } else {
        navigate("/landing-page");
      }
    }
  }, [user, isLoaded]);
  console.log("user", user);

  return (
    <div className="h-screen w-screen   bg-black flex items-center justify-center">
      {/* Logo */}
      <div className="absolute top-6 left-6">
        <img src={logo} alt="LitVerse Logo" className="h-12 w-auto" />
      </div>
      <div className="w-4.5/5 grid grid-cols-2 gap-8">
      
        {/* Left Side */}
        <div className="flex flex-col justify-center text-white">
          <h1 className="text-4xl font-bold mb-6">
            Track books you’ve read.
            <br />
            Save those you want to read.
            <br />
            Tell your friends what’s good.
          </h1>

          <SignedOut>
            <SignInButton mode="modal" asChild>
              <button className="btn btn-primary w-36">Get Started</button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* Right Side - Image */}
        <div className="flex justify-center items-center">
          <img
            src={f1}
            alt="Books Background"
            className="rounded-lg shadow-lg brightness-75  opacity-90"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
