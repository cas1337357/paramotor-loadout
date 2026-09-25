export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface EngineItem {
  id: string;
  brand: string;
  model: string;
  weight: number; // kg
  thrust: number; // kg
  rarity: Rarity;
  displacementCc?: number;
  starterType?: string;
  cooling?: string;
}

export interface FrameItem {
  id: string;
  brand: string;
  model: string;
  weight: number; // kg
  rarity: Rarity;
  material?: string;
  propellerSize?: string;
}

export interface ReserveItem {
  id: string;
  brand: string;
  model: string;
  weight: number; // kg
  type: string;
  rarity: Rarity;
}

export interface GliderSize {
  size: string;
  weight: number; // kg
  area: number; // m²
}

export interface GliderModelMap {
  [modelName: string]: GliderSize[];
}

export interface ManufacturerMap {
  [mfrName: string]: {
    models: GliderModelMap;
  };
}

export interface AccessoryItem {
  id: string;
  name: string;
  weight: number; // kg
  category: string;
  rarity: Rarity;
}

export interface WearableItem {
  id: string;
  name: string;
  weight: number; // kg
  rarity: Rarity;
}

export const GEAR_DATA = {
  // ENGINES: Vittorazi, Polini, Corsair, Air Conception, EOS, Minari
  engines: [
    // Vittorazi Engines
    { 
      id: 'moster185-my25', 
      brand: 'Vittorazi', 
      model: 'Moster 185 Plus MY25', 
      weight: 14.2, 
      thrust: 75, 
      rarity: 'epic' as Rarity, 
      displacementCc: 185, 
      starterType: 'Manual Flash', 
      cooling: 'Air Forced' 
    },
    { 
      id: 'moster185-factory-r', 
      brand: 'Vittorazi', 
      model: 'Moster 185 Factory-R', 
      weight: 12.8, 
      thrust: 82, 
      rarity: 'legendary' as Rarity, 
      displacementCc: 185, 
      starterType: 'Carbon Manual', 
      cooling: 'Air with Carbon Shroud' 
    },
    { 
      id: 'moster185-efi', 
      brand: 'Vittorazi', 
      model: 'Moster 185 EFI (Fuel Injection)', 
      weight: 14.8, 
      thrust: 78, 
      rarity: 'legendary' as Rarity, 
      displacementCc: 185, 
      starterType: 'Dual Start', 
      cooling: 'Air Forced' 
    },
    { 
      id: 'atom80', 
      brand: 'Vittorazi', 
      model: 'Atom 80 MY24', 
      weight: 10.4, 
      thrust: 55, 
      rarity: 'rare' as Rarity, 
      displacementCc: 78, 
      starterType: 'Flash Starter', 
      cooling: 'Fan Cooled' 
    },
    { 
      id: 'cosmos300', 
      brand: 'Vittorazi', 
      model: 'Cosmos 300 (Liquid Cooled)', 
      weight: 25.5, 
      thrust: 115, 
      rarity: 'epic' as Rarity, 
      displacementCc: 300, 
      starterType: 'Electric Start', 
      cooling: 'Liquid Cooled' 
    },

    // Polini Engines
    { 
      id: 'thor202', 
      brand: 'Polini', 
      model: 'Thor 202 (Liquid Cooled)', 
      weight: 16.8, 
      thrust: 90, 
      rarity: 'legendary' as Rarity, 
      displacementCc: 205, 
      starterType: 'Flash / Dual', 
      cooling: 'Liquid Cooled' 
    },
    { 
      id: 'thor190-hf', 
      brand: 'Polini', 
      model: 'Thor 190 HF', 
      weight: 13.8, 
      thrust: 76, 
      rarity: 'epic' as Rarity, 
      displacementCc: 193, 
      starterType: 'Flash Starter', 
      cooling: 'Air Forced' 
    },
    { 
      id: 'thor130-evo', 
      brand: 'Polini', 
      model: 'Thor 130 EVO', 
      weight: 12.5, 
      thrust: 64, 
      rarity: 'rare' as Rarity, 
      displacementCc: 125, 
      starterType: 'Flash Starter', 
      cooling: 'Forced Air' 
    },
    { 
      id: 'thor80', 
      brand: 'Polini', 
      model: 'Thor 80', 
      weight: 11.1, 
      thrust: 52, 
      rarity: 'common' as Rarity, 
      displacementCc: 86, 
      starterType: 'Flash Starter', 
      cooling: 'Liquid Cooled' 
    },
    { 
      id: 'thor303', 
      brand: 'Polini', 
      model: 'Thor 303 Dual Spark', 
      weight: 20.5, 
      thrust: 112, 
      rarity: 'legendary' as Rarity, 
      displacementCc: 281, 
      starterType: 'Electric Start', 
      cooling: 'Liquid Cooled' 
    },

    // Other Top Flight Engines
    { 
      id: 'nitro200', 
      brand: 'Air Conception', 
      model: 'Nitro 200 Ultra Light', 
      weight: 11.8, 
      thrust: 72, 
      rarity: 'rare' as Rarity, 
      displacementCc: 190, 
      starterType: 'Manual', 
      cooling: 'Air' 
    },
    { 
      id: 'black-bull', 
      brand: 'Corsair', 
      model: 'Black Bull 235', 
      weight: 17.2, 
      thrust: 95, 
      rarity: 'epic' as Rarity, 
      displacementCc: 235, 
      starterType: 'Manual / Dual', 
      cooling: 'Air Forced' 
    },
    { 
      id: 'eos150', 
      brand: 'EOS', 
      model: 'EOS 150 RV', 
      weight: 11.5, 
      thrust: 70, 
      rarity: 'common' as Rarity, 
      displacementCc: 154, 
      starterType: 'Easy Pull', 
      cooling: 'Air Forced' 
    },
    { 
      id: 'minari181', 
      brand: 'Minari', 
      model: 'Minari 181 EVO', 
      weight: 14.5, 
      thrust: 76, 
      rarity: 'rare' as Rarity, 
      displacementCc: 181, 
      starterType: 'Manual', 
      cooling: 'Air Forced' 
    },
  ],

  // FRAMES & AIRFRAMES: Parajet, PAP, Iris, Macfly, Kangook, Power2Fly, Scout, Adventure
  frames: [
    // Parajet
    { id: 'pj-maverick-ti', brand: 'Parajet', model: 'Maverick Titanium', weight: 9.8, rarity: 'epic' as Rarity, material: 'Titanium Grade 5', propellerSize: '140 cm' },
    { id: 'pj-maverick-al', brand: 'Parajet', model: 'Maverick Aircraft Alloy', weight: 10.6, rarity: 'rare' as Rarity, material: 'Aluminum 6082-T6', propellerSize: '140 cm' },
    { id: 'pj-zenith', brand: 'Parajet', model: 'Zenith CNC Billet', weight: 12.0, rarity: 'common' as Rarity, material: 'CNC Machined Alloy', propellerSize: '130 cm' },
    { id: 'pj-volution3', brand: 'Parajet', model: 'Volution 3 Classic', weight: 11.2, rarity: 'common' as Rarity, material: 'Aero Alloy', propellerSize: '135 cm' },

    // PAP Paramotors
    { id: 'pap-tinox-v2', brand: 'PAP Paramotors', model: 'Tinox V2 Titanium', weight: 8.6, rarity: 'legendary' as Rarity, material: 'Titanium & Carbon', propellerSize: '140 cm' },
    { id: 'pap-tinox-inox', brand: 'PAP Paramotors', model: 'Tinox Stainless Inox', weight: 9.9, rarity: 'rare' as Rarity, material: 'Stainless Inox Steel', propellerSize: '140 cm' },
    { id: 'pap-rolling-trike', brand: 'PAP Paramotors', model: 'Rolling Trike Frame', weight: 14.2, rarity: 'rare' as Rarity, material: 'Reinforced Steel Trike', propellerSize: '150 cm' },

    // Iris Paramotors
    { id: 'iris-infinity-xl', brand: 'Iris Paramotors', model: 'Infinity XL Aero', weight: 10.5, rarity: 'rare' as Rarity, material: 'Aircraft Aluminum', propellerSize: '140 cm' },
    { id: 'iris-aero-carbon', brand: 'Iris Paramotors', model: 'Iris Aero Carbon', weight: 8.2, rarity: 'epic' as Rarity, material: 'Carbon Composite', propellerSize: '140 cm' },
    { id: 'iris-ultra-ti', brand: 'Iris Paramotors', model: 'Iris Ultra Titanium', weight: 8.8, rarity: 'legendary' as Rarity, material: 'Grade 5 Titanium', propellerSize: '140 cm' },

    // Macfly Paramotors
    { id: 'macfly-138-ti', brand: 'Macfly Paramotors', model: 'Macfly 138 Pure Titanium', weight: 7.8, rarity: 'legendary' as Rarity, material: 'Pure Titanium Seamless', propellerSize: '138 cm' },
    { id: 'macfly-140-carbon', brand: 'Macfly Paramotors', model: 'Macfly 140 Carbon Hybrid', weight: 8.2, rarity: 'epic' as Rarity, material: 'Titanium & Carbon Spars', propellerSize: '140 cm' },

    // Kangook Paramotors
    { id: 'kangook-amaruk', brand: 'Kangook Paramotors', model: 'Amaruk Modular Frame', weight: 10.5, rarity: 'epic' as Rarity, material: '6061-T6 Aluminum', propellerSize: '140 cm' },
    { id: 'kangook-classic', brand: 'Kangook Paramotors', model: 'Classic Lightweight', weight: 9.8, rarity: 'rare' as Rarity, material: 'Hydroformed Aluminum', propellerSize: '132 cm' },
    { id: 'kangook-vikking', brand: 'Kangook Paramotors', model: 'Vikking Heavy Duty', weight: 10.8, rarity: 'common' as Rarity, material: 'Welded Tubular Aluminum', propellerSize: '140 cm' },
    { id: 'kangook-trekk', brand: 'Kangook Paramotors', model: 'Trekk Expedition Frame', weight: 9.2, rarity: 'rare' as Rarity, material: 'Ultra-Tough 6061 Alloy', propellerSize: '130 cm' },

    // Power2Fly, Scout, Adventure
    { id: 'p2f-rs-titanium', brand: 'Power2Fly', model: 'RS Ultra Titanium', weight: 8.5, rarity: 'legendary' as Rarity, material: 'Aerospace Titanium', propellerSize: '140 cm' },
    { id: 'scout-carbon', brand: 'Scout', model: 'Carbon Dynamic Aero', weight: 11.5, rarity: 'epic' as Rarity, material: 'Prepreg Carbon Fibre', propellerSize: '132 cm' },
    { id: 'adv-pluma', brand: 'Adventure', model: 'Pluma Carbon Light', weight: 6.5, rarity: 'legendary' as Rarity, material: 'Full Monocoque Carbon', propellerSize: '130 cm' },
  ],

  // GLIDERS / WINGS: Dudek, FlyOzone, Bruce Goldsmith Designs (BGD), Niviuk, Macpara, Velocity, Gin Paragliders, Flare Paragliders
  manufacturers: {
    // 1. Dudek
    Dudek: {
      models: {
        "DriftAir 2": [
          { size: "16", weight: 4.15, area: 16.0 },
          { size: "18", weight: 4.48, area: 18.0 },
          { size: "20", weight: 4.81, area: 20.0 },
          { size: "22", weight: 5.17, area: 22.0 },
          { size: "24", weight: 5.48, area: 24.0 },
          { size: "26", weight: 5.79, area: 26.0 },
          { size: "28", weight: 6.10, area: 28.0 }
        ],
        "Warp 2": [
          { size: "15", weight: 3.95, area: 15.0 },
          { size: "16", weight: 4.18, area: 16.0 },
          { size: "17", weight: 4.34, area: 17.0 },
          { size: "18", weight: 4.50, area: 18.0 },
          { size: "20", weight: 4.80, area: 20.0 },
          { size: "22", weight: 5.10, area: 22.0 },
          { size: "24", weight: 5.44, area: 24.0 }
        ],
        "Nucleon 4": [
          { size: "18", weight: 4.82, area: 18.0 },
          { size: "20", weight: 5.13, area: 20.0 },
          { size: "22", weight: 5.51, area: 22.0 },
          { size: "24", weight: 5.82, area: 24.0 },
          { size: "26", weight: 6.24, area: 26.0 },
          { size: "28", weight: 6.63, area: 28.0 }
        ],
        "Hadron 3": [
          { size: "16", weight: 4.30, area: 16.0 },
          { size: "18", weight: 4.66, area: 18.0 },
          { size: "20", weight: 4.92, area: 20.0 },
          { size: "22", weight: 5.28, area: 22.0 },
          { size: "24", weight: 5.64, area: 24.0 }
        ],
        "Universal 1.1": [
          { size: "23", weight: 5.20, area: 23.0 },
          { size: "26", weight: 5.55, area: 25.5 },
          { size: "28", weight: 5.90, area: 28.0 },
          { size: "31", weight: 6.35, area: 31.0 },
          { size: "34", weight: 6.80, area: 34.0 }
        ],
        "Snake 3 (Slalom Pro)": [
          { size: "14", weight: 3.70, area: 14.0 },
          { size: "15", weight: 3.88, area: 15.0 },
          { size: "16", weight: 4.05, area: 16.0 },
          { size: "18", weight: 4.35, area: 18.0 },
          { size: "20", weight: 4.65, area: 20.0 }
        ],
        "Solo": [
          { size: "21", weight: 5.20, area: 21.0 },
          { size: "24", weight: 5.60, area: 24.0 },
          { size: "27", weight: 6.10, area: 27.0 }
        ],
        "V-King (Single Skin)": [
          { size: "18", weight: 3.80, area: 18.0 },
          { size: "20", weight: 4.10, area: 20.0 },
          { size: "23", weight: 4.50, area: 23.0 }
        ]
      }
    },

    // 2. FlyOzone (Ozone)
    FlyOzone: {
      models: {
        "Spyder 3 (Ultralight Reflex)": [
          { size: "20", weight: 3.91, area: 20.0 },
          { size: "22", weight: 4.19, area: 22.0 },
          { size: "24", weight: 4.42, area: 24.0 },
          { size: "26", weight: 4.66, area: 26.0 },
          { size: "28", weight: 4.88, area: 28.0 },
          { size: "30", weight: 5.13, area: 30.0 }
        ],
        "Viper 5 (Competition Slalom)": [
          { size: "14", weight: 3.82, area: 14.1 },
          { size: "16", weight: 4.09, area: 16.1 },
          { size: "18", weight: 4.45, area: 18.1 },
          { size: "20", weight: 4.76, area: 20.1 },
          { size: "22", weight: 5.06, area: 22.1 },
          { size: "24", weight: 5.42, area: 24.1 }
        ],
        "Roadster 3 (All-Rounder)": [
          { size: "22", weight: 5.01, area: 22.0 },
          { size: "24", weight: 5.33, area: 24.0 },
          { size: "26", weight: 5.65, area: 26.0 },
          { size: "28", weight: 5.99, area: 28.0 },
          { size: "30", weight: 6.28, area: 30.0 }
        ],
        "Freeride 2 (Acro / Play)": [
          { size: "14", weight: 3.65, area: 14.0 },
          { size: "15", weight: 3.80, area: 15.0 },
          { size: "16", weight: 3.95, area: 16.0 },
          { size: "17", weight: 4.10, area: 17.0 },
          { size: "19", weight: 4.40, area: 19.0 },
          { size: "21", weight: 4.80, area: 21.0 },
          { size: "23", weight: 5.20, area: 23.0 }
        ],
        "Kona 3": [
          { size: "22", weight: 4.80, area: 22.0 },
          { size: "24", weight: 5.10, area: 24.0 },
          { size: "26", weight: 5.40, area: 26.0 },
          { size: "28", weight: 5.75, area: 28.0 },
          { size: "30", weight: 6.05, area: 30.0 }
        ],
        "Mojo PWR 2 (Training to XC)": [
          { size: "22", weight: 4.95, area: 22.0 },
          { size: "24", weight: 5.25, area: 24.0 },
          { size: "26", weight: 5.55, area: 26.0 },
          { size: "28", weight: 5.90, area: 28.0 },
          { size: "30", weight: 6.20, area: 30.0 }
        ],
        "Speedster 3": [
          { size: "20", weight: 4.60, area: 20.0 },
          { size: "22", weight: 4.90, area: 22.0 },
          { size: "24", weight: 5.20, area: 24.0 },
          { size: "26", weight: 5.50, area: 26.0 },
          { size: "28", weight: 5.85, area: 28.0 }
        ]
      }
    },

    // 3. Bruce Goldsmith Designs (BGD)
    "Bruce Goldsmith Designs": {
      models: {
        "Luna 2 (Reflex Play)": [
          { size: "18", weight: 4.40, area: 18.0 },
          { size: "20", weight: 4.90, area: 20.0 },
          { size: "23", weight: 5.40, area: 23.0 },
          { size: "26", weight: 5.90, area: 26.0 }
        ],
        "Wasp 2 (Entry to Progression)": [
          { size: "21", weight: 4.50, area: 21.0 },
          { size: "23", weight: 4.80, area: 23.0 },
          { size: "25", weight: 5.10, area: 25.0 },
          { size: "27", weight: 5.45, area: 27.0 },
          { size: "29", weight: 5.80, area: 29.0 }
        ],
        "Cyclone (Dedicated Slalom)": [
          { size: "16", weight: 4.10, area: 16.0 },
          { size: "18", weight: 4.35, area: 18.0 },
          { size: "20", weight: 4.65, area: 20.0 },
          { size: "22", weight: 4.95, area: 22.0 }
        ],
        "Echo 2 Motor (Lightweight)": [
          { size: "22", weight: 3.85, area: 22.0 },
          { size: "24", weight: 4.10, area: 24.0 },
          { size: "26", weight: 4.35, area: 26.0 },
          { size: "28", weight: 4.60, area: 28.0 }
        ],
        "Magic Motor": [
          { size: "21", weight: 4.70, area: 21.0 },
          { size: "23", weight: 5.00, area: 23.0 },
          { size: "25", weight: 5.30, area: 25.0 },
          { size: "27", weight: 5.65, area: 27.0 }
        ]
      }
    },

    // 4. Niviuk
    Niviuk: {
      models: {
        "Kougar 3 (Performance Reflex)": [
          { size: "16", weight: 4.00, area: 16.0 },
          { size: "18", weight: 4.30, area: 18.0 },
          { size: "20", weight: 4.60, area: 20.0 },
          { size: "22", weight: 5.00, area: 22.5 },
          { size: "25", weight: 5.40, area: 25.0 },
          { size: "28", weight: 5.80, area: 28.0 }
        ],
        "Qubik (Easy XC Reflex)": [
          { size: "19", weight: 4.70, area: 19.0 },
          { size: "21", weight: 5.10, area: 21.0 },
          { size: "23", weight: 5.50, area: 23.0 },
          { size: "25", weight: 5.90, area: 25.0 },
          { size: "27", weight: 6.30, area: 27.0 }
        ],
        "Link 2 (Training & Progression)": [
          { size: "21", weight: 4.75, area: 21.0 },
          { size: "23", weight: 5.10, area: 23.0 },
          { size: "25", weight: 5.40, area: 25.0 },
          { size: "27", weight: 5.75, area: 27.0 }
        ],
        "Doberman 2 (Competition Slalom)": [
          { size: "14", weight: 3.75, area: 14.0 },
          { size: "15", weight: 3.90, area: 15.0 },
          { size: "16", weight: 4.05, area: 16.0 },
          { size: "17", weight: 4.25, area: 17.0 },
          { size: "18", weight: 4.45, area: 18.0 }
        ],
        "Skin 3 P (Single Skin Ultralight)": [
          { size: "16", weight: 1.80, area: 16.0 },
          { size: "18", weight: 1.95, area: 18.0 },
          { size: "20", weight: 2.10, area: 20.0 }
        ]
      }
    },

    // 5. Macpara
    Macpara: {
      models: {
        "Colorado 2 (High Speed Reflex)": [
          { size: "18", weight: 4.20, area: 17.88 },
          { size: "20", weight: 4.50, area: 19.88 },
          { size: "22", weight: 5.00, area: 21.97 },
          { size: "24", weight: 5.20, area: 23.92 },
          { size: "26", weight: 5.40, area: 25.96 },
          { size: "29", weight: 5.70, area: 28.62 },
          { size: "31", weight: 6.10, area: 31.41 }
        ],
        "Charger 2 (Confidence Builder)": [
          { size: "19", weight: 4.80, area: 19.20 },
          { size: "21", weight: 5.00, area: 21.30 },
          { size: "23", weight: 5.25, area: 23.40 },
          { size: "25", weight: 5.50, area: 25.50 },
          { size: "28", weight: 5.80, area: 28.00 },
          { size: "31", weight: 6.15, area: 31.00 },
          { size: "34", weight: 6.50, area: 33.80 }
        ],
        "Paradox (Speed & Acro)": [
          { size: "13.5", weight: 3.50, area: 13.5 },
          { size: "15", weight: 3.75, area: 15.0 },
          { size: "16.5", weight: 3.95, area: 16.5 },
          { size: "18", weight: 4.20, area: 18.0 },
          { size: "20", weight: 4.50, area: 20.0 },
          { size: "22", weight: 4.80, area: 22.0 }
        ],
        "Muse 5": [
          { size: "22", weight: 4.60, area: 22.0 },
          { size: "24", weight: 4.90, area: 24.0 },
          { size: "26", weight: 5.20, area: 26.0 },
          { size: "28", weight: 5.55, area: 28.0 },
          { size: "30", weight: 5.90, area: 30.0 }
        ]
      }
    },

    // 6. Velocity
    Velocity: {
      models: {
        "Core 2 (Beginner to Sport)": [
          { size: "18", weight: 4.30, area: 18.0 },
          { size: "22", weight: 4.80, area: 22.0 },
          { size: "25", weight: 5.20, area: 25.0 },
          { size: "29", weight: 5.70, area: 29.0 },
          { size: "33", weight: 6.20, area: 33.0 }
        ],
        "Elektra (High Glide Performance)": [
          { size: "20", weight: 4.40, area: 20.0 },
          { size: "22", weight: 4.70, area: 22.0 },
          { size: "24", weight: 5.00, area: 24.0 },
          { size: "26", weight: 5.30, area: 26.0 },
          { size: "28", weight: 5.65, area: 28.0 }
        ],
        "Recon (XC Cruiser)": [
          { size: "20", weight: 4.60, area: 20.0 },
          { size: "22", weight: 4.90, area: 22.0 },
          { size: "24", weight: 5.20, area: 24.0 },
          { size: "26", weight: 5.55, area: 26.0 }
        ],
        "Edge 2": [
          { size: "24", weight: 5.30, area: 24.0 },
          { size: "28", weight: 5.80, area: 28.0 },
          { size: "32", weight: 6.40, area: 32.0 }
        ]
      }
    },

    // 7. Gin Paragliders
    "Gin Paragliders": {
      models: {
        "Falcon 2 (Speed & Slalom)": [
          { size: "18", weight: 4.70, area: 18.0 },
          { size: "20", weight: 5.00, area: 20.0 },
          { size: "22", weight: 5.25, area: 22.0 },
          { size: "24", weight: 5.50, area: 24.0 }
        ],
        "Vantage 3 (Intermediate Sport)": [
          { size: "21", weight: 4.80, area: 21.0 },
          { size: "23", weight: 5.10, area: 23.0 },
          { size: "25", weight: 5.40, area: 25.0 },
          { size: "27", weight: 5.75, area: 27.0 },
          { size: "29", weight: 6.10, area: 29.0 }
        ],
        "Pegasus 3 (Entry Level Passive Safety)": [
          { size: "22", weight: 4.80, area: 22.0 },
          { size: "24", weight: 5.10, area: 24.0 },
          { size: "26", weight: 5.45, area: 26.0 },
          { size: "28", weight: 5.80, area: 28.0 },
          { size: "30", weight: 6.15, area: 30.0 }
        ],
        "Condor 2 (Heavy Duty / Trike)": [
          { size: "37", weight: 7.90, area: 37.0 },
          { size: "41", weight: 8.60, area: 41.0 }
        ]
      }
    },

    // 8. Flare Paragliders
    "Flare Paragliders": {
      models: {
        "Moustache (High Speed Soaring)": [
          { size: "13", weight: 3.00, area: 13.0 },
          { size: "15", weight: 3.30, area: 15.0 },
          { size: "18", weight: 3.70, area: 18.0 },
          { size: "22", weight: 4.30, area: 22.0 },
          { size: "26", weight: 4.90, area: 26.0 }
        ],
        "Line (Precision Pro)": [
          { size: "11", weight: 2.70, area: 11.0 },
          { size: "13", weight: 2.95, area: 13.0 },
          { size: "15", weight: 3.25, area: 15.0 },
          { size: "17", weight: 3.60, area: 17.0 }
        ]
      }
    }
  } as ManufacturerMap,

  // RESERVES: Independence, High Adventure, Ozone, Dudek
  reserves: [
    { id: 'uc-100', brand: 'Independence', model: 'Ultra Cross 100 Square', weight: 0.97, type: 'Square Cross', rarity: 'legendary' as Rarity },
    { id: 'uc-125', brand: 'Independence', model: 'Ultra Cross 125 Square', weight: 1.19, type: 'Square Cross', rarity: 'legendary' as Rarity },
    { id: 'beamer3', brand: 'High Adventure', model: 'Beamer 3 Steerable Rogallo', weight: 1.78, type: 'Steerable Rogallo', rarity: 'epic' as Rarity },
    { id: 'angel-sq-120', brand: 'Ozone', model: 'Angel SQ 120 Square', weight: 1.50, type: 'Square Chute', rarity: 'rare' as Rarity },
    { id: 'angel-sq-140', brand: 'Ozone', model: 'Angel SQ 140 Pro', weight: 1.75, type: 'Square Chute', rarity: 'rare' as Rarity },
    { id: 'globe-light-110', brand: 'Dudek', model: 'Globe Light 110 Round', weight: 1.55, type: 'Round PDA', rarity: 'common' as Rarity },
    { id: 'gin-yeti-cross', brand: 'Gin', model: 'Yeti Cross 2 Light', weight: 1.35, type: 'Square Cross', rarity: 'rare' as Rarity },
  ],

  // HELMETS
  helmets: [
    { id: 'helm-comms', name: 'MicroAvionics Comms Pro Noise-Cancelling', weight: 1.15, rarity: 'epic' as Rarity },
    { id: 'helm-carbon', name: 'Icaro SkyRunner Carbon Fibre Ultralight', weight: 0.78, rarity: 'legendary' as Rarity },
    { id: 'helm-standard', name: 'PlusMax PlusAir EN966 Certified Helmet', weight: 0.85, rarity: 'common' as Rarity },
    { id: 'helm-visor', name: 'Nevada PPG Aero with Tinted Visor', weight: 0.95, rarity: 'rare' as Rarity },
    { id: 'helm-sena', name: 'Charly No Limit with Integrated Sena Bluetooth', weight: 1.25, rarity: 'epic' as Rarity },
  ],

  // GLOVES
  gloves: [
    { id: 'glove-heated', name: 'Blazewear 7.4V Heated High-Altitude PPG Gloves', weight: 0.45, rarity: 'epic' as Rarity },
    { id: 'glove-windproof', name: 'Gin Windstopper Summer Paragliding Gloves', weight: 0.22, rarity: 'rare' as Rarity },
    { id: 'glove-standard', name: 'Standard Leather Aviator Kevlar Reinforced', weight: 0.35, rarity: 'common' as Rarity },
    { id: 'glove-charly-touch', name: 'Charly Touchscreen Thermal Flying Mitts', weight: 0.28, rarity: 'rare' as Rarity },
  ],

  // BOOTS
  boots: [
    { id: 'boot-crispi', name: 'Crispi Airborne Ankle-Support PPG Boots', weight: 1.45, rarity: 'epic' as Rarity },
    { id: 'boot-salomon', name: 'Salomon Quest 4D GTX High Support', weight: 1.30, rarity: 'rare' as Rarity },
    { id: 'boot-trail', name: 'Hoka Speedgoat Ultralight Trail Runners', weight: 0.72, rarity: 'common' as Rarity },
    { id: 'boot-hanwag', name: 'Hanwag Super Fly GTX Certified Air Ankle Lock', weight: 1.70, rarity: 'legendary' as Rarity },
    { id: 'boot-lowa', name: 'Lowa Renegade GTX Mid All-Terrain', weight: 1.20, rarity: 'rare' as Rarity },
  ],

  // ACCESSORIES
  accessories: [
    { id: 'gopro-13', name: 'GoPro Hero 13 + Chase Cam Mount', weight: 0.16, category: 'Camera', rarity: 'rare' as Rarity },
    { id: 'insta360-x4', name: 'Insta360 X4 Carbon Extension Boom', weight: 0.32, category: 'Camera', rarity: 'epic' as Rarity },
    { id: 'v7-radio', name: 'Icom IC-V86 7W Aviation / 2m Radio', weight: 0.45, category: 'Comms', rarity: 'common' as Rarity },
    { id: 'strobe', name: 'Northstar 3SM High-Power FAA Anti-Collision Strobe', weight: 0.08, category: 'Safety', rarity: 'rare' as Rarity },
    { id: 'vario', name: 'Flymaster GPS M PPG Flight Computer', weight: 0.22, category: 'Flight Computer', rarity: 'epic' as Rarity },
    { id: 'inreach', name: 'Garmin inReach Mini 2 Satellite SOS Beacon', weight: 0.10, category: 'Safety', rarity: 'legendary' as Rarity },
    { id: 'powerbank', name: 'Anker 10,000mAh Cockpit USB-C Battery Bank', weight: 0.22, category: 'Power', rarity: 'rare' as Rarity },
    { id: 'camelbak', name: '2.0L Hydration Bladder with Insulated Tube', weight: 2.15, category: 'Comfort', rarity: 'common' as Rarity },
    { id: 'hook-knife', name: 'Emergency Webbing Line Hook Knife & Whistle', weight: 0.06, category: 'Safety', rarity: 'uncommon' as Rarity },
    { id: 'first-aid', name: 'Adventure Medical Ultralight Field Trauma Kit', weight: 0.35, category: 'Safety', rarity: 'rare' as Rarity },
  ]
};
