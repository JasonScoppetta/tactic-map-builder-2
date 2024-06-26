import { LayerGroup } from "@/components/Layers/LayerGroup";
import { LayerIconItem } from "@/components/Layers/LayerIcontem";
import { LayerSpotItem } from "@/components/Layers/LayerSpotItem";
import { LayerTextItem } from "@/components/Layers/LayerTexttem";
import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import React from "react";

export const Layers: React.FC = () => {
  const editor = useMapEditor();
  if (!editor) return null;

  const handleAddSpotToRow = (groupId: string, rowId: string) => {
    editor?.addSpot({
      groupId,
      rowId,
    });
  };

  const handleAddRowToGroup = (groupId: string) => {
    const newRow = editor?.addRow({ groupId });
    if (newRow) {
      handleAddSpotToRow(groupId, newRow.id);
    }
  };

  const handleDeleteRow = (groupId: string, rowId: string) => {
    editor?.deleteRow({ groupId, rowId });
  };

  return (
    <div className={"flex flex-col"}>
      <LayerGroup title={"Text"} isRoot>
        {editor.value?.texts.map((text) => (
          <LayerTextItem indentation={1} key={text.id} text={text}>
            {text.id}
          </LayerTextItem>
        ))}
      </LayerGroup>
      <LayerGroup title={"Icons"} isRoot>
        {editor.value?.icons.map((icon) => (
          <LayerIconItem indentation={1} key={icon.id} icon={icon}>
            {icon.id}
          </LayerIconItem>
        ))}
      </LayerGroup>
      <LayerGroup title={"Groups"} isRoot>
        {editor.value?.groups.map((group) => (
          <LayerGroup
            key={group.id}
            title={group.label}
            indentation={1}
            selectionType={"group"}
            selectionId={group.id}
            onAdd={() => handleAddRowToGroup(group.id)}
          >
            {group.rows.map((row, rowIndex) => (
              <LayerGroup
                title={"Row " + (rowIndex + 1)}
                key={row.id}
                indentation={2}
                onAdd={() => handleAddSpotToRow(group.id, row.id)}
                onDelete={() => handleDeleteRow(group.id, row.id)}
              >
                {row.items.map((item) => (
                  <LayerSpotItem
                    indentation={2}
                    key={item.id}
                    spot={item}
                    group={group}
                  >
                    {item.id}
                  </LayerSpotItem>
                ))}
              </LayerGroup>
            ))}
          </LayerGroup>
        ))}
      </LayerGroup>
    </div>
  );
};
