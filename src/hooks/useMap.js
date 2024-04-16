import { useEffect, useState } from 'react';

const { Tmapv3 } = window;


export const useMap = (mapRef) => {
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    if (mapRef.current?.firstChild || mapInstance) {
      return;
    }

    const map = new Tmapv3.Map('map', {
      zoom: DEFAULT_ZOOM_LEVEL,
      zoomControl: false,
      center: new Tmapv3.LatLng(INITIAL_LATITUDE, INITIAL_LONGITUDE),
    });

    map.setZoomLimit(MIN_ZOOM_LEVEL, MAX_ZOOM_LEVEL);
    setMapInstance(map);
  }, [mapRef, mapInstance]);

};