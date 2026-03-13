'use client';

import { useEffect, useState, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { eventBus } from '@/lib/event-bus';
import { useStations } from '@/hooks/use-stations';
import { useGeolocation } from '@/hooks/use-geolocation';
import { Skeleton } from '@/components/atoms/skeleton';

// Diseño de Marcador Personalizado
const createCustomIcon = (price: number, isCheapest: boolean, isActive: boolean) => {
    if (isCheapest) {
        return new L.DivIcon({
            className: 'bg-transparent',
            html: `
            <div class="relative group cursor-pointer transition-transform duration-300 ${isActive ? 'scale-125 z-[9999]' : 'scale-110 z-[1000]'}">
                <div class="bg-primary text-background-dark font-black px-3 py-1 rounded-full shadow-2xl border-2 border-background-dark">
                    $${price.toFixed(2)}
                </div>
                <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                    <div class="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-primary shadow-xl"></div>
                </div>
                <div class="absolute inset-0 rounded-full bg-primary animate-ping opacity-30 -z-10"></div>
            </div>`,
            iconSize: [60, 40],
            iconAnchor: [30, 40],
            popupAnchor: [0, -40]
        });
    }

    return new L.DivIcon({
        className: 'bg-transparent',
        html: `
        <div class="relative group cursor-pointer transition-transform duration-300 ${isActive ? 'scale-125 z-[9000]' : 'scale-100 z-[1]'}">
            <div class="bg-sky-500 text-white font-bold px-2 py-0.5 rounded-full shadow-lg border border-white/50 whitespace-nowrap">
                $${price.toFixed(2)}
            </div>
            <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-sky-500"></div>
            </div>
        </div>`,
        iconSize: [50, 30],
        iconAnchor: [25, 30],
        popupAnchor: [0, -30]
    });
};

// Componente helper para mover la cámara cuando la ubicación o bus de eventos lo dicte
const MapController = ({
    userLocation,
    focusedStationId,
    stations
}: {
    userLocation: [number, number] | null;
    focusedStationId: string | null;
    stations: any[];
}) => {
    const map = useMap();

    useEffect(() => {
        if (focusedStationId) {
            const target = stations.find(s => s.id === focusedStationId);
            if (target) {
                map.flyTo([target.lat, target.lng], 16, { animate: true, duration: 1 });
            }
        } else if (userLocation) {
            map.flyTo(userLocation, 14, { animate: true, duration: 1.5 });
        }
    }, [userLocation, focusedStationId, map, stations]);

    useEffect(() => {
        const handleReset = () => {
            map.flyTo([6.2518, -75.5636], 14, { animate: true, duration: 2 });
        };
        eventBus.on('RESET_VIEW', handleReset);
        return () => {
            eventBus.off('RESET_VIEW', handleReset);
        };
    }, [map]);

    return null;
};

// Componente para manejar los botones de control de zoom a traves del API de useMap()
const ZoomControls = () => {
    const map = useMap();

    return (
        <div className="absolute bottom-8 right-8 flex flex-col gap-2 z-[1000]">
            <button
                onClick={() => map.zoomIn()}
                className="bg-white dark:bg-background-dark text-slate-900 dark:text-slate-100 p-2.5 rounded-lg shadow-xl border border-slate-200 dark:border-primary/20 hover:bg-slate-50 dark:hover:bg-primary/10 transition-colors"
            >
                <span className="material-symbols-outlined">add</span>
            </button>
            <button
                onClick={() => map.zoomOut()}
                className="bg-white dark:bg-background-dark text-slate-900 dark:text-slate-100 p-2.5 rounded-lg shadow-xl border border-slate-200 dark:border-primary/20 hover:bg-slate-50 dark:hover:bg-primary/10 transition-colors"
            >
                <span className="material-symbols-outlined">remove</span>
            </button>
            <div className="h-2"></div>
            <button className="bg-white dark:bg-background-dark text-slate-900 dark:text-slate-100 p-2.5 rounded-lg shadow-xl border border-slate-200 dark:border-primary/20 hover:bg-slate-50 dark:hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined">layers</span>
            </button>
        </div>
    );
};

function MapViewerComponent() {
    const { location, loading: geoLoading } = useGeolocation();
    const { stations, cheapestStation, loading: stationsLoading } = useStations(location?.lat || 6.2518, location?.lng || -75.5636);

    const [activeStationId, setActiveStationId] = useState<string | null>(null);

    useEffect(() => {
        // Suscribirse a los eventos originados en StationList
        const handleFocus = (id: string) => {
            setActiveStationId(id);
        };
        eventBus.on('STATION_LIST_CLICKED', handleFocus);

        return () => {
            eventBus.off('STATION_LIST_CLICKED', handleFocus);
        };
    }, []);

    if (geoLoading) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-900 relative overflow-hidden">
                <Skeleton className="absolute inset-0 z-0 h-full w-full rounded-none" />
                <div className="z-10 flex flex-col items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-6 rounded-2xl shadow-xl">
                    <span className="material-symbols-outlined text-4xl text-primary animate-bounce mb-4">my_location</span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ubicando...</h2>
                    <p className="text-slate-500 text-sm mt-2 text-center max-w-xs">Buscando tu posición para mostrar las gasolineras locales.</p>
                </div>
            </div>
        );
    }

    const defaultCenter: [number, number] = location ? [location.lat, location.lng] : [6.2518, -75.5636]; // Default: Medellín si falla

    return (
        <div className="h-full w-full relative group shadow-inner">
            {/* Floating Search Result Summary */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-background-dark/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl border border-slate-200 dark:border-primary/20 flex items-center gap-6 z-[1000] min-w-max">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 uppercase">Current Filter</span>
                    <span className="text-sm font-semibold flex items-center gap-1 text-slate-900 dark:text-white">
                        <span className="material-symbols-outlined text-sm text-primary">filter_list</span>
                        Diesel
                    </span>
                </div>
                <div className="w-px h-6 bg-slate-300 dark:bg-primary/20"></div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 uppercase">Avg. Price</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">$15,400/gl</span>
                </div>
                <div className="w-px h-6 bg-slate-300 dark:bg-primary/20 hidden md:block"></div>
                <button 
                  onClick={() => eventBus.emit('RESET_VIEW')}
                  className="text-xs font-black text-primary hover:underline hidden md:block"
                >
                  RESET VIEW
                </button>
            </div>

            <MapContainer
                center={defaultCenter}
                zoom={14}
                className="h-full w-full z-0 font-display"
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                <MapController
                    userLocation={location ? [location.lat, location.lng] : null}
                    focusedStationId={activeStationId}
                    stations={stations}
                />

                <ZoomControls />

                {/* User Location Marker */}
                {location && (
                    <Marker
                        position={[location.lat, location.lng]}
                        icon={new L.DivIcon({
                            className: 'bg-transparent',
                            html: `<div class="relative flex items-center justify-center h-8 w-8">
                                <div class="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg z-10"></div>
                                <div class="absolute w-12 h-12 bg-primary/30 rounded-full animate-ping border border-primary/20"></div>
                            </div>`,
                            iconSize: [32, 32],
                            iconAnchor: [16, 16]
                        })}
                    />
                )}

                {/* Stations Markers */}
                {stations.map((station) => {
                    const isCheapest = cheapestStation?.id === station.id;
                    const isActive = activeStationId === station.id;

                    return (
                        <Marker
                            key={station.id}
                            position={[station.lat, station.lng]}
                            icon={createCustomIcon(station.precio_gasolina, isCheapest, isActive)}
                            eventHandlers={{
                                click: () => {
                                    eventBus.emit('MAP_MARKER_CLICKED', station.id);
                                    setActiveStationId(station.id);
                                }
                            }}
                        >
                            <Popup closeButton={false} className="custom-popup" offset={[0, -20]}>
                                <div className="flex flex-col gap-0 p-1 min-w-[160px]">
                                    {isCheapest && <p className="text-[10px] font-bold text-primary mb-1 tracking-wider uppercase">Best Price</p>}
                                    <span className="text-sm font-bold text-slate-900">{station.nombre_estacion}</span>
                                    {isCheapest && <p className="text-[10px] text-slate-500 opacity-80 mt-1">Cheapest option nearby</p>}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* Floating Loading Indicator for Stations */}
            {stationsLoading && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-background-dark/90 px-4 py-2 rounded-full shadow-lg border border-slate-200 dark:border-primary/20 flex items-center gap-2 z-[1000] animate-bounce">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Buscando gasolineras...</span>
                </div>
            )}
        </div>
    );
}

export default memo(MapViewerComponent);
