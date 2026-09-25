export type UnitSystem = 'metric' | 'imperial';

export type GearCategory = 
  | 'propulsion'
  | 'wing'
  | 'avionics'
  | 'safety'
  | 'tools'
  | 'comfort'
  | 'camping';

export type ItemPackingStatus = 'packed' | 'staged' | 'unpacked';

export interface GearItem {
  id: string;
  name: string;
  category: GearCategory;
  weightKg: number;
  isEssential: boolean;
  notes?: string;
  location?: string;
  packingStatus?: ItemPackingStatus;
}

export interface AircraftProfile {
  pilotWeightKg: number;
  pilotGearWeightKg: number; // Flight suit, shoes, gloves
  wingModel: string;
  wingAreaSqM: number;
  wingWeightKg: number;
  wingCertifiedMinAUWKg: number;
  wingCertifiedMaxAUWKg: number;
  motorModel: string;
  motorDryWeightKg: number; // Frame, engine, propeller, harness
  motorThrustKg: number; // Thrust at sea level
  fuelTankCapacityLiters: number;
  fuelBurnRateLitersPerHour: number;
  reserveModel: string;
  reserveWeightKg: number;
  reserveLastRepackedDate: string;
  hangPointHole: number; // 1 to 5
}

export interface LoadoutPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  fuelLiters: number;
  includedItemIds: string[];
  missionNotes: string;
  targetAltitudeFt?: number;
  flightType: 'sunset' | 'xc' | 'bivy' | 'thermal' | 'training';
}

export interface PreflightItem {
  id: string;
  phase: 'airframe' | 'fuel' | 'harness' | 'wing' | 'avionics' | 'launch';
  title: string;
  detail: string;
  isCritical: boolean;
  completed: boolean;
}

export interface WeightBreakdown {
  pilotTotalKg: number;
  airframeTotalKg: number; // Motor + harness + prop + reserve
  wingTotalKg: number;
  fuelTotalKg: number;
  gearByCategoryKg: Record<GearCategory, number>;
  totalGearKg: number;
  takeoffAUWKg: number;
  dryAUWKg: number; // Without fuel
  landingAUWKg: number; // With reserve fuel (approx 1.5L)
  wingLoadingKgPerM2: number;
  thrustToWeightRatio: number;
  estimatedClimbRateFpm: number;
  flightEnduranceMinutes: number;
  weightStatus: 'under' | 'optimal' | 'heavy' | 'overweight';
}

export interface GitHubSyncState {
  isConnected: boolean;
  token?: string;
  repoOwner?: string;
  repoName?: string;
  gistId?: string;
  lastSynced?: string;
  syncMethod: 'gist' | 'repo' | 'none';
}
