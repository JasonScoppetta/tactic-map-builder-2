import {MapEditorOptions, MapEditorState} from "@/types";
import React from "react";

export const MapEditorContext = React.createContext<MapEditorState | null>(
    null,
);

export interface MapEditorProviderProps
    extends React.PropsWithChildren<MapEditorOptions> {
}

export const useMapEditor = () => {
    return React.useContext(MapEditorContext);
};
