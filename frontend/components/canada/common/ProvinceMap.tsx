import React, { useState } from 'react';
import { CanadianProvince } from '../../../types/canada';

interface ProvinceMapProps {
  selectedProvince?: CanadianProvince;
  onProvinceSelect?: (province: CanadianProvince) => void;
  className?: string;
}

export const ProvinceMap: React.FC<ProvinceMapProps> = ({
  selectedProvince,
  onProvinceSelect,
  className = ''
}) => {
  const [hoveredProvince, setHoveredProvince] = useState<CanadianProvince | null>(null);
  
  const provinceNames: Record<CanadianProvince, string> = {
    'AB': 'Alberta',
    'BC': 'British Columbia',
    'MB': 'Manitoba',
    'NB': 'New Brunswick',
    'NL': 'Newfoundland and Labrador',
    'NS': 'Nova Scotia',
    'NT': 'Northwest Territories',
    'NU': 'Nunavut',
    'ON': 'Ontario',
    'PE': 'Prince Edward Island',
    'QC': 'Quebec',
    'SK': 'Saskatchewan',
    'YT': 'Yukon'
  };
  
  const handleProvinceClick = (province: CanadianProvince) => {
    if (onProvinceSelect) {
      onProvinceSelect(province);
    }
  };
  
  return (
    <div className={`province-map relative ${className}`}>
      <svg 
        viewBox="0 0 800 600" 
        className="w-full h-auto"
        aria-label="Map of Canadian provinces and territories"
      >
        {/* This is a simplified representation - a real implementation would have detailed SVG paths */}
        <g>
          {/* British Columbia */}
          <path 
            d="M100,200 L150,150 L150,300 L100,350 Z" 
            fill={selectedProvince === 'BC' ? '#0051a5' : hoveredProvince === 'BC' ? '#c8ddf8' : '#e6f0ff'}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={() => setHoveredProvince('BC')}
            onMouseLeave={() => setHoveredProvince(null)}
            onClick={() => handleProvinceClick('BC')}
            aria-label="British Columbia"
            role="button"
          />
          
          {/* Alberta */}
          <path 
            d="M150,150 L200,150 L200,300 L150,300 Z" 
            fill={selectedProvince === 'AB' ? '#0051a5' : hoveredProvince === 'AB' ? '#c8ddf8' : '#e6f0ff'}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={() => setHoveredProvince('AB')}
            onMouseLeave={() => setHoveredProvince(null)}
            onClick={() => handleProvinceClick('AB')}
            aria-label="Alberta"
            role="button"
          />
          
          {/* Saskatchewan */}
          <path 
            d="M200,150 L250,150 L250,300 L200,300 Z" 
            fill={selectedProvince === 'SK' ? '#0051a5' : hoveredProvince === 'SK' ? '#c8ddf8' : '#e6f0ff'}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={() => setHoveredProvince('SK')}
            onMouseLeave={() => setHoveredProvince(null)}
            onClick={() => handleProvinceClick('SK')}
            aria-label="Saskatchewan"
            role="button"
          />
          
          {/* Manitoba */}
          <path 
            d="M250,150 L300,150 L300,300 L250,300 Z" 
            fill={selectedProvince === 'MB' ? '#0051a5' : hoveredProvince === 'MB' ? '#c8ddf8' : '#e6f0ff'}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={() => setHoveredProvince('MB')}
            onMouseLeave={() => setHoveredProvince(null)}
            onClick={() => handleProvinceClick('MB')}
            aria-label="Manitoba"
            role="button"
          />
          
          {/* Ontario */}
          <path 
            d="M300,150 L400,200 L400,350 L300,300 Z" 
            fill={selectedProvince === 'ON' ? '#0051a5' : hoveredProvince === 'ON' ? '#c8ddf8' : '#e6f0ff'}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={() => setHoveredProvince('ON')}
            onMouseLeave={() => setHoveredProvince(null)}
            onClick={() => handleProvinceClick('ON')}
            aria-label="Ontario"
            role="button"
          />
          
          {/* Quebec */}
          <path 
            d="M400,200 L500,150 L550,300 L400,350 Z" 
            fill={selectedProvince === 'QC' ? '#0051a5' : hoveredProvince === 'QC' ? '#c8ddf8' : '#e6f0ff'}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={() => setHoveredProvince('QC')}
            onMouseLeave={() => setHoveredProvince(null)}
            onClick={() => handleProvinceClick('QC')}
            aria-label="Quebec"
            role="button"
          />
          
          {/* New Brunswick */}
          <path 
            d="M550,300 L570,320 L550,350 L530,330 Z" 
            fill={selectedProvince === 'NB' ? '#0051a5' : hoveredProvince === 'NB' ? '#c8ddf8' : '#e6f0ff'}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={() => setHoveredProvince('NB')}
            onMouseLeave={() => setHoveredProvince(null)}
            onClick={() => handleProvinceClick('NB')}
            aria-label="New Brunswick"
            role="button"
          />
          
          {/* Nova Scotia */}
          <path 
            d="M570,320 L600,310 L610,350 L550,350 Z" 
            fill={selectedProvince === 'NS' ? '#0051a5' : hoveredProvince === 'NS' ? '#c8ddf8' : '#e6f0ff'}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={() => setHoveredProvince('NS')}
            onMouseLeave={() => setHoveredProvince(null)}
            onClick={() => handleProvinceClick('NS')}
            aria-label="Nova Scotia"
            role="button"
          />
          
          {/* Prince Edward Island */}
          <path 
            d="M580,300 L590,300 L590,310 L580,310 Z" 
            fill={selectedProvince === 'PE' ? '#0051a5' : hoveredProvince === 'PE' ? '#c8ddf8' : '#e6f0ff'}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={() => setHoveredProvince('PE')}
            onMouseLeave={() => setHoveredProvince(null)}
            onClick={() => handleProvinceClick('PE')}
            aria-label="Prince Edward Island"
            role="button"
          />
          
          {/* Newfoundland and Labrador */}
          <path 
            d="M550,250 L620,220 L650,280 L600,290 Z" 
            fill={selectedProvince === 'NL' ? '#0051a5' : hoveredProvince === 'NL' ? '#c8ddf8' : '#e6f0ff'}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={() => setHoveredProvince('NL')}
            onMouseLeave={() => setHoveredProvince(null)}
            onClick={() => handleProvinceClick('NL')}
            aria-label="Newfoundland and Labrador"
            role="button"
          />
          
          {/* Yukon */}
          <path 
            d="M120,100 L150,100 L150,150 L100,200 Z" 
            fill={selectedProvince === 'YT' ? '#0051a5' : hoveredProvince === 'YT' ? '#c8ddf8' : '#e6f0ff'}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={() => setHoveredProvince('YT')}
            onMouseLeave={() => setHoveredProvince(null)}
            onClick={() => handleProvinceClick('YT')}
            aria-label="Yukon"
            role="button"
          />
          
          {/* Northwest Territories */}
          <path 
            d="M150,100 L250,100 L250,150 L150,150 Z" 
            fill={selectedProvince === 'NT' ? '#0051a5' : hoveredProvince === 'NT' ? '#c8ddf8' : '#e6f0ff'}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={() => setHoveredProvince('NT')}
            onMouseLeave={() => setHoveredProvince(null)}
            onClick={() => handleProvinceClick('NT')}
            aria-label="Northwest Territories"
            role="button"
          />
          
          {/* Nunavut */}
          <path 
            d="M250,100 L400,100 L400,200 L300,150 L250,150 Z" 
            fill={selectedProvince === 'NU' ? '#0051a5' : hoveredProvince === 'NU' ? '#c8ddf8' : '#e6f0ff'}
            stroke="#333"
            strokeWidth="1"
            onMouseEnter={() => setHoveredProvince('NU')}
            onMouseLeave={() => setHoveredProvince(null)}
            onClick={() => handleProvinceClick('NU')}
            aria-label="Nunavut"
            role="button"
          />
        </g>
      </svg>
      
      {hoveredProvince && (
        <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow">
          {provinceNames[hoveredProvince]}
        </div>
      )}
    </div>
  );
};

export default ProvinceMap; 