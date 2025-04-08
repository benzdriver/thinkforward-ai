import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { ProvinceMap } from '../common';
import { CanadianProvince } from '../../../types/canada';

interface ProvinceSelectorProps {
  selectedProvince?: CanadianProvince;
  onProvinceSelect: (province: CanadianProvince) => void;
  className?: string;
}

export const ProvinceSelector: React.FC<ProvinceSelectorProps> = ({
  selectedProvince,
  onProvinceSelect,
  className = ''
}) => {
  const { t } = useTranslation(['provincial-programs', 'common']);
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');
  
  const provinces: CanadianProvince[] = [
    'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'
  ];
  
  const provinceNames: Record<CanadianProvince, string> = {
    'AB': t('provinces.ab', { ns: 'provincial-programs' }),
    'BC': t('provinces.bc', { ns: 'provincial-programs' }),
    'MB': t('provinces.mb', { ns: 'provincial-programs' }),
    'NB': t('provinces.nb', { ns: 'provincial-programs' }),
    'NL': t('provinces.nl', { ns: 'provincial-programs' }),
    'NS': t('provinces.ns', { ns: 'provincial-programs' }),
    'NT': t('provinces.nt', { ns: 'provincial-programs' }),
    'NU': t('provinces.nu', { ns: 'provincial-programs' }),
    'ON': t('provinces.on', { ns: 'provincial-programs' }),
    'PE': t('provinces.pe', { ns: 'provincial-programs' }),
    'QC': t('provinces.qc', { ns: 'provincial-programs' }),
    'SK': t('provinces.sk', { ns: 'provincial-programs' }),
    'YT': t('provinces.yt', { ns: 'provincial-programs' })
  };
  
  return (
    <div className={`province-selector ${className}`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('provinceSelector.title', { ns: 'provincial-programs' })}</h2>
      <p className="text-gray-600 mb-6">{t('provinceSelector.description', { ns: 'provincial-programs' })}</p>
      
      <div className="tab-selector mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === 'map'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('map')}
          >
            {t('provinceSelector.mapView', { ns: 'provincial-programs' })}
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === 'list'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('list')}
          >
            {t('provinceSelector.listView', { ns: 'provincial-programs' })}
          </button>
        </div>
      </div>
      
      {activeTab === 'map' ? (
        <div className="map-view">
          <ProvinceMap 
            selectedProvince={selectedProvince} 
            onProvinceSelect={onProvinceSelect} 
          />
          <p className="text-sm text-gray-500 mt-2">
            {t('provinceSelector.mapInstructions', { ns: 'provincial-programs' })}
          </p>
        </div>
      ) : (
        <div className="list-view grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {provinces.map(province => (
            <button
              key={province}
              className={`p-4 rounded border text-left transition-colors ${
                selectedProvince === province
                  ? 'bg-primary-50 border-primary text-primary'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => onProvinceSelect(province)}
            >
              <div className="font-medium">{provinceNames[province]}</div>
              <div className="text-sm text-gray-500">{province}</div>
            </button>
          ))}
        </div>
      )}
      
      {selectedProvince && (
        <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
          <h3 className="font-medium text-gray-800">
            {t('provinceSelector.selectedProvince', { ns: 'provincial-programs' })}: {provinceNames[selectedProvince]} ({selectedProvince})
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {t('provinceSelector.clickForDetails', { ns: 'provincial-programs' })}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProvinceSelector; 