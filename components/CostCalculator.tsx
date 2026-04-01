'use client';

import { useState, useMemo } from 'react';

type Procedure = { name: string; usPrice: number; mxPrice: number };

export default function CostCalculator({ procedures }: { procedures: Procedure[] }) {
  const [selectedProc, setSelectedProc] = useState(0);
  const [flights, setFlights] = useState(400); // Default flight cost
  const [hotel, setHotel] = useState(600); // Default hotel cost

  const currentProc = procedures[selectedProc] || { name: 'Procedure', usPrice: 0, mxPrice: 0 };
  
  const totalMexicoCost = currentProc.mxPrice + flights + hotel;
  const netSavings = currentProc.usPrice - totalMexicoCost;
  const savingsPercent = Math.round((netSavings / currentProc.usPrice) * 100);

  // Calculate widths for the visual bars (max width is US Price)
  const mxBarWidth = Math.min((totalMexicoCost / currentProc.usPrice) * 100, 100);

  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-8 my-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Interactive Savings Calculator</h2>
      <p className="text-gray-600 mb-6">See your estimated net savings after factoring in travel and hotel costs.</p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Procedure</label>
          <select 
            className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-blue-500"
            value={selectedProc}
            onChange={(e) => setSelectedProc(Number(e.target.value))}
          >
            {procedures.map((p, i) => (
              <option key={i} value={i}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Est. Flight Cost (Roundtrip)</label>
          <select 
            className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-blue-500"
            value={flights}
            onChange={(e) => setFlights(Number(e.target.value))}
          >
            <option value={250}>Short Flight (e.g. CA to Tijuana) - $250</option>
            <option value={400}>Medium Flight (e.g. TX to Cancun) - $400</option>
            <option value={600}>Long Flight (e.g. NY to Mexico) - $600</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Est. Hotel & Food (Total)</label>
          <select 
            className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-blue-500"
            value={hotel}
            onChange={(e) => setHotel(Number(e.target.value))}
          >
            <option value={300}>Budget (2-3 Days) - $300</option>
            <option value={600}>Standard (4-5 Days) - $600</option>
            <option value={1200}>Luxury / Extended Stay - $1,200</option>
          </select>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 mb-8 text-center border border-blue-100">
        <h3 className="text-lg font-medium text-gray-700 uppercase tracking-wide">Estimated Net Savings</h3>
        <p className="text-4xl md:text-5xl font-extrabold text-green-600 my-2">
          ${netSavings.toLocaleString()}
        </p>
        <p className="text-blue-900 font-semibold">You save {savingsPercent}% by traveling!</p>
      </div>

      <div className="space-y-6">
        {/* US Bar */}
        <div>
          <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
            <span>Average US Cost (Procedure Only)</span>
            <span>${currentProc.usPrice.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6">
            <div className="bg-red-400 h-6 rounded-full w-full"></div>
          </div>
        </div>

        {/* Mexico Bar */}
        <div>
          <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
            <span>Total Mexico Trip (Procedure + Travel)</span>
            <span>${totalMexicoCost.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6 flex overflow-hidden">
            <div 
              className="bg-green-500 h-6 flex items-center justify-center text-xs text-white font-bold" 
              style={{ width: `${mxBarWidth}%` }}
              title="Total Mexico Cost"
            >
              MX
            </div>
          </div>
          <div className="flex gap-4 mt-2 text-xs text-gray-500 justify-end">
            <span>Procedure: ${currentProc.mxPrice.toLocaleString()}</span>
            <span>Flights: ${flights}</span>
            <span>Hotel: ${hotel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}