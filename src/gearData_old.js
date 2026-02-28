export const GEAR_DATA = {
  engines: [
    { id: 'thor202', brand: 'Polini', model: 'Thor 202 (Water Cooled)', weight: 16.8, thrust: 90, rarity: 'legendary' },
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
    { id: 'pluma', brand: 'Adventure', model: 'Pluma Carbon', weight: 6.5, rarity: 'legendary' },
    { id: 'v3-frame', brand: 'Limitless', model: 'V3 Titanium', weight: 7.9, rarity: 'rare' }
  ],
  manufacturers: {
    Dudek: {
      models: {
        "DriftAir 2": [{ size: "20", weight: 4.85, area: 20 }, { size: "22", weight: 5.15, area: 22 }, { size: "24", weight: 5.43, area: 24 }, { size: "26", weight: 5.75, area: 26 }, { size: "28", weight: 6.10, area: 28 }],
        "Warp 2": [{ size: "18", weight: 4.90, area: 18 }, { size: "20", weight: 5.20, area: 20 }, { size: "22", weight: 5.50, area: 22 }, { size: "24", weight: 5.85, area: 24 }],
        "V-King": [{ size: "18", weight: 3.80, area: 18 }, { size: "20", weight: 4.10, area: 20 }, { size: "23", weight: 4.50, area: 23 }],
        "Solo": [{ size: "21", weight: 5.20, area: 21 }, { size: "24", weight: 5.60, area: 24 }, { size: "27", weight: 6.10, area: 27 }],
        "Nemo 5": [{ size: "23", weight: 4.60, area: 23 }, { size: "25", weight: 4.90, area: 25 }],
        "Nucleon 4": [{ size: "18", weight: 4.82, area: 18 }, { size: "22", weight: 5.51, area: 22 }, { size: "26", weight: 6.24, area: 26 }],
        "Hadron 3": [{ size: "16", weight: 4.30, area: 16 }, { size: "20", weight: 4.92, area: 20 }, { size: "24", weight: 5.64, area: 24 }],
        "Universal 1.1": [{ size: "23", weight: 6.10, area: 23 }, { size: "28", weight: 6.90, area: 28 }, { size: "34", weight: 7.80, area: 34 }]
      }
    },
    Ozone: {
      models: {
        "Roadster 3": [{ size: "22", weight: 4.95, area: 22 }, { size: "24", weight: 5.30, area: 24 }, { size: "26", weight: 5.65, area: 26 }, { size: "28", weight: 6.05, area: 28 }, { size: "30", weight: 6.45, area: 30 }],
        "Spyder 3": [{ size: "22", weight: 3.60, area: 22 }, { size: "24", weight: 3.90, area: 24 }, { size: "26", weight: 4.20, area: 26 }, { size: "28", weight: 4.50, area: 28 }],
        "Speedster 3": [{ size: "20", weight: 4.63, area: 20 }, { size: "24", weight: 5.30, area: 24 }, { size: "30", weight: 6.17, area: 30 }],
        "Viper 5": [{ size: "20", weight: 4.80, area: 20 }, { size: "22", weight: 5.10, area: 22 }, { size: "24", weight: 5.40, area: 24 }, { size: "27", weight: 5.90, area: 27 }],
        "Freeride": [{ size: "14", weight: 3.69, area: 14 }, { size: "19", weight: 4.47, area: 19 }, { size: "23", weight: 5.10, area: 23 }]
      }
    },
    ITV: {
      models: {
        "Billy 2": [{ size: "20", weight: 5.00, area: 20 }, { size: "24", weight: 5.80, area: 24 }, { size: "28", weight: 6.40, area: 28 }],
        "Bulldog": [{ size: "35", weight: 8.90, area: 35 }, { size: "40", weight: 9.50, area: 40 }]
      }
    },
    Gin: {
      models: {
        "Falcon 2": [{ size: "20", weight: 5.00, area: 20 }, { size: "24", weight: 5.50, area: 24 }, { size: "26", weight: 6.10, area: 26 }],
        "Vantage 4": [{ size: "22", weight: 4.40, area: 22 }, { size: "26", weight: 4.80, area: 26 }]
      }
    },
    BGD: {
      models: {
        "Luna 2": [{ size: "20", weight: 4.90, area: 20 }, { size: "23", weight: 5.40, area: 23 }, { size: "26", weight: 5.90, area: 26 }],
        "Magic Motor": [{ size: "21", weight: 4.60, area: 21 }, { size: "25", weight: 5.10, area: 25 }, { size: "29", weight: 5.70, area: 29 }]
      }
    }
  },
  standardWeights: { helmet: 0.85, gloves: 0.35, boots: 1.20, reserve: 1.55 },
  accessories: [
    { id: 'gopro-13', name: 'GoPro Hero 13', weight: 0.16, category: 'Camera', rarity: 'rare' },
    { id: 'v7-radio', name: 'Icom V7 Radio', weight: 0.45, category: 'Comms', rarity: 'common' },
    { id: 'strobe', name: 'Northstar Strobe', weight: 0.12, category: 'Safety', rarity: 'common' }
  ]
};