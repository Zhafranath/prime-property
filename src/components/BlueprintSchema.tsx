/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";

interface BlueprintSchemaProps {
  type: "Villa" | "Ruko";
  propertyName: string;
  dimensions: { width: number; length: number };
}

export default function BlueprintSchema({ type, propertyName, dimensions }: BlueprintSchemaProps) {
  const isVilla = type === "Villa";

  return (
    <div className="relative w-full h-full bg-[#001D3D] overflow-hidden flex items-center justify-center p-4 select-none">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff1a 1px, transparent 1px), linear-gradient(to bottom, #ffffff1a 1px, transparent 1px)`,
             backgroundSize: `4px 4px, 40px 40px, 40px 40px`
           }} 
      />

      {/* Main Drawing Area */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md aspect-[4/3] border-2 border-white/40 bg-[#001D3D]/60 backdrop-blur-sm shadow-2xl flex items-center justify-center"
      >
        {/* Architectural Lines SVG */}
        <svg viewBox="0 0 400 300" className="w-full h-full text-white/80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <style>
            {`
              .wall { stroke: white; stroke-width: 2.5; stroke-linecap: round; }
              .door { stroke: #C9A961; stroke-width: 2; fill: none; stroke-dasharray: 4 2; }
              .label { fill: #C9A961; font-family: 'JetBrains Mono', monospace; font-size: 8px; font-weight: bold; text-transform: uppercase; }
              .dimension { fill: white; font-family: 'JetBrains Mono', monospace; font-size: 6px; opacity: 0.6; }
            `}
          </style>

          {/* Outer Walls */}
          <rect x="40" y="40" width="320" height="220" className="wall" />

          {isVilla ? (
            <>
              {/* Villa Rooms Partitioning */}
              <line x1="40" y1="150" x2="240" y2="150" className="wall" /> {/* Horizontal Main Partition */}
              <line x1="240" y1="40" x2="240" y2="260" className="wall" /> {/* Vertical Main Partition */}
              <line x1="40" y1="100" x2="140" y2="100" className="wall" /> {/* Small Room */}
              <line x1="140" y1="40" x2="140" y2="100" className="wall" />

              {/* Pool Area */}
              <rect x="260" y="60" width="80" height="180" className="wall" fill="rgba(0, 150, 255, 0.1)" strokeDasharray="5 3" />
              <text x="300" y="150" className="label" textAnchor="middle" transform="rotate(-90, 300, 150)">Infinity Pool</text>

              {/* Labels */}
              <text x="140" y="210" className="label" textAnchor="middle">Grand Living Area</text>
              <text x="90" y="80" className="label" textAnchor="middle">Master Suite</text>
              <text x="190" y="80" className="label" textAnchor="middle">Guest Wing</text>
              
              {/* Doors */}
              <path d="M 240 180 Q 210 180 210 210" className="door" /> {/* Living Room Door */}
              <path d="M 140 110 Q 110 110 110 140" className="door" /> {/* Suite Door */}
            </>
          ) : (
            <>
              {/* Ruko Rooms Partitioning */}
              <line x1="40" y1="200" x2="360" y2="200" className="wall" /> {/* Back Section */}
              <line x1="240" y1="200" x2="240" y2="260" className="wall" /> {/* Restroom/Loading */}
              
              {/* Showroom Area */}
              <rect x="70" y="70" width="260" height="100" className="wall" strokeDasharray="8 4" fill="rgba(201, 169, 97, 0.05)" />
              
              {/* Labels */}
              <text x="200" y="125" className="label" textAnchor="middle" fontSize="12">Main Showroom / Commercial Area</text>
              <text x="140" y="235" className="label" textAnchor="middle">Executive Office</text>
              <text x="300" y="235" className="label" textAnchor="middle">Service & Utility</text>
              
              {/* Doors */}
              <path d="M 200 40 Q 200 70 170 70" className="door" /> {/* Front Entrance */}
              <path d="M 240 220 Q 210 220 210 250" className="door" /> {/* Back Door */}
            </>
          )}

          {/* Dimension Markers */}
          <text x="200" y="35" className="dimension" textAnchor="middle">{dimensions.width}M WIDTH</text>
          <text x="35" y="150" className="dimension" textAnchor="middle" transform="rotate(-90, 35, 150)">{dimensions.length}M DEPTH</text>
          
          {/* Legend/Stamp */}
          <g transform="translate(260, 270)">
            <rect x="0" y="0" width="100" height="25" fill="#C9A961" />
            <text x="50" y="10" className="label" fill="#001D3D" textAnchor="middle" fontSize="6">OFFICIAL CETAK BIRU</text>
            <text x="50" y="20" className="label" fill="#001D3D" textAnchor="middle" fontSize="5">{propertyName.substring(0, 20)}</text>
          </g>
        </svg>

        {/* Decorative Stamps */}
        <div className="absolute top-6 right-6 border border-white/20 px-2 py-1 rounded rotate-12">
          <span className="text-[6px] font-mono text-white/40 uppercase tracking-widest">Ver 2.1.A - Certified</span>
        </div>
      </motion.div>

      {/* Blueprint Header */}
      <div className="absolute top-4 left-6">
        <h5 className="text-[10px] font-black text-white/90 tracking-[0.3em] uppercase mb-1">Architectural Layout Schema</h5>
        <div className="flex items-center gap-2">
          <span className="h-0.5 w-8 bg-luxury-gold" />
          <span className="text-[8px] font-mono text-luxury-gold tracking-widest uppercase">{type} - Scale 1:100</span>
        </div>
      </div>
    </div>
  );
}
