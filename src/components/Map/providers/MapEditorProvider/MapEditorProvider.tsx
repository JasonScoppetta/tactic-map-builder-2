import { MapEditorTools } from "@/components/Map/MapEditorTools";
import { DraggingGuides, GroupPosition } from "@/types";
import React from "react";
import { MapEditorContext, MapEditorProviderProps } from "./context";

export const MapEditorProvider: React.FC<MapEditorProviderProps> = (props) => {
  const { children, ...rest } = props;

  const [selectedGroups, setSelectedGroups] = React.useState<
    Record<string, boolean>
  >({});

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

  const selectGroup = (id: string, appendSelection?: boolean) => {
    if (appendSelection) {
      setSelectedGroups((prev) => ({ ...prev, [id]: true }));
      return;
    }
    setSelectedGroups({ [id]: true });
  };

  const clearSelection = () => {
    setSelectedGroups({});
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
        selectGroup,
        clearSelection,
        draggingGroup,
        guides: draggingGuides,
        selectedGroups,
      }}
    >
      <MapEditorTools />
      {children}
    </MapEditorContext.Provider>
  );
};
