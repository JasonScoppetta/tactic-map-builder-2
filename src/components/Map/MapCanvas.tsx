import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import React from "react";
import { CanvasText } from "@/components/Map/canvas/CanvasText";
import { useCanvas } from "@/components/Map/canvas/useCanvas";

export function MapCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { initCanvas, addText } = useCanvas();
  const editor = useMapEditor();
  console.log("VALUE", editor?.value);

  React.useEffect(() => {
    if (canvasRef.current) {
      const cleanup = initCanvas(canvasRef.current);
      return cleanup;
    }
  }, [initCanvas]);

  return <canvas ref={canvasRef} className="w-full h-full bg-red-100" />;
}

export function MapCanvas2() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const editor = useMapEditor();

  const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(
    null,
  );

  React.useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    setContext(ctx);
  }, [canvasRef.current]);

  const render = React.useCallback(() => {
    if (!context || !canvasRef.current) return;

    // Clear canvas
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    CanvasText.draw(context, {
      id: "text",
      x: 0,
      y: 0,
      text: "Hello, world!",
      textColor: "black",
      fontSize: 16,
      fontFamily: "Arial",
    });
  }, [editor]);

  React.useEffect(() => {
    const animationFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrame);
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        cursor: editor?.selectedMainTool === "moveMap" ? "move" : "default",
        background: "red",
        width: "100%",
        height: "100%",
      }}
    />
  );
}
