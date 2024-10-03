import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { useMap } from "@/components/Map/providers/MapProvider/context";
import { MapIcon } from "@/components/MapIcon";
import { MapText } from "@/components/MapText";
import { mergeRefs } from "@/helpers/mergeRef";
import { useMapEditorMapTools } from "@/hooks/useMapEditorMapTools";
import React from "react";
import { SpotGroup } from "../SpotGroup/SpotGroup";
import { SpotGroupLine } from "@/components/SpotGroupLine/SpotGroupLine";
import { MapGrid } from "./MapGrid";

export const MapSvg = React.forwardRef<SVGSVGElement>(function (_, ref) {
  const map = useMap();
  const editor = useMapEditor();

  const mainSvgRef = React.useRef<SVGSVGElement>(null);
  const groupRef = React.useRef<SVGGElement>(null);
  const selectionRectangleRef = React.useRef<HTMLDivElement>(null);

  const {
    groupTransform,
    handleMapMouseDown,
    handleMapMouseUp,
    defaultCursor,
  } = useMapEditorMapTools({
    mainSvgRef,
    groupRef,
    selectionRectangleRef,
  });

  return (
    <>
      <svg
        width={editor?.areaSize?.width || map.width}
        height={editor?.areaSize?.height || map.height}
        onMouseDown={handleMapMouseDown}
        onMouseUp={handleMapMouseUp}
        ref={mainSvgRef}
        style={{ cursor: defaultCursor }}
      >
        <MapGrid />
        <g
          xmlns="http://www.w3.org/2000/svg"
          width={editor?.areaSize?.width || map.width}
          height={editor?.areaSize?.height || map.height}
          style={{ background: "transparent" }}
          ref={mergeRefs([groupRef, ref])}
          transform={groupTransform}
        >
          <g>
            <image href={"/map1.svg"} width={map.width} height={map.height} />
            {map.texts.map((text) => (
              <MapText text={text} key={text.id} />
            ))}
            {map.icons.map((icon) => (
              <MapIcon icon={icon} key={icon.id} />
            ))}
            {map.groups.map((group, groupIndex) => {
              let gapX = 0;
              let gapY = 0;

              return (
                <SpotGroup key={groupIndex} group={group}>
                  {group.rows.map((row, rowIndex) => {
                    if (group.gap) {
                      if (rowIndex && rowIndex % 2 === 0) {
                        if (group.orientation === "horizontal") {
                          gapY += group.gap;
                        } else {
                          gapX += group.gap;
                        }
                      }
                    }

                    return (
                      <SpotGroupLine
                        group={group}
                        orientation={group.orientation}
                        paddingX={gapX}
                        paddingY={gapY}
                        key={rowIndex}
                        row={row}
                        rowIndex={rowIndex}
                        spotGapX={group.spotGapX}
                        spotGapY={group.spotGapY}
                      />
                    );
                  })}
                </SpotGroup>
              );
            })}
          </g>
        </g>
      </svg>
      <div
        ref={selectionRectangleRef}
        className={
          "fixed top-0 left-0 border border-primary/80 z-sticky bg-primary/40 hidden"
        }
      ></div>
    </>
  );
});
