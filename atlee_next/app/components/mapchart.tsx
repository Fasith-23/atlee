'use client';

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { GeoJsonObject } from 'geojson';
import L, { Layer, LeafletMouseEvent } from 'leaflet';
import chroma from 'chroma-js'; // For gradient generation

const geoJsonUrl =
  'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json';

// Dummy ESG data for demonstration
const esgData: { [key: string]: number } = {
  china: 1, // Lowercase keys
  canada: 1.5,
  germany: 3.8,
  france: 4,
  // Add more countries here
};

const MapChart: React.FC = () => {
  const [geoData, setGeoData] = useState<GeoJsonObject | null>(null);
  const [tooltipContent, setTooltipContent] = useState<string | null>(null);

  // Fetch GeoJSON data
  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const response = await fetch(geoJsonUrl);
        const data = await response.json();
        setGeoData(data);
      } catch (error) {
        console.error('Failed to load GeoJSON data:', error);
      }
    };

    fetchGeoJson();
  }, []);

  // Gradient scale using chroma.js
  const colorScale = chroma.scale(['#FFFFFF','#FF9800', '#E65100']).domain([0, 4]); // Adjusted domain

  // Normalize country names for comparison
  const normalizeName = (name: string | undefined) => name?.toLowerCase() || '';

  // Function to style the countries based on ESG score
  const getCountryStyle = (countryName?: string) => {
    const esgScore = esgData[normalizeName(countryName)] || 0; // Default to 0 if no data
    return {
      fillColor: colorScale(esgScore).hex(), // Use gradient color
      color: '#333',
      weight: 1,
      fillOpacity: 0.7,
    };
  };

  // Function to handle hover events on countries
  const onEachFeature = (
    feature: GeoJsonObject & { properties: { name?: string } },
    layer: Layer
  ) => {
    layer.on({
      mouseover: (e: LeafletMouseEvent) => {
        const targetLayer = e.target as L.Path; // Cast to L.Path to access setStyle
        targetLayer.setStyle({
          fillOpacity: 1, // Highlight on hover
          weight: 2,
        });
        setTooltipContent(
          `${feature.properties.name || 'Unknown'} - ESG Score: ${
            esgData[normalizeName(feature.properties.name)] || 'N/A'
          }`
        ); // Display country name and ESG score
      },
      mouseout: (e: LeafletMouseEvent) => {
        const targetLayer = e.target as L.Path;
        targetLayer.setStyle(getCountryStyle(feature.properties.name)); // Reset style
        setTooltipContent(null); // Hide tooltip
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 w-full">
      <MapContainer
        center={[30, 0]}
        zoom={1.7}
        style={{ height: '500px', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {geoData && (
          <GeoJSON
            data={geoData}
            style={(feature) =>
              getCountryStyle((feature?.properties as { name: string })?.name ?? '')
            }
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      {tooltipContent && (
        <div className="absolute p-4 bg-white border rounded shadow-md z-10">
          <strong>{tooltipContent}</strong>
        </div>
      )}
    </div>
  );
};

export default MapChart;
