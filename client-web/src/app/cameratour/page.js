"use client";
import { useState, useEffect, useRef } from "react";
import Avatar from "../../components/Avatar";
import Dictaphone from "../../components/voice";
import { getDistance, nearLoc } from "../helpers/loc";
import Confetti from "react-confetti";
import { motion } from "framer-motion";


function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
}

export default function Home() {
  const [locs, setLocs] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [closest, setClosest] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const [visPlace, setVisPlace] = useState([]);
  const [text, setText] = useState("");

  const [showEffect, setShowEffect] = useState(false);
  const { width, height } = useWindowSize(); // Get screen size

  useEffect(() => {
    if (closest && cameraPermission) {
      setShowEffect(true); 
  
      const hideTimeout = setTimeout(() => setShowEffect(false), 6000); 
  
      return () => {
        clearTimeout(hideTimeout);
      };
    }
  }, [closest,cameraPermission]);
  

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          console.log(`Your location: (${latitude}, ${longitude})`);

          let textAll = "";
          let bestMatch = null;
          let bestMatchDistance = Infinity;
          const locs = {
            lat: latitude,
            long: longitude,
            acc: accuracy,
            nearLoc: [],
          };

          for (const [name, loc] of Object.entries(nearLoc)) {
            const dist = getDistance(latitude, longitude, loc.lat, loc.long);
            const combinedAcc = accuracy + loc.acc;
            locs.nearLoc.push({ name, ...loc, dist });
            const line = `${name}: ${dist.toFixed(2)} meters away (±${
              loc.acc
            }m)\n`;
            // textAll += line;
            console.log(line);
            if (dist <= combinedAcc && dist < bestMatchDistance) {
              bestMatch = name;
              bestMatchDistance = dist;
            }
          }
          setLocs(locs);
          setClosest(bestMatch);
        },
        (error) => {
          console.error("Error getting location:", error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Important: This ensures the video plays when loaded
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
        setCameraPermission(true);
      }
    } catch (err) {
      setCameraError(`Error accessing camera: ${err.message}`);
      console.error("Camera error:", err);
    }
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full">
      {/* Full screen wrapper */}
      <div className="relative w-full h-full">
        {/* Camera Section */}
        {!cameraPermission && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-black to-gray-900">
            <div className="relative group ">
              {/* Animated glow effect background */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-500 to-teal-400 rounded-full opacity-70 blur-xl group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

              {/* Main button */}
              <button
                onClick={startCamera}
                className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-700 to-purple-800 text-white font-bold py-5 px-10 rounded-full text-2xl shadow-xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 z-10 hover:cursor-pointer"
              >
                {/* Inner content */}
                <span className="relative z-10 flex items-center justify-center gap-3 font-extrabold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Start the tour
                </span>

                {/* Shimmer effect on hover */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
              </button>

              {/* Pulsing rings */}
              <div className="absolute -inset-4 border border-blue-400/30 rounded-full animate-ping opacity-20"></div>
              <div className="absolute -inset-8 border border-purple-400/20 rounded-full animate-ping opacity-10 animation-delay-700"></div>
            </div>
          </div>
        )}

        {/* Confetti Animation */}
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 left-16 top-1/2 z-50">
        {showEffect && (
          <Confetti
            width={width}
            height={height}
            numberOfPieces={200}
            recycle={false}
          />
        )}

        {/* Gamified Effect */}
        {showEffect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute flex flex-col w-[300px] items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-xl shadow-2xl"
          >
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-white text-4xl font-bold mb-2"
            >
              🎉 Hurray! New Place Found 🎉
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white text-lg"
            >
              Exploring new locations made fun! 🚀
            </motion.p>
          </motion.div>
        )}
        </div>

        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
            <div className="text-red-500 bg-white p-4 rounded-lg max-w-xs text-center">
              {cameraError}
            </div>
          </div>
        )}

        {/* Video element takes full screen */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Avatar positioned in the middle */}
        <div className="absolute h-[50%] w-[50%]  flex items-center top-85 bottom-10 right-0 justify-center pointer-events-none ">
          <div className="w-[100%] h-[100%]">
            <Avatar text={text} closest={closest} locs={locs}
              fetchLoading={fetchLoading} setFetchLoading={setFetchLoading}
              cameraPermission={cameraPermission} setText={setText}
            />
          </div>
        </div>

        {/* Location display in a corner */}
        {/* {location && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs p-2 rounded-md z-10">
            <div>Lat: {location.latitude.toFixed(6)}</div>
            <div>Long: {location.longitude.toFixed(6)}</div>
          </div>
        )} */}

        {/* Video call controls */}

        {cameraPermission && (
          <div className="absolute top-3 left-3  flex justify-center space-x-4 z-10">
            <button
              onClick={() => {
                if (videoRef.current && videoRef.current.srcObject) {
                  const tracks = videoRef.current.srcObject.getTracks();
                  tracks.forEach((track) => track.stop());
                  videoRef.current.srcObject = null;
                  setCameraPermission(false);
                }
              }}
              className="bg-red-500/30 text-white font-medium w-14 h-14 rounded-full flex items-center justify-center transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {cameraPermission && (
          <div className="absolute top-3 right-3  flex justify-center space-x-4 z-10">
            <a href="/stats" target="_blank">
              <button className="bg-blue-500/50 text-white font-medium  h-14 rounded-2xl flex items-center justify-center transition-colors px-5">
                Stats
              </button>
            </a>
          </div>
        )}

        {cameraPermission && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4 z-10">
            <div>
              <Dictaphone setText={setText} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
