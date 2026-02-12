"use client";
import React, { useEffect, useState } from 'react';

function BestAccuracyLocation() {
  const [bestPos, setBestPos] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [log, setLog] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let bestAccuracy = Infinity;
    let bestLocation = null;
    let updateCount = 0;

    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          updateCount++;
          setCount(updateCount);
          setLog(logs => [...logs, `#${updateCount} - Lat: ${latitude}, Lon: ${longitude}, Acc: ${accuracy}m`]);

          if (accuracy < bestAccuracy) {
            bestAccuracy = accuracy;
            bestLocation = { latitude, longitude };
            setBestPos(bestLocation);
            setAccuracy(bestAccuracy);
          }

          // Stop after 10 updates (or adjust based on desired stability)
          if (updateCount >= 10) {
            navigator.geolocation.clearWatch(watchId);
          }
        },
        (error) => {
          console.error("Geolocation error:", error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Best Accuracy Location</h2>
      <p>Updates Received: {count}</p>
      {bestPos && (
        <p>
          Best Location: ({bestPos.latitude}, {bestPos.longitude})<br />
          Accuracy: {accuracy} meters
        </p>
      )}
      <pre>{log.join('\n')}</pre>
    </div>
  );
}

export default BestAccuracyLocation;
