import React, { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

export const PRESET_LOCATIONS = [
  { name: 'Bandra West, Mumbai', coords: [72.8295, 19.0596] },
  { name: 'Dadar West, Mumbai', coords: [72.8427, 19.0178] },
  { name: 'Andheri East, Mumbai', coords: [72.8697, 19.1136] },
  { name: 'Bhiwandi, Thane', coords: [73.0632, 19.2967] },
  { name: 'Pune Central', coords: [73.8567, 18.5204] }
];

export const LocationProvider = ({ children }) => {
  // Default to Bandra West, Mumbai coordinates [lng, lat]
  const [coords, setCoords] = useState([72.8295, 19.0596]);
  const [cityName, setCityName] = useState('Bandra West, Mumbai');
  const [distanceRadius, setDistanceRadius] = useState(10); // in kilometers
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Request browser geolocation
  const detectDeviceLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { longitude, latitude } = pos.coords;
        setCoords([longitude, latitude]);
        setCityName('Current Location (GPS)');
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation denied or timed out, using Mumbai fallback:', err.message);
        setLocationError('Using default city coordinates');
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const selectPresetLocation = (preset) => {
    setCoords(preset.coords);
    setCityName(preset.name);
  };

  return (
    <LocationContext.Provider
      value={{
        coords,
        cityName,
        distanceRadius,
        setDistanceRadius,
        isLocating,
        locationError,
        detectDeviceLocation,
        selectPresetLocation,
        presetLocations: PRESET_LOCATIONS
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
