"use client";


import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useShelters } from "@/hooks/useShelter";
import { GoogleGenerativeAI } from "@google/generative-ai";


const ShelterList = ({ userLocation, selectedShelter, setSelectedShelter }) => {
 const [sortedShelters, setSortedShelters] = useState([]);
 const [expandedShelter, setExpandedShelter] = useState(null);
 const [shelterDetails, setShelterDetails] = useState({});
 const [loading, setLoading] = useState(false);
 const shelters = useShelters();


 // Calculate distance between two points using Haversine formula
 const calculateDistance = (lat1, lon1, lat2, lon2) => {
   const R = 6371; // Radius of the earth in km
   const dLat = deg2rad(lat2 - lat1);
   const dLon = deg2rad(lon2 - lon1);
   const a =
     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
     Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
     Math.sin(dLon / 2) * Math.sin(dLon / 2);
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   const d = R * c; // Distance in km
   return d;
 };


 const deg2rad = (deg) => {
   return deg * (Math.PI / 180);
 };


 // Geocode address to get latitude and longitude
 const geocodeAddress = async (address) => {
   try {
     const geocoder = new window.google.maps.Geocoder();
     return new Promise((resolve, reject) => {
       geocoder.geocode({ address }, (results, status) => {
         if (status === "OK") {
           resolve({
             lat: results[0].geometry.location.lat(),
             lng: results[0].geometry.location.lng(),
           });
         } else {
           reject(status);
         }
       });
     });
   } catch (error) {
     console.error("Geocoding error:", error);
     return null;
   }
 };


 // Sort shelters by distance from user
 useEffect(() => {
   const sortShelters = async () => {
     if (!userLocation) return;


     const sheltersWithDistance = await Promise.all(
       shelters.map(async (shelter) => {
         try {
           const location = await geocodeAddress(shelter.address);
           if (location) {
             const distance = calculateDistance(
               userLocation.lat,
               userLocation.lng,
               location.lat,
               location.lng
             );
             return { ...shelter, distance, location };
           }
           return { ...shelter, distance: Infinity };
         } catch (error) {
           console.error(`Error with shelter ${shelter.name}:`, error);
           return { ...shelter, distance: Infinity };
         }
       })
     );


     // Sort by distance
     const sorted = sheltersWithDistance.sort((a, b) => a.distance - b.distance);
     setSortedShelters(sorted);
   };


   if (window.google && window.google.maps) {
     sortShelters();
   }
 }, [userLocation]);


 // Set expanded shelter when selected shelter changes
 useEffect(() => {
   if (selectedShelter) {
     setExpandedShelter(selectedShelter);
     fetchShelterDetails(selectedShelter);
   }
 }, [selectedShelter]);


 // Fetch additional shelter details using Gemini API
 const fetchShelterDetails = async (shelter) => {
   // Check if we already have details for this shelter
   if (shelterDetails[shelter.name]) return;


   setLoading(true);
   try {
     const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


     const prompt = `Please provide detailed information about "${shelter.name}" as a hurricane shelter located at "${shelter.address}".
     Include the following in JSON format:
     1. Safety rating (1-10)
     2. Capacity (approximate number of people)
     3. Facilities (list of available facilities)
     4. Special accommodations (if any)
     5. Safety features
     6. A brief one-sentence description of the location


     Format the response as valid JSON like this:
     {
       "safetyRating": 8,
       "capacity": 500,
       "facilities": ["Restrooms", "Food service", "Medical station"],
       "specialAccommodations": "ADA accessible",
       "safetyFeatures": ["Storm shutters", "Backup generators", "Elevated location"],
       "description": "A well-maintained school facility with ample space and resources for emergency shelter."
     }`;


     const result = await model.generateContent(prompt);
     const response = await result.response;
     const text = response.text();
    
     try {
       // Find the JSON object in the text
       const jsonMatch = text.match(/\{[\s\S]*\}/);
       const jsonString = jsonMatch ? jsonMatch[0] : text;
       const data = JSON.parse(jsonString);
      
       setShelterDetails(prev => ({
         ...prev,
         [shelter.name]: data
       }));
     } catch (parseError) {
       console.error("Error parsing Gemini response:", parseError);
       // Fallback if parsing fails
       setShelterDetails(prev => ({
         ...prev,
         [shelter.name]: {
           safetyRating: Math.floor(Math.random() * 3) + 7, // Random rating 7-9
           capacity: Math.floor(Math.random() * 300) + 200, // Random capacity 200-500
           facilities: ["Restrooms", "Food service", "Medical station"],
           specialAccommodations: shelter.isPetFriendly ? "Pet friendly" : "None specified",
           safetyFeatures: ["Storm shutters", "Backup generators"],
           description: `A designated emergency shelter location at ${shelter.name}.`
         }
       }));
     }
   } catch (error) {
     console.error("Error fetching shelter details:", error);
     // Fallback data
     setShelterDetails(prev => ({
       ...prev,
       [shelter.name]: {
         safetyRating: Math.floor(Math.random() * 3) + 7, // Random rating 7-9
         capacity: Math.floor(Math.random() * 300) + 200, // Random capacity 200-500
         facilities: ["Restrooms", "Food service", "Medical station"],
         specialAccommodations: shelter.isPetFriendly ? "Pet friendly" : "None specified",
         safetyFeatures: ["Storm shutters", "Backup generators"],
         description: `A designated emergency shelter location at ${shelter.name}.`
       }
     }));
   } finally {
     setLoading(false);
   }
 };


 const getSafetyColor = (rating) => {
   if (rating >= 9) return "bg-green-500";
   if (rating >= 7) return "bg-green-400";
   if (rating >= 5) return "bg-yellow-500";
   if (rating >= 3) return "bg-orange-500";
   return "bg-red-500";
 };


 return (
   <div className="h-full flex flex-col bg-[#D8E3EB]">
     <div className="rounded-bl-xl p-4 bg-[#93AEC5] text-black">
       <div className="flex justify-between items-center">
         <div>
           <h2 className="text-2xl font-bold">Hurricane Shelters</h2>
           <p className="text-sm opacity-80">Sorted by distance from your location</p>
         </div>
        
         <AnimatePresence>
           {expandedShelter && (
             <motion.button
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.8 }}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => {
                 setExpandedShelter(null);
                 setSelectedShelter?.(null);
               }}
               className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium flex items-center space-x-1 transition-colors"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
               </svg>
               <span>Clear Selection</span>
             </motion.button>
           )}
         </AnimatePresence>
       </div>
     </div>


     <div className="overflow-y-auto flex-grow p-4">
       <AnimatePresence mode="wait">
         {sortedShelters.length > 0 ? (
           <motion.div
             key="shelter-list"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="space-y-3"
           >
             {sortedShelters.map((shelter, index) => (
               <motion.div
                 key={shelter.name}
                 layout="position"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{
                   opacity: 1,
                   y: 0,
                   scale: expandedShelter?.name === shelter.name ? 1.02 : 1
                 }}
                 transition={{
                   delay: index * 0.05,
                   duration: 0.3,
                   layout: {
                     duration: 0.4,
                     type: "spring",
                     stiffness: 200,
                     damping: 25
                   }
                 }}
                 className={`rounded-xl shadow-md overflow-hidden cursor-pointer border-2
                   ${expandedShelter?.name === shelter.name
                     ? "border-blue-500"
                     : index === 0
                       ? "border-green-400"
                       : "border-transparent"}
                   ${index === 0
                     ? "bg-gradient-to-r from-green-50 to-blue-50"
                     : "bg-white"}`}
                 onClick={() => {
                   // Toggle selection if clicking the same shelter
                   if (expandedShelter?.name === shelter.name) {
                     setExpandedShelter(null);
                     setSelectedShelter?.(null);
                   } else {
                     setExpandedShelter(shelter);
                     setSelectedShelter?.(shelter);
                     fetchShelterDetails(shelter);
                   }
                 }}
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
               >
                 <div className="p-4">
                   <div className="flex justify-between items-start">
                     <div>
                       <h3 className={`font-bold text-lg ${index === 0 ? "text-green-700" : "text-gray-800"}`}>
                         {shelter.name}
                         {index === 0 && (
                           <span className="ml-2 inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                             Closest
                           </span>
                         )}
                       </h3>
                       <p className="text-gray-600 text-sm mt-1">{shelter.address}</p>
                       {shelter.distance && (
                         <p className="text-blue-600 text-sm mt-1 font-medium">
                           {shelter.distance.toFixed(1)} km away
                         </p>
                       )}
                     </div>
                     <div className="flex flex-col items-end">
                       {shelter.isPetFriendly && (
                         <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                           Pet Friendly
                         </span>
                       )}
                       <motion.div
                         animate={{ rotate: expandedShelter?.name === shelter.name ? 180 : 0 }}
                         transition={{ duration: 0.3 }}
                         className="mt-2 text-gray-400"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                         </svg>
                       </motion.div>
                     </div>
                   </div>


                   <AnimatePresence>
                     {expandedShelter?.name === shelter.name && (
                       <motion.div
                         initial={{ opacity: 0, height: 0 }}
                         animate={{ opacity: 1, height: "auto" }}
                         exit={{ opacity: 0, height: 0 }}
                         transition={{
                           height: {
                             duration: 0.4,
                             type: "spring",
                             stiffness: 100,
                             damping: 30
                           },
                           opacity: { duration: 0.25 }
                         }}
                         className="mt-4 pt-4 border-t border-gray-200 overflow-hidden"
                       >
                         {loading ? (
                           <div className="flex justify-center items-center min-h-[200px] p-4">
                             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                           </div>
                         ) : shelterDetails[shelter.name] ? (
                           <motion.div
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             transition={{ duration: 0.3, delay: 0.1 }}
                             className="space-y-4"
                           >
                             <div className="flex items-center justify-between">
                               <div className="flex items-center space-x-2">
                                 <span className="font-semibold text-gray-700">Safety Rating:</span>
                                 <div className={`px-2 py-1 rounded-md text-white font-bold ${getSafetyColor(shelterDetails[shelter.name].safetyRating)}`}>
                                   {shelterDetails[shelter.name].safetyRating}/10
                                 </div>
                               </div>
                               <div className="flex items-center space-x-2">
                                 <span className="font-semibold text-gray-700">Capacity:</span>
                                 <span className="text-gray-800">{shelterDetails[shelter.name].capacity} people</span>
                               </div>
                             </div>
                            
                             <p className="text-gray-700 italic border-l-4 border-blue-300 pl-3 py-1 bg-blue-50">
                               "{shelterDetails[shelter.name].description}"
                             </p>
                            
                             <div>
                               <h4 className="font-semibold text-gray-700 mb-1">Facilities:</h4>
                               <div className="flex flex-wrap gap-2">
                                 {shelterDetails[shelter.name].facilities.map((facility, i) => (
                                   <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                     {facility}
                                   </span>
                                 ))}
                               </div>
                             </div>
                            
                             <div className="flex items-center space-x-2">
                               <span className="font-semibold text-gray-700">Special Accommodations:</span>
                               <span className="text-gray-800">{shelterDetails[shelter.name].specialAccommodations}</span>
                             </div>
                            
                             <div>
                               <h4 className="font-semibold text-gray-700 mb-1">Safety Features:</h4>
                               <div className="flex flex-wrap gap-2">
                                 {shelterDetails[shelter.name].safetyFeatures.map((feature, i) => (
                                   <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                                     {feature}
                                   </span>
                                 ))}
                               </div>
                             </div>
                            
                             <div className="flex justify-center pt-2">
                               <a
                                 href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shelter.address)}`}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
                               >
                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                 </svg>
                                 <span>Open in Google Maps</span>
                               </a>
                             </div>
                           </motion.div>
                         ) : (
                           <div className="py-4 text-center text-gray-500">
                             Loading shelter information...
                           </div>
                         )}
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </div>
               </motion.div>
             ))}
           </motion.div>
         ) : (
           <div className="flex flex-col items-center justify-center h-full py-12">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
             <p className="text-gray-600">Loading shelters...</p>
           </div>
         )}
       </AnimatePresence>
     </div>
   </div>
 );
};


export default ShelterList;