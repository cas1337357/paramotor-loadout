# Paramotor Loadout & AUW Calculator

A responsive, offline-first Progressive Web App (PWA) and RPG loadout system for powered paragliding (PPG) pilots. Accurately calculates in-flight All-Up-Weight (AUW), wing loading ($kg/m^2$), and checks FAA Part 103 compliance with a dynamic paper-doll pilot visualization and real manufacturer photography.

## Features

- **Dynamic Interactive Pilot Paper Doll**: Real-time visualization of equipped gear with rotating carbon propeller blades, thrust heat aura, helmet cyber-HUD visor, heated tactical gloves, and flight boots.
- **Authentic Manufacturer Flight Photography**: High-resolution in-flight canopy photography for every wing brand (*Dudek, FlyOzone, Bruce Goldsmith Designs, Niviuk, Macpara, Flare, Velocity, Gin*).
- **Comprehensive Equipment Database**:
  - **8 Glider Manufacturers**: 3-step drill-down (Manufacturer → Model → Size) with exact surface areas ($m^2$) and canopy weights.
  - **14 Paramotor Airframes**: Parajet, PAP, Iris, Macfly, Kangook, Power2Fly, Scout, Adventure (Titanium, Carbon, and Aircraft Alloy).
  - **14 Propulsion Engines**: Vittorazi (Atom 80, Moster 185 Plus, Factory-R, Moster 185 EFI, Cosmos 300), Polini (Thor 80, 130 EVO, 190 HF, 202 Liquid Cooled, 303 Dual Spark), Corsair, Air Conception, EOS, Minari.
  - **Reserves, Flight Helmets, Gloves, Boots, and Flight Computers**.
- **Live Flight Dynamics & Compliance**:
  - Dynamic All-Up-Weight (AUW) in Metric ($kg$) and Imperial ($lbs$).
  - Live Wing Loading calculation ($kg/m^2$ and $lbs/ft^2$) with handling behavior classification.
  - Real-time FAA Part 103 Empty Weight validation ($\le 254\ \text{lbs}$ / $115.2\ \text{kg}$).
  - Two-stroke mixed fuel weight density slider (0–16L).
- **Progressive Web App (PWA)**:
  - Installable on iOS, Android, and Desktop.
  - Fully functional offline via Service Worker caching.
  - Local persistence across sessions via `localStorage`.

## Tech Stack

- **React 18** with **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Lucide Icons**
- **Vite PWA Plugin** with Workbox offline caching

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```
