import {MapState} from "@/types";
import React from "react";

export const MapContext = React.createContext<MapState | null>(null);

export interface MapProviderProps extends React.PropsWithChildren {
    value: MapState;
}

export const useMap = () => {
    const context = React.useContext(MapContext);
    if (!context) {
        throw new Error("useMap must be used within a MapProvider");
    }
    return context;
};
