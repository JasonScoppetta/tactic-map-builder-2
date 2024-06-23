import React from "react";
import {MapContext, MapProviderProps} from "./context";

export const MapProvider: React.FC<MapProviderProps> = ({
  children,
  value,
}) => {
  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

