import { Station } from '@/types';
import { calculateDistance } from '@/lib/utils';
import { eventBus } from '@/lib/event-bus';

interface StationCardProps {
    station: Station;
    isCheapest: boolean;
    isActive: boolean;
    userDistanceStr?: string;
    onClick: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export function StationCard({
    station,
    isCheapest,
    isActive,
    userDistanceStr,
    onClick,
    onMouseEnter,
    onMouseLeave
}: StationCardProps) {
    if (isCheapest) {
        return (
            <div
                className={`p-4 rounded-xl border-2 border-primary bg-primary/5 relative group cursor-pointer transition-all ${isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark' : ''}`}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <div className="absolute -top-3 right-4 bg-primary text-background-dark text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">workspace_premium</span>
                    BEST PRICE
                </div>
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{station.nombre_estacion}</h3>
                        <p className="text-xs text-slate-500 dark:text-primary/70">{station.direccion || 'Dirección no disponible'}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-black text-primary">${station.precio_gasolina.toFixed(2)}</span>
                        <span className="text-xs font-medium block opacity-70">per liter</span>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">near_me</span>
                            {userDistanceStr || '--'}
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-yellow-500">star</span>
                            4.8
                        </div>
                    </div>
                    <button className="flex items-center gap-2 bg-primary text-background-dark px-4 py-1.5 rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}>
                        <span className="material-symbols-outlined text-sm">navigation</span>
                        Go
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`p-4 rounded-xl border border-slate-200 dark:border-primary/10 bg-slate-50 dark:bg-primary/5 hover:border-primary/40 transition-all cursor-pointer ${isActive ? 'ring-2 ring-slate-400 dark:ring-slate-500 border-transparent shadow-md bg-white' : ''}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-bold text-lg">{station.nombre_estacion}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{station.direccion || 'Dirección no disponible'}</p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-black">${station.precio_gasolina.toFixed(2)}</span>
                    <span className="text-xs font-medium block opacity-70">per liter</span>
                </div>
            </div>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">near_me</span>
                        {userDistanceStr || '--'}
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-yellow-500">star</span>
                        4.2
                    </div>
                </div>
                <button className="flex items-center gap-2 bg-slate-200 dark:bg-primary/20 text-slate-900 dark:text-slate-100 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-slate-300 dark:hover:bg-primary/30 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick();
                    }}>
                    <span className="material-symbols-outlined text-sm">navigation</span>
                    Go
                </button>
            </div>
        </div>
    );
}
