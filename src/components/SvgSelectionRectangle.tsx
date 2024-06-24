import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { EventResourceId } from "@/helpers/event-manager";
import React from "react";

export interface SvgSelectionRectangleProps {
  isSelected: boolean;
  targetRef: SVGGElement | null;
  updateEventId?: EventResourceId;
}

export const SvgSelectionRectangle: React.FC<SvgSelectionRectangleProps> = ({
  isSelected,
  targetRef,
  updateEventId,
}) => {
  const editor = useMapEditor();
  const [selectBoxRef, setSelectBoxRef] = React.useState<SVGRectElement | null>(
    null,
  );

  const updateSelection = React.useCallback(() => {
    if (!isSelected) {
      setSelectBoxRef(null);
      return;
    }

    if (!selectBoxRef) return;
    const groupSize = targetRef?.getBBox();

    console.log(groupSize);

    selectBoxRef.setAttribute("width", String(groupSize?.width || 0));
    selectBoxRef.setAttribute("height", String(groupSize?.height || 0));
  }, [isSelected, selectBoxRef, targetRef]);

  React.useEffect(() => {
    updateSelection();
  }, [updateSelection]);

  React.useEffect(() => {
    if (!updateEventId) return;

    editor?.events.addListener(updateEventId, "update", updateSelection);

    return () => {
      editor?.events.removeListener(updateEventId, "update", updateSelection);
    };
  }, [updateEventId, updateSelection]);

  if (!isSelected) return null;

  return (
    <rect
      ref={setSelectBoxRef}
      width={1}
      height={1}
      x={0}
      y={0}
      className={"selection-rectangle fill-primary/50 stroke-primary stroke-2"}
    />
  );
};
