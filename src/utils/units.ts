import { UnitSystem } from '../types/paramotor';

export const KG_TO_LBS = 2.20462262;
export const LBS_TO_KG = 1 / KG_TO_LBS;
export const LITERS_TO_GALLONS = 0.264172;
export const GALLONS_TO_LITERS = 1 / LITERS_TO_GALLONS;
export const FUEL_DENSITY_KG_PER_LITER = 0.745; // 2-stroke gasoline mix (50:1)

export function formatWeight(kg: number, system: UnitSystem, decimals: number = 1): string {
  if (system === 'imperial') {
    const lbs = kg * KG_TO_LBS;
    return `${lbs.toFixed(decimals)} lbs`;
  }
  return `${kg.toFixed(decimals)} kg`;
}

export function formatVolume(liters: number, system: UnitSystem, decimals: number = 1): string {
  if (system === 'imperial') {
    const gal = liters * LITERS_TO_GALLONS;
    return `${gal.toFixed(decimals)} gal`;
  }
  return `${liters.toFixed(decimals)} L`;
}

export function formatWingLoading(kgPerM2: number, system: UnitSystem): string {
  if (system === 'imperial') {
    // 1 kg/m² = 0.204816 lbs/ft²
    const lbsPerSqFt = kgPerM2 * 0.204816;
    return `${lbsPerSqFt.toFixed(2)} lbs/ft²`;
  }
  return `${kgPerM2.toFixed(2)} kg/m²`;
}

export function formatClimbRate(fpm: number, system: UnitSystem): string {
  if (system === 'metric') {
    const mps = fpm * 0.00508;
    return `${mps.toFixed(1)} m/s`;
  }
  return `${Math.round(fpm)} fpm`;
}

export function convertInputWeightToKg(value: number, system: UnitSystem): number {
  return system === 'imperial' ? value * LBS_TO_KG : value;
}

export function convertKgToDisplay(kg: number, system: UnitSystem): number {
  return system === 'imperial' ? kg * KG_TO_LBS : kg;
}

export function convertInputVolumeToLiters(value: number, system: UnitSystem): number {
  return system === 'imperial' ? value * GALLONS_TO_LITERS : value;
}

export function convertLitersToDisplay(liters: number, system: UnitSystem): number {
  return system === 'imperial' ? liters * LITERS_TO_GALLONS : liters;
}
