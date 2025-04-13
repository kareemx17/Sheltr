"use client";
import { useState, useEffect, useRef } from "react";
import { useShelters } from "../hooks/useShelter";

const ShelterMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [locationStatus, setLocationStatus] = useState(
    "Waiting for map to load..."
  );
  const [shelterMarkers, setShelterMarkers] = useState([]);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const shelters = useShelters();

  useEffect(() => {
    // Initialize map
    window.initMap = function () {
      try {
        setLocationStatus("Map loaded, getting your location...");

        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 27.9506, lng: -82.4572 }, // default Tampa center
          zoom: 12,
          mapTypeId: "satellite",
        });

        // Store map instance in ref for later use with shelters
        mapInstanceRef.current = map;

        // Handle user location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };

              setLocationStatus(
                `Found location! Accuracy: ${Math.round(
                  position.coords.accuracy
                )} meters`
              );

              // Center map on user's location
              map.setCenter(pos);

              new window.google.maps.Marker({
                position: pos,
                map: map,
                title: "Your location",
                icon: {
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  scaledSize: new window.google.maps.Size(32, 32),
                },
              });

              new window.google.maps.Circle({
                strokeColor: "#0000FF",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#0000FF",
                fillOpacity: 0.35,
                map: map,
                center: pos,
                radius: position.coords.accuracy,
              });
            },
            (error) => {
              setLocationStatus(`Location error: ${error.message}`);
              console.error("Geolocation error:", error);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
          );
        } else {
          setLocationStatus("Geolocation not supported by your browser");
        }
      } catch (error) {
        console.error("Error initializing map:", error);
        setLocationStatus(`Map error: ${error.message}`);
      }
    };

    // Load Google Maps script if not already loaded
    if (!document.getElementById("google-maps-script")) {
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      setLocationStatus("Loading Google Maps...");
    }

    return () => {
      delete window.initMap;
    };
  }, [apiKey]);

  // Handle adding shelter markers in a separate useEffect
  useEffect(() => {
    // Only process shelters when map is loaded and shelters data is available
    if (mapInstanceRef.current && shelters && shelters.length > 0) {
      const geocoder = new window.google.maps.Geocoder();
      const map = mapInstanceRef.current;
      const markers = [];
      let activeInfoWindow = null;

      // Process each shelter
      shelters.forEach((shelter) => {
        // Use address with city and state for better geocoding results
        const fullAddress = `${shelter.address}, Tampa, FL`;

        geocoder.geocode({ address: fullAddress }, (results, status) => {
          if (status === "OK" && results[0]) {
            const location = results[0].geometry.location;

            const marker = new window.google.maps.Marker({
              position: location,
              map: map,
              title: shelter.name,
              icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                scaledSize: new window.google.maps.Size(32, 32),
              },
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 10px; max-width: 250px;">
                  <h3 style="margin: 0 0 5px 0;">${shelter.name}</h3>
                  <p style="margin-bottom: 5px;">${shelter.address}</p>
                  <p style="margin-bottom: 12px; color: ${
                    shelter.isPetFriendly ? "green" : "red"
                  };">
                    ${shelter.isPetFriendly ? "Pet Friendly" : "No Pets"}
                  </p>
                  <div style="margin-top: 8px;">
                    <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      shelter.address
                    )}"
                      target="_blank" style="background:#4285F4;color:white;padding:5px 10px;text-decoration:none;border-radius:4px;display:inline-block;">
                      Open in Google Maps
                    </a>
                  </div>
                </div>
              `,
            });

            marker.addListener("click", () => {
              if (activeInfoWindow) activeInfoWindow.close();
              infoWindow.open(map, marker);
              activeInfoWindow = infoWindow;
            });

            markers.push(marker);
          } else {
            console.error(`Geocoding failed for ${shelter.name}: ${status}`);
          }
        });
      });

      setShelterMarkers(markers);
    }
  }, [shelters]);

  return (
    <div className="relative w-[95%] h-[95%] pt-10 pl-10 rounded-full">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default ShelterMap;
