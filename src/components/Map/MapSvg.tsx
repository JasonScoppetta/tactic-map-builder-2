import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { useMap } from "@/components/Map/providers/MapProvider/context";
import { MapIcon } from "@/components/MapIcon";
import { MapText } from "@/components/MapText";
import { getObjectKeys } from "@/helpers/getObjectKeys";
import { SelectionTargetType } from "@/types";
import React from "react";
import { SpotGroup } from "../SpotGroup/SpotGroup";
import { SpotGroupLine } from "@/components/SpotGroupLine/SpotGroupLine";
import { MapGrid } from "./MapGrid";

function calculateViewBox(
  svgWidth: number,
  svgHeight: number,
  viewBoxWidth: number,
  viewBoxHeight: number,
): [number, number, number, number] {
  return [
    (viewBoxWidth - svgWidth) / 2,
    (viewBoxHeight - svgHeight) / 2,
    svgWidth,
    svgHeight,
  ];
}

interface ToolsState {
  start: { x: number; y: number };
  isDragging: boolean;
  items: Record<string, { rect: DOMRect; type: SelectionTargetType }>;
}

interface ViewBoxInfo {
  viewBox: string;
  viewBoxArray: [number, number, number, number];
}

export const MapSvg = React.forwardRef<SVGSVGElement>(function (_, ref) {
  const map = useMap();
  const editor = useMapEditor();
  const mainSvgRef = React.useRef<SVGSVGElement>(null);
  const toolsState = React.useRef<ToolsState>({
    start: { x: 0, y: 0 },
    isDragging: false,
    items: {},
  });
  const selectionRectangleRef = React.useRef<HTMLDivElement>(null);

  const [scale, setScale] = React.useState(1); // Initial scale factor
  const [viewBox, setViewBox] = React.useState<ViewBoxInfo>({
    viewBox: `0 0 ${map.width} ${map.height}`,
    viewBoxArray: [0, 0, map.width, map.height],
  }); // Initial viewBox dimensions

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
      const newViewBoxArray = calculateViewBox(
        editor?.areaWidth || 0,
        editor?.areaHeight || 0,
        newWidth,
        newHeight,
      );
      setViewBox({
        viewBox: newViewBox,
        viewBoxArray: newViewBoxArray,
      });
    },
    [scale, editor?.areaHeight, editor?.areaWidth, map.height, map.width],
  );

  const handleRectangleTool = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!mainSvgRef.current) return;
    toolsState.current.items = {};
    Array.from(
      mainSvgRef.current.querySelectorAll("[data-selection-type]"),
    ).forEach((element) => {
      const id =
        element.getAttribute("data-group-id") ||
        element.getAttribute("data-text-id") ||
        element.getAttribute("data-icon-id");
      if (!id) return;
      toolsState.current.items[id] = {
        rect: element.getBoundingClientRect(),
        type: element.getAttribute(
          "data-selection-type",
        ) as SelectionTargetType,
      };
    });

    const { clientX, clientY } = event;
    toolsState.current.start = { x: clientX, y: clientY };

    toolsState.current.isDragging = true;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", () => {
      window.removeEventListener("mousemove", handleMouseMove);
    });
  };

  const handleMoveTool = (event: React.MouseEvent<SVGSVGElement>) => {
    const { clientX, clientY } = event;
    toolsState.current.start = { x: clientX, y: clientY };

    toolsState.current.isDragging = true;
  };

  const handleMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!editor?.isEditing) return;
    if (editor.selectedMainTool === "select") {
      handleRectangleTool(event);
      return;
    }

    if (editor.selectedMainTool === "moveMap") {
      handleMoveTool(event);
      return;
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!editor?.isEditing) return;
    if (!selectionRectangleRef.current) return;
    if (!toolsState.current.isDragging) return;

    selectionRectangleRef.current?.classList.remove("hidden");
    window.addEventListener("mouseup", handleMouseUp, true);

    const { clientX, clientY } = event;
    const startX = toolsState.current.start.x;
    const startY = toolsState.current.start.y;

    // Calculate the position and dimensions of the selection rectangle
    const x = Math.min(clientX, startX);
    const y = Math.min(clientY, startY);
    const width = Math.abs(clientX - startX);
    const height = Math.abs(clientY - startY);

    selectionRectangleRef.current.style.width = `${width}px`;
    selectionRectangleRef.current.style.height = `${height}px`;
    selectionRectangleRef.current.style.left = `${x}px`;
    selectionRectangleRef.current.style.top = `${y}px`;

    // Calculate the bounds of the selection rectangle
    const selectionRect = {
      left: x,
      right: x + width,
      top: y,
      bottom: y + height,
    };

    // Filter selected items based on their position relative to the selection rectangle
    getObjectKeys(toolsState.current.items).forEach((itemId) => {
      const item = toolsState.current.items[itemId];
      const isItemInArea =
        item.rect.left < selectionRect.right &&
        item.rect.right > selectionRect.left &&
        item.rect.top < selectionRect.bottom &&
        item.rect.bottom > selectionRect.top;

      editor?.updateSelection(itemId, item.type, {
        appendSelection: isItemInArea,
        removeSelection: !isItemInArea,
      });
    });

    //console.log(selectedItems);
  };

  const handleMouseUp = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!editor?.isEditing) return;
    if (!selectionRectangleRef.current) return;
    if (!toolsState.current.isDragging) return;

    toolsState.current.isDragging = false;
    selectionRectangleRef.current.style.width = "0";
    selectionRectangleRef.current.style.height = "0";

    selectionRectangleRef.current?.classList.add("hidden");

    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp, true);
  };

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
        onMouseDown={handleMouseDown}
        onMouseUp={() => {
          editor?.clearSelection();
        }}
        ref={mainSvgRef}
      >
        <MapGrid />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={editor?.areaWidth || map.width}
          height={editor?.areaHeight || map.height}
          style={{ background: "transparent" }}
          viewBox={viewBox.viewBox}
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
      <div
        ref={selectionRectangleRef}
        className={
          "fixed top-0 left-0 border border-primary/80 z-sticky bg-primary/40 hidden"
        }
      ></div>
    </>
  );
});
