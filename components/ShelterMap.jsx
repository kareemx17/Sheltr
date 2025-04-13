"use client";
import { useState, useEffect, useRef } from "react";
import { useShelters } from "@/hooks/useShelter";

const ShelterMap = ({
  onUserLocationChange,
  onShelterSelect,
  selectedShelter,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [locationStatus, setLocationStatus] = useState(
    "Waiting for map to load..."
  );
  const [shelterMarkers, setShelterMarkers] = useState([]);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const shelters = [
    {
      name: "Armwood High",
      address: "12000 US Highway 92, Seffner, FL 33584",
      isPetFriendly: false,
    },
    {
      name: "Barrington/Stowers",
      address: "5925 Village Center Dr, Tampa, FL 33624",
      isPetFriendly: true,
    },
    {
      name: "Bartels Middle",
      address: "9190 Imperial Oaks Blvd, Tampa, FL 33647",
      isPetFriendly: true,
    },
    {
      name: "Benito Middle",
      address: "10101 Cross Creek Blvd, Tampa, FL 33647",
      isPetFriendly: false,
    },
    {
      name: "Bevis Elementary",
      address: "5720 Osprey Ridge Dr, Lithia, FL 33547",
      isPetFriendly: false,
    },
    {
      name: "Bowers-Whitley / Muller",
      address: "13609 N. 22nd St, Tampa, FL 33613",
      isPetFriendly: false,
    },
    {
      name: "Boyette Springs Elementary",
      address: "10141 Sedgebrook Dr, Riverview, FL 33578",
      isPetFriendly: false,
    },
    {
      name: "Brandon High",
      address: "1101 Victoria St, Brandon, FL 33510",
      isPetFriendly: false,
    },
    {
      name: "Burnett Middle",
      address: "1010 N Kingsway Rd, Seffner, FL 33584",
      isPetFriendly: true,
    },
    {
      name: "Cannella Elementary",
      address: "10707 Nixon Rd, Tampa, FL 33612",
      isPetFriendly: false,
    },
    {
      name: "Carrollwood Elementary",
      address: "3516 McFarland Rd, Tampa, FL 33618",
      isPetFriendly: false,
    },
    {
      name: "Cimino Elementary",
      address: "4329 Culbreath Rd, Valrico, FL 33596",
      isPetFriendly: false,
    },
    {
      name: "Collins Elementary",
      address: "12424 Summerfield Blvd, Riverview, FL 33579",
      isPetFriendly: false,
    },
    {
      name: "Cork Elementary",
      address: "3501 N Cork Rd, Plant City, FL 33565",
      isPetFriendly: false,
    },
    {
      name: "Cypress Creek Elementary",
      address: "4040 19TH Ave. NE, Ruskin, FL 33570",
      isPetFriendly: false,
    },
    {
      name: "Dorothy York Elementary",
      address: "5995 Covington Garden Drive, Tampa, FL 33619",
      isPetFriendly: false,
    },
    {
      name: "Durant High",
      address: "4748 Cougar Path, Plant City, FL 33567",
      isPetFriendly: true,
    },
    {
      name: "Hammond Elementary",
      address: "8008 N Mobley Rd, Odessa, FL 33556",
      isPetFriendly: false,
    },
    {
      name: "Heritage Elementary",
      address: "18201 East Meadows Rd, Tampa, FL 33647",
      isPetFriendly: false,
    },
    {
      name: "Jennings Middle",
      address: "9325 Govenors Rd, Seffner, FL 33584",
      isPetFriendly: false,
    },
    {
      name: "Knights Elementary",
      address: "4815 N Keene Rd, Tampa, FL 33603",
      isPetFriendly: false,
    },
    {
      name: "Lake Magdalene Elementary",
      address: "2002 Pine Lake Dr, Tampa, FL 33612",
      isPetFriendly: false,
    },
    {
      name: "Lockhart Elementary",
      address: "3719 N 17TH St, Tampa, FL 33610",
      isPetFriendly: false,
    },
    {
      name: "Marshall Middle",
      address: "18 S Maryland Ave, Plant City, FL 33563",
      isPetFriendly: false,
    },
    {
      name: "Martinez Middle",
      address: "5601 W Lutz Lake Fern Rd, Lutz, FL 33558",
      isPetFriendly: false,
    },
    {
      name: "McKitrick Elementary",
      address: "5503 Lutz Lake Fern Rd, Lutz, FL 33558",
      isPetFriendly: false,
    },
    {
      name: "Middleton High",
      address: "4801 N 22nd St, Tampa, FL 33610",
      isPetFriendly: true,
    },
    {
      name: "Mort Elementary",
      address: "1806 Bearss Ave, Tampa, FL 33613",
      isPetFriendly: false,
    },
    {
      name: "Mulrennan Middle",
      address: "4215 Durant Rd, Valrico, FL 33596",
      isPetFriendly: false,
    },
    {
      name: "Nelson Elementary",
      address: "5413 Durant Rd, Dover, FL 33527",
      isPetFriendly: false,
    },
    {
      name: "Newsome High",
      address: "16550 Fishhawk Blvd, Lithia, FL 33547",
      isPetFriendly: false,
    },
    {
      name: "Pizzo Elementary",
      address: "11701 Bull Run, Tampa, FL 33617",
      isPetFriendly: false,
    },
    {
      name: "Pride Elementary",
      address: "10310 Lions Den Dr, Riverview, FL 33569",
      isPetFriendly: false,
    },
    {
      name: "Reddick Elementary",
      address: "325 West Lake Dr, Wimauma, FL 33598",
      isPetFriendly: false,
    },
    {
      name: "Sessums Elementary",
      address: "11525 Ramble Creek Dr, Riverview, FL 33569",
      isPetFriendly: false,
    },
    {
      name: "Sheehy Elementary",
      address: "6402 N 40TH St, Tampa, FL 33610",
      isPetFriendly: false,
    },
    {
      name: "Shields Middle",
      address: "15732 Beth Shields Way, Ruskin, FL 33573",
      isPetFriendly: true,
    },
    {
      name: "Sickles High",
      address: "7950 Gunn Highway, Tampa, FL 33626",
      isPetFriendly: true,
    },
    {
      name: "Simmons Career Center",
      address: "1202 W Grant St, Plant City, FL 33563",
      isPetFriendly: false,
    },
    {
      name: "Smith, SGT Paul Middle",
      address: "14303 Citrus Pointe Dr, Tampa, FL 33625",
      isPetFriendly: false,
    },
    {
      name: "Steinbrenner High",
      address: "5575 W. Lutz Lake Fern Rd, Lutz, FL 33558",
      isPetFriendly: true,
    },
    {
      name: "Summerfield Elementary",
      address: "11990 Big Bend Rd, Riverview, FL 33579",
      isPetFriendly: false,
    },
    {
      name: "Tomlin Middle",
      address: "501 N Woodrow Wilson St, Plant City, FL 33563",
      isPetFriendly: false,
    },
    {
      name: "Turkey Creek Middle",
      address: "5005 Turkey Creek Rd, Plant City, FL 33567",
      isPetFriendly: false,
    },
    {
      name: "Turner Elementary",
      address: "9020 Imerial Oaks Blvd, Tampa, FL 33647",
      isPetFriendly: false,
    },
    {
      name: "Valrico Elementary",
      address: "609 S Miller Rd, Valrico, FL 33594",
      isPetFriendly: false,
    },
    {
      name: "Wharton High",
      address: "20150 Bruce B Downs Blvd, Tampa, FL 33647",
      isPetFriendly: false,
    },
    {
      name: "Wilson Elementary",
      address: "702 English St, Plant City, FL 33563",
      isPetFriendly: false,
    },
  ];

  useEffect(() => {
    window.initMap = async function () {
      try {
        setLocationStatus("Map loaded, getting your location...");

        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 27.9506, lng: -82.4572 }, // default Tampa center
          zoom: 12,
          mapTypeId: "hybrid",
          mapTypeControl: true,
          fullscreenControl: true,
          streetViewControl: false,
          zoomControl: true,
        });

        // Store map instance for later use
        mapInstanceRef.current = map;

        // 🏥 Add shelters to map
        const geocodeAddress = (address) => {
          return new Promise((resolve, reject) => {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode(
              { address: address + ", Tampa, FL" },
              (results, status) => {
                if (status === "OK" && results[0]) {
                  resolve(results[0].geometry.location);
                } else {
                  reject(new Error(`Geocode failed: ${status}`));
                }
              }
            );
          });
        };

        const markers = [];
        const sheltersWithLocations = [];

        for (const shelter of shelters) {
          try {
            const location = await geocodeAddress(shelter.address);
            const shelterWithLocation = {
              ...shelter,
              location: {
                lat: location.lat(),
                lng: location.lng(),
              },
            };
            sheltersWithLocations.push(shelterWithLocation);

            const marker = new window.google.maps.Marker({
              position: location,
              map: map,
              title: shelter.name,
              animation: window.google.maps.Animation.DROP,
              icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                scaledSize: new window.google.maps.Size(32, 32),
              },
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
               <div style="padding: 10px; max-width: 250px;">
                 <h3 style="margin: 0 0 5px 0;">${shelter.name}</h3>
                 <p>${shelter.address}</p>
                 <p style="color: ${shelter.isPetFriendly ? "green" : "red"};">
                   ${shelter.isPetFriendly ? "Pet Friendly" : "No Pets"}
                 </p>
                 <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                   shelter.address
                 )}"
                   target="_blank" style="background:#4285F4;color:white;padding:5px 10px;text-decoration:none;border-radius:4px;">
                   Open in Google Maps
                 </a>
               </div>
             `,
            });

            marker.addListener("click", () => {
              // Check if this shelter is already selected
              if (
                selectedShelter &&
                selectedShelter.name === shelterWithLocation.name
              ) {
                // If it's already selected, deselect it
                if (activeInfoWindow) {
                  activeInfoWindow.close();
                  setActiveInfoWindow(null);
                }
                onShelterSelect?.(null);
              } else {
                // Otherwise, select this shelter
                if (activeInfoWindow) activeInfoWindow.close();
                infoWindow.open(map, marker);
                setActiveInfoWindow(infoWindow);
                onShelterSelect?.(shelterWithLocation);
              }
            });

            // Store marker and location with shelter
            markers.push({ marker, shelter: shelterWithLocation });
          } catch (error) {
            console.error(`Error geocoding ${shelter.name}:`, error);
          }
        }

        setShelterMarkers(markers);

        // 📍 User location marker
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };

              setUserLocation(pos);
              setLocationStatus(
                `Found location! Accuracy: ${Math.round(
                  position.coords.accuracy
                )} meters`
              );
              onUserLocationChange?.(pos);

              // ✅ Center map on user's location
              map.setCenter(pos);

              const userMarker = new window.google.maps.Marker({
                position: pos,
                map: map,
                title: "Your location",
                animation: window.google.maps.Animation.BOUNCE,
                icon: {
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  scaledSize: new window.google.maps.Size(36, 36),
                },
              });

              // Stop the bouncing after 3 seconds
              setTimeout(() => {
                userMarker.setAnimation(null);
              }, 3000);

              const accuracyCircle = new window.google.maps.Circle({
                strokeColor: "#4285F4",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#4285F4",
                fillOpacity: 0.2,
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
  }, [onUserLocationChange, onShelterSelect]);

  // Effect to handle selected shelter changes
  useEffect(() => {
    // Close any open info window when selection is cleared
    if (!selectedShelter && activeInfoWindow) {
      activeInfoWindow.close();
      setActiveInfoWindow(null);

      // Reset zoom and center if we have user location
      if (mapInstanceRef.current && userLocation) {
        mapInstanceRef.current.setZoom(12);
        mapInstanceRef.current.panTo(userLocation);
      }
      return;
    }

    if (
      selectedShelter &&
      mapInstanceRef.current &&
      shelterMarkers.length > 0
    ) {
      // Close any open info window
      if (activeInfoWindow) {
        activeInfoWindow.close();
      }

      // Find the marker for the selected shelter
      const markerData = shelterMarkers.find(
        (item) => item.shelter.name === selectedShelter.name
      );

      if (markerData) {
        // Center on the selected shelter
        mapInstanceRef.current.panTo(markerData.marker.getPosition());
        mapInstanceRef.current.setZoom(15);

        // Add bounce animation
        markerData.marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(() => {
          markerData.marker.setAnimation(null);
        }, 2100);

        // Open its info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
           <div style="padding: 10px; max-width: 250px;">
             <h3 style="margin: 0 0 5px 0;">${selectedShelter.name}</h3>
             <p>${selectedShelter.address}</p>
             <p style="color: ${
               selectedShelter.isPetFriendly ? "green" : "red"
             };">
               ${selectedShelter.isPetFriendly ? "Pet Friendly" : "No Pets"}
             </p>
             <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
               selectedShelter.address
             )}"
               target="_blank" style="background:#4285F4;color:white;padding:5px 10px;text-decoration:none;border-radius:4px;">
               Open in Google Maps
             </a>
           </div>
         `,
        });

        infoWindow.open(mapInstanceRef.current, markerData.marker);
        setActiveInfoWindow(infoWindow);
      }
    }
  }, [selectedShelter, shelterMarkers, userLocation]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-lg text-sm shadow-lg">
        {locationStatus}
      </div>
    </div>
  );
};

export default ShelterMap;
