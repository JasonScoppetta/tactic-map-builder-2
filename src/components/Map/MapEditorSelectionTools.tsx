import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { MapEditorEventData } from "@/helpers/event-manager";
import { getObjectKeys } from "@/helpers/getObjectKeys";
import { sanitizeDep } from "@/helpers/sanitizeDep";
import { useEditorSelectionBoundingRect } from "@/hooks/useEditorSelectionBoundingRect";
import { SpotGroup } from "@/types";
import React from "react";

export const MapEditorSelectionTools = () => {
  const selectionRect = useEditorSelectionBoundingRect();
  const editor = useMapEditor();

  const selection = getObjectKeys(editor?.selection || {}).filter(
    (key) => editor?.selection[key] === "group",
  );
  const [rowRects, setRowRects] = React.useState<Record<string, DOMRect>>({});
  const isSingleSelect = selection.length === 1;
  const sanitizedSelection = sanitizeDep(selection);

  const [group, setGroup] = React.useState<SpotGroup | undefined>();
  const rows = group?.rows || [];

  function addSpotToRow(rowId: string) {
    editor?.addSpot({
      groupId: selection[0],
      rowId,
    });
  }

  const handleAddRow = () => {
    console.log(selection[0]);
    if (!selection[0]) return;
    if (editor?.selection?.[selection[0]] !== "group") return;
    const newRow = editor?.addRow({
      groupId: selection[0],
    });
    console.log(newRow);
    if (!newRow) return;
    addSpotToRow(newRow.id);
  };

  React.useEffect(() => {
    const update = (targetGroup?: SpotGroup) => {
      console.log("HERE");
      if (!isSingleSelect) return;
      const groupSelection = editor?.selection[selection[0]];
      if (groupSelection !== "group") return;
      const group = targetGroup || editor?.getItem(selection[0]);
      if (!group || !("rows" in group)) return;
      const rects: Record<string, DOMRect> = {};
      group.rows.forEach((row) => {
        const lastItem = row.items[row.items.length - 1];
        const rowElement = document.querySelector(
          lastItem
            ? `[data-spot-id="${lastItem.id}"]`
            : `[data-row-id="${row.id}"]`,
        );
        if (!rowElement) return;
        rects[row.id] = rowElement.getBoundingClientRect();
      });
      setRowRects(rects);
      setGroup(group);
    };

    const updateEvent = (event: MapEditorEventData) => {
      update(event.group);
    };

    editor?.events.addListener(selection[0], "update", updateEvent);
    update();

    return () => {
      editor?.events.removeListener(selection[0], "update", updateEvent);
      setGroup(undefined);
      setRowRects({});
    };
  }, [sanitizedSelection, isSingleSelect]);

  if (!group) return null;

  return (
    <>
      {isSingleSelect && (
        <>
          {rows?.map((row) => (
            <div
              className={
                "flex absolute pointer-events-none items-end justify-start"
              }
              style={{
                top: rowRects[row.id]?.y,
                left: rowRects[row.id]?.x,
                width: rowRects[row.id]?.width,
                height: rowRects[row.id]?.height,
              }}
              key={row.id}
            >
              <Button
                className={"bg-primary pointer-events-auto"}
                onClick={() => addSpotToRow(row.id)}
                icon={"Plus"}
              />
            </div>
          ))}
        </>
      )}
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
            console.log(group);
            editor?.updateGroup(selection[0], {
              rotation: (group?.rotation || 0) + 10,
            });
          }}
        >
          <Icon name={"RotateCw"} color={"white"} />
        </div>
      </div>
      <div
        className={"absolute z-sticky bg-primary"}
        style={{
          top: selectionRect?.y,
          left: selectionRect?.x + selectionRect?.width,
        }}
      >
        <Button
          className={"bg-primary pointer-events-auto"}
          onClick={() => handleAddRow()}
          icon={"Plus"}
        />
      </div>
    </>
  );
};
