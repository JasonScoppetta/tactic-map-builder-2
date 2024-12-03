import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { MapValue } from "@/types";
import React from "react";
import { MapProvider } from "./providers/MapProvider/MapProvider";
import { MapCanvas } from "@/components/Map/MapCanvas";

export interface MapProps {
  value?: MapValue;
}

export const Map = React.forwardRef<SVGSVGElement, MapProps>(
  function (props, ref) {
    const { value } = props;
    const editor = useMapEditor();
    const mapValue = editor?.value || value;
    if (!mapValue) return <>No map state provided</>;

    return (
      <MapProvider
        value={{
          ...mapValue,
          gridSize: mapValue.gridSize || 20,
        }}
      >
        <MapCanvas ref={ref} />
      </MapProvider>
    );
  },
);
