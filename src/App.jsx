import React, { useState, useEffect } from 'react';
import './index.css';

// Centralized Database for Gear Selection
const gearDatabase = {
    helmet: [
        { id: 'h1', name: 'Standard Helmet', weightKg: 1.2 },
        { id: 'h2', name: 'Carbon Pro Helmet', weightKg: 0.8 },
        { id: 'h3', name: 'Comms Integrated', weightKg: 1.5 }
    ],
    wing: [
        { id: 'w1', name: 'Dudek Driftair 2', weightKg: 8.0 },
        { id: 'w2', name: 'Ozone Roadster 3', weightKg: 6.5 },
        { id: 'w3', name: 'BGD Luna 3', weightKg: 7.2 }
    ],
    reserve: [
        { id: 'r1', name: 'Square Reserve 120', weightKg: 1.8 },
        { id: 'r2', name: 'Lightweight Reserve', weightKg: 1.2 },
        { id: 'r3', name: 'Tandem Reserve', weightKg: 2.8 }
    ],
    motor: [
        { id: 'm1', name: 'Polini Thor 202 (WC)', weightKg: 32.0 },
        { id: 'm2', name: 'Vittorazi Moster 185', weightKg: 24.5 },
        { id: 'm3', name: 'Atom 80', weightKg: 20.0 }
    ],
    instrument: [
        { id: 'i1', name: 'Basic Alti/Vario', weightKg: 0.3 },
        { id: 'i2', name: 'Full Flight Deck', weightKg: 1.5 },
        { id: 'i3', name: 'Phone Mount Only', weightKg: 0.1 }
    ],
    boots: [
        { id: 'b1', name: 'Standard Hiking Boots', weightKg: 1.5 },
        { id: 'b2', name: 'Lightweight Trail Runners', weightKg: 0.6 },
        { id: 'b3', name: 'Heavy Ankle Support', weightKg: 2.0 }
    ]
};

