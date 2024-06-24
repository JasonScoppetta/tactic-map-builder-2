import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { useMap } from "@/components/Map/providers/MapProvider/context";
import { MapIcon } from "@/components/MapIcon";
import { MapText } from "@/components/MapText";
import React from "react";
import { SpotGroup } from "../SpotGroup/SpotGroup";
import { SpotGroupLine } from "@/components/SpotGroupLine/SpotGroupLine";
import { MapGrid } from "./MapGrid";

function calculateViewBox(
  svgWidth: number,
  svgHeight: number,
  viewBoxWidth: number,
  viewBoxHeight: number,
): string {
  return `${(viewBoxWidth - svgWidth) / 2} ${(viewBoxHeight - svgHeight) / 2} ${svgWidth} ${svgHeight}`;
}

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
    //updateViewBox(newScale);
  };

  const handleZoomOut = () => {
    const newScale = scale / 1.2; // Decrease scale by 20% (adjust as needed)
    setScale(newScale);
    //updateViewBox(newScale);
  };

  const updateViewBox = React.useCallback(
    (newScale: number) => {
      // Calculate new viewBox dimensions based on scale
      const newWidth = map.width / newScale; // Assuming original width of 400
      const newHeight = map.height / newScale; // Assuming original height of 400
      const newViewBox = `${0} ${0} ${newWidth} ${newHeight}`;
      setViewBox(
        calculateViewBox(
          editor?.areaWidth || 0,
          editor?.areaHeight || 0,
          newWidth,
          newHeight,
        ),
      );
    },
    [scale, editor?.areaHeight, editor?.areaWidth, map.height, map.width],
  );

  React.useEffect(() => {
    updateViewBox(1);
  }, [updateViewBox]);

  return (
    <>
      {/*<div>
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
      </div>*/}
      <svg
        width={editor?.areaWidth || map.width}
        height={editor?.areaHeight || map.height}
      >
        <MapGrid />
        <svg
          onClick={() => {
            editor?.clearSelection();
          }}
          xmlns="http://www.w3.org/2000/svg"
          width={editor?.areaWidth || map.width}
          height={editor?.areaHeight || map.height}
          style={{ background: "transparent" }}
          viewBox={viewBox}
          ref={ref}
        >
          <image
            href={"/map1.svg"}
            width={map.width * scale}
            height={map.height * scale}
          />
          {map.texts.map((text) => (
            <MapText text={text} key={text.id} />
          ))}
          {map.icons.map((icon) => (
            <MapIcon icon={icon} key={icon.id} />
          ))}
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
      </svg>
    </>
  );
});
