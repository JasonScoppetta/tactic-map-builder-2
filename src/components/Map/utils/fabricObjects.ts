import "fabric";
import * as fabric from "fabric";
import { MapText } from "@/types";

interface TextObjectProps {
  text: string;
  canvas: fabric.Canvas;
  id: string;
}

export const createTextObject = (
  canvas: fabric.Canvas,
  text: MapText,
): fabric.IText => {
  const textObject = new fabric.IText(text.text, {
    left: text.x || canvas.getWidth() / 2,
    top: text.y || canvas.getHeight() / 2,
    fontSize: 24,
    fill: "#333333",
    fontFamily: "Arial",
    originX: "center",
    originY: "center",
    selectable: true,
    hasControls: true,
    hasBorders: true,
    id: text.id,
    evented: true,
    editable: true,
    lockMovementX: false,
    lockMovementY: false,
    cornerSize: 12,
    transparentCorners: false,
    cornerColor: "#00a0f5",
    cornerStrokeColor: "#0063d1",
    borderColor: "#00a0f5",
    borderScaleFactor: 2,
    padding: 8,
  });

  // Ensure proper cursor behavior
  textObject.set("hoverCursor", "move");
  textObject.set("editingCursor", "text");
  textObject.set("moveCursor", "move");

  return textObject;
};
