'use client';

import { useEffect, useState, useRef } from 'react';
import { StationCard } from '@/components/molecules/station-card';
import { useStations } from '@/hooks/use-stations';
import { useGeolocation } from '@/hooks/use-geolocation';
import { eventBus } from '@/lib/event-bus';
import { Skeleton } from '@/components/atoms/skeleton';
import { MapPin } from 'lucide-react';
import { calculateDistance } from '@/lib/utils';

export default function StationList() {
    const { location, loading: geoLoading, error: geoError } = useGeolocation();
    const { stations, cheapestStation, loading: stationsLoading } = useStations(location?.lat || 6.2518, location?.lng || -75.5636);

    const [activeStationId, setActiveStationId] = useState<string | null>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Suscribirse a los clicks en los marcadores del mapa
        const handleMapClick = (id: string) => {
            setActiveStationId(id);

            // Auto-scroll al elemento en la lista
            const element = document.getElementById(`station-card-${id}`);
            if (element && listRef.current) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };
        eventBus.on('MAP_MARKER_CLICKED', handleMapClick);

        // Enfocar automáticamente la más barata al inicializar
        const handleCheapest = (id: string) => {
            setActiveStationId(id);
        };
        eventBus.on('CHEAPEST_STATION_FOUND', handleCheapest);

        return () => {
            eventBus.off('MAP_MARKER_CLICKED', handleMapClick);
            eventBus.off('CHEAPEST_STATION_FOUND', handleCheapest);
        };
    }, []);

    const handleCardClick = (id: string) => {
        setActiveStationId(id);
        eventBus.emit('STATION_LIST_CLICKED', id);
    };

    const handleMouseEnter = (id: string) => {
        // Hover
    };

    const showLoading = geoLoading && stations.length === 0;

    if (showLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 h-full text-center space-y-4">
                <MapPin className="w-12 h-12 text-primary animate-bounce" />
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Ubicando...</h3>
                <p className="text-sm text-slate-500">Buscando gasolineras en Medellín para ti...</p>
            </div>
        );
    }

    if (stationsLoading) {
        return (
            <div className="flex flex-col gap-4 p-4 h-full">
                <div className="mb-4">
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="p-6 border-b border-primary/10 shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold">Nearby Stations</h2>
                    <span className="bg-primary/20 text-primary text-[10px] uppercase font-black px-2 py-0.5 rounded tracking-wider">Live</span>
                </div>
                <div className="flex gap-2">
                    <button className="flex-1 text-xs py-1.5 rounded bg-primary text-background-dark font-bold">Lowest Price</button>
                    <button className="flex-1 text-xs py-1.5 rounded bg-slate-100 dark:bg-primary/10 text-slate-500 dark:text-slate-300 font-medium border border-slate-200 dark:border-primary/10">Closest</button>
                </div>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {stations.map((station) => {
                    const isCheapest = cheapestStation?.id === station.id;
                    const isActive = activeStationId === station.id;

                    // Calcular distancia si tenemos la ubicacion real
                    let distanceStr = "";
                    if (location) {
                        const dist = calculateDistance(location.lat, location.lng, station.lat, station.lng);
                        distanceStr = dist < 1 ? `${(dist * 1000).toFixed(0)} m` : `${dist.toFixed(1)} km`;
                    }

                    return (
                        <div id={`station-card-${station.id}`} key={station.id}>
                            <StationCard
                                station={station}
                                isCheapest={isCheapest}
                                isActive={isActive}
                                userDistanceStr={distanceStr}
                                onClick={() => handleCardClick(station.id)}
                                onMouseEnter={() => handleMouseEnter(station.id)}
                                onMouseLeave={() => { }}
                            />
                        </div>
                    );
                })}

                {stations.length === 0 && (
                    <div className="text-center py-10 text-slate-400 font-medium">
                        No se encontraron gasolineras en esta zona.
                    </div>
                )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-primary/5 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold shrink-0">
                Last updated just now
            </div>
        </>
    );
}