export default function App() {
    const [isKg, setIsKg] = useState(true);
    
    // Core state values
    const [pilotWeight, setPilotWeight] = useState(85);
    const [motorWeight, setMotorWeight] = useState(32);
    const [fuelVol, setFuelVol] = useState(10);
    const [wingWeight, setWingWeight] = useState(8);

    // Gear Selection State
    const [selectedGear, setSelectedGear] = useState({
        helmet: gearDatabase.helmet[0],
        wing: gearDatabase.wing[0],
        reserve: gearDatabase.reserve[0],
        motor: gearDatabase.motor[0],
        instrument: gearDatabase.instrument[0],
        boots: gearDatabase.boots[0]
    });

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);

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

    const handleSliderChange = (type, value) => {
        if (type === 'pilot') setPilotWeight(value);
        if (type === 'fuel') setFuelVol(value);
        if (type === 'motor') {
            setMotorWeight(value);
            setSelectedGear(prev => ({ ...prev, motor: { name: 'Custom Engine', weightKg: isKg ? value : value / 2.20462 } }));
        }
        if (type === 'wing') {
            setWingWeight(value);
            setSelectedGear(prev => ({ ...prev, wing: { name: 'Custom Wing', weightKg: isKg ? value : value / 2.20462 } }));
        }
    };

    const openGearModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const selectGear = (item) => {
        setSelectedGear(prev => ({ ...prev, [modalType]: item }));
        
        if (modalType === 'motor') {
            setMotorWeight(isKg ? item.weightKg : item.weightKg * 2.20462);
        }
        if (modalType === 'wing') {
            setWingWeight(isKg ? item.weightKg : item.weightKg * 2.20462);
        }
        setIsModalOpen(false);
    };

    useEffect(() => {
        // Calculate dynamic weights for calculation
        const pilotKg = isKg ? pilotWeight : pilotWeight / 2.20462;
        const motorKg = isKg ? motorWeight : motorWeight / 2.20462;
        const wingKg = isKg ? wingWeight : wingWeight / 2.20462;
        
        // Static Gear Weights
        const helmetKg = selectedGear.helmet.weightKg;
        const reserveKg = selectedGear.reserve.weightKg;
        const instKg = selectedGear.instrument.weightKg;
        const bootsKg = selectedGear.boots.weightKg;
        
        // Fuel Calculation (0.72 kg/L average density)
        const fuelLiters = isKg ? fuelVol : fuelVol / 0.264172;
        const currentFuelKg = fuelLiters * 0.72; 
        
        const currentTotalKg = pilotKg + motorKg + wingKg + helmetKg + reserveKg + instKg + bootsKg + currentFuelKg;

        setFuelWeight(isKg ? currentFuelKg : currentFuelKg * 2.20462);
        setTotalWeight(isKg ? currentTotalKg : currentTotalKg * 2.20462);
        
        // FAA Part 103 Warning (Max empty weight 254 lbs = 115.212 kg)
        // Empty weight = motor + wing + harness + reserve + helmet + instruments + boots
        const emptyWeightKg = motorKg + wingKg + helmetKg + reserveKg + instKg + bootsKg;
        setShowWarning(emptyWeightKg > 115.212);
    }, [pilotWeight, motorWeight, fuelVol, wingWeight, isKg, selectedGear]);

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
                        <span className="panel-title">Core Weights</span>
                        <div className="unit-toggle">
                            <button className={`unit-btn ${isKg ? 'active' : ''}`} onClick={() => toggleUnit(true)}>KG</button>
                            <button className={`unit-btn ${!isKg ? 'active' : ''}`} onClick={() => toggleUnit(false)}>LBS</button>
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
                            type="range" min={isKg ? config.pilot.kg.min : config.pilot.lbs.min} 
                            max={isKg ? config.pilot.kg.max : config.pilot.lbs.max} 
                            step={isKg ? config.pilot.kg.step : config.pilot.lbs.step} 
                            value={pilotWeight} onChange={(e) => handleSliderChange('pilot', parseFloat(e.target.value))} 
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
                            type="range" min={isKg ? config.motor.kg.min : config.motor.lbs.min} 
                            max={isKg ? config.motor.kg.max : config.motor.lbs.max} 
                            step={isKg ? config.motor.kg.step : config.motor.lbs.step} 
                            value={motorWeight} onChange={(e) => handleSliderChange('motor', parseFloat(e.target.value))} 
                        />
                    </div>

                    <div className="slider-group">
                        <div className="slider-header">
                            <span>Wing Weight</span>
                            <span className="slider-value">
                                {formatValue(wingWeight, isKg ? config.wing.kg.step : config.wing.lbs.step)} {weightUnit}
                            </span>
                        </div>
                        <input 
                            type="range" min={isKg ? config.wing.kg.min : config.wing.lbs.min} 
                            max={isKg ? config.wing.kg.max : config.wing.lbs.max} 
                            step={isKg ? config.wing.kg.step : config.wing.lbs.step} 
                            value={wingWeight} onChange={(e) => handleSliderChange('wing', parseFloat(e.target.value))} 
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
                            type="range" min={isKg ? config.fuel.kg.min : config.fuel.lbs.min} 
                            max={isKg ? config.fuel.kg.max : config.fuel.lbs.max} 
                            step={isKg ? config.fuel.kg.step : config.fuel.lbs.step} 
                            value={fuelVol} onChange={(e) => handleSliderChange('fuel', parseFloat(e.target.value))} 
                        />
                    </div>
                </div>

                {/* Central RPG Loadout Visual */}
                <div className="rpg-layout">
                    <div className="pilot-model-container">
                        {/* UPDATE THIS SRC TO YOUR BACKGROUND PHOTO */}
                        <img src="./your-pilot-photo.jpg" alt="Pilot Background" className="pilot-photo" />

                        <div className="gear-slot slot-helmet" onClick={() => openGearModal('helmet')} title="Select Helmet">
                            <i className="fa-solid fa-helmet-safety"></i>
                            <span className="gear-label">{selectedGear.helmet.name}</span>
                        </div>
                        <div className="gear-slot slot-wing" onClick={() => openGearModal('wing')} title="Select Wing">
                            <i className="fa-solid fa-parachute-box"></i>
                            <span className="gear-label">{selectedGear.wing.name}</span>
                        </div>
                        <div className="gear-slot slot-reserve" onClick={() => openGearModal('reserve')} title="Select Reserve">
                            <i className="fa-solid fa-life-ring"></i>
                            <span className="gear-label">{selectedGear.reserve.name}</span>
                        </div>
                        <div className="gear-slot slot-motor" onClick={() => openGearModal('motor')} title="Select Motor">
                            <i className="fa-solid fa-fan"></i>
                            <span className="gear-label">{selectedGear.motor.name}</span>
                        </div>
                        <div className="gear-slot slot-instrument" onClick={() => openGearModal('instrument')} title="Select Instruments">
                            <i className="fa-solid fa-walkie-talkie"></i>
                            <span className="gear-label">{selectedGear.instrument.name}</span>
                        </div>
                        <div className="gear-slot slot-boots" onClick={() => openGearModal('boots')} title="Select Footwear">
                            <i className="fa-solid fa-shoe-prints"></i>
                            <span className="gear-label">{selectedGear.boots.name}</span>
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

            {/* Gear Selection Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <span className="modal-title">Select {modalType}</span>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            {gearDatabase[modalType].map((item) => {
                                const displayWeight = isKg ? item.weightKg : item.weightKg * 2.20462;
                                return (
                                    <div key={item.id} className="gear-option" onClick={() => selectGear(item)}>
                                        <span className="gear-option-name">{item.name}</span>
                                        <span className="gear-option-weight">{displayWeight.toFixed(1)} {weightUnit}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}