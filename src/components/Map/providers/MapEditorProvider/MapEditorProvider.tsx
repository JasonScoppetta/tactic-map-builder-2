import { MapEditorSelectionTools } from "@/components/Map/MapEditorSelectionTools";
import { EventManager } from "@/helpers/event-manager";
import { getUuid } from "@/helpers/getUuid";
import {
  AddSpotOptions,
  DraggingGuides,
  GetSpotReturn,
  ItemPosition,
  MapIcon,
  MapText,
  SelectionTarget,
  SelectionTargets,
  SelectionTargetType,
  SpotGroup,
  SpotItem,
} from "@/types";
import React from "react";
import { MapEditorContext, MapEditorProviderProps } from "./context";

export const MapEditorProvider: React.FC<MapEditorProviderProps> = (props) => {
  const { children, ...rest } = props;

  const events = React.useMemo(() => {
    return new EventManager();
  }, []);

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

  const startDraggingItem = (id: string) => {
    setDraggingGroup(id);
    updateGroupsPositions(id);
  };

  const endDraggingItem = () => {
    setDraggingGroup(null);
    updateGroupsPositions();
    clearGuides();
  };

  const moveItem = (
    id: string,
    type: SelectionTargetType,
    position: ItemPosition,
  ) => {
    setMapState((prev) => {
      if (!prev) return undefined;
      const group = prev.groups.find((g) => g.id === id);

      if (group)
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

      if (type === "group")
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

      if (type === "text")
        return {
          ...prev,
          texts: prev.texts.map((t) => {
            if (t.id === id) {
              return {
                ...t,
                x: position.x,
                y: position.y,
              };
            }
            return t;
          }),
        };

      if (type === "icon")
        return {
          ...prev,
          icons: prev.icons.map((i) => {
            if (i.id === id) {
              return {
                ...i,
                x: position.x,
                y: position.y,
              };
            }
            return i;
          }),
        };

      return prev;
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

    let updatedGroup: SpotGroup | undefined;

    setMapState((prev) => {
      if (!prev) return undefined;
      return {
        ...prev,
        groups: prev.groups.map((group) => {
          if (group.id === options.groupId) {
            const _group = {
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

            updatedGroup = _group;

            return _group;
          }
          return group;
        }),
      };
    });

    events.dispatchEvent(
      {
        event: "add",
        targetType: "spot",
        id: newSpot.id,
        spot: newSpot,
      },
      false,
    );

    events.dispatchEvent(
      {
        event: "update",
        targetType: "group",
        id: options.groupId,
        group: updatedGroup,
      },
      false,
    );

    return newSpot;
  };

  const updateGroup = (groupId: string, group: Partial<SpotGroup>) => {
    let updatedGroup: SpotGroup | undefined;
    setMapState((prev) => {
      if (!prev) return undefined;
      return {
        ...prev,
        groups: prev.groups.map((g) => {
          if (g.id === groupId) {
            const _group = {
              ...g,
              ...group,
            };

            updatedGroup = _group;

            return _group;
          }
          return g;
        }),
      };
    });

    events.dispatchEvent(
      {
        event: "update",
        targetType: "group",
        id: groupId,
        group: updatedGroup,
      },
      false,
    );
  };

  const updateSpot = (spotId: string, spot: Partial<SpotItem>) => {
    setMapState((prev) => {
      if (!prev) return undefined;
      let updatedSpot: SpotItem | undefined;
      const newState = {
        ...prev,
        groups: prev.groups.map((group) => {
          return {
            ...group,
            rows: group.rows.map((row) => {
              return {
                ...row,
                items: row.items.map((item) => {
                  if (item.id === spotId) {
                    const _spot = {
                      ...item,
                      ...spot,
                    };

                    updatedSpot = _spot;

                    return _spot;
                  }
                  return item;
                }),
              };
            }),
          };
        }),
      };

      events.dispatchEvent(
        {
          event: "update",
          targetType: "spot",
          id: spotId,
          spot: updatedSpot,
        },
        false,
      );

      return newState;
    });
  };

  const updateText = (textId: string, text: Partial<MapText>) => {
    setMapState((prev) => {
      if (!prev) return undefined;
      let updatedText: MapText | undefined;
      const newState = {
        ...prev,
        texts: prev.texts.map((t) => {
          if (t.id === textId) {
            const _text = {
              ...t,
              ...text,
            };

            updatedText = _text;

            return _text;
          }
          return t;
        }),
      };

      events.dispatchEvent(
        {
          event: "update",
          targetType: "text",
          id: textId,
          text: updatedText,
        },
        false,
      );

      return newState;
    });
  };

  const updateIcon = (iconId: string, icon: Partial<MapIcon>) => {
    setMapState((prev) => {
      if (!prev) return undefined;
      let updatedIcon: MapIcon | undefined;
      const newState = {
        ...prev,
        icons: prev.icons.map((i) => {
          if (i.id === iconId) {
            const _icon = {
              ...i,
              ...icon,
            };

            updatedIcon = _icon;

            return _icon;
          }
          return i;
        }),
      };

      events.dispatchEvent(
        {
          event: "update",
          targetType: "icon",
          id: iconId,
          icon: updatedIcon,
        },
        false,
      );

      return newState;
    });
  };

  const updateItem = (
    id: string,
    type: SelectionTargetType,
    property: string,
    value: unknown,
  ) => {
    if (type === "group") {
      updateGroup(id, { [property]: value });
      return;
    }

    if (type === "spot") {
      updateSpot(id, { [property]: value });
      return;
    }

    if (type === "text") {
      updateText(id, { [property]: value });
      return;
    }

    if (type === "icon") {
      updateIcon(id, { [property]: value });
      return;
    }
  };

  const getItem = (id: string): SelectionTarget | undefined => {
    if (!mapState) return undefined;

    for (const text of mapState.texts) {
      if (text.id === id) return text;
    }

    for (const icon of mapState.icons) {
      if (icon.id === id) return icon;
    }

    for (const group of mapState.groups) {
      if (group.id === id) return group;
      for (const row of group.rows) {
        if (row.id === id) return row;
        for (const item of row.items) {
          if (item.id === id) {
            return item;
          }
        }
      }
    }

    return undefined;
  };

  const getSpot = (spotId: string): GetSpotReturn | undefined => {
    if (!mapState) return undefined;

    for (const group of mapState.groups) {
      for (const row of group.rows) {
        for (const item of row.items) {
          if (item.id === spotId) {
            return {
              group,
              row,
              spot: item,
            };
          }
        }
      }
    }

    return undefined;
  };

  React.useEffect(() => {
    updateGroupsPositions();
  }, []);

  setTimeout(() => {
    events.processQueue();
  }, 1);

  return (
    <MapEditorContext.Provider
      value={{
        ...rest,
        value: mapState,
        moveItem,
        startDraggingItem,
        endDraggingItem,
        updateSelection,
        clearSelection,
        addSpot,
        updateItem,
        updateGroup,
        updateSpot,
        updateText,
        updateIcon,
        getSpot,
        getItem,
        draggingGroup,
        guides: draggingGuides,
        selection,
        events,
      }}
    >
      <MapEditorSelectionTools />
      {children}
    </MapEditorContext.Provider>
  );
};
