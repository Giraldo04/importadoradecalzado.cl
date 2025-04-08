// src/components/ChileAddressForm.js
import React, { useState, useEffect } from 'react';
import { REGIONS, CHILE_REGIONS } from '../data/chileAddressData';

const ChileAddressForm = ({ address, setAddress }) => {
  const [selectedRegion, setSelectedRegion] = useState(address.region || '');
  const [availableCommunes, setAvailableCommunes] = useState([]);
  const [selectedCommune, setSelectedCommune] = useState(address.commune || '');

  useEffect(() => {
    if (selectedRegion && CHILE_REGIONS[selectedRegion]) {
      setAvailableCommunes(CHILE_REGIONS[selectedRegion]);
      if (!CHILE_REGIONS[selectedRegion].includes(selectedCommune)) {
        setSelectedCommune('');
      }
    } else {
      setAvailableCommunes([]);
      setSelectedCommune('');
    }
  }, [selectedRegion, selectedCommune]);

  useEffect(() => {
    setAddress((prev) => ({
      ...prev,
      region: selectedRegion,
      commune: selectedCommune,
    }));
  }, [selectedRegion, selectedCommune, setAddress]);

  return (
    <div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Región:</label>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="w-full border rounded p-2"
          required
        >
          <option value="">Elige una región</option>
          {REGIONS.map((region, index) => (
            <option key={index} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Comuna:</label>
        <select
          value={selectedCommune}
          onChange={(e) => setSelectedCommune(e.target.value)}
          className="w-full border rounded p-2"
          required
          disabled={availableCommunes.length === 0}
        >
          <option value="">Elige una comuna</option>
          {availableCommunes.map((comuna, index) => (
            <option key={index} value={comuna}>
              {comuna}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ChileAddressForm;
