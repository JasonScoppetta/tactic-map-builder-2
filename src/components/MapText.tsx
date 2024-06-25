import { SvgSelectionRectangle } from "@/components/SvgSelectionRectangle";
import { useEditorItemGestures } from "@/hooks/useEditorItemGestures";
import { MapText as IMapText } from "@/types";
import React from "react";

export interface MapTextProps {
  text: IMapText;
}

export const MapText: React.FC<MapTextProps> = ({ text }) => {
  const editorActions = useEditorItemGestures({ ...text, type: "text" });
  const groupRef = React.useRef<SVGGElement | null>(null);

  return (
    <g
      className={"map-text touch-none"}
      data-text-id={text.id}
      transform={`translate(${text.x}, ${text.y})`}
      {...editorActions?.bindListeners()}
    >
      <SvgSelectionRectangle
        isSelected={editorActions?.isSelected || false}
        targetRef={groupRef.current}
        updateEventId={text?.id}
      />
      <g ref={groupRef}>
        <text
          x={0}
          y={0}
          fontSize={text.fontSize}
          fill={text.textColor}
          fontWeight={text.fontWeight}
          fontFamily={text.fontFamily}
          dominantBaseline={"hanging"}
          className={"touch-none select-none"}
        >
          {text.text}
        </text>
      </g>
    </g>
  );
};
