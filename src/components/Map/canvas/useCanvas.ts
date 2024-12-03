import React, { useState, useCallback } from "react";
import * as fabric from "fabric";
import { util } from "fabric";
import { initializeCanvasEvents } from "../utils/canvasEvents";
import { createTextObject } from "../utils/fabricObjects";
import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { useInitCanvasEvents } from "@/components/Map/canvas/helpers/useInitCanvasEvents";

export const useCanvas = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const editor = useMapEditor();
  const initCanvasEvents = useInitCanvasEvents();

  React.useEffect(() => {
    if (!canvas || !editor?.value) return;

    fetch("/map1.svg")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then(async (svgText) => {
        canvas.clear();
        const resultSVG = await fabric.loadSVGFromString(svgText);

        const svgObject = util.groupSVGElements(
          resultSVG.objects as fabric.FabricObject[],
          resultSVG.options,
        );
        // Set properties
        svgObject.set({
          selectable: false,
          evented: false,
          hasControls: false,
          lockMovementX: false,
          lockMovementY: false,
          lockRotation: false,
          lockScalingX: false,
          lockScalingY: false,
        });

        // Add SVG to canvas
        canvas.add(svgObject);

        for (const text of editor.value?.texts) {
          const textObject = createTextObject(canvas, text);
          canvas.add(textObject);
        }

        canvas.requestRenderAll();
      })
      .catch((error) => {
        console.error("Error fetching SVG:", error);
      });
  }, [editor?.value, canvas]);

  const initCanvas = useCallback((canvasEl: HTMLCanvasElement) => {
    const dpr = window.devicePixelRatio || 1;

    const fabricCanvas = new fabric.Canvas(canvasEl, {
      width: window.innerWidth,
      height: window.innerHeight,
      selection: true,
      interactive: true,
      enableRetinaScaling: true,
      preserveObjectStacking: true,
    });

    const removeCanvasEvents = initCanvasEvents(fabricCanvas);

    fabricCanvas.setDimensions(
      {
        width: window.innerWidth * dpr,
        height: window.innerHeight * dpr,
      },
      {
        cssOnly: true,
      },
    );

    const hoveredObjects = new Set<fabric.Object>();

    // Add hover effect for objects
    fabricCanvas.on("mouse:over", handleMouseOver);
    fabricCanvas.on("mouse:out", handleMouseOut);

    // Listen to object transformations
    fabricCanvas.on("object:modified", handleObjectModified);
    //fabricCanvas.on("object:moving", handleObjectModified);
    //fabricCanvas.on("object:scaling", handleObjectModified);
    //fabricCanvas.on("object:rotating", handleObjectModified);

    // Use before:render to draw the hover outline
    fabricCanvas.on("before:render", () => {
      hoveredObjects.forEach((obj) => {
        //drawHoverOutline(obj);
      });
    });

    function handleMouseOver(opt: fabric.IEvent<MouseEvent>) {
      const obj = opt.target;
      if (obj) {
        hoveredObjects.add(obj);
        fabricCanvas.requestRenderAll();
      }
    }

    function handleMouseOut(opt: fabric.IEvent<MouseEvent>) {
      const obj = opt.target;
      if (obj) {
        hoveredObjects.delete(obj);
        fabricCanvas.requestRenderAll();
      }
    }

    function handleObjectModified(opt: fabric.IEvent) {
      const obj = opt.target;
      if (obj && hoveredObjects.has(obj)) {
        fabricCanvas.requestRenderAll();
      }
      console.log("AAA", obj);
      editor?.updateText(obj.id, { text: obj.textLines.join("\n") });
      editor?.moveItem(obj.id, "text", { x: obj.left, y: obj.top });
      if (obj && obj.type === "text") {
        //setTextPosition({ left: obj.left, top: obj.top });
      }
    }

    function drawHoverOutline(obj: fabric.Object) {
      const ctx = fabricCanvas.getContext("2d");
      ctx.save();

      // Apply the object's transformation matrix
      ctx.transform(...obj.calcTransformMatrix());

      // Set the border style
      ctx.strokeStyle = "blue"; // Border color
      ctx.lineWidth = 2 / fabricCanvas.getZoom(); // Adjust for zoom level

      // Draw the rectangle in the object's local coordinate space
      ctx.strokeRect(
        -obj.width! / 2,
        -obj.height! / 2,
        obj.width!,
        obj.height!,
      );

      ctx.restore();
    }

    fabricCanvas.on("object:moving", (opt) => {
      const obj = opt.target;
      //snapObjectToGrid(obj);
    });

    function snapObjectToGrid(obj: fabric.Object) {
      const gridSize = 50; // Use editor's grid size or default to 50

      // Get the object's center point in canvas coordinates
      const objCenter = obj.getCenterPoint();

      // Invert the viewport transform to get actual positions
      const invVpt = fabric.util.invertTransform(
        fabricCanvas.viewportTransform!,
      );

      // Transform the object's center point to viewport coordinates
      const viewportPoint = fabric.util.transformPoint(objCenter, invVpt);

      // Snap the viewport coordinates to the nearest grid point
      const snappedViewportX =
        Math.round(viewportPoint.x / gridSize) * gridSize;
      const snappedViewportY =
        Math.round(viewportPoint.y / gridSize) * gridSize;

      // Transform the snapped viewport point back to canvas coordinates
      const snappedPoint = fabric.util.transformPoint(
        new fabric.Point(snappedViewportX, snappedViewportY),
        fabricCanvas.viewportTransform!,
      );

      // Calculate the offset to apply to the object's position
      const deltaX = snappedPoint.x - objCenter.x;
      const deltaY = snappedPoint.y - objCenter.y;

      // Apply the offset to the object's position
      obj.left = obj.left! + deltaX;
      obj.top = obj.top! + deltaY;

      obj.setCoords(); // Update the object's coordinates
    }

    const drawGrid = () => {
      const ctx = fabricCanvas.getContext();
      ctx.save();

      // Reset transformation matrix to the identity matrix
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const vpt = fabricCanvas.viewportTransform;
      const zoom = fabricCanvas.getZoom();

      // Calculate the visible area in world coordinates
      const topLeftWorldX = -vpt[4] / zoom;
      const topLeftWorldY = -vpt[5] / zoom;
      const visibleWidth = fabricCanvas.width / zoom;
      const visibleHeight = fabricCanvas.height / zoom;
      const bottomRightWorldX = topLeftWorldX + visibleWidth;
      const bottomRightWorldY = topLeftWorldY + visibleHeight;

      // Set the grid size
      const gridSize = 50;

      // Calculate starting points for grid lines
      const startX = Math.floor(topLeftWorldX / gridSize) * gridSize;
      const startY = Math.floor(topLeftWorldY / gridSize) * gridSize;

      // Set a minimum line width to prevent disappearing lines
      const lineWidth = Math.max(1 / zoom, 0.5);

      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 1;

      // Draw vertical grid lines
      for (let x = startX; x <= bottomRightWorldX; x += gridSize) {
        // Align to pixel grid to avoid subpixel rendering issues
        const screenX = Math.round(x * zoom + vpt[4]) + 0.5;
        ctx.beginPath();
        ctx.moveTo(screenX, 0);
        ctx.lineTo(screenX, fabricCanvas.height);
        ctx.stroke();
      }

      // Draw horizontal grid lines
      for (let y = startY; y <= bottomRightWorldY; y += gridSize) {
        const screenY = Math.round(y * zoom + vpt[5]) + 0.5;
        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(fabricCanvas.width, screenY);
        ctx.stroke();
      }

      ctx.restore();
    };

    fabricCanvas.on("before:render", (opt) => {
      //console.log("OPT", opt);
      drawGrid();
    });

    fabricCanvas.on("mouse:wheel", (opt) => {
      const evt = opt.e as WheelEvent;
      const deltaY = evt.deltaY;
      const deltaX = evt.deltaX;
      const vpt = fabricCanvas.viewportTransform!;
      const panningFactor = 1; // Adjust this value as needed

      if (evt.altKey) {
        // Zooming logic when Alt key is pressed
        let zoom = fabricCanvas.getZoom();
        zoom *= 0.999 ** deltaY;
        zoom = Math.min(Math.max(zoom, 0.1), 20); // Clamp zoom value between 0.1 and 20

        // Adjusting for device pixel ratio
        const dpr = window.devicePixelRatio || 1; // Get the device pixel ratio
        const adjustedOffsetX = evt.offsetX;
        const adjustedOffsetY = evt.offsetY;

        // Use adjusted coordinates for zooming
        fabricCanvas.zoomToPoint(
          { x: adjustedOffsetX, y: adjustedOffsetY },
          zoom,
        );
        console.log("Zooming with Alt key pressed");
      } else {
        // Panning logic when Alt key is not pressed
        if (evt.shiftKey && deltaY !== 0) {
          // Horizontal panning with Shift key and vertical scroll
          vpt[4] -= deltaY * panningFactor;
        } else {
          // Horizontal panning with horizontal scroll
          vpt[4] -= deltaX * panningFactor;
        }
        // Vertical panning
        vpt[5] -= deltaY * panningFactor;

        // **Important:** Update the viewport transform
        fabricCanvas.setViewportTransform(vpt);

        fabricCanvas.requestRenderAll();
        console.log("Panning without Alt key");
      }

      // Prevent default scrolling behavior
      evt.preventDefault();
      evt.stopPropagation();
    });

    // Set the canvas state
    setCanvas(fabricCanvas);

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const dpr = window.devicePixelRatio || 1;

      // Update canvas dimensions
      fabricCanvas.setDimensions(
        {
          width: width * dpr,
          height: height * dpr,
        },
        {
          cssOnly: true,
        },
      );

      // Maintain CSS dimensions for proper rendering
      fabricCanvas.setDimensions(
        {
          width: width,
          height: height,
        },
        {
          backstoreOnly: true,
        },
      );

      // Adjust viewport transform to keep the objects and grid aligned
      const zoom = fabricCanvas.getZoom();
      const gridSpacing = 50; // Adjust spacing if needed

      const offsetX = (fabricCanvas.getWidth() / 2) % (gridSpacing * zoom);
      const offsetY = (fabricCanvas.getHeight() / 2) % (gridSpacing * zoom);

      // Update viewport transform with new offsets
      //fabricCanvas.setViewportTransform([zoom, 0, 0, zoom, offsetX, offsetY]);

      // Re-render the grid and objects
      fabricCanvas.requestRenderAll();
    };

    window.addEventListener("resize", handleResize);

    const cleanupEvents = initializeCanvasEvents(fabricCanvas);

    return () => {
      removeCanvasEvents?.();
      window.removeEventListener("resize", handleResize);
      cleanupEvents?.();
      fabricCanvas.dispose();
    };
  }, []);

  const addText = useCallback(() => {
    if (!canvas) return;

    const text = createTextObject({
      text: "Double click to edit",
      canvas,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  }, [canvas]);

  return {
    canvas,
    initCanvas,
    addText,
  };
};
