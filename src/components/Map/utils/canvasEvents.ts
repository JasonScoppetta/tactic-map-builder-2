import * as fabric from "fabric";

export const initializeCanvasEvents = (canvas: fabric.Canvas) => {
  const handleDoubleClick = (e: fabric.IEvent) => {
    if (e.target && e.target.type === "i-text") {
      const textObject = e.target as fabric.IText;
      // Ensure the object is selected before editing
      canvas.setActiveObject(textObject);
      textObject.enterEditing();
      textObject.selectAll();
      canvas.requestRenderAll();
    }
  };

  const handleObjectAdded = (e: fabric.IEvent) => {
    if (e.target) {
      e.target.set({
        selectable: true,
        hasControls: true,
        hasBorders: true,
        lockMovementX: false,
        lockMovementY: false,
        cornerSize: 12,
        transparentCorners: false,
        cornerColor: "#00a0f5",
        cornerStrokeColor: "#0063d1",
        borderColor: "#00a0f5",
        borderScaleFactor: 2,
      });
      canvas.requestRenderAll();
    }
  };

  const handleMouseOver = (e: fabric.IEvent) => {
    if (e.target && !canvas.getActiveObjects().length) {
      e.target.set("hoverCursor", "move");
      canvas.requestRenderAll();
    }
  };

  const handleMouseOut = (e: fabric.IEvent) => {
    if (e.target) {
      e.target.set("hoverCursor", null);
      canvas.requestRenderAll();
    }
  };

  const handleSelectionCreated = (e: fabric.IEvent) => {
    const activeObj = e.target;
    if (activeObj) {
      activeObj.set({
        borderColor: "#00a0f5",
        cornerColor: "#00a0f5",
      });
      canvas.requestRenderAll();
    }
  };

  const handleTextEditingEntered = (e: fabric.IEvent) => {
    if (e.target) {
      const textObject = e.target as fabric.IText;
      textObject.set({
        lockMovementX: true,
        lockMovementY: true,
      });
      canvas.requestRenderAll();
    }
  };

  const handleTextEditingExited = (e: fabric.IEvent) => {
    if (e.target) {
      const textObject = e.target as fabric.IText;
      textObject.set({
        lockMovementX: false,
        lockMovementY: false,
      });
      // Ensure the text remains selected after editing
      canvas.setActiveObject(textObject);
      canvas.requestRenderAll();
    }
  };

  // Attach event listeners
  canvas.on("mouse:dblclick", handleDoubleClick);
  canvas.on("object:added", handleObjectAdded);
  canvas.on("mouse:over", handleMouseOver);
  canvas.on("mouse:out", handleMouseOut);
  canvas.on("selection:created", handleSelectionCreated);
  canvas.on("text:editing:entered", handleTextEditingEntered);
  canvas.on("text:editing:exited", handleTextEditingExited);

  // Return cleanup function
  return () => {
    canvas.off("mouse:dblclick", handleDoubleClick);
    canvas.off("object:added", handleObjectAdded);
    canvas.off("mouse:over", handleMouseOver);
    canvas.off("mouse:out", handleMouseOut);
    canvas.off("selection:created", handleSelectionCreated);
    canvas.off("text:editing:entered", handleTextEditingEntered);
    canvas.off("text:editing:exited", handleTextEditingExited);
  };
};
