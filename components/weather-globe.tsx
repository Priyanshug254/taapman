"use client"

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Environment, Cloud } from '@react-three/drei'
import { Card } from "@/components/ui/card"
import { Globe, MousePointerClick } from "lucide-react"
import { WeatherData } from "@/types/weather"
import * as THREE from 'three'

interface WeatherGlobeProps {
    weather: WeatherData
}

function Earth({ weather }: { weather: WeatherData }) {
    const earthRef = useRef<THREE.Mesh>(null)
    const cloudsRef = useRef<THREE.Group>(null)

    // Different colors based on weather condition
    const earthColor = useMemo(() => {
        const cond = weather.condition.toLowerCase()
        if (cond.includes('snow')) return '#e2e8f0' // Icy white
        if (cond.includes('rain')) return '#3b82f6' // Deep blue
        if (cond.includes('sunny') || cond.includes('clear')) return '#10b981' // Green/Blue
        return '#64748b' // Default slate
    }, [weather.condition])

    useFrame((state, delta) => {
        if (earthRef.current) {
            earthRef.current.rotation.y += delta * 0.1
        }
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += delta * 0.15
        }
    })

    return (
        <group>
            {/* Main Earth Sphere */}
            <mesh ref={earthRef} scale={2}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    color={earthColor}
                    roughness={0.7}
                    metalness={0.1}
                />
            </mesh>

            {/* Atmosphere/Glow */}
            <mesh scale={2.2}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    color={earthColor}
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Clouds Layer */}
            <group ref={cloudsRef}>
                <Cloud opacity={0.5} speed={0.4} width={10} depth={1.5} segments={20} position={[0, 0, 0]} />
            </group>
        </group>
    )
}

export function WeatherGlobe({ weather }: WeatherGlobeProps) {
    return (
        <Card className="p-0 overflow-hidden backdrop-blur-md bg-slate-900/80 border-white/10 shadow-lg lg:col-span-2 relative h-[400px]">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <Globe className="h-5 w-5 text-sky-400" />
                <h3 className="text-xl font-bold text-white shadow-sm">Global Perspective</h3>
            </div>

            <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 text-xs text-white/50 bg-black/30 px-3 py-1.5 rounded-full">
                <MousePointerClick className="h-3 w-3" />
                <span>Interactive 3D View</span>
            </div>

            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Earth weather={weather} />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                <Environment preset="city" />
            </Canvas>
        </Card>
    )
}
