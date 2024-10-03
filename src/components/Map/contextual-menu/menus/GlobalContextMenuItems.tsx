import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { ContextMenuItem } from "@/components/primitives/context-menu";
import React from "react";

export const GlobalContextMenuItems: React.FC = () => {
  const editor = useMapEditor();

  const handleAddGroup = (event: React.MouseEvent) => {
    editor?.addGroup({
      x: 0,
      y: 0,
      orientation: "horizontal",
    });
  };

  const handleAddText = (event: React.MouseEvent) => {
    editor?.addText({
      text: "New text",
      x: 0,
      y: 0,
      fontSize: 12,
    });
  };

  const handleAddIcon = (event: React.MouseEvent) => {
    editor?.addIcon({
      icon: { set: "lucide", icon: "Clock" },
      x: 0,
      y: 0,
      fontSize: 12,
    });
  };

  return (
    <>
      <ContextMenuItem onClick={handleAddGroup}>Add group</ContextMenuItem>
      <ContextMenuItem onClick={handleAddText}>Add text</ContextMenuItem>
      <ContextMenuItem onClick={handleAddIcon}>Add icon</ContextMenuItem>
    </>
  );
};