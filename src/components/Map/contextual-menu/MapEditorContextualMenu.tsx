import { SpotContextMenuItems } from "@/components/Map/contextual-menu/menus/SpotContextMenuItems";
import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/primitives/context-menu";
import { SelectionTargetType } from "@/types";
import React, { PropsWithChildren } from "react";

export const MapEditorContextualMenu: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const editor = useMapEditor();

  const [target, setTarget] = React.useState<{
    target: SelectionTargetType;
    id: string;
  }>();

  return (
    <ContextMenu>
      <ContextMenuTrigger
        onContextMenu={(event) => {
          event.stopPropagation();

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
              setTarget({
                target: "spot",
                id: spotId,
              });
              return;
            }
          }

          event.preventDefault();
        }}
      >
        <>{children}</>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {target?.target === "spot" && <SpotContextMenuItems id={target.id} />}
      </ContextMenuContent>
    </ContextMenu>
  );
};
