"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon in Leaflet with Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap()
    useEffect(() => {
        map.setView(center)
    }, [center, map])
    return null
}

interface MapClientProps {
    coords: [number, number]
    city: string
    temp: number
}

// Default export is critical for lazy load
export default function MapClient({ coords, city, temp }: MapClientProps) {
    return (
        <MapContainer
            center={coords}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
        >
            <ChangeView center={coords} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={coords}>
                <Popup>
                    <div className="text-center">
                        <p className="font-bold">{city}</p>
                        <p>{temp}°C</p>
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
    )
}
