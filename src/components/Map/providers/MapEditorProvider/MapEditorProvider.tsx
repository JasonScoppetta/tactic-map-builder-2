import { MapEditorContextualMenu } from "@/components/Map/MapEditorContextualMenu";
import { MapEditorTools } from "@/components/Map/MapEditorTools";
import { getUuid } from "@/helpers/getUuid";
import {
  AddSpotOptions,
  DraggingGuides,
  GroupPosition,
  SelectionTargets,
  SelectionTargetType,
  SpotGroup,
  SpotItem,
} from "@/types";
import React from "react";
import { MapEditorContext, MapEditorProviderProps } from "./context";

export const MapEditorProvider: React.FC<MapEditorProviderProps> = (props) => {
  const { children, ...rest } = props;

  const [selection, setSelection] = React.useState<SelectionTargets>({});

  const [mapState, setMapState] = React.useState(props.value);
  const [draggingGroup, setDraggingGroup] = React.useState<null | string>(null);
  const [draggingGuides, setDraggingGuides] = React.useState<DraggingGuides>({
    x: [],
    y: [],
  });

  const [groupsInYPosition, setGroupsInYPosition] = React.useState<
    Record<number, number>
  >([]);

  const [groupsInXPosition, setGroupsInXPosition] = React.useState<
    Record<number, number>
  >([]);

  const clearGuides = () => {
    setDraggingGuides({ x: [], y: [] });
  };

  const updateGroupsPositions = (excludeGroupId?: string) => {
    setGroupsInYPosition(
      mapState?.groups.reduce(
        (acc, group) => ({
          ...acc,
          ...(excludeGroupId !== group.id ? { [group.y]: group.y } : undefined),
        }),
        {},
      ) || {},
    );

    setGroupsInXPosition(
      mapState?.groups.reduce(
        (acc, group) => ({
          ...acc,
          ...(excludeGroupId !== group.id ? { [group.x]: group.x } : undefined),
        }),
        {},
      ) || {},
    );
  };

  const startDraggingGroup = (id: string) => {
    setDraggingGroup(id);
    updateGroupsPositions(id);
  };

  const endDraggingGroup = () => {
    setDraggingGroup(null);
    updateGroupsPositions();
    clearGuides();
  };

  const moveGroup = (id: string, position: GroupPosition) => {
    setMapState((prev) => {
      if (!prev) return undefined;
      const group = prev.groups.find((g) => g.id === id);
      if (!group) return prev;

      setDraggingGuides({
        x:
          groupsInXPosition[position.x] &&
          groupsInXPosition[position.x] === group.x
            ? [position.x]
            : [],
        y:
          groupsInYPosition[position.y] &&
          groupsInYPosition[position.y] === group.y
            ? [position.y]
            : [],
      });

      return {
        ...prev,
        groups: prev.groups.map((g) => {
          if (g.id === id) {
            return {
              ...g,
              x: position.x,
              y: position.y,
            };
          }
          return g;
        }),
      };
    });
  };

  const updateSelection = (
    id: string,
    targetType: SelectionTargetType,
    appendSelection?: boolean,
  ) => {
    if (appendSelection) {
      setSelection((prev) => ({ ...prev, [id]: targetType }));
      return;
    }
    setSelection({ [id]: targetType });
  };

  const clearSelection = () => {
    setSelection({});
  };

  const addSpot = (options: AddSpotOptions) => {
    const newSpot: SpotItem = {
      id: getUuid(),
      type: options.type,
    } as SpotItem;

    setMapState((prev) => {
      if (!prev) return undefined;
      return {
        ...prev,
        groups: prev.groups.map((group) => {
          if (group.id === options.groupId) {
            return {
              ...group,
              rows: group.rows.map((row) => {
                if (row.id === options.rowId) {
                  return {
                    ...row,
                    items: row.items.concat(newSpot),
                  };
                }
                return row;
              }),
            };
          }
          return group;
        }),
      };
    });

    return newSpot;
  };

  const updateGroup = (groupId: string, group: Partial<SpotGroup>) => {
    setMapState((prev) => {
      if (!prev) return undefined;
      return {
        ...prev,
        groups: prev.groups.map((g) => {
          if (g.id === groupId) {
            return {
              ...g,
              ...group,
            };
          }
          return g;
        }),
      };
    });
  };

  React.useEffect(() => {
    updateGroupsPositions();
  }, []);

  return (
    <MapEditorContext.Provider
      value={{
        ...rest,
        value: mapState,
        moveGroup,
        startDraggingGroup,
        endDraggingGroup,
        updateSelection,
        clearSelection,
        addSpot,
        updateGroup,
        draggingGroup,
        guides: draggingGuides,
        selection,
      }}
    >
      <MapEditorTools />
      <MapEditorContextualMenu>{children}</MapEditorContextualMenu>
    </MapEditorContext.Provider>
  );
};
