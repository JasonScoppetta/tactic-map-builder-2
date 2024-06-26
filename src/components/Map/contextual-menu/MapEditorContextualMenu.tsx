import { IconContextMenuItems } from "@/components/Map/contextual-menu/menus/IconContextMenuItems";
import { SpotContextMenuItems } from "@/components/Map/contextual-menu/menus/SpotContextMenuItems";
import { TextContextMenuItems } from "@/components/Map/contextual-menu/menus/TextContextMenuItems";
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
          let textItem: HTMLElement | null = null;
          let iconItem: HTMLElement | null = null;

          let target = event.target as HTMLElement;
          while (target) {
            target = target.parentElement as HTMLElement;
            if (target?.classList?.contains("spot-item")) {
              spotItem = target;
              break;
            }

            if (target?.classList?.contains("map-text")) {
              textItem = target;
              break;
            }

            if (target?.classList?.contains("map-icon")) {
              iconItem = target;
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

          if (textItem) {
            const textId = textItem.getAttribute("data-text-id");
            if (textId) {
              editor?.updateSelection(textId, "text");
              setTarget({
                target: "text",
                id: textId,
              });
              return;
            }
          }

          if (iconItem) {
            const iconId = iconItem.getAttribute("data-icon-id");
            if (iconId) {
              editor?.updateSelection(iconId, "icon");
              setTarget({
                target: "icon",
                id: iconId,
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
        {target?.target === "text" && <TextContextMenuItems id={target.id} />}
        {target?.target === "icon" && <IconContextMenuItems id={target.id} />}
      </ContextMenuContent>
    </ContextMenu>
  );
};
