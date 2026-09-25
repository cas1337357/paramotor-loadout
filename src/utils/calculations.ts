import { AircraftProfile, GearCategory, GearItem, WeightBreakdown } from '../types/paramotor';
import { FUEL_DENSITY_KG_PER_LITER } from './units';

export function calculateWeightBreakdown(
  aircraft: AircraftProfile,
  allGear: GearItem[],
  includedItemIds: string[],
  currentFuelLiters: number
): WeightBreakdown {
  const pilotTotalKg = aircraft.pilotWeightKg + aircraft.pilotGearWeightKg;
  const airframeTotalKg = aircraft.motorDryWeightKg + aircraft.reserveWeightKg;
  const wingTotalKg = aircraft.wingWeightKg;
  const fuelTotalKg = currentFuelLiters * FUEL_DENSITY_KG_PER_LITER;

  const includedGear = allGear.filter((g) => includedItemIds.includes(g.id));

  const gearByCategoryKg: Record<GearCategory, number> = {
    propulsion: 0,
    wing: 0,
    avionics: 0,
    safety: 0,
    tools: 0,
    comfort: 0,
    camping: 0,
  };

  includedGear.forEach((item) => {
    gearByCategoryKg[item.category] = (gearByCategoryKg[item.category] || 0) + item.weightKg;
  });

  const totalGearKg = includedGear.reduce((sum, item) => sum + item.weightKg, 0);

  const takeoffAUWKg = pilotTotalKg + airframeTotalKg + wingTotalKg + fuelTotalKg + totalGearKg;
  const dryAUWKg = takeoffAUWKg - fuelTotalKg;

  // Assume landing with standard VFR minimum safety reserve of 1.5 liters
  const reserveFuelLiters = Math.min(1.5, currentFuelLiters);
  const landingAUWKg = dryAUWKg + reserveFuelLiters * FUEL_DENSITY_KG_PER_LITER;

  // Wing loading
  const wingArea = Math.max(12, aircraft.wingAreaSqM);
  const wingLoadingKgPerM2 = takeoffAUWKg / wingArea;

  // Thrust-to-weight ratio
  const thrustToWeightRatio = aircraft.motorThrustKg / Math.max(1, takeoffAUWKg);

  // Approximate climb rate (fpm) based on excess thrust:
  // Typical PPG l/d at best climb speed is ~6.8
  const dragAtClimbKg = takeoffAUWKg / 6.8;
  const excessThrustKg = Math.max(0, aircraft.motorThrustKg - dragAtClimbKg);
  // 1 kg excess thrust on a paramotor produces roughly 14-16 fpm climb rate
  const estimatedClimbRateFpm = Math.round(excessThrustKg * 15.2);

  // Flight endurance (minutes)
  const burnRate = Math.max(1, aircraft.fuelBurnRateLitersPerHour);
  const flightEnduranceMinutes = Math.round((currentFuelLiters / burnRate) * 60);

  // Certified weight status
  let weightStatus: 'under' | 'optimal' | 'heavy' | 'overweight' = 'optimal';
  if (takeoffAUWKg < aircraft.wingCertifiedMinAUWKg) {
    weightStatus = 'under';
  } else if (takeoffAUWKg > aircraft.wingCertifiedMaxAUWKg) {
    weightStatus = 'overweight';
  } else if (
    takeoffAUWKg >
    aircraft.wingCertifiedMinAUWKg + (aircraft.wingCertifiedMaxAUWKg - aircraft.wingCertifiedMinAUWKg) * 0.82
  ) {
    weightStatus = 'heavy';
  }

  return {
    pilotTotalKg,
    airframeTotalKg,
    wingTotalKg,
    fuelTotalKg,
    gearByCategoryKg,
    totalGearKg,
    takeoffAUWKg,
    dryAUWKg,
    landingAUWKg,
    wingLoadingKgPerM2,
    thrustToWeightRatio,
    estimatedClimbRateFpm,
    flightEnduranceMinutes,
    weightStatus,
  };
}

export function recommendHangPoint(pilotTotalWeightKg: number): {
  recommendedHole: number;
  pitchDegree: number;
  description: string;
} {
  // Paramotor swan-neck or high hang points:
  // Hole 1 (front): Light pilots (<68 kg / 150 lbs)
  // Hole 2: Light-medium pilots (68 - 78 kg / 150 - 172 lbs)
  // Hole 3 (middle): Medium pilots (78 - 88 kg / 172 - 194 lbs)
  // Hole 4: Medium-heavy pilots (88 - 98 kg / 194 - 216 lbs)
  // Hole 5 (rear): Heavy pilots (>98 kg / 216 lbs)
  if (pilotTotalWeightKg < 68) {
    return {
      recommendedHole: 1,
      pitchDegree: 6,
      description: 'Hole 1 (Forward): Prevents pilot from reclining too far back; maintains 6° forward thrust line.',
    };
  } else if (pilotTotalWeightKg < 78) {
    return {
      recommendedHole: 2,
      pitchDegree: 7,
      description: 'Hole 2 (Medium-Forward): Optimal 7° nose-up angle on launch run.',
    };
  } else if (pilotTotalWeightKg < 88) {
    return {
      recommendedHole: 3,
      pitchDegree: 8,
      description: 'Hole 3 (Neutral/Mid): Standard factory balance point for average pilot frame.',
    };
  } else if (pilotTotalWeightKg < 98) {
    return {
      recommendedHole: 4,
      pitchDegree: 9,
      description: 'Hole 4 (Medium-Aft): Shifts hang point aft to counter heavier torso weight.',
    };
  } else {
    return {
      recommendedHole: 5,
      pitchDegree: 10,
      description: 'Hole 5 (Aft): Essential for heavier pilots to prevent nose-down propeller pitch.',
    };
  }
}
