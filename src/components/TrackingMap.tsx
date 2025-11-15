'use client'

import { useEffect, useRef } from 'react'

interface TrackingMapProps {
  currentPosition?: { lat: number; lng: number }
  destinationPosition?: { lat: number; lng: number }
  status?: string
}

const TrackingMap: React.FC<TrackingMapProps> = ({ 
  currentPosition = { lat: -6.2088, lng: 106.8456 },
  destinationPosition = { lat: -6.2297, lng: 106.8295 },
  status = 'shipped'
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // ⬅️ Dynamic import agar tidak dieksekusi di server
    const loadLeaflet = async () => {
      const L = (await import('leaflet')).default

      // FIX ikon leaflet hilang di Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      })

      const map = L.map(mapRef.current).setView(currentPosition, 12)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      const currentLocationIcon = L.divIcon({ ... })
      const destinationIcon = L.divIcon({ ... })

      if (status === 'shipped' || status === 'delivered') {
        L.marker([currentPosition.lat, currentPosition.lng], { icon: currentLocationIcon })
          .addTo(map)
      }

      L.marker([destinationPosition.lat, destinationPosition.lng], { icon: destinationIcon })
        .addTo(map)

      if (status === 'shipped') {
        L.polyline(
          [
            [currentPosition.lat, currentPosition.lng],
            [destinationPosition.lat, destinationPosition.lng]
          ],
          { color: '#242a2e', weight: 3, opacity: 0.7, dashArray: '10,10' }
        ).addTo(map)
      }

      mapInstanceRef.current = map
    }

    loadLeaflet()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [currentPosition, destinationPosition, status])

  return (
    <div 
      ref={mapRef} 
      style={{ 
        height: '400px', 
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden'
      }} 
    />
  )
}

export default TrackingMap
