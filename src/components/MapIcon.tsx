import { IconFromSet } from "@/components/IconFromSet";
import { SvgSelectionRectangle } from "@/components/SvgSelectionRectangle";
import { useEditorItemGestures } from "@/hooks/useEditorItemGestures";
import { MapIcon as IMapIcon } from "@/types";
import React from "react";

export interface MapIconProps {
  icon: IMapIcon;
}

export const MapIcon: React.FC<MapIconProps> = ({ icon }) => {
  const editorActions = useEditorItemGestures({ ...icon, type: "icon" });
  const groupRef = React.useRef<SVGGElement | null>(null);

  return (
    <g
      className={"map-icon touch-none"}
      data-selection-type={"icon"}
      data-icon-id={icon.id}
      transform={`translate(${icon.x}, ${icon.y})`}
      {...editorActions?.bindListeners()}
    >
      <SvgSelectionRectangle
        isSelected={editorActions?.isSelected || false}
        targetRef={groupRef.current}
        updateEventId={icon?.id}
      />
      <g ref={groupRef}>
        <IconFromSet
          icon={icon.icon}
          size={icon.fontSize || 8}
          color={icon.color}
        />
      </g>
    </g>
  );
};
