"use client";
import React, { useEffect, useState } from 'react';

const nearLoc = {
	"stockTicker": {
		lat: 13.0045213,
		long: 77.544636,
		acc: 13.65
	},
	"vendingMachine": {
		lat: 13.0046345,
		long: 77.5444103,
		acc: 12.67
	},
	"mbaBridge": {
		lat: 13.0048402,
		long: 77.5442367,
		acc: 2.5
	},
	"mbaAILab": {
		lat: 13.0047431,
		long: 77.5445032,
		acc: 4.9
	},
	"mbaDigitalClassroom": {
		lat: 13.0052077,
		long: 77.5445211,
		acc: 3.18
	},
};

function getDistance(lat1, lon1, lat2, lon2) {
	const toRad = angle => (angle * Math.PI) / 180;
	const R = 6371000; // in meters
	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);

	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

function Home() {
	const [text1, setText1] = useState("");
	const [text2, setText2] = useState("");
	const [closest, setClosest] = useState("");
	const [updateNo, setUpdateNo] = useState(0);

	useEffect(() => {
		if (navigator.geolocation) {
			const watchId = navigator.geolocation.watchPosition(
				(position) => {
					const { latitude, longitude, accuracy } = position.coords;
					setUpdateNo(u => u + 1);

					console.log(`Your location: (${latitude}, ${longitude})`);
					setText1(`Your location: (${latitude}, ${longitude}), Accuracy: ±${accuracy.toFixed(1)}m`);

					let textAll = "";
					let bestMatch = null;
					let bestMatchDistance = Infinity;

					for (const [name, loc] of Object.entries(nearLoc)) {
						const dist = getDistance(latitude, longitude, loc.lat, loc.long);
						const combinedAcc = accuracy + loc.acc;

						const line = `${name}: ${dist.toFixed(2)} meters away (±${loc.acc}m)\n`;
						textAll += line;

						// Best match = nearest within combined accuracy
						if (dist <= combinedAcc && dist < bestMatchDistance) {
							bestMatch = name;
							bestMatchDistance = dist;
						}
					}

					setClosest(bestMatch ? `Likely at: ${bestMatch}` : "No location matched accurately");
					setText2(textAll);
				},
				(error) => {
					console.error("Error getting location:", error.message);
				},
				{
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 0
				}
			);

			return () => navigator.geolocation.clearWatch(watchId);
		}
	}, []);

	return (
		<div style={{ padding: '1rem' }}>
			<h2>Live Location</h2>
			<p>Update No: {updateNo}</p>
			<p>{text1}</p>
			<pre>{text2}</pre>
			<h3 style={{ color: 'green' }}>{closest}</h3>
		</div>
	);
}

export default Home;
