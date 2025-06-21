const busRoutes = {
    'BUS001-AB': {
      busName: 'City Express',
      direction: 'A to B',
      route: [
        { name: 'Central Station', distance: 0 },
        { name: 'Market Square', distance: 3 },
        { name: 'University', distance: 7 },
        { name: 'Hospital', distance: 12 },
        { name: 'Airport', distance: 18 },
        { name: 'Mall Complex', distance: 22 },
        { name: 'Tech Park', distance: 28 },
      ],
    },
    'BUS001-BA': {
      busName: 'City Express',
      direction: 'B to A',
      route: [
        { name: 'Tech Park', distance: 0 },
        { name: 'Mall Complex', distance: 6 },
        { name: 'Airport', distance: 10 },
        { name: 'Hospital', distance: 16 },
        { name: 'University', distance: 21 },
        { name: 'Market Square', distance: 25 },
        { name: 'Central Station', distance: 28 },
      ],
    },
    'BUS002-AB': {
      busName: 'Metro Link',
      direction: 'A to B',
      route: [
        { name: 'Railway Station', distance: 0 },
        { name: 'City Center', distance: 4 },
        { name: 'Shopping District', distance: 8 },
        { name: 'Business Park', distance: 15 },
        { name: 'Residential Area', distance: 20 },
      ],
    },
    'BUS002-BA': {
      busName: 'Metro Link',
      direction: 'B to A',
      route: [
        { name: 'Residential Area', distance: 0 },
        { name: 'Business Park', distance: 5 },
        { name: 'Shopping District', distance: 12 },
        { name: 'City Center', distance: 16 },
        { name: 'Railway Station', distance: 20 },
      ],
    },
  };
  
  export default busRoutes;