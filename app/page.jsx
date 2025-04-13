import Image from "next/image";



export default function Home() {
  return (
    <main className="h-[calc(100vh-4rem)] w-full">
      <div className="flex w-full h-full">
        {/* Left half - Main content */}
        <div className="w-1/2 h-full bg-gradient-to-br from-green-500 to-blue-500 p-8 relative overflow-hidden">
          {/* <div className="absolute inset-0 bg-[url('/storm-pattern.png')] opacity-10"></div>
          <div className="relative z-10 h-full flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4 text-white animate-pulse">Welcome to Sheltr</h1>
            <p className="text-xl text-white/90 mb-6">Your trusted source for emergency shelter information</p>
            <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                  Find Nearest Shelter
                </button>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                  Emergency Kit Checklist
                </button>
                <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                  Evacuation Routes
                </button>
              </div>
            </div>
          </div> */}
        </div>

        {/* right half type shit */}
        <div className="w-1/2 h-full bg-gradient-to-br from-green-500 to-blue-500 p-8 relative overflow-hidden">
          <h2 className="text-2xl font-bold mb-6 text-white">Active Hurricanes</h2>
          <div className="space-y-4">
            {/* Hurricane Card 1 */}
            <div className="bg-gradient-to-r from-red-900 to-red-800 p-4 rounded-lg shadow-lg transform hover:scale-102 transition-all duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Hurricane Maria</h3>
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">Category 4</span>
              </div>
              <div className="mt-2 space-y-1 text-gray-200">
                <p className="flex items-center">
                  <span className="w-24">Distance:</span>
                  <span className="text-red-300 font-semibold">250 miles</span>
                </p>
                <p className="flex items-center">
                  <span className="w-24">Arrival:</span>
                  <span className="text-red-300 font-semibold">48 hours</span>
                </p>
                <p className="flex items-center">
                  <span className="w-24">Speed:</span>
                  <span className="text-red-300 font-semibold">15 mph</span>
                </p>
              </div>
            </div>

            {/* second card type shit */}
            <div className="bg-gradient-to-r from-orange-900 to-orange-800 p-4 rounded-lg shadow-lg transform hover:scale-102 transition-all duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Hurricane Andrew</h3>
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">Category 3</span>
              </div>
              <div className="mt-2 space-y-1 text-gray-200">
                <p className="flex items-center">
                  <span className="w-24">Distance:</span>
                  <span className="text-orange-300 font-semibold">400 miles</span>
                </p>
                <p className="flex items-center">
                  <span className="w-24">Arrival:</span>
                  <span className="text-orange-300 font-semibold">72 hours</span>
                </p>
                <p className="flex items-center">
                  <span className="w-24">Speed:</span>
                  <span className="text-orange-300 font-semibold">12 mph</span>
                </p>
              </div>
            </div>

            {/* 3 card type shit*/}
            <div className="bg-gradient-to-r from-yellow-900 to-yellow-800 p-4 rounded-lg shadow-lg transform hover:scale-102 transition-all duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Hurricane Katrina</h3>
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">Category 2</span>
              </div>
              <div className="mt-2 space-y-1 text-gray-200">
                <p className="flex items-center">
                  <span className="w-24">Distance:</span>
                  <span className="text-yellow-300 font-semibold">600 miles</span>
                </p>
                <p className="flex items-center">
                  <span className="w-24">Arrival:</span>
                  <span className="text-yellow-300 font-semibold">96 hours</span>
                </p>
                <p className="flex items-center">
                  <span className="w-24">Speed:</span>
                  <span className="text-yellow-300 font-semibold">10 mph</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
