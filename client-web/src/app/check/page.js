"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

// Custom useWindowSize Hook
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


export default function LiveCamera() {
  const videoRef = useRef(null);
  const [showEffect, setShowEffect] = useState(false);
  const { width, height } = useWindowSize(); // Get screen size
 

  useEffect(() => {
    const timeout = setTimeout(() => setShowEffect(true), 3000); // Show after 3s
    const hideTimeout = setTimeout(() => setShowEffect(false), 9000); // Hide after 6s
  
    return () => {
      clearTimeout(timeout);
      clearTimeout(hideTimeout);
    };
  }, []);
  


  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    }
    startCamera();

    const timeout = setTimeout(() => setShowEffect(true), 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative flex items-center justify-center h-screen bg-black">
      {/* Live Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover absolute inset-0 opacity-90"
      />

      {/* Confetti Animation */}
      {showEffect && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />}

      {/* Gamified Effect */}
      {showEffect && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-xl shadow-2xl"
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
  );
}
