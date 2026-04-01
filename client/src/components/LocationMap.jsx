import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25,41],
  iconAnchor: [12,41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const ChangeMapView = ({ coords }) => {
  const map = useMap();

  useEffect(() => {
    if(coords){
      map.setView([coords.lat, coords.lng], 13);
    }
  }, [coords]);

  return null;
};

const LocationMarker = ({ setLocation }) => {

  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLocation(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const LocationMap = ({ location, setLocation }) => {

  return (
    <MapContainer
      center={[22.5726, 88.3639]}
      zoom={12}
      style={{ height: "250px", width: "100%" }}
    >

      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ChangeMapView coords={location} />

      <LocationMarker setLocation={setLocation} />

    </MapContainer>
  );
};

export default LocationMap;
