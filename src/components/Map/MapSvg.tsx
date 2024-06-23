import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { useMap } from "@/components/Map/providers/MapProvider/context";
import React from "react";
import { SpotGroup } from "../SpotGroup/SpotGroup";
import { SpotGroupLine } from "@/components/SpotGroupLine/SpotGroupLine";
import { MapGrid } from "./MapGrid";

export const MapSvg = React.forwardRef<SVGSVGElement>(function (_, ref) {
  const map = useMap();
  const editor = useMapEditor();

  const [scale, setScale] = React.useState(1); // Initial scale factor
  const [viewBox, setViewBox] = React.useState(
    `0 0 ${map.width} ${map.height}`,
  ); // Initial viewBox dimensions

  const handleZoomIn = () => {
    const newScale = scale * 1.2; // Increase scale by 20% (adjust as needed)
    setScale(newScale);
    updateViewBox(newScale);
  };

  const handleZoomOut = () => {
    const newScale = scale / 1.2; // Decrease scale by 20% (adjust as needed)
    setScale(newScale);
    updateViewBox(newScale);
  };

  const updateViewBox = (newScale: number) => {
    // Calculate new viewBox dimensions based on scale
    const newWidth = map.width / newScale; // Assuming original width of 400
    const newHeight = map.height / newScale; // Assuming original height of 400
    const newViewBox = `${0} ${0} ${newWidth} ${newHeight}`;
    setViewBox(newViewBox);
  };

  return (
    <>
      <div>
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
      </div>
      <svg
        onClick={() => {
          editor?.clearSelection();
        }}
        xmlns="http://www.w3.org/2000/svg"
        width={map.width * scale}
        height={map.height * scale}
        style={{ background: "transparent" }}
        viewBox={viewBox}
        ref={ref}
      >
        <image
          href={"/map1.svg"}
          width={map.width * scale}
          height={map.height * scale}
        />
        <MapGrid />
        {map.groups.map((group, groupIndex) => (
          <SpotGroup key={groupIndex} group={group}>
            {group.rows.map((row, rowIndex) => (
              <SpotGroupLine
                group={group}
                orientation={group.orientation}
                key={rowIndex}
                row={row}
                rowIndex={rowIndex}
              />
            ))}
          </SpotGroup>
        ))}
      </svg>
    </>
  );
});
