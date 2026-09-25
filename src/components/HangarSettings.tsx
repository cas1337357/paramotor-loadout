import React, { useState } from 'react';
import { 
  Plane, 
  User, 
  Gauge, 
  Fuel, 
  Shield, 
  Save, 
  Check, 
  RotateCcw, 
  Calendar,
  AlertTriangle,
  Zap,
  Info
} from 'lucide-react';
import { AircraftProfile, UnitSystem } from '../types/paramotor';
import { 
  convertInputWeightToKg, 
  convertKgToDisplay, 
  convertInputVolumeToLiters, 
  convertLitersToDisplay,
  formatWeight 
} from '../utils/units';

interface HangarSettingsProps {
  aircraft: AircraftProfile;
  unitSystem: UnitSystem;
  onSaveAircraft: (updated: AircraftProfile) => void;
}

const PARAMOTOR_PRESETS: {
  name: string;
  motorModel: string;
  motorDryWeightKg: number;
  motorThrustKg: number;
  fuelTankCapacityLiters: number;
  fuelBurnRateLitersPerHour: number;
}[] = [
  {
    name: 'Vittorazi Moster 185 Plus (140cm Carbon)',
    motorModel: 'Vittorazi Moster 185 Plus MY22',
    motorDryWeightKg: 24.5,
    motorThrustKg: 75.0,
    fuelTankCapacityLiters: 14.0,
    fuelBurnRateLitersPerHour: 3.8,
  },
  {
    name: 'Vittorazi Atom 80 (Lightweight)',
    motorModel: 'Vittorazi Atom 80 (Air Conception Frame)',
    motorDryWeightKg: 19.8,
    motorThrustKg: 54.0,
    fuelTankCapacityLiters: 11.5,
    fuelBurnRateLitersPerHour: 2.7,
  },
  {
    name: 'Polini Thor 202 (Heavy / Tandem / High Power)',
    motorModel: 'Polini Thor 202 Dual Spark',
    motorDryWeightKg: 28.5,
    motorThrustKg: 90.0,
    fuelTankCapacityLiters: 15.0,
    fuelBurnRateLitersPerHour: 4.5,
  },
  {
    name: 'Air Conception Nitro 200 Titanium',
    motorModel: 'Air Conception Nitro 200 Ultra',
    motorDryWeightKg: 20.2,
    motorThrustKg: 72.0,
    fuelTankCapacityLiters: 12.0,
    fuelBurnRateLitersPerHour: 3.5,
  },
];

const WING_PRESETS: {
  name: string;
  wingModel: string;
  wingAreaSqM: number;
  wingWeightKg: number;
  wingCertifiedMinAUWKg: number;
  wingCertifiedMaxAUWKg: number;
}[] = [
  {
    name: 'Ozone Spyder 3 (22m² - Reflex XC)',
    wingModel: 'Ozone Spyder 3 22',
    wingAreaSqM: 22.0,
    wingWeightKg: 4.8,
    wingCertifiedMinAUWKg: 90.0,
    wingCertifiedMaxAUWKg: 135.0,
  },
  {
    name: 'Dudek Universal 1.1 (24m² - Beginner to XC)',
    wingModel: 'Dudek Universal 1.1 24',
    wingAreaSqM: 24.0,
    wingWeightKg: 5.4,
    wingCertifiedMinAUWKg: 85.0,
    wingCertifiedMaxAUWKg: 140.0,
  },
  {
    name: 'BGD Luna 2 (23m² - Speed & Play)',
    wingModel: 'BGD Luna 2 23',
    wingAreaSqM: 23.0,
    wingWeightKg: 5.1,
    wingCertifiedMinAUWKg: 80.0,
    wingCertifiedMaxAUWKg: 130.0,
  },
  {
    name: 'Flow Sirocco (20m² - Agile Small Wing)',
    wingModel: 'Flow Sirocco 20',
    wingAreaSqM: 20.0,
    wingWeightKg: 4.3,
    wingCertifiedMinAUWKg: 90.0,
    wingCertifiedMaxAUWKg: 130.0,
  },
];

