import React, { useState, useMemo } from 'react';
import { GEAR_DATA } from './gearData';
import pilotImage from './pilot_model.png';

export default function App() {
  const [unit, setUnit] = useState('kg');
  const [pilotWeight, setPilotWeight] = useState(85);
  const [fuelLiters, setFuelLiters] = useState(5);
  const [menu, setMenu] = useState(null); // { type, step, mfr, model }

  const [loadout, setLoadout] = useState({
    engine: GEAR_DATA.engines[0], // Thor 202
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
      {/* SIDE DRAWER: SEAMLESS SELECTION */}
      <div className={`side-drawer ${menu ? 'open' : ''}`}>
        <div className="flex justify-between items-center mb-16 border-b-4 border-amber-900 pb-8">
           <h3 className="text-rpg-gold font-medieval text-5xl uppercase italic">Equip {menu?.type}</h3>
           <button onClick={() => setMenu(null)} className="text-slate-500 hover:text-white font-black text-3xl">CLOSE [X]</button>
        </div>
        
        <div className="pr-4 h-[80vh] overflow-y-auto">
          {menu?.type === 'engine' && GEAR_DATA.engines.map(e => (
            <div key={e.id} onClick={() => {setLoadout({...loadout, engine: e}); setMenu(null)}} className="loot-card">
              <p className="text-amber-500 font-black uppercase text-sm mb-1">{e.brand}</p>
              <p className="text-4xl font-black text-white">{e.model}</p>
            </div>
          ))}

          {menu?.type === 'reserve' && GEAR_DATA.reserves.map(r => (
            <div key={r.id} onClick={() => {setLoadout({...loadout, reserve: r}); setMenu(null)}} className="loot-card">
              <p className="text-purple-500 font-black uppercase text-sm mb-1">{r.brand}</p>
              <p className="text-4xl font-black text-white">{r.model}</p>
              <p className="text-xs text-slate-500">{r.type} - {r.weight}kg</p>
            </div>
          ))}

          {menu?.type === 'wing' && menu.step === 'mfr' && Object.keys(GEAR_DATA.manufacturers).map(m => (
            <div key={m} onClick={() => setMenu({type: 'wing', step: 'model', mfr: m})} className="loot-card text-rpg-gold font-black text-4xl uppercase">{m}</div>
          ))}
          {menu?.type === 'wing' && menu.step === 'model' && Object.keys(GEAR_DATA.manufacturers[menu.mfr].models).map(mod => (
            <div key={mod} onClick={() => setMenu({type: 'wing', step: 'size', mfr: menu.mfr, model: mod})} className="loot-card text-white font-black text-3xl uppercase">{mod}</div>
          ))}
          {menu?.type === 'wing' && menu.step === 'size' && GEAR_DATA.manufacturers[menu.mfr].models[menu.model].map(s => (
            <div key={s.size} onClick={() => {setLoadout({...loadout, glider: {...s, brand: menu.mfr, model: menu.model}}); setMenu(null)}} className="loot-card text-green-400 font-black text-6xl">{s.size}m</div>
          ))}

          {menu?.type === 'accessory' && GEAR_DATA.accessories.map(acc => (
            <div key={acc.id} onClick={() => {setLoadout({...loadout, accessory: acc}); setMenu(null)}} className="loot-card text-white font-black text-3xl">{acc.name}</div>
          ))}
          
          {menu?.type === 'frame' && GEAR_DATA.frames.map(f => (
            <div key={f.id} onClick={() => {setLoadout({...loadout, frame: f}); setMenu(null)}} className="loot-card text-white font-black text-4xl uppercase">{f.model}</div>
          ))}
        </div>
      </div>

      <div className="character-screen">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-10 justify-center items-start pl-12">
          <Socket label="HEAD" active={loadout.helmet} sub="Helmet" onClick={() => setLoadout({...loadout, helmet: !loadout.helmet})} />
          <Socket label="WING" active={true} sub={`${loadout.glider.model}`} onClick={() => setMenu({type: 'wing', step: 'mfr'})} />
          <Socket label="RESERVE" active={true} sub={loadout.reserve.model} onClick={() => setMenu({type: 'reserve'})} rarity={loadout.reserve.rarity} />
          <Socket label="MISC" active={!!loadout.accessory} sub={loadout.accessory?.name || "EMPTY"} onClick={() => setMenu({type: 'accessory'})} />
        </div>

        {/* CENTER COLUMN: CHEST LEVEL HERO DATA */}
        <div className="flex flex-col items-center">
          <div className="relative flex justify-center items-center min-h-[900px] w-full">
            <img src={pilotImage} alt="Pilot" className={`h-[850px] w-auto transition-all ${menu ? 'opacity-10 blur-3xl' : 'opacity-90'}`} />
            
            {!menu && (
              <div className="hero-data-anchor">
                <div className="flex items-baseline justify-center">
                  <p className="hero-weight-number">{convert(stats.total).toFixed(1)}</p>
                  <p className="text-5xl text-slate-500 uppercase font-black tracking-widest ml-4">{unitL}</p>
                </div>
                {stats.warning && (
                  <div className="safety-alert-box">
                    <p className="safety-alert-text">{stats.warning}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* COMMAND CENTER SLIDERS */}
          <div className="w-[850px] bg-black/90 border-4 border-rpg-gold p-10 space-y-12 mb-10">
              <div className="slider-group">
                <div className="flex justify-between text-rpg-gold font-black uppercase text-2xl tracking-widest mb-4">
                  <span>Fuel Reserve</span><span className="text-amber-500 italic">{fuelLiters}L</span>
                </div>
                <input type="range" min="0" max="15" step="1" value={fuelLiters} onChange={(e) => setFuelLiters(Number(e.target.value))} className="rpg-slider" />
              </div>
              <div className="slider-group">
                <div className="flex justify-between text-rpg-gold font-black uppercase text-2xl tracking-widest mb-4">
                  <span>Pilot Mass ({unitL})</span><span className="text-amber-500 italic">{convert(pilotWeight).toFixed(1)}</span>
                </div>
                <input type="range" min="0" max={unit === 'kg' ? 300 : 660} step="1" value={convert(pilotWeight)} onChange={(e) => setPilotWeight(unit === 'kg' ? Number(e.target.value) : Number(e.target.value) / 2.20462)} className="rpg-slider" />
              </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-10 justify-center items-end pr-12">
          <Socket label="GLOVES" active={loadout.gloves} sub="Gloves" onClick={() => setLoadout({...loadout, gloves: !loadout.gloves})} />
          <Socket label="ENGINE" active={true} sub={loadout.engine.model} onClick={() => setMenu({type: 'engine'})} rarity={loadout.engine.rarity} />
          <Socket label="FRAME" active={true} sub={loadout.frame.model} onClick={() => setMenu({type: 'frame'})} rarity={loadout.frame.rarity} />
          <Socket label="BOOTS" active={loadout.boots} sub="Boots" onClick={() => setLoadout({...loadout, boots: !loadout.boots})} />
        </div>
      </div>

      {/* 1400PX ATTRIBUTE PEDESTAL */}
      <div className="attribute-box space-y-12">
        <div className="flex justify-between items-center border-b-4 border-slate-800 pb-10">
           <div className="flex bg-black/50 border-2 border-slate-700 p-1">
              <button onClick={() => setUnit('kg')} className={`px-10 py-4 text-3xl font-black ${unit === 'kg' ? 'bg-amber-600' : 'text-slate-600'}`}>KG</button>
              <button onClick={() => setUnit('lbs')} className={`px-10 py-4 text-3xl font-black ${unit === 'lbs' ? 'bg-amber-600' : 'text-slate-600'}`}>LBS</button>
           </div>
           <div className={`px-12 py-6 border-8 font-black text-5xl tracking-widest ${stats.total <= 115.2 ? 'border-green-600 text-green-400' : 'border-red-600 text-red-500 animate-pulse'}`}>
              {stats.total <= 115.2 ? '✓ PART 103' : '⚠ EXPERIMENTAL'}
           </div>
        </div>
        <div className="grid grid-cols-2 gap-16">
          <div><p className="attr-label-huge">Wing Loading</p><p className="attr-value-huge text-blue-400">{stats.loading.toFixed(2)}</p></div>
          <div className="text-right"><p className="attr-label-huge">Empty Mass</p><p className="attr-value-huge text-amber-500">{convert(stats.empty).toFixed(1)}</p></div>
        </div>
      </div>
    </div>
  );
}

function Socket({ label, sub, active, onClick, rarity }) {
  const getBorder = () => {
    if (rarity === 'legendary') return 'border-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.9)]';
    if (rarity === 'epic') return 'border-purple-600 shadow-[0_0_50px_rgba(163,53,238,1)]';
    return 'border-slate-700';
  };
  return (
    <div onClick={onClick} className={`gear-socket ${active ? 'active' : 'opacity-20 grayscale'} ${active ? getBorder() : ''}`}>
      <span className="socket-label leading-none">{label}</span>
      <span className="text-3xl font-black text-white text-center uppercase italic px-6 truncate w-full">{active ? sub : 'EMPTY'}</span>
    </div>
  );
}