import React, { useEffect, useState } from 'react';
import { useGeoLocation } from './hooks/useGeoLocation';

const GeoLocationComponent = ({ onLocationIdentified }) => {
  const { location } = useGeoLocation();

  useEffect(() => {
    if (location) {
      const { latitude, longitude } = location;
      const coordinate = {
        x: longitude,
        y: latitude,
      };
      onLocationIdentified(coordinate);
    }
  }, [location, onLocationIdentified]);

  return null; 
};

export default GeoLocationComponent;