export const HangarSettings: React.FC<HangarSettingsProps> = ({
  aircraft,
  unitSystem,
  onSaveAircraft,
}) => {
  // Form fields
  const [pilotWeight, setPilotWeight] = useState(
    convertKgToDisplay(aircraft.pilotWeightKg, unitSystem).toFixed(1)
  );
  const [pilotGearWeight, setPilotGearWeight] = useState(
    convertKgToDisplay(aircraft.pilotGearWeightKg, unitSystem).toFixed(1)
  );

  const [wingModel, setWingModel] = useState(aircraft.wingModel);
  const [wingAreaSqM, setWingAreaSqM] = useState(aircraft.wingAreaSqM.toString());
  const [wingWeight, setWingWeight] = useState(
    convertKgToDisplay(aircraft.wingWeightKg, unitSystem).toFixed(1)
  );
  const [wingMinAUW, setWingMinAUW] = useState(
    convertKgToDisplay(aircraft.wingCertifiedMinAUWKg, unitSystem).toFixed(1)
  );
  const [wingMaxAUW, setWingMaxAUW] = useState(
    convertKgToDisplay(aircraft.wingCertifiedMaxAUWKg, unitSystem).toFixed(1)
  );

  const [motorModel, setMotorModel] = useState(aircraft.motorModel);
  const [motorDryWeight, setMotorDryWeight] = useState(
    convertKgToDisplay(aircraft.motorDryWeightKg, unitSystem).toFixed(1)
  );
  const [motorThrust, setMotorThrust] = useState(
    convertKgToDisplay(aircraft.motorThrustKg, unitSystem).toFixed(1)
  );
  const [fuelTankCapacity, setFuelTankCapacity] = useState(
    convertLitersToDisplay(aircraft.fuelTankCapacityLiters, unitSystem).toFixed(1)
  );
  const [fuelBurnRate, setFuelBurnRate] = useState(
    aircraft.fuelBurnRateLitersPerHour.toFixed(1)
  );

  const [reserveModel, setReserveModel] = useState(aircraft.reserveModel);
  const [reserveWeight, setReserveWeight] = useState(
    convertKgToDisplay(aircraft.reserveWeightKg, unitSystem).toFixed(1)
  );
  const [reserveRepackDate, setReserveRepackDate] = useState(aircraft.reserveLastRepackedDate);

  const [hangPointHole, setHangPointHole] = useState(aircraft.hangPointHole);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Check reserve repack age
  const repackDateObj = new Date(reserveRepackDate);
  const now = new Date();
  const monthsSinceRepack = Math.round(
    (now.getTime() - repackDateObj.getTime()) / (1000 * 60 * 60 * 24 * 30.43)
  );
  const isRepackOverdue = monthsSinceRepack > 12;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: AircraftProfile = {
      pilotWeightKg: convertInputWeightToKg(parseFloat(pilotWeight) || 75, unitSystem),
      pilotGearWeightKg: convertInputWeightToKg(parseFloat(pilotGearWeight) || 3.5, unitSystem),
      wingModel: wingModel.trim(),
      wingAreaSqM: parseFloat(wingAreaSqM) || 22.0,
      wingWeightKg: convertInputWeightToKg(parseFloat(wingWeight) || 4.5, unitSystem),
      wingCertifiedMinAUWKg: convertInputWeightToKg(parseFloat(wingMinAUW) || 80, unitSystem),
      wingCertifiedMaxAUWKg: convertInputWeightToKg(parseFloat(wingMaxAUW) || 135, unitSystem),
      motorModel: motorModel.trim(),
      motorDryWeightKg: convertInputWeightToKg(parseFloat(motorDryWeight) || 24, unitSystem),
      motorThrustKg: convertInputWeightToKg(parseFloat(motorThrust) || 70, unitSystem),
      fuelTankCapacityLiters: convertInputVolumeToLiters(parseFloat(fuelTankCapacity) || 12, unitSystem),
      fuelBurnRateLitersPerHour: parseFloat(fuelBurnRate) || 3.5,
      reserveModel: reserveModel.trim(),
      reserveWeightKg: convertInputWeightToKg(parseFloat(reserveWeight) || 2.0, unitSystem),
      reserveLastRepackedDate: reserveRepackDate,
      hangPointHole,
    };

    onSaveAircraft(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const applyMotorPreset = (preset: typeof PARAMOTOR_PRESETS[0]) => {
    setMotorModel(preset.motorModel);
    setMotorDryWeight(convertKgToDisplay(preset.motorDryWeightKg, unitSystem).toFixed(1));
    setMotorThrust(convertKgToDisplay(preset.motorThrustKg, unitSystem).toFixed(1));
    setFuelTankCapacity(convertLitersToDisplay(preset.fuelTankCapacityLiters, unitSystem).toFixed(1));
    setFuelBurnRate(preset.fuelBurnRateLitersPerHour.toFixed(1));
  };

  const applyWingPreset = (preset: typeof WING_PRESETS[0]) => {
    setWingModel(preset.wingModel);
    setWingAreaSqM(preset.wingAreaSqM.toString());
    setWingWeight(convertKgToDisplay(preset.wingWeightKg, unitSystem).toFixed(1));
    setWingMinAUW(convertKgToDisplay(preset.wingCertifiedMinAUWKg, unitSystem).toFixed(1));
    setWingMaxAUW(convertKgToDisplay(preset.wingCertifiedMaxAUWKg, unitSystem).toFixed(1));
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-16">
      {/* Hangar Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg sm:text-xl font-black text-white">
              Aircraft Hangar & Pilot Profile
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Specify your pilot body weight, paramotor airframe, glider certified envelope, and reserve details.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Profile Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section 1: Pilot Body & Gear Weight */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Pilot Body & Personal Flight Wear
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Pilot Dry Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'}) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={pilotWeight}
                onChange={(e) => setPilotWeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                Your body weight with standard street clothes
              </span>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Flight Wear & Footwear ({unitSystem === 'metric' ? 'kg' : 'lbs'}) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={pilotGearWeight}
                onChange={(e) => setPilotGearWeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                Heavy boots, insulated flight suit, and PPG helmet
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Paramotor & Engine Specs */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Paramotor Unit & Engine
              </h3>
            </div>

            {/* Quick Engine Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Presets:</span>
              {PARAMOTOR_PRESETS.map((p) => (
                <button
                  type="button"
                  key={p.name}
                  onClick={() => applyMotorPreset(p)}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium border border-slate-700 transition"
                >
                  {p.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-3">
              <label className="text-xs text-slate-400 block mb-1">Motor & Frame Model</label>
              <input
                type="text"
                required
                value={motorModel}
                onChange={(e) => setMotorModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Dry Unit Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'}) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={motorDryWeight}
                onChange={(e) => setMotorDryWeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              />
              <span className="text-[11px] text-slate-500 block mt-1">Empty frame, engine, harness, prop</span>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Static Thrust ({unitSystem === 'metric' ? 'kg' : 'lbs'}) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={motorThrust}
                onChange={(e) => setMotorThrust(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              />
              <span className="text-[11px] text-slate-500 block mt-1">Full throttle thrust at sea level</span>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Fuel Tank Capacity ({unitSystem === 'metric' ? 'Liters' : 'Gallons'}) *
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={fuelTankCapacity}
                onChange={(e) => setFuelTankCapacity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              />
              <span className="text-[11px] text-slate-500 block mt-1">Max tank usable volume</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Avg Fuel Burn Rate (Liters / Hour) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={fuelBurnRate}
                onChange={(e) => setFuelBurnRate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                Average cruise consumption (usually 3.0 to 4.5 L/hr)
              </span>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Current Hang Point Hole (1 = Front, 5 = Rear)
              </label>
              <select
                value={hangPointHole}
                onChange={(e) => setHangPointHole(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              >
                <option value={1}>Hole 1 - Most Forward (Light pilots &lt; 150 lbs)</option>
                <option value={2}>Hole 2 - Medium Forward (150 - 172 lbs)</option>
                <option value={3}>Hole 3 - Neutral Mid (172 - 194 lbs)</option>
                <option value={4}>Hole 4 - Medium Aft (194 - 216 lbs)</option>
                <option value={5}>Hole 5 - Most Aft (Heavy pilots &gt; 216 lbs)</option>
              </select>
              <span className="text-[11px] text-slate-500 block mt-1">
                Swan-neck swing-arm pivot pin hole
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Wing / Glider Specifications */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Glider / Wing Envelope
              </h3>
            </div>

            {/* Quick Wing Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Presets:</span>
              {WING_PRESETS.map((p) => (
                <button
                  type="button"
                  key={p.name}
                  onClick={() => applyWingPreset(p)}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium border border-slate-700 transition"
                >
                  {p.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Wing Model & Brand</label>
              <input
                type="text"
                required
                value={wingModel}
                onChange={(e) => setWingModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Flat Area (m²) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={wingAreaSqM}
                onChange={(e) => setWingAreaSqM(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Glider Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'}) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={wingWeight}
                onChange={(e) => setWingWeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              />
              <span className="text-[11px] text-slate-500 block mt-1">Canopy and risers</span>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Certified Min AUW ({unitSystem === 'metric' ? 'kg' : 'lbs'}) *
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={wingMinAUW}
                onChange={(e) => setWingMinAUW(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              />
              <span className="text-[11px] text-slate-500 block mt-1">EN/DGAC bottom weight</span>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Certified Max AUW ({unitSystem === 'metric' ? 'kg' : 'lbs'}) *
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={wingMaxAUW}
                onChange={(e) => setWingMaxAUW(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              />
              <span className="text-[11px] text-slate-500 block mt-1">EN/DGAC structural top weight</span>
            </div>
          </div>
        </div>

        {/* Section 4: Reserve Parachute & Repack Inspection Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-md space-y-3.5">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-pink-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Emergency Reserve Parachute & Repack Tracker
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Reserve Model</label>
              <input
                type="text"
                required
                value={reserveModel}
                onChange={(e) => setReserveModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Reserve Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'}) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={reserveWeight}
                onChange={(e) => setReserveWeight(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Last Repack Date *</label>
              <input
                type="date"
                required
                value={reserveRepackDate}
                onChange={(e) => setReserveRepackDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Repack status alert */}
          <div
            className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
              isRepackOverdue
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {isRepackOverdue ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              ) : (
                <Calendar className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              )}
              <span>
                {monthsSinceRepack} months since last certified repack.{' '}
                {isRepackOverdue
                  ? 'Reserve repack is OVERDUE (12 month interval exceeded). Schedule a professional repack!'
                  : 'Reserve status is current and flight legal.'}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-sky-500/25 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Aircraft & Pilot Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
