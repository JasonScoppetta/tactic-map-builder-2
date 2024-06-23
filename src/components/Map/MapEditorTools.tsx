import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { Icon } from "@/components/primitives/Icon";
import { getObjectKeys } from "@/helpers/getObjectKeys";
import { useEditorSelectionBoundingRect } from "@/hooks/useEditorSelectionBoundingRect";
import React from "react";

export const MapEditorTools = () => {
  const selectionRect = useEditorSelectionBoundingRect();
  const editor = useMapEditor();

  const selectedGroups = getObjectKeys(editor?.selectedGroups || {});
  const isSingleSelect = selectedGroups.length === 1;

  const group = React.useMemo(() => {
    if (!isSingleSelect) return undefined;
    return editor?.value?.groups.find(
      (group) => group.id === selectedGroups[0],
    );
  }, [selectedGroups, isSingleSelect]);
  const rows = group?.rows || [];

  function addSpotToRow(rowId: string) {
    editor?.addSpot({
      groupId: selectedGroups[0],
      type: "Desk",
      rowId,
    });
  }

  if (!group) return null;

  return (
    <>
      <div
        className={"absolute"}
        style={{
          top: selectionRect?.y + selectionRect?.height / 2 - 16,
          left: selectionRect?.x + selectionRect?.width / 2 - 16,
        }}
      >
        <div
          className={
            "bg-primary w-8 h-8 rounded-[100%] flex items-center justify-center shadow-lg border border-input"
          }
          onClick={() => {
            editor?.updateGroup(selectedGroups[0], {
              rotation: (group?.rotation || 0) + 10,
            });
          }}
        >
          <Icon name={"RotateCw"} color={"white"} />
        </div>
      </div>
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
    </>
  );
};
