import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MapProps {
  pocLocation?: {
    name: string;
    address: string;
    coordinates: [number, number];
  };
  userLocation?: [number, number];
}

const Map: React.FC<MapProps> = ({ pocLocation, userLocation }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isTokenSet, setIsTokenSet] = useState(false);

  // Default POC location in Kochi, Kerala
  const defaultPOC = {
    name: "Kochi Medical Center POC",
    address: "Marine Drive, Ernakulam, Kochi",
    coordinates: [76.2673, 9.9312] as [number, number]
  };

  // Default user location in Kochi
  const defaultUserLocation: [number, number] = [76.2600, 9.9250];

  const currentPOC = pocLocation || defaultPOC;
  const currentUserLocation = userLocation || defaultUserLocation;

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken.trim()) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: currentPOC.coordinates,
        zoom: 13,
        pitch: 45,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      map.current.on('load', () => {
        // Add user location marker
        new mapboxgl.Marker({ color: '#3b82f6' })
          .setLngLat(currentUserLocation)
          .setPopup(new mapboxgl.Popup().setHTML('<p><strong>Your Location</strong></p>'))
          .addTo(map.current!);

        // Add POC location marker
        new mapboxgl.Marker({ color: '#16a34a' })
          .setLngLat(currentPOC.coordinates)
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div>
              <strong>${currentPOC.name}</strong><br>
              <small>${currentPOC.address}</small>
            </div>
          `))
          .addTo(map.current!);

        // Add route between user and POC
        map.current!.addSource('route', {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': {
              'type': 'LineString',
              'coordinates': [currentUserLocation, currentPOC.coordinates]
            }
          }
        });

        map.current!.addLayer({
          'id': 'route',
          'type': 'line',
          'source': 'route',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': 'hsl(var(--medical-green))',
            'line-width': 4,
            'line-opacity': 0.8
          }
        });

        // Fit map to show both points
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(currentUserLocation);
        bounds.extend(currentPOC.coordinates);
        map.current!.fitBounds(bounds, { padding: 50 });
      });

      setIsTokenSet(true);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (!isTokenSet) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Map Configuration Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
            <Input
              id="mapbox-token"
              type="text"
              placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIi..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Get your token from{' '}
              <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                mapbox.com
              </a>
            </p>
          </div>
          <Button onClick={initializeMap} className="w-full" disabled={!mapboxToken.trim()}>
            Load Map
          </Button>
          <div className="text-xs text-muted-foreground">
            💡 For persistent configuration, connect your project to Supabase and store the token in Edge Function Secrets
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm border rounded-lg p-3 shadow-lg max-w-xs">
        <h4 className="font-semibold text-sm">{currentPOC.name}</h4>
        <p className="text-xs text-muted-foreground mt-1">{currentPOC.address}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 bg-medical-green rounded-full"></div>
          <span className="text-xs">POC Center</span>
        </div>
      </div>
    </div>
  );
};

export default Map;