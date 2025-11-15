"use client";

import { useEffect, useRef } from "react";

interface TrackingMapProps {
  lat: number;
  lng: number;
}

export default function TrackingMap({ lat, lng }: TrackingMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let map: any;

    import("leaflet").then((L) => {
      if (!mapRef.current) return;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
      });

      map = L.map(mapRef.current).setView([lat, lng], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      L.marker([lat, lng]).addTo(map);
    });

    return () => {
      if (map) map.remove();
    };
  }, [lat, lng]);

  return (
    <div
      ref={mapRef}
      style={{ height: "400px", width: "100%", borderRadius: "8px" }}
    />
  );
}
