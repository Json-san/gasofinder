import { useState, useEffect } from 'react';
import { Location } from '@/types';

interface GeolocationState {
    location: Location | null;
    error: string | null;
    loading: boolean;
}

export function useGeolocation(): GeolocationState {
    const [state, setState] = useState<GeolocationState>({
        location: null,
        error: null,
        loading: true,
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setState({ location: null, error: 'La geolocalización no es soportada por este navegador', loading: false });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setState({
                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                    error: null,
                    loading: false,
                });
            },
            (error) => {
                setState({ location: null, error: error.message, loading: false });
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }, []);

    return state;
}
