import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/primitives/context-menu";
import React, { PropsWithChildren } from "react";

export const MapEditorContextualMenu: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const editor = useMapEditor();
  return (
    <ContextMenu modal>
      <ContextMenuTrigger
        onContextMenu={(event) => {
          event.stopPropagation();
          event.preventDefault();

          let spotItem: HTMLElement | null = null;

          let target = event.target as HTMLElement;
          while (target) {
            target = target.parentElement as HTMLElement;
            if (target?.classList?.contains("spot-item")) {
              spotItem = target;
              break;
            }
          }

          if (spotItem) {
            const spotId = spotItem.getAttribute("data-spot-id");
            if (spotId) {
              editor?.updateSelection(spotId, "spot");
              console.log(spotId);
            }
          }
        }}
      >
        <>{children}</>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Edit panel</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
