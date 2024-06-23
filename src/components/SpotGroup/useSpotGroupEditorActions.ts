import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { useMap } from "@/components/Map/providers/MapProvider/context";
import { useIsEditing } from "@/hooks/useIsEditing";
import { GroupPosition, SpotGroup } from "@/types";
import { useDrag } from "@use-gesture/react";
import React from "react";

export const useSpotGroupEditorActions = (group: SpotGroup) => {
  const { gridSize } = useMap();
  const editor = useMapEditor();
  const isEditing = useIsEditing();

  const startPosition = React.useRef<GroupPosition & { isDragging: boolean }>({
    x: group.x || 0,
    y: group.y || 0,
    isDragging: false,
  });

  const bindListeners = useDrag(
    (options) => {
      const {
        down,
        dragging,
        metaKey,
        movement: [mx, my],
        tap,
      } = options;

      if (tap) {
        editor?.selectGroup(group.id, metaKey);
        return;
      }

      if (!startPosition.current.isDragging && dragging) {
        startPosition.current.isDragging = true;
        startPosition.current.x = group.x;
        startPosition.current.y = group.y;
        editor?.startDraggingGroup(group.id);
      }

      if (!down) {
        startPosition.current.isDragging = false;
        editor?.endDraggingGroup();
        return;
      }

      // Calculate snapped positions based on grid size
      const snappedX =
        Math.round((startPosition.current.x + mx) / gridSize) * gridSize;
      const snappedY =
        Math.round((startPosition.current.y + my) / gridSize) * gridSize;

      // Update position with snapped coordinates
      //setPosition({ x: snappedX, y: snappedY });
      editor?.moveGroup(group.id, { x: snappedX, y: snappedY });
    },
    { filterTaps: true },
  );

  if (!isEditing) return undefined;

  return {
    bindListeners: () => {
      const events = bindListeners();
      const eventClick = events.onClick;
      events.onClick = (e) => {
        e.stopPropagation();
        eventClick?.(e);
      };
      return events;
    },
  };
};
