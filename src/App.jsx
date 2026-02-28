import React, { useState, useMemo } from 'react';
import { GEAR_DATA } from './gearData';
import pilotImage from './pilot_model.png';

export default function App() {
  const [unit, setUnit] = useState('kg');
  const [pilotWeight, setPilotWeight] = useState(85);
  const [fuelLiters, setFuelLiters] = useState(5);
  const [menu, setMenu] = useState(null); 

  // Starting loadout with your verified equipment
  const [loadout, setLoadout] = useState({
    engine: GEAR_DATA.engines[0], // Polini Thor 202
    frame: GEAR_DATA.frames[0],
    glider: { ...GEAR_DATA.manufacturers.Dudek.models["DriftAir 2"][2], brand: 'Dudek', model: 'DriftAir 2' },
    reserve: GEAR_DATA.reserves[0],
    accessory: GEAR_DATA.accessories[0],
    helmet: true, gloves: true, boots: true
  });

  const convert = (val) => unit === 'kg' ? val : val * 2.20462;
  const unitL = unit === 'kg' ? 'kg' : 'lbs';

  const stats = useMemo(() => {
    const gearBase = (loadout.engine?.weight || 0) + (loadout.frame?.weight || 0) + (loadout.glider?.weight || 0) + (loadout.accessory?.weight || 0) + (loadout.reserve?.weight || 0);
    const std = (loadout.helmet ? GEAR_DATA.standardWeights.helmet : 0) + (loadout.gloves ? GEAR_DATA.standardWeights.gloves : 0) + (loadout.boots ? GEAR_DATA.standardWeights.boots : 0);
    const total = gearBase + std + pilotWeight + (fuelLiters * 0.748);
    const loading = total / (loadout.glider?.area || 1);
    
    let warning = null;
    if (loading > 6.8) warning = "CRITICAL: OVERLOADED";
    else if (loading > 6.2) warning = "WARNING: HIGH LOADING";
    else if (loading < 3.2) warning = "DANGER: UNDER LOADED";
    
    return { total, loading, warning, empty: total - pilotWeight };
  }, [loadout, pilotWeight, fuelLiters]);

  return (
    <div className="app-viewport">
      {/* SELECTION DRAWER */}
      <div className={`side-drawer ${menu ? 'open' : ''}`}>
        <div className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
           <h3 className="text-amber-500 font-bold text-3xl uppercase tracking-tighter">Equip {menu?.type}</h3>
           <button onClick={() => setMenu(null)} className="text-zinc-500 hover:text-white font-bold text-xl">CLOSE [X]</button>
        </div>
        <div className="pr-2 h-[80vh] overflow-y-auto custom-scrollbar">
          {menu?.type === 'engine' && GEAR_DATA.engines.map(e => (
            <div key={e.id} onClick={() => {setLoadout({...loadout, engine: e}); setMenu(null)}} className="loot-card">
              <p className="text-amber-500 font-bold uppercase text-xs mb-1">{e.brand}</p>
              <p className="text-2xl font-bold text-white">{e.model}</p>
            </div>
          ))}
          {menu?.type === 'reserve' && GEAR_DATA.reserves.map(r => (
            <div key={r.id} onClick={() => {setLoadout({...loadout, reserve: r}); setMenu(null)}} className="loot-card">
              <p className="text-zinc-400 font-bold uppercase text-xs mb-1">{r.brand}</p>
              <p className="text-2xl font-bold text-white">{r.model}</p>
            </div>
          ))}
          {menu?.type === 'wing' && menu.step === 'mfr' && Object.keys(GEAR_DATA.manufacturers).map(m => (
            <div key={m} onClick={() => setMenu({type: 'wing', step: 'model', mfr: m})} className="loot-card text-amber-500 font-bold text-2xl uppercase">{m}</div>
          ))}
          {menu?.type === 'wing' && menu.step === 'model' && Object.keys(GEAR_DATA.manufacturers[menu.mfr].models).map(mod => (
            <div key={mod} onClick={() => setMenu({type: 'wing', step: 'size', mfr: menu.mfr, model: mod})} className="loot-card text-white font-bold text-xl uppercase">{mod}</div>
          ))}
          {menu?.type === 'wing' && menu.step === 'size' && GEAR_DATA.manufacturers[menu.mfr].models[menu.model].map(s => (
            <div key={s.size} onClick={() => {setLoadout({...loadout, glider: {...s, brand: menu.mfr, model: menu.model}}); setMenu(null)}} className="loot-card text-green-500 font-bold text-4xl">{s.size}m</div>
          ))}
          {menu?.type === 'accessory' && GEAR_DATA.accessories.map(acc => (
            <div key={acc.id} onClick={() => {setLoadout({...loadout, accessory: acc}); setMenu(null)}} className="loot-card text-white font-bold text-xl">{acc.name}</div>
          ))}
          {menu?.type === 'frame' && GEAR_DATA.frames.map(f => (
            <div key={f.id} onClick={() => {setLoadout({...loadout, frame: f}); setMenu(null)}} className="loot-card text-white font-bold text-xl uppercase">{f.model}</div>
          ))}
        </div>
      </div>

      <div className="character-screen">
        <div className="gear-column-left">
          <Socket label="HEAD" active={loadout.helmet} sub="Helmet" onClick={() => setLoadout({...loadout, helmet: !loadout.helmet})} />
          <Socket label="WING" active={true} sub={`${loadout.glider.model}`} onClick={() => setMenu({type: 'wing', step: 'mfr'})} />
          <Socket label="RESERVE" active={true} sub={loadout.reserve.model} onClick={() => setMenu({type: 'reserve'})} />
          <Socket label="MISC" active={!!loadout.accessory} sub={loadout.accessory?.name || "EMPTY"} onClick={() => setMenu({type: 'accessory'})} />
        </div>

        <div className="hero-column">
          <div className="relative flex justify-center items-center min-h-[900px] w-full">
            <img src={pilotImage} alt="Pilot" className={`h-[850px] w-auto transition-all ${menu ? 'opacity-10 blur-xl' : 'opacity-90'}`} />
            {!menu && (
              <div className="hero-data-anchor">
                <div className="flex items-baseline justify-center">
                  <p className="hero-weight-number">{convert(stats.total).toFixed(1)}</p>
                  <p className="text-5xl text-zinc-500 uppercase font-bold tracking-widest ml-4">{unitL}</p>
                </div>
                {stats.warning && <div className="safety-alert-box"><p className="safety-alert-text">{stats.warning}</p></div>}
              </div>
            )}
          </div>

          <div className="command-center space-y-10">
              <div>
                <div className="flex justify-between uppercase tracking-widest mb-4">
                  <span className="text-zinc-400 font-bold">Fuel Reserve</span>
                  <span className="text-amber-500 font-bold">{fuelLiters}L</span>
                </div>
                <input type="range" min="0" max="15" step="1" value={fuelLiters} onChange={(e) => setFuelLiters(Number(e.target.value))} className="rpg-slider" />
              </div>
              <div>
                <div className="flex justify-between uppercase tracking-widest mb-4">
                  <span className="text-zinc-400 font-bold">Pilot Mass ({unitL})</span>
                  <span className="text-amber-500 font-bold">{convert(pilotWeight).toFixed(1)}</span>
                </div>
                <input type="range" min="0" max={unit === 'kg' ? 300 : 660} step="1" value={convert(pilotWeight)} onChange={(e) => setPilotWeight(unit === 'kg' ? Number(e.target.value) : Number(e.target.value) / 2.20462)} className="rpg-slider" />
              </div>
          </div>
        </div>

        <div className="gear-column-right">
          <Socket label="GLOVES" active={loadout.gloves} sub="Gloves" onClick={() => setLoadout({...loadout, gloves: !loadout.gloves})} />
          <Socket label="ENGINE" active={true} sub={loadout.engine.model} onClick={() => setMenu({type: 'engine'})} />
          <Socket label="FRAME" active={true} sub={loadout.frame.model} onClick={() => setMenu({type: 'frame'})} />
          <Socket label="BOOTS" active={loadout.boots} sub="Boots" onClick={() => setLoadout({...loadout, boots: !loadout.boots})} />
        </div>
      </div>

      <div className="attribute-box space-y-10">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-8">
           <div className="flex bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
              <button onClick={() => setUnit('kg')} className={`px-10 py-3 text-2xl font-bold transition-all ${unit === 'kg' ? 'bg-amber-600 text-white' : 'text-zinc-600'}`}>KG</button>
              <button onClick={() => setUnit('lbs')} className={`px-10 py-3 text-2xl font-bold transition-all ${unit === 'lbs' ? 'bg-amber-600 text-white' : 'text-zinc-600'}`}>LBS</button>
           </div>
           <div className={`px-12 py-6 border-4 font-bold text-4xl tracking-widest rounded-xl ${stats.total <= 115.2 ? 'border-green-600 text-green-500' : 'border-red-600 text-red-500 animate-pulse'}`}>
              {stats.total <= 115.2 ? '✓ PART 103' : '⚠ EXPERIMENTAL'}
           </div>
        </div>
        <div className="grid grid-cols-2 gap-10">
          <div><p className="attr-label-huge">Wing Loading</p><p className="attr-value-huge text-blue-500">{stats.loading.toFixed(2)}</p></div>
          <div className="text-right"><p className="attr-label-huge">Empty Mass</p><p className="attr-value-huge text-amber-500">{convert(stats.empty).toFixed(1)}</p></div>
        </div>
      </div>
    </div>
  );
}

function Socket({ label, sub, active, onClick }) {
  return (
    <div onClick={onClick} className={`gear-socket ${active ? 'active' : 'opacity-30'}`}>
      <span className="socket-label">{label}</span>
      <span className="text-3xl font-bold text-white text-center uppercase italic px-4 truncate w-full">{active ? sub : 'EMPTY'}</span>
    </div>
  );
}