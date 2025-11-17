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
  },
  {
    label: 'Gomti Nagar Extension',
    locality: 'Gomti Nagar Extension',
    area: 'Gomti Nagar',
    pincode: '226010',
    latitude: 26.8154,
    longitude: 80.9956,
    aliases: ['Gomti Extension'],
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
  },
  {
    label: 'Aliganj Kapoorthala',
    locality: 'Kapoorthala, Aliganj',
    area: 'Aliganj',
    pincode: '226024',
    latitude: 26.8805,
    longitude: 80.9463,
    aliases: ['Kapoorthala'],
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
  },
  {
    label: 'Alambagh',
    locality: 'Alambagh',
    area: 'Alambagh',
    pincode: '226005',
    latitude: 26.7947,
    longitude: 80.9145,
  },
  {
    label: 'Hazratganj',
    locality: 'Hazratganj',
    area: 'Hazratganj',
    pincode: '226001',
    latitude: 26.852,
    longitude: 80.9462,
  },
  {
    label: 'Chinhat',
    locality: 'Chinhat',
    area: 'Chinhat',
    pincode: '226028',
    latitude: 26.869,
    longitude: 81.0544,
  },
  {
    label: 'Jankipuram Sector G',
    locality: 'Sector G, Jankipuram',
    area: 'Jankipuram',
    sector: 'Sector G',
    pincode: '226021',
    latitude: 26.926,
    longitude: 80.9486,
  },
  {
    label: 'Rajajipuram',
    locality: 'Rajajipuram',
    area: 'Rajajipuram',
    pincode: '226017',
    latitude: 26.857,
    longitude: 80.8905,
  },
  {
    label: 'Mahanagar',
    locality: 'Mahanagar',
    area: 'Mahanagar',
    pincode: '226006',
    latitude: 26.8669,
    longitude: 80.943,
  },
  {
    label: 'Sushant Golf City',
    locality: 'Sushant Golf City',
    area: 'Shaheed Path',
    pincode: '226030',
    latitude: 26.75,
    longitude: 80.997,
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

  }
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
  }
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


