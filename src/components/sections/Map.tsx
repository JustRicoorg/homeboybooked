
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-16.675833, 13.438333], // Serrekunda coordinates
      zoom: 15
    });

    const marker = new mapboxgl.Marker()
      .setLngLat([-16.675833, 13.438333])
      .addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      {!mapboxToken && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center p-4">
          <input
            type="text"
            placeholder="Enter your Mapbox public token"
            className="w-full max-w-md px-4 py-2 border rounded"
            onChange={(e) => setMapboxToken(e.target.value)}
          />
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;
