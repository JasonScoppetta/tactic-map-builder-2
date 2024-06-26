import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { MapEditorEventData } from "@/helpers/event-manager";
import { SelectionTargetType } from "@/types";
import React from "react";

export interface SvgGroupPreviewProps {
  width?: number;
  height?: number;
  targetId: string;
  targetType: SelectionTargetType;
  groupId?: string;
}

export const SvgGroupPreview: React.FC<SvgGroupPreviewProps> = ({
  width = 32,
  height = 32,
  targetType,
  targetId,
  groupId,
}) => {
  const editor = useMapEditor();
  const layerPreviewGroupRef = React.useRef<SVGSVGElement>(null);
  const targetElement = document.querySelector(
    `[data-${targetType}-id="${targetId}"]`,
  );

  const updateLayerPreview = () => {
    if (!targetElement || !layerPreviewGroupRef.current) {
      return;
    }

    const spotElementClone = targetElement.cloneNode(true) as HTMLElement;
    spotElementClone.querySelector(".selection-rectangle")?.remove();
    layerPreviewGroupRef.current.innerHTML = spotElementClone.innerHTML;

    const layerPreviewRect = layerPreviewGroupRef.current.getBBox();

    const newViewBox = [
      0,
      0,
      layerPreviewRect.width,
      layerPreviewRect.height,
    ].join(" ");

    (layerPreviewGroupRef.current.parentNode as SVGSVGElement)?.setAttribute(
      "viewBox",
      newViewBox,
    );
  };

  React.useEffect(() => {
    updateLayerPreview();

    const onItemUpdated = (event: MapEditorEventData) => {
      if (event.targetType === targetType && event.id === targetId) {
        updateLayerPreview();
      }
    };

    const onGroupUpdated = (event: MapEditorEventData) => {
      if (event.targetType === "group" && event.id === groupId) {
        updateLayerPreview();
      }
    };

    editor?.events?.addListener(targetId, "update", onItemUpdated);
    if (groupId) {
      editor?.events?.addListener(groupId, "update", onGroupUpdated);
    }
    return () => {
      editor?.events?.removeListener(targetId, "update", onItemUpdated);
      if (groupId) {
        editor?.events?.removeListener(groupId, "update", onGroupUpdated);
      }
    };
  }, [
    targetId,
    targetElement,
    layerPreviewGroupRef.current,
    targetType,
    groupId,
  ]);

  return (
    <div
      className={
        "flex border border-secondary bg-primary-background overflow-hidden rounded-sm flex-shrink-0"
      }
      style={{ width }}
    >
      <svg viewBox={`0 0 ${width} ${height}`} height={height} width={width}>
        <g ref={layerPreviewGroupRef}></g>
      </svg>
    </div>
  );
};
