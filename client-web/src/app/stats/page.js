"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  Map,
  GlobeAlt,
  Camera,
  Calendar,
  Flag,
  Clock,
  ThumbsUp,
  Zap,
  Globe2Icon,
  Menu,
  X,
} from "lucide-react";
import { nearLocVisited } from "../helpers/loc";

export default function TravelTimeline() {
  const [activePlace, setActivePlace] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timelineRef = useRef(null);
  const [vis, setVis] = useState([]); // Initialize as empty array instead of null

  useEffect(() => {
    let vis = window.localStorage.getItem("visited");
    if (vis) {
      vis = JSON.parse(vis);
    } else {
      vis = nearLocVisited;
      window.localStorage.setItem("visited", JSON.stringify(vis));
    }
    setVis(vis); 
    console.log(vis);
    
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;

      const timelineRect = timelineRef.current.getBoundingClientRect();
      const timelineStart = timelineRect.top + window.pageYOffset;
      const timelineEnd = timelineStart + timelineRect.height;
      const currentPosition = window.pageYOffset + window.innerHeight;

      const progress = Math.min(
        100,
        Math.max(
          0,
          ((currentPosition - timelineStart) / timelineRect.height) * 100
        )
      );

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sortedPlaces = useMemo(
    () =>
      vis && Array.isArray(vis) ? [...vis].sort((a, b) => {
        if (a.visited === b.visited) return a.id - b.id;
        return a.visited ? -1 : 1;
      }) : [],
    [vis]
  );

  const visitedPlaces = sortedPlaces.filter((place) => place.visited);
  const totalPlaces = sortedPlaces.length;
  const visitedCount = visitedPlaces.length;
  const totalDays = visitedPlaces.reduce(
    (sum, place) => sum + parseInt(place.duration),
    0
  );
  const totalPhotos = visitedPlaces.reduce(
    (sum, place) => sum + place.photos,
    0
  );
  const avgRating =
    visitedCount > 0
      ? (
          visitedPlaces.reduce((sum, place) => sum + place.rating, 0) /
          visitedCount
        ).toFixed(1)
      : 0;
  const lastVisitedIndex =
    sortedPlaces.findIndex((place) => !place.visited) - 1;
  const timelineProgress = ((lastVisitedIndex + 1) / sortedPlaces.length) * 100;

  // Show loading state if data isn't ready yet
  if (!vis || !Array.isArray(vis)) {
    return (
      <div className="bg-gray-100 min-h-screen p-4 sm:p-8 font-sans flex items-center justify-center">
        <div className="text-xl sm:text-2xl text-indigo-800 font-semibold">Loading travel data...</div>
      </div>
    );
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header with responsive design */}
        <div className="flex justify-between items-center mb-6 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-indigo-800">
            AI Travel Guide
          </h1>
          
          {/* Mobile menu button */}
          <div className="block sm:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
          {/* Desktop button */}
          <button
            onClick={() => setShowStats(!showStats)}
            className="hidden sm:flex bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-all items-center gap-2"
          >
            {showStats ? <Map size={20} /> : <Zap size={20} />}
            {showStats ? "Show Timeline" : "Show Stats"}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="block sm:hidden mb-6 bg-white rounded-lg shadow-md p-4">
            <button
              onClick={() => {
                setShowStats(!showStats);
                setMobileMenuOpen(false);
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {showStats ? <Map size={18} /> : <Zap size={18} />}
              {showStats ? "Show Timeline" : "Show Stats"}
            </button>
          </div>
        )}

        {!showStats ? (
          <div className="relative mb-16 sm:mb-32" ref={timelineRef}>
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-300 z-0"></div>
            {/* Animated progress line */}
            <div
              className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-indigo-600 z-10 transition-all duration-300"
              style={{ height: `${scrollProgress}%` }}
            ></div>

            {sortedPlaces.map((place, index) => {
              const isVisited = place.visited;
              const isActive = activePlace === place.id;

              return (
                <div
                  key={place.id}
                  className="flex flex-col mb-16 sm:mb-32 relative z-10 items-center sm:items-start"
                >
                  <div
                    className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-lg
                    ${isVisited ? "bg-indigo-500" : "bg-gray-300"}`}
                  ></div>

                  {isVisited ? (
                    <div
                      className={`w-full sm:w-5/12 px-2 ${
                        index % 2 === 0 ? "sm:mr-12 sm:ml-auto" : "sm:ml-12"
                      }`}
                      onMouseEnter={() => setActivePlace(place.id)}
                      onMouseLeave={() => setActivePlace(null)}
                    >
                      <div
                        className={`bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 mt-4 sm:mt-0 ${
                          isActive ? "transform scale-105 shadow-2xl" : ""
                        }`}
                      >
                        <div className="h-36 sm:h-48 bg-indigo-200 flex items-center justify-center">
                          <img
                            src={`https://media.istockphoto.com/id/942152278/photo/gadisar-lake-at-jaisalmer-rajasthan-at-sunrise-with-ancient-temples-and-archaeological-ruins.jpg?s=612x612&w=0&k=20&c=HvhbHZ8HH_lAjAAI2pmqL4mUipyyAwy31qp5jjKQTO0=`}
                            alt={place.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                              {place.name}
                            </h2>
                            <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full self-start">
                              {place.date}
                            </span>
                          </div>

                          <div className="flex items-center text-gray-600 mb-4">
                            <Clock size={16} className="mr-1" />
                            <span>{place.duration}</span>
                          </div>

                          <h3 className="font-semibold text-gray-700 mb-2">
                            Highlights:
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {place.highlights.map((highlight, i) => (
                              <span
                                key={i}
                                className="bg-gray-100 text-gray-700 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full"
                              >
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`w-full sm:w-5/12 px-2 opacity-70 ${
                        index % 2 === 0 ? "sm:mr-12 sm:ml-auto" : "sm:ml-12"
                      }`}
                    >
                      <div className="bg-gray-100 rounded-xl p-4 sm:p-6 shadow mt-4 sm:mt-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-500">
                            {place.name}
                          </h2>
                          <span className="bg-gray-200 text-gray-500 text-sm font-medium px-3 py-1 rounded-full self-start">
                            Planned
                          </span>
                        </div>
                        <div className="text-gray-400">
                          <p className="mb-2">Duration: {place.duration}</p>
                          <h3 className="font-semibold mb-2">Highlights:</h3>
                          <div className="flex flex-wrap gap-2">
                            {place.highlights.map((highlight, i) => (
                              <span
                                key={i}
                                className="bg-gray-200 text-gray-500 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full"
                              >
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-indigo-800">
              Travel Progress
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div className="bg-indigo-50 rounded-xl p-4 sm:p-6 text-center">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="bg-indigo-100 p-3 sm:p-4 rounded-full">
                    <Flag className="text-indigo-600 w-6 sm:w-8 h-6 sm:h-8" />
                  </div>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-1 sm:mb-2">
                  {visitedCount}
                  <span className="text-xl sm:text-2xl text-gray-500">/{totalPlaces}</span>
                </h3>
                <p className="text-sm sm:text-base text-gray-600">Destinations Visited</p>
              </div>

              <div className="bg-indigo-50 rounded-xl p-4 sm:p-6 text-center">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="bg-indigo-100 p-3 sm:p-4 rounded-full">
                    <Calendar className="text-indigo-600 w-6 sm:w-8 h-6 sm:h-8" />
                  </div>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-1 sm:mb-2">
                  {totalDays}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">Days Exploring</p>
              </div>

              <div className="bg-indigo-50 rounded-xl p-4 sm:p-6 text-center">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="bg-indigo-100 p-3 sm:p-4 rounded-full">
                    <Camera className="text-indigo-600 w-6 sm:w-8 h-6 sm:h-8" />
                  </div>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-1 sm:mb-2">
                  {totalPhotos}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">Memories Captured</p>
              </div>
            </div>

            <div className="bg-indigo-50 p-4 sm:p-6 rounded-xl mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold text-indigo-800 mb-3 sm:mb-4">
                Exploration Progress
              </h3>
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow">
                <div className="relative h-3 sm:h-4 bg-gray-200 rounded-full">
                  <div
                    className="absolute h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${(visitedCount / totalPlaces) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600">
                  <span>{visitedCount} completed</span>
                  <span>{totalPlaces - visitedCount} remaining</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-8 sm:grid-cols-2">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
                <div className="flex items-center mb-4 sm:mb-6">
                  <ThumbsUp className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3" />
                  <h3 className="text-lg sm:text-xl font-semibold">
                    Average Experience Rating
                  </h3>
                </div>
                <div className="text-center">
                  <span className="text-4xl sm:text-5xl font-bold">{avgRating}</span>
                  <span className="text-lg sm:text-xl font-semibold"> / 5.0</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
                <div className="flex items-center mb-4 sm:mb-6">
                  <Globe2Icon className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3" />
                  <h3 className="text-lg sm:text-xl font-semibold">Next Destination</h3>
                </div>
                <div className="text-center">
                  <span className="text-2xl sm:text-3xl font-bold">
                    {sortedPlaces.find((place) => !place.visited)?.name ||
                      "All destinations visited!"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}