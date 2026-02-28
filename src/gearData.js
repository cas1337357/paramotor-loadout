export const GEAR_DATA = {
  engines: [
    { id: 'thor202', brand: 'Polini', model: 'Thor 202 (WC)', weight: 16.8, thrust: 90, rarity: 'legendary' },
    { id: 'moster185', brand: 'Vittorazi', model: 'Moster 185 Plus', weight: 14.2, thrust: 75, rarity: 'epic' },
    { id: 'atom80', brand: 'Vittorazi', model: 'Atom 80', weight: 10.4, thrust: 55, rarity: 'rare' },
    { id: 'nitro200', brand: 'AirDesign', model: 'Nitro 200', weight: 11.8, thrust: 72, rarity: 'rare' },
    { id: 'black-bull', brand: 'Corsair', model: 'Black Bull', weight: 17.2, thrust: 95, rarity: 'epic' },
    { id: 'eos150', brand: 'EOS', model: 'EOS 150 RV', weight: 11.5, thrust: 70, rarity: 'common' }
  ],
  frames: [
    { id: 'maverick', brand: 'Parajet', model: 'Maverick', weight: 9.8, rarity: 'epic' },
    { id: 'rs-titanium', brand: 'Power2Fly', model: 'RS Titanium', weight: 8.5, rarity: 'legendary' },
    { id: 'infinity-xl', brand: 'Iris', model: 'Infinity XL', weight: 10.5, rarity: 'rare' },
    { id: 'scout-carbon', brand: 'Scout', model: 'Carbon Fibre', weight: 11.5, rarity: 'epic' },
    { id: 'pluma', brand: 'Adventure', model: 'Pluma Carbon', weight: 6.5, rarity: 'legendary' }
  ],
  reserves: [
    { id: 'uc-100', brand: 'Independence', model: 'Ultra Cross 100', weight: 0.97, type: 'Square', rarity: 'legendary' },
    { id: 'uc-125', brand: 'Independence', model: 'Ultra Cross 125', weight: 1.19, type: 'Square', rarity: 'legendary' },
    { id: 'beamer3', brand: 'High Adventure', model: 'Beamer 3', weight: 1.78, type: 'Rogallo', rarity: 'epic' },
    { id: 'angel-sq', brand: 'Ozone', model: 'Angel SQ 120', weight: 1.50, type: 'Square', rarity: 'rare' },
    { id: 'globe-light', brand: 'Dudek', model: 'Globe Light 110', weight: 1.55, type: 'Round', rarity: 'common' }
  ],
  manufacturers: {
    Dudek: {
      models: {
        "DriftAir": [
          { size: "14", weight: 3.78, area: 14 }, { size: "15", weight: 3.94, area: 15 }, { size: "16", weight: 4.11, area: 16 }, 
          { size: "18", weight: 4.44, area: 18 }, { size: "20", weight: 4.77, area: 20 }, { size: "22", weight: 5.13, area: 22 }, 
          { size: "24", weight: 5.43, area: 24 }
        ],
        "DriftAir 2": [
          { size: "16", weight: 4.15, area: 16 }, { size: "18", weight: 4.48, area: 18 }, { size: "20", weight: 4.81, area: 20 },
          { size: "22", weight: 5.17, area: 22 }, { size: "24", weight: 5.48, area: 24 }, { size: "26", weight: 5.79, area: 26 },
          { size: "28", weight: 6.10, area: 28 }
        ],
        "Warp 2": [
          { size: "15", weight: 3.95, area: 15 }, { size: "16", weight: 4.18, area: 16 }, { size: "17", weight: 4.34, area: 17 }, 
          { size: "18", weight: 4.50, area: 18 }, { size: "20", weight: 4.80, area: 20 }, { size: "22", weight: 5.10, area: 22 }, 
          { size: "24", weight: 5.44, area: 24 }
        ],
        "Nucleon 4": [
          { size: "18", weight: 4.82, area: 18 }, { size: "20", weight: 5.13, area: 20 }, { size: "22", weight: 5.51, area: 22 },
          { size: "24", weight: 5.82, area: 24 }, { size: "26", weight: 6.24, area: 26 }, { size: "28", weight: 6.63, area: 28 }
        ],
        "Hadron 3": [
          { size: "16", weight: 4.30, area: 16 }, { size: "18", weight: 4.66, area: 18 }, { size: "20", weight: 4.92, area: 20 }, 
          { size: "22", weight: 5.28, area: 22 }, { size: "24", weight: 5.64, area: 24 }
        ],
        "Solo": [{ size: "21", weight: 5.20, area: 21 }, { size: "24", weight: 5.60, area: 24 }, { size: "27", weight: 6.10, area: 27 }],
        "V-King": [{ size: "18", weight: 3.80, area: 18 }, { size: "20", weight: 4.10, area: 20 }, { size: "23", weight: 4.50, area: 23 }],
        "Nemo 5": [{ size: "23", weight: 4.60, area: 23 }, { size: "25", weight: 4.90, area: 25 }]
      }
    },
    Ozone: {
      models: {
        "Viper 5": [
          { size: "14", weight: 3.82, area: 14.1 }, { size: "16", weight: 4.09, area: 16.1 }, { size: "18", weight: 4.45, area: 18.1 },
          { size: "20", weight: 4.76, area: 20.1 }, { size: "22", weight: 5.06, area: 22.1 }, { size: "24", weight: 5.42, area: 24.1 }
        ],
        "Spyder 3": [
          { size: "20", weight: 3.91, area: 20 }, { size: "22", weight: 4.19, area: 22 }, { size: "24", weight: 4.42, area: 24 },
          { size: "26", weight: 4.66, area: 26 }, { size: "28", weight: 4.88, area: 28 }, { size: "30", weight: 5.13, area: 30 }
        ],
        "Roadster 3": [
          { size: "22", weight: 5.01, area: 22 }, { size: "24", weight: 5.33, area: 24 }, { size: "26", weight: 5.65, area: 26 },
          { size: "28", weight: 5.99, area: 28 }, { size: "30", weight: 6.28, area: 30 }
        ],
        "Freeride 2": [
          { size: "14", weight: 3.65, area: 14 }, { size: "15", weight: 3.80, area: 15 }, { size: "16", weight: 3.95, area: 16 },
          { size: "17", weight: 4.10, area: 17 }, { size: "19", weight: 4.40, area: 19 }, { size: "21", weight: 4.80, area: 21 }, 
          { size: "23", weight: 5.20, area: 23 }
        ]
      }
    },
    Niviuk: {
      models: {
        "Kougar 3": [
          { size: "16", weight: 4.0, area: 16 }, { size: "18", weight: 4.3, area: 18 }, { size: "20", weight: 4.6, area: 20 },
          { size: "22", weight: 5.0, area: 22.5 }, { size: "25", weight: 5.4, area: 25 }, { size: "28", weight: 5.8, area: 28 }
        ],
        "Qubik": [
          { size: "19", weight: 4.70, area: 19 }, { size: "21", weight: 5.10, area: 21 }, { size: "23", weight: 5.50, area: 23 },
          { size: "25", weight: 5.90, area: 25 }, { size: "27", weight: 6.30, area: 27 }
        ],
        "Link 2": [{ size: "23", weight: 5.10, area: 23 }, { size: "25", weight: 5.40, area: 25 }]
      }
    },
    Flow: {
      models: {
        "RPM 2": [
          { size: "15", weight: 4.2, area: 15 }, { size: "17", weight: 4.4, area: 17 }, { size: "18", weight: 4.6, area: 18 },
          { size: "20", weight: 4.9, area: 20 }, { size: "22", weight: 5.1, area: 22 }, { size: "24", weight: 5.4, area: 24 }
        ],
        "Panorama": [{ size: "32", weight: 7.20, area: 32 }, { size: "41", weight: 8.40, area: 41 }]
      }
    },
    ITV: { models: { "Billy 2": [{ size: "18", weight: 4.60, area: 18 }, { size: "20", weight: 5.00, area: 20 }, { size: "22", weight: 5.40, area: 22 }, { size: "24", weight: 5.80, area: 24 }, { size: "26", weight: 6.20, area: 26 }] } },
    Gin: { models: { "Falcon 2": [{ size: "20", weight: 5.00, area: 20 }, { size: "22", weight: 5.25, area: 22 }, { size: "24", weight: 5.50, area: 24 }] } },
    BGD: { models: { "Luna 2": [{ size: "18", weight: 4.40, area: 18 }, { size: "20", weight: 4.90, area: 20 }, { size: "23", weight: 5.40, area: 23 }, { size: "26", weight: 5.90, area: 26 }] } }
  },
  standardWeights: { helmet: 0.85, gloves: 0.35, boots: 1.20 },
  accessories: [
    { id: 'gopro-13', name: 'GoPro Hero 13', weight: 0.16, category: 'Camera', rarity: 'rare' },
    { id: 'v7-radio', name: 'Icom V7 Radio', weight: 0.45, category: 'Comms', rarity: 'common' },
    { id: 'strobe', name: 'Northstar Strobe', weight: 0.08, category: 'Safety', rarity: 'rare' },
    { id: 'vario', name: 'Flymaster Vario', weight: 0.22, category: 'Flight-Computer', rarity: 'epic' }
  ]
};