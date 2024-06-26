import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { useMap } from "@/components/Map/providers/MapProvider/context";
import { MapIcon } from "@/components/MapIcon";
import { MapText } from "@/components/MapText";
import { getObjectKeys } from "@/helpers/getObjectKeys";
import { mergeRefs } from "@/helpers/mergeRef";
import { SelectionTargetType } from "@/types";
import React from "react";
import { SpotGroup } from "../SpotGroup/SpotGroup";
import { SpotGroupLine } from "@/components/SpotGroupLine/SpotGroupLine";
import { MapGrid } from "./MapGrid";

interface CalculateViewBoxOptions {
  scale?: number;
  mouseX?: number;
  mouseY?: number;
  startViewBox?: [number, number, number, number];
}

function calculateViewBox(
  svgWidth: number,
  svgHeight: number,
  viewBoxWidth: number,
  viewBoxHeight: number,
  options?: CalculateViewBoxOptions,
): [number, number, number, number] {
  const { scale = 1, mouseX, mouseY, startViewBox } = options || {};
  const width = svgWidth / scale;
  const height = svgHeight / scale;

  let x = 0;
  let y = 0;

  if (mouseX && mouseY && startViewBox) {
    const [startMinX, startMinY, startWidth, startHeight] = startViewBox;

    // Calculate new center coordinates in SVG coordinates
    const svgMouseX = (mouseX * svgWidth) / viewBoxWidth;
    const svgMouseY = (mouseY * svgHeight) / viewBoxHeight;

    // Calculate new viewBox minX and minY
    x = svgMouseX - (svgMouseX - startMinX) / scale;
    y = svgMouseY - (svgMouseY - startMinY) / scale;
  } else {
    x = (viewBoxWidth - width) / 2;
    y = (viewBoxHeight - height) / 2;
  }

  return [x, y, width, height];
}

interface ToolsState {
  start: { x: number; y: number };
  startPosition: { x: number; y: number };
  mousePosition: { x: number; y: number };
  isDragging: boolean;
  items: Record<string, { rect: DOMRect; type: SelectionTargetType }>;
  zoom: number;
  startViewBox: [number, number, number, number];
  isMapResizing: boolean;
  svgTransform?: SVGMatrix;
}

interface ViewBoxInfo {
  viewBox: string;
  viewBoxArray: [number, number, number, number];
}

