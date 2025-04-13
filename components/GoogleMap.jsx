"use client";
import { useState, useEffect, useRef } from "react";
import { shelters } from "./shelterData";

const GoogleMap = () => {
  const mapRef = useRef(null);
  const [locationStatus, setLocationStatus] = useState("Waiting for map to load...");
  const [shelterMarkers, setShelterMarkers] = useState([]);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  useEffect(() => {
    // Define the callback function BEFORE adding the script tag
    window.initMap = async function() {
      try {
        setLocationStatus("Map loaded, getting your location...");
        
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 27.9506, lng: -82.4572 }, // Tampa center
          zoom: 11,
          mapTypeId: "satellite"
        });

        // Function to geocode an address
        const geocodeAddress = (address) => {
          return new Promise((resolve, reject) => {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: address + ", Tampa, FL" }, (results, status) => {
              if (status === "OK" && results[0]) {
                resolve(results[0].geometry.location);
              } else {
                reject(new Error(`Geocode was not successful for the following reason: ${status}`));
              }
            });
          });
        };

        // Add shelter markers with accurate coordinates
        const markers = [];
        for (const shelter of shelters) {
          try {
            const location = await geocodeAddress(shelter.address);
            const marker = new window.google.maps.Marker({
              position: location,
              map: map,
              title: shelter.name,
              icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                scaledSize: new window.google.maps.Size(32, 32)
              }
            });

            // Add info window for each marker
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 10px; max-width: 250px;">
                  <h3 style="margin: 0 0 5px 0;">${shelter.name}</h3>
                  <p style="margin: 0 0 5px 0;">${shelter.address}</p>
                  <p style="margin: 0 0 5px 0; color: ${shelter.isPetFriendly ? 'green' : 'red'}">
                    ${shelter.isPetFriendly ? 'Pet Friendly' : 'No Pets'}
                  </p>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shelter.address)}" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style="
                      display: inline-block;
                      padding: 5px 10px;
                      background-color: #4285F4;
                      color: white;
                      text-decoration: none;
                      border-radius: 4px;
                      margin-top: 5px;
                    "
                  >
                    Open in Google Maps
                  </a>
                </div>
              `
            });

            marker.addListener("click", () => {
              // Close the previously opened info window
              if (activeInfoWindow) {
                activeInfoWindow.close();
              }
              // Open the new info window
              infoWindow.open(map, marker);
              setActiveInfoWindow(infoWindow);
            });

            markers.push(marker);
          } catch (error) {
            console.error(`Error geocoding ${shelter.name}:`, error);
          }
        }
        setShelterMarkers(markers);
        
        // Try to get user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              
              setLocationStatus(`Found location! Accuracy: ${Math.round(position.coords.accuracy)} meters`);
              
              // Add user marker
              const userMarker = new window.google.maps.Marker({
                position: pos,
                map: map,
                title: "Your location",
                icon: {
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  scaledSize: new window.google.maps.Size(32, 32)
                }
              });
              
              // Add accuracy circle
              const accuracyCircle = new window.google.maps.Circle({
                strokeColor: "#0000FF",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#0000FF",
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
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full"></div>
      <div className="absolute top-4 left-4 bg-white p-2 rounded shadow z-10">
        {locationStatus}
      </div>
    </div>
  );
};

export default GoogleMap;