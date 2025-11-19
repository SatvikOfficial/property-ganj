export type LocalityInsight = {
  averagePricePerSqft?: number;
  ranking?: number;
  safetyRating?: number;
  nearbyAmenities?: string[];
  pros?: string[];
  cons?: string[];
  priceTrend?: { year: number; price: number }[];
  trendConfidence?: 'High' | 'Medium' | 'Low' | string;
};

export type PopularLucknowLocality = {
  label: string;
  locality: string;
  area?: string;
  sector?: string;
  block?: string;
  road?: string;
  neighbourhood?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  aliases?: string[];
  insights?: LocalityInsight;
};

export const POPULAR_LUCKNOW_LOCALITIES: PopularLucknowLocality[] = [
  {
    label: 'Gomti Nagar',
    locality: 'Gomti Nagar',
    area: 'Gomti Nagar',
    pincode: '226010',
    latitude: 26.8537,
    longitude: 81.001,
    aliases: ['Gomti Nagar Phase 1', 'Gomtinagar'],
    insights: {
      averagePricePerSqft: 7800,
      ranking: 1,
      safetyRating: 4.6,
      nearbyAmenities: ['Phoenix Palassio', 'International schools', 'Medanta Hospital'],
      pros: ['Planned township with landscaped greens', 'Premium cafes & offices', 'Upcoming metro corridor'],
      cons: ['Peak hour traffic near Patrakarpuram', 'Premium ticket sizes'],
      priceTrend: [
        { year: 2022, price: 7200 },
        { year: 2023, price: 7600 },
        { year: 2024, price: 7900 },
        { year: 2025, price: 8200 },
      ],
      trendConfidence: 'High',
    },
  },
  {
    label: 'Gomti Nagar Extension',
    locality: 'Gomti Nagar Extension',
    area: 'Gomti Nagar',
    pincode: '226010',
    latitude: 26.8154,
    longitude: 80.9956,
    aliases: ['Gomti Extension'],
    insights: {
      averagePricePerSqft: 6600,
      ranking: 2,
      safetyRating: 4.4,
      nearbyAmenities: ['Ekana Stadium', 'IT parks', 'Upcoming metro'],
      pros: ['Newer gated townships', 'Wider roads with better drainage', 'Close to Shaheed Path expressway'],
      cons: ['Limited retail high-streets today', 'Construction dust in pockets'],
      priceTrend: [
        { year: 2022, price: 5900 },
        { year: 2023, price: 6200 },
        { year: 2024, price: 6550 },
        { year: 2025, price: 6800 },
      ],
      trendConfidence: 'High',
    },
  },
  {
    label: 'Vrindavan Yojna Sector 2',
    locality: 'Sector 2, Vrindavan Yojna',
    area: 'Vrindavan Yojna',
    sector: 'Sector 2',
    pincode: '226029',
    latitude: 26.7392,
    longitude: 81.0047,
    aliases: ['Vrindavan Yojana', 'Vrinda'],
    insights: {
      averagePricePerSqft: 5200,
      ranking: 5,
      safetyRating: 4,
      nearbyAmenities: ['PGI Lucknow', 'Proposed metro line', 'International schools'],
      pros: ['Affordable plotted developments', 'Good rental demand from PGI staff', 'Green belt around sectors'],
      cons: ['Limited nightlife/retail', 'Road work ongoing in pockets'],
      priceTrend: [
        { year: 2022, price: 4700 },
        { year: 2023, price: 4950 },
        { year: 2024, price: 5150 },
        { year: 2025, price: 5400 },
      ],
      trendConfidence: 'Medium',
    },
  },
  {
    label: 'Shaheed Path',
    locality: 'Shaheed Path',
    road: 'Amar Shaheed Path',
    area: 'Gomti Nagar Extension',
    pincode: '226030',
    latitude: 26.7898,
    longitude: 81.0193,
    aliases: ['Amar Shaheed Path'],
    insights: {
      averagePricePerSqft: 6100,
      ranking: 4,
      safetyRating: 4.2,
      nearbyAmenities: ['Ekana Stadium', 'Phoenix Palassio', 'IT City'],
      pros: ['Expressway connectivity', 'Mix of villas & plotted townships', 'Close to Sushant Golf City'],
      cons: ['Sound pollution along expressway', 'Sparse public transport late night'],
      priceTrend: [
        { year: 2022, price: 5600 },
        { year: 2023, price: 5850 },
        { year: 2024, price: 6050 },
        { year: 2025, price: 6400 },
      ],
      trendConfidence: 'High',
    },
  },
  {
    label: 'Indira Nagar Sector 11',
    locality: 'Sector 11, Indira Nagar',
    area: 'Indira Nagar',
    sector: 'Sector 11',
    pincode: '226016',
    latitude: 26.8754,
    longitude: 80.9961,
    aliases: ['Indiranagar'],
    insights: {
      averagePricePerSqft: 6400,
      ranking: 3,
      safetyRating: 4.3,
      nearbyAmenities: ['Munshipulia Metro', 'BBD University', 'Kaleva Chauraha markets'],
      pros: ['Established social infra', 'Great metro & bus access', 'Balanced ticket sizes'],
      cons: ['Old drainage network in inner lanes', 'Street parking congestion'],
      priceTrend: [
        { year: 2022, price: 5900 },
        { year: 2023, price: 6100 },
        { year: 2024, price: 6350 },
        { year: 2025, price: 6550 },
      ],
      trendConfidence: 'High',
    },
  },
  {
    label: 'Aliganj Kapoorthala',
    locality: 'Kapoorthala, Aliganj',
    area: 'Aliganj',
    pincode: '226024',
    latitude: 26.8805,
    longitude: 80.9463,
    aliases: ['Kapoorthala'],
    insights: {
      averagePricePerSqft: 6000,
      ranking: 6,
      safetyRating: 4.1,
      nearbyAmenities: ['Trans Gomti offices', 'City Montessori School', 'Kapoorthala market'],
      pros: ['Central location', 'High rental absorption', 'Leafy internal roads'],
      cons: ['Older building stock', 'Parking crunch near market'],
      priceTrend: [
        { year: 2022, price: 5600 },
        { year: 2023, price: 5750 },
        { year: 2024, price: 5950 },
        { year: 2025, price: 6150 },
      ],
      trendConfidence: 'Medium',
    },
  },
  {
    label: 'Ashiyana Phase 1',
    locality: 'Sector K, Ashiyana',
    area: 'Ashiyana',
    sector: 'Sector K',
    pincode: '226012',
    latitude: 26.7938,
    longitude: 80.9317,
    aliases: ['Ashiana', 'Ashiyana', 'Aashiana'],
    insights: {
      averagePricePerSqft: 4800,
      ranking: 8,
      safetyRating: 3.9,
      nearbyAmenities: ['Airport 15 mins', 'NCRTC terminal (planned)', 'Local markets'],
      pros: ['Budget friendly apartments', 'Close to schools & banks', 'Steady rental yield'],
      cons: ['Narrow internal roads', 'Older civic infrastructure'],
      priceTrend: [
        { year: 2022, price: 4400 },
        { year: 2023, price: 4550 },
        { year: 2024, price: 4700 },
        { year: 2025, price: 4900 },
      ],
      trendConfidence: 'Medium',
    },
  },
  {
    label: 'Ashiyana Colony Sector L',
    locality: 'Sector L, Ashiyana Colony',
    area: 'Ashiyana',
    sector: 'Sector L',
    pincode: '226012',
    latitude: 26.7844,
    longitude: 80.9256,
    aliases: ['Ashiyana L'],
    insights: {
      averagePricePerSqft: 4650,
      ranking: 9,
      safetyRating: 3.8,
      nearbyAmenities: ['Local markets', 'Schools', 'Airport road'],
      pros: ['Calmer residential pockets', 'Parks & playgrounds', 'Value homes'],
      cons: ['Limited premium retail', 'Traffic bottlenecks atEntry points'],
      priceTrend: [
        { year: 2022, price: 4200 },
        { year: 2023, price: 4400 },
        { year: 2024, price: 4600 },
        { year: 2025, price: 4750 },
      ],
      trendConfidence: 'Medium',
    },
  },
  {
    label: 'Alambagh',
    locality: 'Alambagh',
    area: 'Alambagh',
    pincode: '226005',
    latitude: 26.7947,
    longitude: 80.9145,
    insights: {
      averagePricePerSqft: 5200,
      ranking: 7,
      safetyRating: 3.9,
      nearbyAmenities: ['Charbagh Station', 'Metro interchange', 'Wholesale markets'],
      pros: ['Transport hub', 'High footfall retail', 'Affordable rentals'],
      cons: ['Congested roads', 'Noise & air pollution'],
      priceTrend: [
        { year: 2022, price: 4800 },
        { year: 2023, price: 5000 },
        { year: 2024, price: 5150 },
        { year: 2025, price: 5300 },
      ],
      trendConfidence: 'Medium',
    },
  },
  {
    label: 'Hazratganj',
    locality: 'Hazratganj',
    area: 'Hazratganj',
    pincode: '226001',
    latitude: 26.852,
    longitude: 80.9462,
    insights: {
      averagePricePerSqft: 9300,
      ranking: 1,
      safetyRating: 4.7,
      nearbyAmenities: ['High court', 'Premium retail', 'Metro station'],
      pros: ['Heritage high street', 'Excellent social infra', 'Prime office catchment'],
      cons: ['Limited new supply', 'Parking extremely limited'],
      priceTrend: [
        { year: 2022, price: 8800 },
        { year: 2023, price: 9100 },
        { year: 2024, price: 9350 },
        { year: 2025, price: 9600 },
      ],
      trendConfidence: 'High',
    },
  },
  {
    label: 'Chinhat',
    locality: 'Chinhat',
    area: 'Chinhat',
    pincode: '226028',
    latitude: 26.869,
    longitude: 81.0544,
    insights: {
      averagePricePerSqft: 4800,
      ranking: 10,
      safetyRating: 3.7,
      nearbyAmenities: ['Faizabad Road', 'Corporate campuses', 'New malls coming up'],
      pros: ['Future IT corridor', 'Plot options at entry prices', 'Near outer ring road'],
      cons: ['Infrastructure catching up', 'Water logging in low-lying lanes'],
      priceTrend: [
        { year: 2022, price: 4300 },
        { year: 2023, price: 4500 },
        { year: 2024, price: 4700 },
        { year: 2025, price: 4900 },
      ],
      trendConfidence: 'Medium',
    },
  },
  {
    label: 'Jankipuram Sector G',
    locality: 'Sector G, Jankipuram',
    area: 'Jankipuram',
    sector: 'Sector G',
    pincode: '226021',
    latitude: 26.926,
    longitude: 80.9486,
    insights: {
      averagePricePerSqft: 4500,
      ranking: 11,
      safetyRating: 3.8,
      nearbyAmenities: ['Engineering colleges', 'Sitapur Road connectivity', 'Metro (planned phase 2)'],
      pros: ['Budget apartments & plots', 'Student housing demand', 'Green pockets'],
      cons: ['Limited premium retail', 'Long commute to CBD'],
      priceTrend: [
        { year: 2022, price: 4100 },
        { year: 2023, price: 4250 },
        { year: 2024, price: 4400 },
        { year: 2025, price: 4600 },
      ],
      trendConfidence: 'Medium',
    },
  },
  {
    label: 'Rajajipuram',
    locality: 'Rajajipuram',
    area: 'Rajajipuram',
    pincode: '226017',
    latitude: 26.857,
    longitude: 80.8905,
    insights: {
      averagePricePerSqft: 4300,
      ranking: 12,
      safetyRating: 3.6,
      nearbyAmenities: ['Lucknow University (second campus)', 'Flyover to Alambagh', 'Local markets'],
      pros: ['Dense social infra', 'Affordable resale inventory', 'Close to Cantt & Alambagh'],
      cons: ['Narrow roads', 'Aging civic services'],
      priceTrend: [
        { year: 2022, price: 3900 },
        { year: 2023, price: 4050 },
        { year: 2024, price: 4200 },
        { year: 2025, price: 4400 },
      ],
      trendConfidence: 'Medium',
    },
  },
  {
    label: 'Mahanagar',
    locality: 'Mahanagar',
    area: 'Mahanagar',
    pincode: '226006',
    latitude: 26.8669,
    longitude: 80.943,
    insights: {
      averagePricePerSqft: 6700,
      ranking: 4,
      safetyRating: 4.2,
      nearbyAmenities: ['Shopping plazas', 'Schools', 'Proximity to Kapoorthala'],
      pros: ['Central & well connected', 'Strong retail & F&B mix', 'Wide tree-lined roads'],
      cons: ['Limited new supply', 'Parking issues in Bhootnath area'],
      priceTrend: [
        { year: 2022, price: 6200 },
        { year: 2023, price: 6400 },
        { year: 2024, price: 6600 },
        { year: 2025, price: 6850 },
      ],
      trendConfidence: 'High',
    },
  },
  {
    label: 'Sushant Golf City',
    locality: 'Sushant Golf City',
    area: 'Shaheed Path',
    pincode: '226030',
    latitude: 26.75,
    longitude: 80.997,
    insights: {
      averagePricePerSqft: 7200,
      ranking: 3,
      safetyRating: 4.5,
      nearbyAmenities: ['International school cluster', 'Medanta hospital', 'Ekana stadium'],
      pros: ['Premium villa townships', 'Expansive greens & golf course', 'Proximity to IT City'],
      cons: ['Limited public transport currently', 'Association charges on higher side'],
      priceTrend: [
        { year: 2022, price: 6600 },
        { year: 2023, price: 6900 },
        { year: 2024, price: 7100 },
        { year: 2025, price: 7400 },
      ],
      trendConfidence: 'High',
    },
  },
  {
    label: 'Arjunganj Cantonment',
    locality: 'Arjunganj',
    area: 'Sultanpur Road',
    pincode: '226002',
    latitude: 26.7723,
    longitude: 81.0169,
    aliases: ['Arjunganj', 'Arjungang'],
  },
  {
    label: 'Telibagh',
    locality: 'Telibagh',
    area: 'Lucknow Cantonment',
    pincode: '226002',
    latitude: 26.772,
    longitude: 80.9754,
    insights: {
      averagePricePerSqft: 4400,
      ranking: 13,
      safetyRating: 3.7,
      nearbyAmenities: ['Army Cantonment', 'Airport Road', 'PGI Lucknow'],
      pros: ['Close to defence establishments', 'Upcoming metro connectivity', 'Quiet residential lanes'],
      cons: ['Limited malls/cafes', 'Water supply intermittent in summers'],
      priceTrend: [
        { year: 2022, price: 4000 },
        { year: 2023, price: 4200 },
        { year: 2024, price: 4350 },
        { year: 2025, price: 4500 },
      ],
      trendConfidence: 'Medium',
    },
  },
  {
    label: 'Husainabad',
    locality: 'Husainabad',
    area: 'Chowk',
    pincode: '226003',
    latitude: 26.8739,
    longitude: 80.9121,
  },
  {
    label: 'Qaiserbagh',
    locality: 'Qaiserbagh',
    area: 'Hazratganj',
    pincode: '226018',
    latitude: 26.8551,
    longitude: 80.9187,
  },
  {
    label: 'Butler Colony',
    locality: 'Butler Colony',
    area: 'Moti Mahal Marg',
    pincode: '226001',
    latitude: 26.8423,
    longitude: 80.9362,
  },
  {
    label: 'Vikas Nagar',
    locality: 'Vikas Nagar',
    area: 'Vikas Nagar',
    pincode: '226022',
    latitude: 26.9027,
    longitude: 80.95,
  },
  {
    label: 'Kursi Road',
    locality: 'Kursi Road',
    area: 'Kursi Road',
    pincode: '226026',
    latitude: 26.9445,
    longitude: 80.9499,
  },
  {

    "label": "LDA Colony",

    "locality": "LDA Colony",

    "area": "Kanpur Road",

    "pincode": "226012",

    "latitude": 26.7909,

    "longitude": 80.9161,

  },

  {

    "label": "Amausi",

    "locality": "Amausi",

    "area": "Kanpur Road",

    "pincode": "226008",

    "latitude": 26.7729,

    "longitude": 80.8872,

  },

  {

    "label": "Charbagh",

    "locality": "Charbagh",

    "area": "Charbagh",

    "pincode": "226004",

    "latitude": 26.8398,

    "longitude": 80.9255,

  },

  {

    "label": "Rajendra Nagar",

    "locality": "Rajendra Nagar",

    "area": "Rajajipuram",

    "pincode": "226004",

    "latitude": 26.845,

    "longitude": 80.915,

  },

  {

    "label": "Sarojini Nagar",

    "locality": "Sarojini Nagar",

    "area": "Kanpur Road",

    "pincode": "226008",

    "latitude": 26.7488,

    "longitude": 80.863,

  },

  {

    "label": "Kalyanpur (East)",

    "locality": "Kalyanpur (East)",

    "area": "Vikas Nagar",

    "pincode": "226022",

    "latitude": 26.8997,

    "longitude": 80.9678,

  },

  {

    "label": "Bakshi Ka Talab",

    "locality": "Bakshi Ka Talab",

    "area": "Sitapur Road",

    "pincode": "226201",

    "latitude": 26.9882,

    "longitude": 80.9217,

  },

  {

    "label": "Mohanlalganj",

    "locality": "Mohanlalganj",

    "area": "Raebareli Road",

    "pincode": "226301",

    "latitude": 26.6897,

    "longitude": 80.9803,

  },

  {

    "label": "Malhaur",

    "locality": "Malhaur",

    "area": "Faizabad Road",

    "pincode": "226028",

    "latitude": 26.8539,

    "longitude": 81.0486,

  },

  {

    "label": "Adarsh Nagar",

    "locality": "Adarsh Nagar",

    "area": "Alambagh",

    "pincode": "226005",

    "latitude": 26.8005,

    "longitude": 80.9155,

  },

  {

    "label": "Chandganj",

    "locality": "Chandganj",

    "area": "Aliganj",

    "pincode": "226024",

    "latitude": 26.8901,

    "longitude": 80.9421,

  },

  {

    "label": "Vrindavan Yojna Sector 10",

    "locality": "Sector 10, Vrindavan Yojna",

    "area": "Vrindavan Yojna",

    "sector": "Sector 10",

    "pincode": "226029",

    "latitude": 26.73,

    "longitude": 81.01,

  },

  {

    "label": "Aminaad",

    "locality": "Aminaad",

    "area": "Old Lucknow",

    "pincode": "226018",

    "latitude": 26.8406,

    "longitude": 80.9329,

  },
  {
    "label": "Patel Nagar",
    "locality": "Patel Nagar, Indira Nagar",
    "area": "Indira Nagar",
    "pincode": "226028",
    "latitude": 26.873,
    "longitude": 81.025,
    
  },
  {
    "label": "Indira Nagar Sector 18",
    "locality": "Sector 18, Indira Nagar",
    "area": "Indira Nagar",
    "sector": "Sector 18",
    "pincode": "226016",
    "latitude": 26.885,
    "longitude": 80.988,
    
  },
  {
    "label": "Indira Nagar Sector 19",
    "locality": "Sector 19, Indira Nagar",
    "area": "Indira Nagar",
    "sector": "Sector 19",
    "pincode": "226016",
    "latitude": 26.888,
    "longitude": 80.995,
    
  },
  {
    "label": "Khurram Nagar",
    "locality": "Khurram Nagar",
    "area": "Indira Nagar",
    "pincode": "226022",
    "latitude": 26.895,
    "longitude": 80.975,
    
  },
  {
    "label": "Munshipulia",
    "locality": "Munshipulia",
    "area": "Indira Nagar",
    "pincode": "226016",
    "latitude": 26.877,
    "longitude": 81.002,
  },
  {
    "label": "Faizullaganj",
    "locality": "Faizullaganj",
    "area": "Sitapur Road",
    "pincode": "226020",
    "latitude": 26.899,
    "longitude": 80.932,
  },
  {
    "label": "Aliganj Sector F",
    "locality": "Sector F, Aliganj",
    "area": "Aliganj",
    "sector": "Sector F",
    "pincode": "226024",
    "latitude": 26.89,
    "longitude": 80.952,
  },
  {
    "label": "Matiyari",
    "locality": "Matiyari",
    "area": "Faizabad Road",
    "pincode": "226028",
    "latitude": 26.875,
    "longitude": 81.035,
  },
  {
    "label": "Gola Ganj",
    "locality": "Gola Ganj",
    "area": "Qaiserbagh",
    "pincode": "226018",
    "latitude": 26.8521,
    "longitude": 80.9255
  },
  {
    "label": "Turiya Ganj",
    "locality": "Turiya Ganj",
    "area": "Hussainganj",
    "pincode": "226001",
    "latitude": 26.848,
    "longitude": 80.938
  },
  {
    "label": "Wazir Ganj",
    "locality": "Wazir Ganj",
    "area": "Chowk",
    "pincode": "226003",
    "latitude": 26.872,
    "longitude": 80.925
  },
  {
    "label": "Nakkhas",
    "locality": "Nakkhas",
    "area": "Chowk",
    "pincode": "226003",
    "latitude": 26.865,
    "longitude": 80.91
  },
  {
    "label": "Yahiyaganj",
    "locality": "Yahiyaganj",
    "area": "Aminabad",
    "pincode": "226018",
    "latitude": 26.840,
    "longitude": 80.930
  },
  {
    "label": "La Touche Road",
    "locality": "La Touche Road",
    "area": "Hazratganj",
    "pincode": "226001",
    "latitude": 26.839,
    "longitude": 80.941
  },
  {
    "label": "Ganga Prasad Road",
    "locality": "Ganga Prasad Road",
    "area": "Aminabad",
    "pincode": "226018",
    "latitude": 26.843,
    "longitude": 80.935
  },
  {
    "label": "Raja Bazar",
    "locality": "Raja Bazar",
    "area": "Chowk",
    "pincode": "226003",
    "latitude": 26.878,
    "longitude": 80.918
  },
  {
    "label": "Daliganj Bridge",
    "locality": "Daliganj Bridge",
    "area": "Daliganj",
    "pincode": "226020",
    "latitude": 26.878,
    "longitude": 80.934
  },
  {
    "label": "Talkatora",
    "locality": "Talkatora",
    "area": "Alambagh",
    "pincode": "226011",
    "latitude": 26.829,
    "longitude": 80.898
  }
];


