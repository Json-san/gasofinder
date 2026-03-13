export interface Station {
  id: string;
  lat: number;
  lng: number;
  precio_gasolina: number;
  nombre_estacion: string;
  direccion?: string;
}

export interface Location {
  lat: number;
  lng: number;
}