export const MapSvg = React.forwardRef<SVGSVGElement>(function (_, ref) {
  const map = useMap();
  const editor = useMapEditor();
  const mainSvgRef = React.useRef<SVGSVGElement>(null);
  const groupRef = React.useRef<SVGGElement>(null);
  const circleTransform = React.useRef<SVGMatrix>(null);
  const innserSvg = React.useRef<SVGSVGElement>(null);
  const toolsState = React.useRef<ToolsState>({
    start: { x: 0, y: 0 },
    mousePosition: { x: 0, y: 0 },
    startPosition: { x: 0, y: 0 },
    isDragging: false,
    items: {},
    zoom: 1,
    startViewBox: [0, 0, map.width, map.height],
    isMapResizing: false,
  });
  const selectionRectangleRef = React.useRef<HTMLDivElement>(null);
  const [groupTransform, setGroupTransform] = React.useState<string>("");

  const [mapPosition, setMapPosition] = React.useState([0, 0]);

  const [viewBox, setViewBox] = React.useState<ViewBoxInfo>({
    viewBox: `0 0 ${map.width} ${map.height}`,
    viewBoxArray: [0, 0, map.width, map.height],
  }); // Initial viewBox dimensions

  const defaultCursor =
    editor?.selectedMainTool === "moveMap" ? "move" : "default";

  const handleZoomIn = () => {
    const newScale = Math.min((editor?.zoom || 1) + 0.1, 5); // Increase scale by 20% (adjust as needed)
    editor?.setZoom(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max((editor?.zoom || 1) - 0.1, 0.5); // Increase scale by 20% (adjust as needed)
    editor?.setZoom(newScale);
  };

  const updateViewBox = React.useCallback(
    (newScale: number) => {
      // Calculate new viewBox dimensions based on scale
      const newWidth = map.width / newScale; // Assuming original width of 400
      const newHeight = map.height / newScale; // Assuming original height of 400
      const newViewBoxArray = calculateViewBox(
        editor?.areaWidth || 0,
        editor?.areaHeight || 0,
        newWidth,
        newHeight /*,
        {
          scale: newScale,
          mouseX: toolsState.current.mousePosition.x,
          mouseY: toolsState.current.mousePosition.y,
          currentViewBox: viewBox.viewBoxArray,
        },*/,
      );
      setViewBox({
        viewBox: newViewBoxArray.join(" "),
        viewBoxArray: newViewBoxArray,
      });
    },
    [editor?.areaHeight, editor?.areaWidth, map.height, map.width],
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
    toolsState.current.startPosition = {
      x: circleTransform.current.e,
      y: circleTransform.current.f,
    };

    toolsState.current.isDragging = true;

    window.addEventListener("mousemove", handleMoveToolMouseMove);
    window.addEventListener("mouseup", () => {
      window.removeEventListener("mousemove", handleMoveToolMouseMove);
    });
  };

  const handleMoveToolMouseMove = (event: MouseEvent) => {
    if (!editor?.isEditing) return;
    if (!toolsState.current.isDragging) return;

    window.addEventListener("mouseup", handleMoveToolMouseUp, true);

    const { clientX, clientY } = event;
    const startX = toolsState.current.start.x;
    const startY = toolsState.current.start.y;

    const deltaX = startX - clientX;
    const deltaY = startY - clientY;

    const newViewBox: [number, number, number, number] = [
      toolsState.current.startPosition.x - deltaX,
      toolsState.current.startPosition.y - deltaY,
      viewBox.viewBoxArray[2],
      viewBox.viewBoxArray[3],
    ];

    //setMapPosition([newViewBox[0], newViewBox[1]]);

    console.log(deltaX);

    const newTransform = circleTransform.current;
    newTransform.e = toolsState.current.startPosition.x - deltaX;
    newTransform.f = toolsState.current.startPosition.y - deltaY;
    // Update circleTransform
    circleTransform.current = newTransform;

    // Update the circle's transform
    const transform = mainSvgRef.current.createSVGTransform();

    transform.setMatrix(circleTransform.current);

    /*const effectiveScale = circleTransform.current.a;
    if (effectiveScale < 0.5 || effectiveScale > 5) return;*/

    //circle.transform.baseVal.initialize(transform);

    setGroupTransform(
      `translate(${circleTransform.current.e}, ${circleTransform.current.f}) scale(${circleTransform.current.a},${circleTransform.current.d})`,
    );

    /*setViewBox({
      viewBox: newViewBox.join(" "),
      viewBoxArray: newViewBox,
    });*/
  };

  const handleMoveToolMouseUp = (event: MouseEvent) => {
    if (!editor?.isEditing) return;
    if (!toolsState.current.isDragging) return;

    event.stopPropagation();

    toolsState.current.isDragging = false;

    window.removeEventListener("mousemove", handleMoveToolMouseMove);
    window.removeEventListener("mouseup", handleMoveToolMouseUp, true);

    if (mainSvgRef.current) mainSvgRef.current.style.cursor = defaultCursor;
  };

  const handleMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!editor?.isEditing) return;
    if (!mainSvgRef.current) return;
    if (
      (!event.metaKey && editor.selectedMainTool === "select") ||
      (event.metaKey && editor.selectedMainTool === "moveMap")
    ) {
      handleRectangleTool(event);
      return;
    }

    if (
      editor.selectedMainTool === "moveMap" ||
      (event.metaKey && editor.selectedMainTool === "select")
    ) {
      handleMoveTool(event);
      mainSvgRef.current.style.cursor = "move";
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

    if (mainSvgRef.current) mainSvgRef.current.style.cursor = defaultCursor;
  };

  React.useEffect(() => {
    updateViewBox(1);
  }, [updateViewBox]);

  React.useEffect(() => {
    const windowKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && editor?.selectedMainTool === "select") {
        mainSvgRef.current?.style.setProperty("cursor", "move");
      }
    };

    const windowKeyUp = (event: KeyboardEvent) => {
      if (toolsState.current.isDragging) return;
      if (toolsState.current.isMapResizing) {
        toolsState.current.isMapResizing = false;
      }

      if (event.key === "Meta" && editor?.selectedMainTool === "select") {
        mainSvgRef.current?.style.setProperty("cursor", "default");
      }
    };

    window.addEventListener("keydown", windowKeyDown);
    window.addEventListener("keyup", windowKeyUp);

    return () => {
      window.removeEventListener("keydown", windowKeyDown);
      window.removeEventListener("keyup", windowKeyUp);
    };
  }, [editor?.selectedMainTool]);

  //console.log(viewBox.viewBoxArray);

  React.useEffect(() => {
    const svg = mainSvgRef.current;
    const circle = groupRef.current;

    if (!svg || !circle) return;

    // Initialize circleTransform to identity matrix
    circleTransform.current = svg.createSVGMatrix();

    const wheelZoom = (event: WheelEvent) => {
      event.preventDefault();

      if (!event.metaKey) {
        const scaleX = event.deltaX ? 1.0 - event.deltaX * 0.8 : 0;
        const scaleY = event.deltaY ? 1.0 - event.deltaY * 0.8 : 0;
        let newTransform = circleTransform.current.translate(scaleX, scaleY);
        circleTransform.current = newTransform;

        // Update the circle's transform
        const transform = mainSvgRef.current.createSVGTransform();

        transform.setMatrix(circleTransform.current);

        /*const effectiveScale = circleTransform.current.a;
        if (effectiveScale < 0.5 || effectiveScale > 5) return;*/

        //circle.transform.baseVal.initialize(transform);

        setGroupTransform(
          `translate(${circleTransform.current.e}, ${circleTransform.current.f}) scale(${circleTransform.current.a},${circleTransform.current.d})`,
        );
        return;
      }

      // Calculate an appropriate scale adjustment
      const scale = 1.0 - event.deltaY * 0.001;

      console.log(scale);

      if (
        (circleTransform.current.a <= 0.3 && scale < 1) ||
        (circleTransform.current.a >= 8 && scale > 1)
      )
        return;

      // Get the mouse position as SVG coordinates
      const coords = convertScreenCoordsToSvgCoords(
        event.clientX,
        event.clientY,
      );

      // To scale around the mouse coords, first we transform the coordinate
      // system so that the origin is at the mouse coords.
      let newTransform = circleTransform.current.translate(coords.x, coords.y);
      // Then we apply the scale
      newTransform = newTransform.scale(scale, scale);
      // Finally we move the coordinate system back to where it was
      newTransform = newTransform.translate(-coords.x, -coords.y);

      // Update circleTransform
      circleTransform.current = newTransform;

      // Update the circle's transform
      const transform = svg.createSVGTransform();

      transform.setMatrix(circleTransform.current);

      /*const effectiveScale = circleTransform.current.a;
      if (effectiveScale < 0.5 || effectiveScale > 5) return;*/

      //circle.transform.baseVal.initialize(transform);

      setGroupTransform(
        `translate(${circleTransform.current.e}, ${circleTransform.current.f}) scale(${circleTransform.current.a},${circleTransform.current.d})`,
      );

      editor?.setZoom(circleTransform.current.a);
    };

    const convertScreenCoordsToSvgCoords = (x: number, y: number) => {
      let pt = svg.createSVGPoint(); // An SVGPoint SVG DOM object
      pt.x = x;
      pt.y = y;
      pt = pt.matrixTransform(circle.getScreenCTM().inverse());
      return { x: pt.x, y: pt.y };
    };

    svg.addEventListener("wheel", wheelZoom);

    return () => {
      svg.removeEventListener("wheel", wheelZoom);
    };
  }, []);

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
        //onWheel={handleMouseWheel}
        ref={mainSvgRef}
        style={{ cursor: defaultCursor }}
        onMouseMove={(event) => {
          if (!event.metaKey) return;
          // Get mouse position relative to the svg
          const { clientX, clientY } = event;
          const rect = mainSvgRef.current?.getBoundingClientRect();
          if (!rect) return;
          toolsState.current.mousePosition = {
            x: clientX - rect.left,
            y: clientY - rect.top,
          };
        }}
      >
        <MapGrid />
        <g
          xmlns="http://www.w3.org/2000/svg"
          width={editor?.areaWidth || map.width}
          height={editor?.areaHeight || map.height}
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
