import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { useMap } from "@/components/Map/providers/MapProvider/context";
import { useIsEditing } from "@/hooks/useIsEditing";
import { useIsItemSelected } from "@/hooks/useIsItemSelected";
import { EditorItemObject, ItemPosition } from "@/types";
import { useDrag } from "@use-gesture/react";
import React from "react";

export const useEditorItemGestures = (item: EditorItemObject) => {
  const { gridSize } = useMap();
  const editor = useMapEditor();
  const isSelected = useIsItemSelected(item.id, item.type);
  const isEditing = useIsEditing();

  const startPosition = React.useRef<ItemPosition & { isDragging: boolean }>({
    x: item.x || 0,
    y: item.y || 0,
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
        editor?.updateSelection(item.id, item.type, metaKey);
        return;
      }

      if (!startPosition.current.isDragging && dragging) {
        startPosition.current.isDragging = true;
        startPosition.current.x = item.x;
        startPosition.current.y = item.y;
        editor?.startDraggingItem(item.id);
      }

      if (!down) {
        startPosition.current.isDragging = false;
        editor?.endDraggingItem();
        return;
      }

      // Calculate snapped positions based on grid size
      const snappedX =
        Math.round((startPosition.current.x + mx) / gridSize) * gridSize;
      const snappedY =
        Math.round((startPosition.current.y + my) / gridSize) * gridSize;

      // Update position with snapped coordinates
      //setPosition({ x: snappedX, y: snappedY });
      editor?.moveItem(item.id, item.type, { x: snappedX, y: snappedY });
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
    isSelected,
  };
};
