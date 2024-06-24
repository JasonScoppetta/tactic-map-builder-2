import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { useMap } from "@/components/Map/providers/MapProvider/context";
import React from "react";

export const MapGrid: React.FC = () => {
  const { gridSize } = useMap();
  const editor = useMapEditor();

  const width = editor?.areaWidth || 0;
  const height = editor?.areaHeight || 0;

  const gridLines = React.useMemo(() => {
    const lines: React.ReactElement[] = [];

    if (!editor?.showGrid) return lines;

    // Vertical lines
    for (let x = gridSize; x < width; x += gridSize) {
      lines.push(
        <line
          key={`vertical-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="#ccc"
          strokeWidth="1"
        />,
      );
    }

    // Horizontal lines
    for (let y = gridSize; y < height; y += gridSize) {
      lines.push(
        <line
          key={`horizontal-${y}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="#ccc"
          strokeWidth="1"
        />,
      );
    }

    return lines;
  }, [editor?.showGrid, gridSize, width, height]);

  const gridGuideLines = React.useMemo(() => {
    const lines: React.ReactElement[] = [];

    if (!editor?.guides) return lines;

    // Vertical lines
    for (const x of editor.guides.x) {
      lines.push(
        <line
          key={`guide-vertical-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="#56A8F5"
          strokeWidth="2"
        />,
      );
    }

    // Horizontal lines
    for (const y of editor.guides.y) {
      lines.push(
        <line
          key={`guide-horizontal-${y}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="#56A8F5"
          strokeWidth="2"
        />,
      );
    }

    return lines;
  }, [editor?.guides, width, height]);

  return (
    <>
      <g>{gridLines}</g>
      <g>{gridGuideLines}</g>
    </>
  );
};
