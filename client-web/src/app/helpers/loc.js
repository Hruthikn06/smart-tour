const nearLoc = {
  // "stockTicker": {
  //   lat: 13.0045213,
  //   long: 77.544636,
  //   acc: 13.65
  // },
  "myHouse": {
    lat: 12.31614107645473,
    long: 76.59035304899268,
    acc: 5.1
  },
};

// 12.31614107645473, 76.59035304899268), Accuracy: ±5.1

// Your location: (12.316746170821409, 76.59060897348277), Accuracy: ±96.0m

const nearLocVisited = [
  // {
  //   id: 1,
  //   name: "Stock Ticker",
  //   spotId: "stockTicker",
  //   date: "Upcoming",
  //   duration: "1 days",
  //   highlights: ["Stock Market", "Finances", "Real time update"],
  //   rating: 4.8,
  //   photos: 127,
  //   visited: false,
  // },
   {
    id: 1,
    name: "My House",
    spotId: "myHouse",
    date: "Upcoming",
    duration: "1 days",
    highlights: ["Stock Market", "Finances", "Real time update"],
    rating: 4.8,
    photos: 127,
    visited: false,
  },
];

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

export { getDistance, nearLoc, nearLocVisited }