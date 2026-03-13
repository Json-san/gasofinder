import { useState, useEffect } from 'react';
import { Station } from '@/types';
import { eventBus } from '@/lib/event-bus';

// Mock data specifically for Medellín (high fidelity)
const generateMockStations = (centerLat: number, centerLng: number): Station[] => {
    // Si estamos cerca de Medellín, usamos datos reales conocidos
    const isMedellin = Math.abs(centerLat - 6.25) < 0.5;

    if (isMedellin) {
        return [
            {
                id: 'station-1',
                nombre_estacion: "EDS Punto Cero (Texaco)",
                lat: 6.2731,
                lng: -75.5756,
                precio_gasolina: 15200,
            },
            {
                id: 'station-2',
                nombre_estacion: "Primax - Castilla",
                lat: 6.2747,
                lng: -75.5745,
                precio_gasolina: 15410,
            },
            {
                id: 'station-3',
                nombre_estacion: "Terpel - Cra 65",
                lat: 6.2768,
                lng: -75.5729,
                precio_gasolina: 15450,
            },
            {
                id: 'station-4',
                nombre_estacion: "Texaco Prado",
                lat: 6.2564,
                lng: -75.5670,
                precio_gasolina: 15390,
            },
            {
                id: 'station-5',
                nombre_estacion: "Mobil - Autopista Sur",
                lat: 6.2315,
                lng: -75.5840,
                precio_gasolina: 15420,
            }
        ];
    }

    // Fallback para otras ubicaciones
    const basePrice = 15400;
    return Array.from({ length: 10 }, (_, i) => ({
        id: `station-fallback-${i}`,
        lat: centerLat + (Math.random() - 0.5) * 0.05,
        lng: centerLng + (Math.random() - 0.5) * 0.05,
        precio_gasolina: Number((basePrice + (Math.random() * 500)).toFixed(0)),
        nombre_estacion: `Estación Medellín ${i + 1}`,
    }));
};

interface UseStationsResult {
    stations: Station[];
    cheapestStation: Station | null;
    loading: boolean;
}

export function useStations(userLat: number | undefined, userLng: number | undefined): UseStationsResult {
    const [stations, setStations] = useState<Station[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Solo fetchear si tenemos ubicación
        if (!userLat || !userLng) {
            setLoading(false);
            return;
        }

        setLoading(true);

        // Simular un fetch delay de 1 segundo
        const timer = setTimeout(() => {
            const data = generateMockStations(userLat, userLng);

            // Ordenar de más barata a más cara
            const sortedData = data.sort((a, b) => a.precio_gasolina - b.precio_gasolina);

            setStations(sortedData);
            setLoading(false);

            if (sortedData.length > 0) {
                // Emitir un evento cuando se encuentra la mas barata
                eventBus.emit('CHEAPEST_STATION_FOUND', sortedData[0].id);
            }

        }, 1000);

        return () => clearTimeout(timer);
    }, [userLat, userLng]);

    return {
        stations,
        cheapestStation: stations.length > 0 ? stations[0] : null,
        loading
    };
}
