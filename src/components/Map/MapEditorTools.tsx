import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { getObjectKeys } from "@/helpers/getObjectKeys";
import { useEditorSelectionBoundingRect } from "@/hooks/useEditorSelectionBoundingRect";
import React from "react";

export const MapEditorTools = () => {
  const selectionRect = useEditorSelectionBoundingRect();
  const editor = useMapEditor();

  const selectedGroups = getObjectKeys(editor?.selectedGroups || {});
  const isSingleSelect = selectedGroups.length === 1;

  const rows = React.useMemo(() => {
    if (!isSingleSelect) return [];
    return (
      editor?.value?.groups.find((group) => group.id === selectedGroups[0])
        ?.rows || []
    );
  }, [selectedGroups, isSingleSelect]);

  function addSpotToRow(rowId: string) {
    editor?.addSpot({
      groupId: selectedGroups[0],
      type: "Desk",
      rowId,
    });
  }

  return (
    <div
      className={"absolute z-sticky p-4 bg-primary"}
      style={{
        top: selectionRect?.y,
        left: selectionRect?.x + selectionRect?.width,
      }}
    >
      {isSingleSelect && (
        <>
          {rows?.map((row) => (
            <div key={row.id}>
              <button onClick={() => addSpotToRow(row.id)}>+ {row.id}</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
