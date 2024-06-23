import { LayerGroup } from "@/components/Layers/LayerGroup";
import { LayerSpotItem } from "@/components/Layers/LayerSpotItem";
import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import React from "react";

export const Layers: React.FC = () => {
  const editor = useMapEditor();
  if (!editor) return null;

  return (
    <div className={"flex flex-col"}>
      <LayerGroup title={"Text"}></LayerGroup>
      <LayerGroup title={"Icons"}></LayerGroup>
      <LayerGroup title={"Groups"}>
        {editor.value?.groups.map((group) => (
          <LayerGroup key={group.id} title={group.label} indentation={1}>
            {group.rows.map((row, rowIndex) => (
              <LayerGroup
                title={"Row " + (rowIndex + 1)}
                key={row.id}
                indentation={2}
              >
                {row.items.map((item) => (
                  <LayerSpotItem indentation={2} key={item.id} spot={item}>
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
