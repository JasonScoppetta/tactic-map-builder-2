import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { getObjectKeys } from "@/helpers/getObjectKeys";
import { svgMatrixToTransformString } from "@/helpers/svgMatrixToTransformString";
import { SelectionTargetType } from "@/types";
import React from "react";
interface ToolsState {
  start: { x: number; y: number };
  startPosition: { x: number; y: number };
  isDragging: boolean;
  items: Record<string, { rect: DOMRect; type: SelectionTargetType }>;
  mapMatrix: SVGMatrix | null;
}

export interface UseMapEditorMapToolsOptions {
  mainSvgRef: React.RefObject<SVGSVGElement>;
  groupRef: React.RefObject<SVGGElement>;
  selectionRectangleRef: React.RefObject<HTMLDivElement>;
}

export const useMapEditorMapTools = (options: UseMapEditorMapToolsOptions) => {
  const { mainSvgRef, groupRef, selectionRectangleRef } = options;
  const editor = useMapEditor();
  const toolsState = React.useRef<ToolsState>({
    start: { x: 0, y: 0 },
    startPosition: { x: 0, y: 0 },
    isDragging: false,
    items: {},
    mapMatrix: null,
  });
  const [groupTransform, setGroupTransform] = React.useState<string>("");

  const defaultCursor =
    editor?.selectedMainTool === "moveMap" ? "move" : "default";

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
    if (!toolsState.current.mapMatrix) return;

    const { clientX, clientY } = event;
    toolsState.current.start = { x: clientX, y: clientY };
    toolsState.current.startPosition = {
      x: toolsState.current.mapMatrix.e,
      y: toolsState.current.mapMatrix.f,
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
    if (!toolsState.current.mapMatrix) return;
    if (!mainSvgRef.current) return;

    window.addEventListener("mouseup", handleMoveToolMouseUp, true);

    const { clientX, clientY } = event;
    const startX = toolsState.current.start.x;
    const startY = toolsState.current.start.y;

    const deltaX = startX - clientX;
    const deltaY = startY - clientY;

    const newTransform = toolsState.current.mapMatrix;
    newTransform.e = toolsState.current.startPosition.x - deltaX;
    newTransform.f = toolsState.current.startPosition.y - deltaY;
    toolsState.current.mapMatrix = newTransform;

    const transform = mainSvgRef.current.createSVGTransform();

    transform.setMatrix(toolsState.current.mapMatrix);

    setGroupTransform(svgMatrixToTransformString(toolsState.current.mapMatrix));
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

  const handleMapMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
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
    const windowKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && editor?.selectedMainTool === "select") {
        mainSvgRef.current?.style.setProperty("cursor", "move");
      }
    };

    const windowKeyUp = (event: KeyboardEvent) => {
      if (toolsState.current.isDragging) return;

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

  const handleMapMouseUp = () => {
    editor?.clearSelection();
  };

  React.useEffect(() => {
    const mapSvg = mainSvgRef.current;
    const group = groupRef.current;

    if (!mapSvg || !group) return;

    if (!toolsState.current.mapMatrix)
      toolsState.current.mapMatrix = mapSvg.createSVGMatrix();

    const handleMapMouseWheelMove = (event: WheelEvent) => {
      if (!toolsState.current.mapMatrix) return;
      if (!mainSvgRef.current) return;

      const scaleX = event.deltaX ? 1.0 - event.deltaX * 0.8 : 0;
      const scaleY = event.deltaY ? 1.0 - event.deltaY * 0.8 : 0;
      toolsState.current.mapMatrix = toolsState.current.mapMatrix.translate(
        scaleX,
        scaleY,
      );

      const transform = mainSvgRef.current.createSVGTransform();

      transform.setMatrix(toolsState.current.mapMatrix);

      setGroupTransform(
        svgMatrixToTransformString(toolsState.current.mapMatrix),
      );
      return;
    };

    const handleMapMouseZoomWheel = (event: WheelEvent) => {
      if (!toolsState.current.mapMatrix) return;
      if (!mainSvgRef.current) return;

      const scale = 1.0 - event.deltaY * 0.001;

      if (
        (toolsState.current.mapMatrix.a <= 0.3 && scale < 1) ||
        (toolsState.current.mapMatrix.a >= 8 && scale > 1)
      )
        return;

      const pt = mapSvg.createSVGPoint();
      pt.x = event.clientX;
      pt.y = event.clientY;
      const coords = pt.matrixTransform(group.getScreenCTM()?.inverse());

      let newTransform = toolsState.current.mapMatrix.translate(
        coords.x,
        coords.y,
      );
      newTransform = newTransform.scale(scale, scale);
      newTransform = newTransform.translate(-coords.x, -coords.y);
      toolsState.current.mapMatrix = newTransform;

      const transform = mapSvg.createSVGTransform();

      transform.setMatrix(toolsState.current.mapMatrix);

      setGroupTransform(
        svgMatrixToTransformString(toolsState.current.mapMatrix),
      );

      editor?.setZoom(toolsState.current.mapMatrix.a);
    };

    const handleMapWheelActions = (event: WheelEvent) => {
      event.preventDefault();

      if (!event.metaKey) {
        return handleMapMouseWheelMove(event);
      }

      handleMapMouseZoomWheel(event);
    };

    mapSvg.addEventListener("wheel", handleMapWheelActions);

    return () => {
      mapSvg.removeEventListener("wheel", handleMapWheelActions);
    };
  }, [mainSvgRef.current, groupRef.current]);

  return {
    defaultCursor,
    groupTransform,
    handleMapMouseUp,
    handleMapMouseDown,
  };
};
