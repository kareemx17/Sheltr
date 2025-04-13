"use client";


import {pathPoints} from "./PathPoints";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Link from "next/link";


const Info = () => {
 const [userLocation, setUserLocation] = useState(null);
 const [riskLevel, setRiskLevel] = useState(null);
 const [hurricaneInfo, setHurricaneInfo] = useState(null);
 const [loading, setLoading] = useState(true);
 const [activeTab, setActiveTab] = useState("overview");


 useEffect(() => {
   // Get user location
   if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(
       (position) => {
         setUserLocation({
           lat: position.coords.latitude,
           lng: position.coords.longitude,
         });
        
         // Determine risk level based on the first latitude in pathPoints
         if (pathPoints && pathPoints.length > 0) {
           const firstLat = pathPoints[0].lat;
          
           if (firstLat >= 24.9 && firstLat <= 25.1) {
             setRiskLevel("high");
           } else if (firstLat >= 31.9 && firstLat <= 32.1) {
             setRiskLevel("medium");
           } else if (firstLat >= 23.9 && firstLat <= 24.1) {
             setRiskLevel("low");
           } else {
             // Default risk level from path analysis
             analyzeHurricanePath();
           }
         } else {
           // No path points, fall back to analysis
           analyzeHurricanePath();
         }
       },
       (error) => {
         console.error("Error getting location:", error);
         // Fall back to path analysis
         analyzeHurricanePath();
       }
     );
   } else {
     // Fall back to path analysis
     analyzeHurricanePath();
   }


   // Analyze hurricane path and get risk assessment
   const analyzeHurricanePath = async () => {
     try {
       // First check pathPoints directly for risk level
       if (pathPoints && pathPoints.length > 0) {
         const firstLat = pathPoints[0].lat;
        
         if (firstLat >= 24.9 && firstLat <= 25.1) {
           setRiskLevel("high");
           setLoading(false);
           return;
         } else if (firstLat >= 31.9 && firstLat <= 32.1) {
           setRiskLevel("medium");
           setLoading(false);
           return;
         } else if (firstLat >= 23.9 && firstLat <= 24.1) {
           setRiskLevel("low");
           setLoading(false);
           return;
         }
       }
      
       // If we couldn't determine from the latitude directly, use AI analysis
       const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
       const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


       const prompt = `Analyze this hurricane path data and provide a risk assessment for Tampa, FL:
       Path Points: ${JSON.stringify(pathPoints)}
      
       Please provide:
       1. Risk level (High/Medium/Low)
       2. Detailed analysis of the hurricane's potential impact
       3. Recommended items to bring
       4. Safety precautions to take
       5. Estimated time of impact`;


       const result = await model.generateContent(prompt);
       const response = await result.response;
       const text = response.text();
      
       // Parse the response and update state
       // Only set risk level if not already set by direct lat check
       setRiskLevel(text.match(/Risk level: (High|Medium|Low)/i)?.[1]?.toLowerCase() || "unknown");
       setHurricaneInfo(text);
       setLoading(false);
     } catch (error) {
       console.error("Error analyzing hurricane path:", error);
       setLoading(false);
     }
   };


   if (pathPoints && !riskLevel) {
     analyzeHurricanePath();
   } else {
     setLoading(false);
   }
 }, [pathPoints]);


 const getRiskColor = (level) => {
   switch (level?.toLowerCase()) {
     case "high":
       return "bg-red-500";
     case "medium":
       return "bg-yellow-500";
     case "low":
       return "bg-green-500";
     default:
       return "bg-gray-500";
   }
 };


 const getRiskDescription = (level) => {
   switch (level?.toLowerCase()) {
     case "high":
       return "This is a severe hurricane situation coming from the Atlantic Ocean. It will directly impact your location with potentially catastrophic effects. Mandatory evacuation in effect.";
     case "medium":
       return "This is a moderate hurricane situation coming from the Atlantic Ocean. It will moderately impact your location. Highly recommended to evacuate as a precautionary measure.";
     case "low":
       return "This is a low-risk hurricane situation coming from the Gulf of Mexico. While the impact is expected to be minimal, it's advised to follow safety protocols and be prepared.";
     default:
       return "Risk level unknown. Please stay tuned to local authorities for updates.";
   }
 };


 const getRiskBasedTasks = (level) => {
   switch (level?.toLowerCase()) {
     case "high":
       return [
         "Evacuate immediately to a safe location",
         "Secure all windows and doors",
         "Turn off utilities",
         "Gather emergency supplies",
         "Stay informed through official channels"
       ];
     case "medium":
       return [
         "Prepare emergency kit",
         "Secure outdoor items",
         "Review evacuation routes",
         "Charge all devices",
         "Monitor weather updates"
       ];
     case "low":
       return [
         "Check emergency supplies",
         "Review family emergency plan",
         "Stay updated on weather",
         "Prepare for possible power outages",
         "Keep important documents ready"
       ];
     default:
       return ["Stay alert and monitor updates"];
   }
 };


 const getPreHurricanePreparation = () => [
   {
     title: "Monitoring and Information",
     items: [
       "Stay Updated on Weather Alerts: Regularly check local weather forecasts, official emergency management agency updates, and local authorities' announcements.",
       "Know Your Evacuation Zone: Determine your zone and know your evacuation routes ahead of time.",
       "Family/Household Communication Plan: Establish how you'll contact each other and meet up if separated."
     ]
   },
   {
     title: "Emergency Kit Checklist",
     items: [
       "Water: At least one gallon of water per person per day for at least 72 hours.",
       "Food: Non-perishable foods (canned goods, energy bars), manual can opener, utensils.",
       "Medical and Hygiene Supplies: First-aid kit, prescription medications, personal hygiene items.",
       "Important Documents: IDs, insurance policies, bank information in a waterproof container.",
       "Flashlights and Batteries: Extra batteries for all essential devices.",
       "Communication Devices: Charged cell phones, portable battery packs, battery- or hand-crank-powered radio.",
       "Tools and Safety Gear: Multi-tool, duct tape, whistle (to signal for help), work gloves.",
       "Cash: Small bills and coins."
     ]
   },
   {
     title: "Home Preparation",
     items: [
       "Secure the Exterior: Board up windows or install storm shutters. Trim trees near the house.",
       "Check the Roof and Gutters: Ensure they're in good condition to reduce damage.",
       "Reinforce Doors and Windows: Use proper locking mechanisms or brace doors.",
       "Prepare for Power Outages: Obtain a generator or alternative power sources."
     ]
   },
   {
     title: "Evacuation Plan",
     items: [
       "Plan Multiple Routes: Know alternate back roads in case of closures or traffic.",
       "Transportation: Have a full tank of gas. Arrange transportation in advance if needed.",
       "Local Shelters: Know the location of emergency shelters, especially in flood-prone areas.",
       "Pets: Check which shelters allow pets; have pet supplies and records ready."
     ]
   }
 ];


 const getDuringHurricaneInstructions = () => [
   {
     title: "Shelter-in-Place",
     items: [
       "Choose a Safe Room: An interior room without windows on a lower floor.",
       "Stay Away From Windows: Strong winds can break glass.",
       "Monitor Updates: Use battery-powered radio or devices with back-up power.",
       "Avoid Using Water: Contamination is possible during severe storms."
     ]
   },
   {
     title: "Evacuation Procedures",
     items: [
       "Leave Immediately: Don't wait until conditions worsen.",
       "Secure Your Home: Lock doors, turn off utilities if instructed.",
       "Follow Designated Routes: Use official evacuation routes.",
       "Have Essential Items: Take your emergency kit and important documents."
     ]
   },
   {
     title: "Communication",
     items: [
       "Conserve Phone Battery: Turn off unnecessary apps.",
       "Use Text Messages: Texts are more likely to get through during network congestion.",
       "Check In with Contacts: Let family and friends know your location when safe.",
       "Follow Official Instructions: Listen to emergency broadcasts."
     ]
   }
 ];


 const getEssentialItems = () => [
   "Water (1 gallon per person per day)",
   "Non-perishable food",
   "First aid kit",
   "Flashlight and batteries",
   "Important documents",
   "Medications",
   "Personal hygiene items",
   "Phone chargers",
   "Cash",
   "Blankets and clothing"
 ];


 const TabButton = ({ name, label, active }) => (
   <button
     onClick={() => setActiveTab(name)}
     className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
       active
         ? "bg-white/90 text-blue-700 border-b-2 border-blue-700"
         : "bg-white/50 text-gray-600 hover:bg-white/70"
     }`}
   >
     {label}
   </button>
 );


 const renderTabContent = () => {
   switch (activeTab) {
     case "overview":
       return (
         <>
           {/* Risk Assessment */}
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200"
           >
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-semibold text-gray-800">Risk Assessment</h2>
               <span className={`px-4 py-2 rounded-full text-white font-medium ${getRiskColor(riskLevel)}`}>
                 {riskLevel?.toUpperCase() || "Analyzing..."}
               </span>
             </div>
             <p className="text-gray-700 leading-relaxed">{getRiskDescription(riskLevel)}</p>
           </motion.div>


           {/* Action Items */}
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200"
           >
             <h2 className="text-xl font-semibold mb-4 text-gray-800">Immediate Action Items</h2>
             <div className="space-y-2">
               {getRiskBasedTasks(riskLevel).map((task, index) => (
                 <div key={index} className="flex items-center space-x-3">
                   <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                   <span className="text-gray-600">{task}</span>
                 </div>
               ))}
             </div>
           </motion.div>


           {/* Find Shelters Button */}
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="text-center mt-6 hover:scale-105 transition"
           >
             <Link
               className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
               href="/shelters"
             >
               Find Nearest Shelters
             </Link>
           </motion.div>
         </>
       );
    
     case "preparation":
       return (
         <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-6"
         >
           {getPreHurricanePreparation().map((section, sectionIndex) => (
             <div
               key={sectionIndex}
               className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200"
             >
               <h2 className="text-xl font-semibold mb-4 text-gray-800">{section.title}</h2>
               <div className="space-y-2">
                 {section.items.map((item, itemIndex) => (
                   <div key={itemIndex} className="flex items-start space-x-3 py-1">
                     <div className="min-w-5 mt-1">
                       <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                     </div>
                     <span className="text-gray-700">{item}</span>
                   </div>
                 ))}
               </div>
             </div>
           ))}
         </motion.div>
       );
    
     case "during":
       return (
         <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-6"
         >
           {getDuringHurricaneInstructions().map((section, sectionIndex) => (
             <div
               key={sectionIndex}
               className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200"
             >
               <h2 className="text-xl font-semibold mb-4 text-gray-800">{section.title}</h2>
               <div className="space-y-2">
                 {section.items.map((item, itemIndex) => (
                   <div key={itemIndex} className="flex items-start space-x-3 py-1">
                     <div className="min-w-5 mt-1">
                       <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                     </div>
                     <span className="text-gray-700">{item}</span>
                   </div>
                 ))}
               </div>
             </div>
           ))}
         </motion.div>
       );
    
     case "checklist":
       return (
         <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200"
         >
           <h2 className="text-xl font-semibold mb-4 text-gray-800">Essential Items Checklist</h2>
           <div className="space-y-3">
             {getEssentialItems().map((item, index) => (
               <div key={index} className="flex items-center space-x-3 p-2 hover:bg-blue-50 rounded-md transition-colors">
                 <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                 <span className="text-gray-700">{item}</span>
               </div>
             ))}
           </div>
         </motion.div>
       );
    
     default:
       return <div>Select a tab to view information</div>;
   }
 };


 return (
   <div className="h-full w-full overflow-y-auto bg-[#D8E3EB]">
     <AnimatePresence>
       {loading ? (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="flex items-center justify-center h-full"
         >
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
         </motion.div>
       ) : (
         <div className="p-4 space-y-4">
           {/* Header with Location */}
           <motion.div
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-200"
           >
             <div className="flex justify-between items-center">
               <div>
                 <h1 className="text-2xl font-bold text-gray-800">Hurricane Preparation</h1>
                 <div className="flex items-center mt-1 text-gray-600">
                   <svg className="w-5 h-5 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                   </svg>
                   <span>Tampa, FL</span>
                 </div>
               </div>
               <span className={`px-4 py-2 rounded-full text-white font-bold ${getRiskColor(riskLevel)}`}>
                 {riskLevel?.toUpperCase() || "UNKNOWN"} RISK
               </span>
             </div>
           </motion.div>
          
           {/* Navigation Tabs */}
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="flex space-x-1 bg-white/50 p-1 rounded-lg shadow-md"
           >
             <TabButton name="overview" label="Overview" active={activeTab === "overview"} />
             <TabButton name="preparation" label="Preparation" active={activeTab === "preparation"} />
             <TabButton name="during" label="During Hurricane" active={activeTab === "during"} />
             <TabButton name="checklist" label="Checklist" active={activeTab === "checklist"} />
           </motion.div>
          
           {/* Tab Content */}
           <div className="space-y-6">
             {renderTabContent()}
           </div>
         </div>
       )}
     </AnimatePresence>
   </div>
 );
};


export default Info;

