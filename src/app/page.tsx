"use client";

import { useState, useEffect } from "react";
import NewCongregation from "./components/NewCongregation";
import NewPerson from "./components/NewPerson";
import NewPersonForm from "./components/NewPersonForm";
import NewCongregationForm from "./components/NewCongregationForm";
import InvestmentPortal from "./components/NewInvestment";

// This is the main page of the application

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  // State to control the visibility of the NewPersonForm
  const [isPersonFormOpen, setIsPersonFormOpen] = useState(false);
  // State to control the visibility of the NewCongregationForm
  const [isCongregationFormOpen, setIsCongregationFormOpen] = useState(false);

  // Function to handle opening the form
  const handlePersonFormOpen = () => {
    setIsPersonFormOpen(true);
  };
  // Function to handle opening the form
  const handleCongregationFormOpen = () => {
    setIsCongregationFormOpen(true);
  };

  // Function to handle closing the form
  const handlePersonFormClose = () => {
    const form = document.querySelector(".newpersonform");
    if (form) {
      form.classList.add("animate-fadeOutForm");
    }
    setTimeout(() => {
      setIsPersonFormOpen(false);
    }, 250); // 250ms to match the animation duration
  };

  // Function to handle closing the form
  const handleCongregationFormClose = () => {
    const form = document.querySelector(".newcongregationform");
    if (form) {
      form.classList.add("animate-fadeOutForm");
    }
    setTimeout(() => {
      setIsCongregationFormOpen(false);
    }, 250); // 250ms to match the animation duration
  };

  // Function to handle sign in
  const signIn = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  // Function to handle sign out
  const signOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  // If isLoggedIn is null, it means the check is still in progress
  if (isLoggedIn === null) {
    // Render a loading spinner or placeholder, but do NOT return before other hooks
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div>
      {/* sign in box in center of screen */}
      {!isLoggedIn && (
        <div>
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 opacity-50 z-10"></div>

          <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-20">
            <div className="bg-white rounded-lg shadow-lg p-8 w-96">
              <h2 className="text-2xl font-bold mb-4">Sign In</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your username"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={signIn}
                  >
                    Sign In
                  </button>
                  <a
                    href="#"
                    className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                  >
                    Forgot Password?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#d9e7ff] flex flex-col items-center justify-center">
        {/* signout button */}
        {isLoggedIn && (
          <button
            className="absolute top-0 right-0 m-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={signOut}
          >
            Sign Out
          </button>
        )}
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to the CLOUT Admin App!
          <br />
          <span className="text-2xl font-light">
            Manage your congregations, investments, and people with ease.
          </span>
        </h1>
        <div className="w-full max-w-md flex flex-col items-center justify-center gap-2">
          <NewPerson handleOpen={handlePersonFormOpen} />
          <NewCongregation handleOpen={handleCongregationFormOpen} />
          <InvestmentPortal />
        </div>
        {isPersonFormOpen && (
          <NewPersonForm handleClose={handlePersonFormClose} />
        )}
        {isCongregationFormOpen && (
          <NewCongregationForm handleClose={handleCongregationFormClose} />
        )}
      </div>
    </div>
  );
}
