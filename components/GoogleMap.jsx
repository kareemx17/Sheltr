"use client";
import { useState, useEffect, useRef } from "react";
import { shelters } from "./shelterData";
import { pathPoints } from "./PathPoints";

const GoogleMap = () => {
  const mapRef = useRef(null);
  const [locationStatus, setLocationStatus] = useState(
    "Waiting for map to load..."
  );
  const [shelterMarkers, setShelterMarkers] = useState([]);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const geoJsonUrl =
    "https://coast.noaa.gov/arcgisdev/rest/services/Hurricanes/Production_Hurricane/MapServer/2/query?where=1=1&outFields=*&f=geojson";

  useEffect(() => {
    window.initMap = async function () {
      try {
        setLocationStatus("Map loaded, getting your location...");

        const map = await new window.google.maps.Map(mapRef.current, {
          center: { lat: 27.9506, lng: -82.4572 },
          zoom: 6,
          mapTypeId: "satellite",
        });

        // 🌀 Add Hurricane Visualization
        const drawHurricanePath = async () => {
          try {
            const response = await fetch(geoJsonUrl);
            const data = await response.json();

            // Clear existing hurricane data
            map.data.forEach((feature) => map.data.remove(feature));

            // Add the hurricane path
            map.data.addGeoJson(data);

      //      // Define the hurricane path points (simulating Hurricane Milton's path)
      //      const pathPoints = [
      //        // { lat: 25.0, lng: -90.0 }, // Gulf of Mexico origin
      //        // { lat: 26.5, lng: -87.0 }, // Approaching Florida
      //        // { lat: 27.5, lng: -84.0 }, // Near Tampa
      //        // { lat: 28.0, lng: -82.0 }, // Crossing Florida
      //        // { lat: 28.5, lng: -80.5 }, // East Coast
      //        // { lat: 29.0, lng: -79.0 }, // Atlantic Ocean
      //        // { lat: 29.5, lng: -77.5 }, // Further into Atlantic
      //        // { lat: 30.0, lng: -76.0 }  // Final Atlantic position

              // { lat: 32.0, lng: -75.0 }, // Atlantic Ocean (northeast of Florida)
              // { lat: 31.0, lng: -78.0 }, // Moving southwest
              // { lat: 30.0, lng: -81.0 }, // Approaching Florida
              // { lat: 29.5, lng: -83.0 }, // Near Tallahassee
              // { lat: 29.0, lng: -85.0 }, // Crossing Florida
              // { lat: 28.5, lng: -87.0 }, // Entering Gulf
              // { lat: 28.0, lng: -89.0 }, // Gulf of Mexico
              // { lat: 27.5, lng: -91.0 },

      //        { lat: 32.0, lng: -75.0 }, // Atlantic Ocean (northeast of Florida)
      // { lat: 31.0, lng: -78.0 }, // Moving southwest
      // { lat: 30.0, lng: -81.0 }, // Approaching Florida
      // { lat: 29.5, lng: -83.0 }, // Near Tallahassee
      // { lat: 29.0, lng: -85.0 }, // Crossing Florida
      // { lat: 28.5, lng: -87.0 }, // Entering Gulf
      // { lat: 28.0, lng: -89.0 }, // Gulf of Mexico
      // { lat: 27.5, lng: -91.0 }

            // Create the path line with gradient effect
            const path = new window.google.maps.Polyline({
              path: pathPoints,
              geodesic: true,
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 8, // Increased from 4 to 8 for wider path
              map: map,
            });

            // Add a wider, semi-transparent path overlay for better visibility
            const pathOverlay = new window.google.maps.Polyline({
              path: pathPoints,
              geodesic: true,
              strokeColor: "#FF0000",
              strokeOpacity: 0.3,
              strokeWeight: 20, // Wide semi-transparent overlay
              map: map,
            });

            // Function to interpolate between two points
            const interpolate = (start, end, fraction) => {
              return {
                lat: start.lat + (end.lat - start.lat) * fraction,
                lng: start.lng + (end.lng - start.lng) * fraction,
              };
            };

            // Function to move the hurricane
            let currentSegment = 0;
            let progress = 0;
            const moveHurricane = () => {
              if (currentSegment < pathPoints.length - 1) {
                const start = pathPoints[currentSegment];
                const end = pathPoints[currentSegment + 1];

                // Update position
                const newPosition = interpolate(start, end, progress);

                // Update hurricane eye with dynamic size based on position
                const eyeSize = 50000 + currentSegment * 10000; // Smaller initial size
                eye.setRadius(eyeSize);
                eye.setCenter(newPosition);

                // Update wind bands with gradient colors
                windBands.forEach((band, index) => {
                  band.setCenter(newPosition);
                  const opacity = 0.8 - index * 0.05; // Darker to lighter
                  const colorIntensity = Math.floor(255 - index * 20); // Dark red to light red
                  const color = `rgb(${colorIntensity}, 0, 0)`;
                  band.setOptions({
                    strokeColor: color,
                    strokeOpacity: opacity,
                    fillColor: color,
                    fillOpacity: opacity * 0.5,
                  });
                });

                // Update wind arrows with gradient colors
                arrows.forEach((arrow, index) => {
                  const angle =
                    ((index * 360) / arrows.length + progress * 720) *
                    (Math.PI / 180);
                  const arrowLength = 30000 + currentSegment * 5000; // Shorter arrows
                  const endLat =
                    newPosition.lat + (arrowLength * Math.sin(angle)) / 111000;
                  const endLng =
                    newPosition.lng +
                    (arrowLength * Math.cos(angle)) /
                      (111000 * Math.cos((newPosition.lat * Math.PI) / 180));

                  const colorIntensity = Math.floor(255 - index * 5);
                  const color = `rgb(${colorIntensity}, 0, 0)`;

                  arrow.setOptions({
                    strokeColor: color,
                    strokeOpacity: 0.8 - index * 0.02,
                  });

                  arrow.setPath([newPosition, { lat: endLat, lng: endLng }]);
                });

                progress += 0.01; // Faster movement

                if (progress >= 1) {
                  progress = 0;
                  currentSegment++;

                  if (currentSegment >= pathPoints.length - 1) {
                    currentSegment = 0;
                  }
                }
              }
            };

            // Create hurricane eye with initial properties
            const eye = new window.google.maps.Circle({
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#FF0000",
              fillOpacity: 0.35,
              map: map,
              center: pathPoints[0],
              radius: 50000, // Smaller initial radius
              clickable: true,
            });

            // Add rotating wind bands with gradient effect
            const windBands = [];
            const numBands = 10; // Reduced number of bands
            const bandWidth = 20000; // Smaller band width

            for (let i = 0; i < numBands; i++) {
              const opacity = 0.8 - i * 0.05;
              const colorIntensity = Math.floor(255 - i * 20);
              const color = `rgb(${colorIntensity}, 0, 0)`;
              const band = new window.google.maps.Circle({
                strokeColor: color,
                strokeOpacity: opacity,
                strokeWeight: 1,
                fillColor: color,
                fillOpacity: opacity * 0.5,
                map: map,
                center: pathPoints[0],
                radius: 50000 + i * bandWidth,
                clickable: false,
              });
              windBands.push(band);
            }

            // Add wind direction arrows with enhanced styling
            const arrows = [];
            const numArrows = 20; // Reduced number of arrows
            const arrowLength = 30000; // Shorter arrows

            for (let i = 0; i < numArrows; i++) {
              const angle = ((i * 360) / numArrows) * (Math.PI / 180);
              const startLat = pathPoints[0].lat;
              const startLng = pathPoints[0].lng;
              const endLat =
                startLat + (arrowLength * Math.sin(angle)) / 111000;
              const endLng =
                startLng +
                (arrowLength * Math.cos(angle)) /
                  (111000 * Math.cos((startLat * Math.PI) / 180));

              const colorIntensity = Math.floor(255 - i * 5);
              const color = `rgb(${colorIntensity}, 0, 0)`;

              const arrow = new window.google.maps.Polyline({
                path: [
                  { lat: startLat, lng: startLng },
                  { lat: endLat, lng: endLng },
                ],
                geodesic: true,
                strokeColor: color,
                strokeOpacity: 0.8 - i * 0.02,
                strokeWeight: 2,
                icons: [
                  {
                    icon: {
                      path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                      scale: 3,
                      fillColor: color,
                      fillOpacity: 0.8 - i * 0.02,
                      strokeWeight: 1,
                    },
                    offset: "100%",
                  },
                ],
                map: map,
              });
              arrows.push(arrow);
            }

            // Add impact markers along the path
            const impactMarkers = pathPoints.map((point, index) => {
              const marker = new window.google.maps.Marker({
                position: point,
                map: map,
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 6,
                  fillColor: "#FF0000",
                  fillOpacity: 0.8,
                  strokeColor: "#FFFFFF",
                  strokeWeight: 2,
                },
                title: `Impact Zone ${index + 1}`,
              });

              const impactInfoWindow = new window.google.maps.InfoWindow({
                content: `
                 <div style="padding: 10px; max-width: 250px;">
                   <h3 style="margin: 0 0 5px 0; color: #FF0000;">Impact Zone ${
                     index + 1
                   }</h3>
                   <p style="margin: 0 0 5px 0;">Wind Speed: ${
                     120 + index * 5
                   } mph</p>
                   <p style="margin: 0;">Expected Time: ${
                     24 - index * 3
                   } hours</p>
                 </div>
               `,
                position: point,
              });

              marker.addListener("click", () => {
                impactInfoWindow.open(map, marker);
              });

              return marker;
            });

            // Start the animation with faster interval
            setInterval(moveHurricane, 30); // Faster animation

            // Add info window for hurricane eye with dynamic content
            const eyeInfoWindow = new window.google.maps.InfoWindow({
              content: `
               <div style="padding: 10px; max-width: 250px;">
                 <h3 style="margin: 0 0 5px 0; color: #FF0000;">Hurricane Milton</h3>
                 <p style="margin: 0 0 5px 0;">Category 3 Hurricane</p>
                 <p style="margin: 0 0 5px 0;">Wind Speed: 120 mph</p>
                 <p style="margin: 0;">Moving towards Atlantic Ocean</p>
               </div>
             `,
              position: pathPoints[0],
            });

            eye.addListener("click", () => {
              eyeInfoWindow.open(map, eye);
            });
          } catch (error) {
            console.error("Error fetching hurricane data:", error);
          }
        };

        await drawHurricanePath();

        // 📍 Get user location
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

    if (!document.getElementById("google-maps-script")) {
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => {
      delete window.initMap;
    };
  }, []);

  return (
    <div className="relative w-[95%] h-[95%] pt-10 pl-10 rounded-full">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default GoogleMap;
