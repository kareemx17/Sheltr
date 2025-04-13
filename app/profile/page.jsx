"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShelters } from "@/hooks/useShelter";
import { useUserStore } from "@/store/userStore";
import uploadShelters from "@/lib/shelterSubmit";
import { toast } from "sonner";

const Profile = () => {
  const user = useUserStore((state) => state.user);
  const shelters = useShelters();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [evacueesNum, setEvacueesNum] = useState(1200);
  const [isEvacuating, setIsEvacuating] = useState(false);
  const [newShelter, setNewShelter] = useState({
    name: "",
    address: "",
    isPetFriendly: false,
  });
  const logout = useUserStore((state) => state.logout);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewShelter({
      ...newShelter,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newShelter.name || !newShelter.address) {
      toast.error("Please fill out all required fields");
      return;
    }

    try {
      setLoading(true);

      const request = await uploadShelters(newShelter);
      toast.success("Shelter has been added.");

      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Error has occured.");
    }

    setNewShelter({
      name: "",
      address: "",
      isPetFriendly: false,
      capacity: 100,
    });
  };

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });

    logout(); // Clear user from Zustand
    router.push("/login"); // Redirect to login
  };

  const toggleEvacuationStatus = () => {
    // Update evacuation status
    const newEvacuatingStatus = !isEvacuating;
    setIsEvacuating(newEvacuatingStatus);

    // Update evacuees count
    setEvacueesNum((prevStats) => prevStats + (newEvacuatingStatus ? 1 : -1));

    // In a real app, this would update the user's evacuation status in the backend
  };

  return (
    <main className="h-[calc(100vh-4rem)] bg-[#D8E3EB] py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Log Out
            </button>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto md:mx-0 flex items-center justify-center text-4xl text-gray-600">
                {user?.name?.charAt(0) || "U"}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-4 mb-1">
                  <h2 className="text-2xl font-semibold">
                    {user?.name || "User Name"}
                  </h2>
                  <button
                    onClick={toggleEvacuationStatus}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      isEvacuating
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {isEvacuating ? "Evacuating" : "Staying"}
                  </button>
                </div>
                <p className="text-gray-600 mb-2">
                  {user?.email || "user@example.com"}
                </p>
                <p className="text-gray-600 mb-4">
                  <span className="inline-flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Tampa, Florida
                  </span>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">
                      Shelters Nearby
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">
                      {shelters.length}
                    </p>
                    <p className="text-sm text-blue-500">
                      Available in your area
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium text-green-800 mb-2">
                      People Evacuating
                    </h3>
                    <p className="text-3xl font-bold text-green-600">
                      {evacueesNum}
                    </p>
                    <p className="text-sm text-green-500">
                      Currently in shelters
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Shelter Form */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-400 p-6">
            <h2 className="text-2xl font-bold text-white">Add New Shelter</h2>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="name"
                  >
                    Shelter Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newShelter.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter shelter name"
                  />
                </div>

                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="address"
                  >
                    Address*
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={newShelter.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter full address"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPetFriendly"
                    name="isPetFriendly"
                    checked={newShelter.isPetFriendly}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    className="ml-2 block text-gray-700"
                    htmlFor="isPetFriendly"
                  >
                    Pet Friendly
                  </label>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Submit New Shelter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
