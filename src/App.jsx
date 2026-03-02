import React, { useState, useEffect } from 'react';
import './index.css';

export default function App() {
    const [isKg, setIsKg] = useState(true);
    
    // Core state values
    const [pilotWeight, setPilotWeight] = useState(85);
    const [motorWeight, setMotorWeight] = useState(32);
    const [fuelVol, setFuelVol] = useState(10);
    const [wingWeight, setWingWeight] = useState(8);

    // Derived states for display
    const [totalWeight, setTotalWeight] = useState(0);
    const [fuelWeight, setFuelWeight] = useState(0);
    const [showWarning, setShowWarning] = useState(false);

    // Bounds and steps definitions
    const config = {
        pilot: { kg: { min: 40, max: 150, step: 1 }, lbs: { min: 90, max: 330, step: 1 } },
        motor: { kg: { min: 15, max: 150, step: 1 }, lbs: { min: 33, max: 330, step: 1 } },
        fuel:  { kg: { min: 0, max: 25, step: 0.5, unit: 'L' }, lbs: { min: 0, max: 6.5, step: 0.1, unit: 'Gal' } },
        wing:  { kg: { min: 2, max: 25, step: 0.5 }, lbs: { min: 4, max: 55, step: 1 } }
    };

    const toggleUnit = (toKg) => {
        if (isKg === toKg) return;
        
        if (toKg) {
            setPilotWeight(prev => prev / 2.20462);
            setMotorWeight(prev => prev / 2.20462);
            setWingWeight(prev => prev / 2.20462);
            setFuelVol(prev => prev / 0.264172);
        } else {
            setPilotWeight(prev => prev * 2.20462);
            setMotorWeight(prev => prev * 2.20462);
            setWingWeight(prev => prev * 2.20462);
            setFuelVol(prev => prev * 0.264172);
        }
        setIsKg(toKg);
    };

    useEffect(() => {
        // Calculate weights in KG for internal math
        const pilotKg = isKg ? pilotWeight : pilotWeight / 2.20462;
        const motorKg = isKg ? motorWeight : motorWeight / 2.20462;
        const wingKg = isKg ? wingWeight : wingWeight / 2.20462;
        
        // 0.72 kg/L is average fuel density
        const fuelLiters = isKg ? fuelVol : fuelVol / 0.264172;
        const currentFuelKg = fuelLiters * 0.72; 
        
        const currentTotalKg = pilotKg + motorKg + wingKg + currentFuelKg;

        // Convert back to appropriate display unit
        setFuelWeight(isKg ? currentFuelKg : currentFuelKg * 2.20462);
        setTotalWeight(isKg ? currentTotalKg : currentTotalKg * 2.20462);
        
        // FAA Part 103 Warning (Max empty weight 254 lbs = 115.212 kg)
        setShowWarning(motorKg > 115.212);
    }, [pilotWeight, motorWeight, fuelVol, wingWeight, isKg]);

    const formatValue = (val, step) => val.toFixed(step >= 1 ? 0 : 1);
    const weightUnit = isKg ? 'kg' : 'lbs';
    const fuelUnit = isKg ? config.fuel.kg.unit : config.fuel.lbs.unit;

    return (
        <>
            <header>Paramotor Loadout Calculator</header>
            
            <div className="main-container">
                {/* Input Sliders Panel */}
                <div className="sliders-panel">
                    <div className="panel-header">
                        <span className="panel-title">Gear Weights</span>
                        <div className="unit-toggle">
                            <button 
                                className={`unit-btn ${isKg ? 'active' : ''}`} 
                                onClick={() => toggleUnit(true)}
                            >
                                KG
                            </button>
                            <button 
                                className={`unit-btn ${!isKg ? 'active' : ''}`} 
                                onClick={() => toggleUnit(false)}
                            >
                                LBS
                            </button>
                        </div>
                    </div>

                    <div className="slider-group">
                        <div className="slider-header">
                            <span>Pilot Body Weight</span>
                            <span className="slider-value">
                                {formatValue(pilotWeight, isKg ? config.pilot.kg.step : config.pilot.lbs.step)} {weightUnit}
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min={isKg ? config.pilot.kg.min : config.pilot.lbs.min} 
                            max={isKg ? config.pilot.kg.max : config.pilot.lbs.max} 
                            step={isKg ? config.pilot.kg.step : config.pilot.lbs.step} 
                            value={pilotWeight} 
                            onChange={(e) => setPilotWeight(parseFloat(e.target.value))} 
                        />
                    </div>

                    <div className="slider-group">
                        <div className="slider-header">
                            <span>Paramotor Empty Weight</span>
                            <span className="slider-value">
                                {formatValue(motorWeight, isKg ? config.motor.kg.step : config.motor.lbs.step)} {weightUnit}
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min={isKg ? config.motor.kg.min : config.motor.lbs.min} 
                            max={isKg ? config.motor.kg.max : config.motor.lbs.max} 
                            step={isKg ? config.motor.kg.step : config.motor.lbs.step} 
                            value={motorWeight} 
                            onChange={(e) => setMotorWeight(parseFloat(e.target.value))} 
                        />
                    </div>

                    <div className="slider-group">
                        <div className="slider-header">
                            <span>Fuel Volume</span>
                            <span className="slider-value">
                                {formatValue(fuelVol, isKg ? config.fuel.kg.step : config.fuel.lbs.step)} {fuelUnit}
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min={isKg ? config.fuel.kg.min : config.fuel.lbs.min} 
                            max={isKg ? config.fuel.kg.max : config.fuel.lbs.max} 
                            step={isKg ? config.fuel.kg.step : config.fuel.lbs.step} 
                            value={fuelVol} 
                            onChange={(e) => setFuelVol(parseFloat(e.target.value))} 
                        />
                    </div>

                    <div className="slider-group">
                        <div className="slider-header">
                            <span>Wing & Reserve Weight</span>
                            <span className="slider-value">
                                {formatValue(wingWeight, isKg ? config.wing.kg.step : config.wing.lbs.step)} {weightUnit}
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min={isKg ? config.wing.kg.min : config.wing.lbs.min} 
                            max={isKg ? config.wing.kg.max : config.wing.lbs.max} 
                            step={isKg ? config.wing.kg.step : config.wing.lbs.step} 
                            value={wingWeight} 
                            onChange={(e) => setWingWeight(parseFloat(e.target.value))} 
                        />
                    </div>
                </div>

                {/* Central RPG Loadout Visual */}
                <div className="rpg-layout">
                    <div className="pilot-model-container">
                        <svg viewBox="0 0 200 300" className="pilot-silhouette" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#d175ff" />
                                    <stop offset="100%" stopColor="#8a2be2" />
                                </linearGradient>
                            </defs>
                            <path fill="url(#purpleGrad)" d="M100 30 C120 30 125 50 100 75 C75 50 80 30 100 30 Z" />
                            <path fill="#2d1b4e" stroke="#d175ff" strokeWidth="2" d="M70 90 C40 90 30 130 50 160 C50 160 60 130 70 115 C80 100 120 100 130 115 C140 130 150 160 150 160 C170 130 160 90 130 90 Z" />
                            <path fill="#1a0b2e" stroke="#8a2be2" strokeWidth="2" d="M80 115 L80 230 L60 280 L90 280 L100 230 L110 280 L140 280 L120 230 L120 115 Z" />
                            <circle cx="100" cy="130" r="80" stroke="#d175ff" strokeWidth="4" fill="none" opacity="0.6"/>
                            <circle cx="100" cy="130" r="70" stroke="#8a2be2" strokeWidth="2" fill="none" opacity="0.3"/>
                        </svg>

                        <div className="gear-slot slot-helmet" title="Helmet">
                            <i className="fa-solid fa-helmet-safety"></i>
                            <span className="gear-label">Helmet</span>
                        </div>
                        <div className="gear-slot slot-wing" title="Wing">
                            <i className="fa-solid fa-parachute-box"></i>
                            <span className="gear-label">Dudek Driftair 2</span>
                        </div>
                        <div className="gear-slot slot-reserve" title="Reserve Parachute">
                            <i className="fa-solid fa-life-ring"></i>
                            <span className="gear-label">Reserve</span>
                        </div>
                        <div className="gear-slot slot-motor" title="Paramotor Engine">
                            <i className="fa-solid fa-fan"></i>
                            <span className="gear-label">Polini Thor 202 (WC)</span>
                        </div>
                        <div className="gear-slot slot-instrument" title="Flight Instruments">
                            <i className="fa-solid fa-walkie-talkie"></i>
                            <span className="gear-label">Comms/Nav</span>
                        </div>
                        <div className="gear-slot slot-boots" title="Footwear">
                            <i className="fa-solid fa-shoe-prints"></i>
                            <span className="gear-label">Boots</span>
                        </div>
                    </div>
                </div>

                {/* Output Stats Panel */}
                <div className="stats-panel">
                    <div className="panel-header">
                        <span className="panel-title">Flight Stats</span>
                    </div>
                    
                    <div className="stat-box">
                        <div className="stat-title">Total In-Flight Weight</div>
                        <div className="stat-value">{totalWeight.toFixed(1)} {weightUnit}</div>
                    </div>

                    <div className="stat-box">
                        <div className="stat-title">Fuel Weight Estimate</div>
                        <div className="stat-value" style={{fontSize: '1.8rem'}}>{fuelWeight.toFixed(1)} {weightUnit}</div>
                    </div>

                    {showWarning && (
                        <div className="warning-banner">
                            <i className="fa-solid fa-triangle-exclamation"></i> 
                            WARNING: EXCEEDS FAA PART 103 LIMIT (254 LBS) 
                            <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}