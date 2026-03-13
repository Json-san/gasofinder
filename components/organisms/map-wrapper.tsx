'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/atoms/skeleton';
import { MapPin } from 'lucide-react';

// Carga dinámica exclusiva para el cliente (deshabilita SSR)
const MapViewer = dynamic(() => import('@/components/organisms/map-viewer'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden rounded-2xl md:rounded-l-none">
            <Skeleton className="absolute inset-0 z-0 h-full w-full rounded-none" />
            <div className="z-10 flex flex-col items-center bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl">
                <MapPin className="h-8 w-8 text-blue-600 mb-4 animate-bounce" />
                <h2 className="text-xl font-bold text-slate-800">Cargando mapa...</h2>
            </div>
        </div>
    )
});

export default function MapWrapper() {
    return <MapViewer />;
}
