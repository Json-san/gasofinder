import mitt from 'mitt';

// Define the events that can be emitted across the application
type Events = {
    STATION_LIST_CLICKED: string; // Payload is the station id
    MAP_MARKER_CLICKED: string;   // Payload is the station id
    CHEAPEST_STATION_FOUND: string; // Payload is the station id
    RESET_VIEW: void;
};

// Create a singleton event bus
export const eventBus = mitt<Events>();
