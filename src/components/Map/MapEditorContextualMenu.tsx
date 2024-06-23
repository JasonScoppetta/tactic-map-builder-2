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
            console.log(spotItem);
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
