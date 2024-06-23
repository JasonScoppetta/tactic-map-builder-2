import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { getObjectKeys } from "@/helpers/getObjectKeys";
import React from "react";

export const useEditorSelectionBoundingRect = () => {
  const editor = useMapEditor();
  const groupSelectionKeys = getObjectKeys(editor?.selectedGroups || {});
  return React.useMemo(() => {
    const rect: Pick<DOMRect, "x" | "y" | "width" | "height"> = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    const groups = groupSelectionKeys.map((key) =>
      window.document.querySelector(`[data-group-id="${key}"]`),
    );

    let lowestX: number | undefined;
    let lowestY: number | undefined;
    let highestRight: number | undefined;
    let highestBottom: number | undefined;

    groups.forEach((group) => {
      if (group) {
        const elemRect = group.getBoundingClientRect();
        if (lowestX === undefined || elemRect.x < lowestX) {
          lowestX = elemRect.x;
        }
        if (lowestY === undefined || elemRect.y < lowestY) {
          lowestY = elemRect.y;
        }
        if (highestRight === undefined || elemRect.right > highestRight) {
          highestRight = elemRect.right;
        }
        if (highestBottom === undefined || elemRect.bottom > highestBottom) {
          highestBottom = elemRect.bottom;
        }
      }
    });

    rect.x = lowestX || 0;
    rect.y = lowestY || 0;
    rect.width = (highestRight || 0) - rect.x;
    rect.height = (highestBottom || 0) - rect.y;

    return rect;
  }, [groupSelectionKeys]);
};
