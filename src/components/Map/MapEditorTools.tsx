import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { Icon } from "@/components/primitives/Icon";
import { getObjectKeys } from "@/helpers/getObjectKeys";
import { useEditorSelectionBoundingRect } from "@/hooks/useEditorSelectionBoundingRect";
import React from "react";

export const MapEditorTools = () => {
  const selectionRect = useEditorSelectionBoundingRect();
  const editor = useMapEditor();

  const selection = getObjectKeys(editor?.selection || {}).filter(
    (key) => editor?.selection[key] === "group",
  );
  const isSingleSelect = selection.length === 1;

  const group = React.useMemo(() => {
    if (!isSingleSelect) return undefined;
    return editor?.value?.groups.find((group) => group.id === selection[0]);
  }, [selection, isSingleSelect]);
  const rows = group?.rows || [];

  function addSpotToRow(rowId: string) {
    editor?.addSpot({
      groupId: selection[0],
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
            editor?.updateGroup(selection[0], {
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
