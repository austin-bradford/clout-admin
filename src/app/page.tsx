"use client";

import { useState, useEffect } from "react";
import NewCongregation from "./components/NewCongregation";
import NewPerson from "./components/NewPerson";
import NewPersonForm from "./components/NewPersonForm";
import NewCongregationForm from "./components/NewCongregationForm";
import InvestmentPortal from "./components/NewInvestment";
import { set } from "mongoose";

// This is the main page of the application

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is logged in when the component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      setIsLoading(false);
    } else {
      setToken(null);
      setIsLoggedIn(false);
      setIsLoading(false);
    }
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
  const signIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const username = (
      form.elements.namedItem("signinUsername") as HTMLInputElement
    ).value;
    const password = (
      form.elements.namedItem("signinPassword") as HTMLInputElement
    ).value;

    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem("token", token);
        setToken(token);
        setIsLoggedIn(true);
      } else {
        const data = await res.json();
        alert(data.error || "Login failed");
      }
    } catch (err) {
      alert("Login failed");
    }
  };

  // Function to handle sign out
  const signOut = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsLoggedIn(false);
  };

  // Add this function to handle signup
  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const username = (
      form.elements.namedItem("signupUsername") as HTMLInputElement
    ).value;
    const password = (
      form.elements.namedItem("signupPassword") as HTMLInputElement
    ).value;
    try {
      const res = await fetch("http://localhost:4000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        alert("Signup successful! Please sign in.");
        setShowSignup(false);
      } else {
        const data = await res.json();
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div>
      {/* Modal for sign in and sign up */}
      {!token && (
        <div>
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 opacity-50 z-10"></div>
          <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-20">
            <div className="relative bg-white rounded-lg shadow-lg p-8 w-96">
              {isLoading && (
                <div className="absolute flex items-center justify-center w-full h-full bg-white -translate-x-8 -translate-y-8 rounded-lg">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span>Loading...</span>
                  </div>
                </div>
              )}

              <h2 className="text-2xl font-bold mb-4">
                {showSignup ? "Sign Up" : "Sign In"}
              </h2>
              {showSignup ? (
                <form onSubmit={handleSignup}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="signupUsername"
                      placeholder="Choose a username"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="signupPassword"
                      placeholder="Choose a password"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Sign Up
                    </button>
                    <button
                      type="button"
                      className="text-blue-500 hover:underline"
                      onClick={() => setShowSignup(false)}
                    >
                      Already have an account?
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={signIn}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="signinUsername"
                      placeholder="Enter your username"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="signinPassword"
                      placeholder="Enter your password"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      className="text-blue-500 hover:underline"
                      onClick={() => setShowSignup(true)}
                    >
                      Need an account?
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#d9e7ff] flex flex-col items-center justify-center">
        {/* signout button */}
        {token && (
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
