import Info from "@/components/Info";
import ShelterMap from "@/components/ShelterMap";

const Shelters = () => {
  return (
    <main className="h-[calc(100vh-4rem)] w-full bg-[#D8E3EB]">
      <div className="flex w-full h-full">
        {/* Left half - Google Map */}
        <div className="w-1/2 h-full">
          <ShelterMap />
        </div>

        <div className="w-1/2 h-full">
          {/* <Info /> */}
        </div>
        {/* Right half - Hurricane Information */}
        {/* <div className="w-1/2 h-full bg-gradient-to-br from-green-500 to-blue-500 p-8 relative overflow-hidden">
          <h2 className="text-2xl font-bold mb-6 text-white">Active Hurricanes</h2>
          <div className="space-y-4">

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
        </div> */}
      </div>
    </main>
  );
};

export default Shelters;
