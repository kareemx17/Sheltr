"use client";


import { useState } from "react";
import ShelterMap from "@/components/ShelterMap";
import ShelterList from "@/components/ShelterList";


const Shelters = () => {
 const [userLocation, setUserLocation] = useState(null);
 const [selectedShelter, setSelectedShelter] = useState(null);


 const handleUserLocationChange = (location) => {
   setUserLocation(location);
 };


 const handleShelterSelect = (shelter) => {
   setSelectedShelter(shelter);
 };


 return (
   <main className="h-[calc(100vh-4rem)] w-full bg-[#D8E3EB]">
     <div className="flex w-full h-full">
       <div className="w-1/2 h-full p-4">
         <ShelterMap
           onUserLocationChange={handleUserLocationChange}
           onShelterSelect={handleShelterSelect}
           selectedShelter={selectedShelter}
         />
       </div>


       <div className="w-1/2 h-full">
         <ShelterList
           userLocation={userLocation}
           selectedShelter={selectedShelter}
           setSelectedShelter={handleShelterSelect}
         />
       </div>
     </div>
   </main>
 );
};


export default Shelters;

