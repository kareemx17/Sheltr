"use client";
import { useState, useEffect, useRef } from "react";

const GoogleMap = () => {
  const mapRef = useRef(null);
  const [locationStatus, setLocationStatus] = useState("Waiting for map to load...");
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  useEffect(() => {
    // Define the callback function BEFORE adding the script tag
    window.initMap = function() {
      try {
        setLocationStatus("Map loaded, getting your location...");
        
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 25.7617, lng: -80.1918 }, // Default location
          zoom: 15,
          mapTypeId: "roadmap" // Change to "satellite" if needed
        });
        
        // Try to get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              
              setLocationStatus(`Found location! Accuracy: ${Math.round(position.coords.accuracy)} meters`);
              
              map.setCenter(pos);
              
              // Add marker
              const marker = new window.google.maps.Marker({
                position: pos,
                map: map,
                title: "Your location"
              });
              
              // Add accuracy circle
              const accuracyCircle = new window.google.maps.Circle({
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
                map: map,
                center: pos,
                radius: position.coords.accuracy
              });
            },
            (error) => {
              setLocationStatus(`Location error: ${error.message}`);
              console.error("Geolocation error:", error);
            },
            {
              enableHighAccuracy: true,
              timeout: 20000,
              maximumAge: 0
            }
          );
        } else {
          setLocationStatus("Geolocation not supported by your browser");
        }
      } catch (error) {
        console.error("Error initializing map:", error);
        setLocationStatus(`Map error: ${error.message}`);
      }
    };
    
    // Check if the script is already loaded
    const existingScript = document.getElementById("google-maps-script");
    if (!existingScript) {
      // Create and add the script tag
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      setLocationStatus("Loading Google Maps...");
    }
    
    // Cleanup function to remove the global callback when component unmounts
    return () => {
      delete window.initMap;
    };
  }, []);
  
  return (
    <div className="relative w-full h-screen">
      <div ref={mapRef} className="w-full h-full"></div>
      <div className="absolute top-4 left-4 bg-white p-2 rounded shadow z-10">
        {locationStatus}
      </div>
    </div>
  );
};

export default GoogleMap;