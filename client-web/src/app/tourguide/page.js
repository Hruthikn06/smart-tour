"use client";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Avatar from "../../components/Avatar";
export default function Home() {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError(`Error getting location: ${error.message}`);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Handle camera access
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
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
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Location & Camera App</title>
        <meta
          name="description"
          content="App that shows location and camera feed"
        />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Location & Camera App
        </h1>

        {/* Location Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Location</h2>

          {locationError ? (
            <div className="text-red-500">{locationError}</div>
          ) : !location ? (
            <div className="text-gray-500">Getting your location...</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Latitude:</p>
                <p className="font-medium">{location.latitude.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-gray-600">Longitude:</p>
                <p className="font-medium">{location.longitude.toFixed(6)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Camera Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Camera Feed</h2>

          {!cameraPermission && !cameraError && (
            <button
              onClick={startCamera}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md mb-4 transition-colors"
            >
              Start Camera
            </button>
          )}

          {cameraError && (
            <div className="text-red-500 mb-4">{cameraError}</div>
          )}

          <div className="relative  rounded-lg overflow-hidden w-full max-w-2xl mx-auto aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            <div className="absolute top-20 left-50 w-full h-full flex items-center justify-center text-2xl font-bold ">
              <Avatar/>
            </div>
          </div>
         
          {cameraPermission && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  if (videoRef.current && videoRef.current.srcObject) {
                    const tracks = videoRef.current.srcObject.getTracks();
                    tracks.forEach((track) => track.stop());
                    videoRef.current.srcObject = null;
                    setCameraPermission(false);
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Stop Camera
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
