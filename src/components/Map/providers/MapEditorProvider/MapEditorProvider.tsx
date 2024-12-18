import { MapEditorSelectionTools } from "@/components/Map/MapEditorSelectionTools";
import { EventManager } from "@/helpers/event-manager";
import { getObjectKeys } from "@/helpers/getObjectKeys";
import { getUuid } from "@/helpers/getUuid";
import {
  AddGroupOptions,
  AddIconOptions,
  AddRowOptions,
  AddSpotOptions,
  AddTextOptions,
  DeleteGroupOptions,
  DeleteRwOptions,
  DeleteSpotOptions,
  DeleteTextOptions,
  DraggingGuides,
  GetSpotReturn,
  ItemPosition,
  ItemPositions,
  MainMouseTool,
  MapIcon,
  MapText,
  SelectionTarget,
  SelectionTargets,
  SelectionTargetType,
  SpotGroup,
  SpotItem,
  SpotRow,
  UpdateSelectionOptions,
  ViewMode,
} from "@/types";
import React from "react";
import { MapEditorContext, MapEditorProviderProps } from "./context";

export const MapEditorProvider: React.FC<MapEditorProviderProps> = (props) => {
  const { children, ...rest } = props;

  const [selectedMainTool, setSelectedMainTool] =
    React.useState<MainMouseTool>("select");

  const events = React.useMemo(() => {
    return new EventManager();
  }, []);

  const [selection, setSelection] = React.useState<SelectionTargets>({});

  const [zoom, setZoom] = React.useState(1);
  const [mapState, setMapState] = React.useState(props.value);
  const [draggingGroup, setDraggingGroup] = React.useState<null | string>(null);
  const [draggingGuides, setDraggingGuides] = React.useState<DraggingGuides>({
    x: [],
    y: [],
  });

  const [viewMode, setViewMode] = React.useState<ViewMode>("floor");

  const [dragStartPositions, setDragStartPositions] =
    React.useState<ItemPositions>();

  const [, setGroupsInYPosition] = React.useState<Record<number, number>>([]);

  const [, setGroupsInXPosition] = React.useState<Record<number, number>>([]);

  const [areaSize, setAreaSize] = React.useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

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

  const updateItemPosition = (id: string) => {
    setDragStartPositions((prev) => {
      const positions = { ...prev };
      const item = getItem(id);
      if (!item) return positions;
      if ("x" in item && "y" in item) {
        positions[id] = {
          x: item?.x || 0,
          y: item?.y || 0,
        };
      }

      return positions;
    });
  };

  const startDraggingItem = (id: string) => {
    setDraggingGroup(id);
    updateGroupsPositions(id);
    //updateItemPosition(id);
  };

  const endDraggingItem = () => {
    setDraggingGroup(null);
    updateGroupsPositions();
    clearGuides();
    _updateSelectionPositions(selection);
  };

  const _moveItem = (
    id: string,
    type: SelectionTargetType,
    position: ItemPosition,
  ) => {
    if (type === "group")
      return updateGroup(id, {
        x: position.x,
        y: position.y,
      });

    if (type === "text")
      return updateText(id, {
        x: position.x,
        y: position.y,
      });

    if (type === "icon")
      return updateIcon(id, {
        x: position.x,
        y: position.y,
      });
  };

  const moveItem = (
    id: string,
    type: SelectionTargetType,
    position: ItemPosition,
    startPosition?: ItemPosition,
  ) => {
    /*setMapState((prev) => {
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

      return prev;
    });*/

    getObjectKeys(selection).forEach((id) => {
      const selectionItemType = selection[id];
      _moveItem(id, selectionItemType, {
        x: (dragStartPositions?.[id]?.x || 0) + position.x,
        y: (dragStartPositions?.[id]?.y || 0) + position.y,
      });
    });

    if (!isItemSelected(id)) {
      _moveItem(id, type, {
        x: (startPosition?.x || 0) + position.x,
        y: (startPosition?.y || 0) + position.y,
      });
    }
  };

  const _updateSelectionPositions = (selection: SelectionTargets) => {
    setDragStartPositions(() => {
      const positions: ItemPositions = {};
      getObjectKeys(selection).forEach((id) => {
        const item = getItem(id);
        if (!item) return;
        if ("x" in item && "y" in item) {
          positions[id] = {
            x: item?.x || 0,
            y: item?.y || 0,
          };
        }
      });

      return positions;
    });
  };

  const updateSelection = (
    id: string,
    targetType: SelectionTargetType,
    options?: UpdateSelectionOptions,
  ) => {
    const { appendSelection = false, removeSelection = false } = options || {};
    if (removeSelection) {
      setSelection((prev) => {
        const rest = { ...prev };
        delete rest[id];
        _updateSelectionPositions(rest);
        return rest;
      });
      return;
    }
    if (appendSelection) {
      setSelection((prev) => {
        const newSelection = { ...prev, [id]: targetType };
        _updateSelectionPositions(newSelection);
        return newSelection;
      });
      return;
    }
    const newSelection = { [id]: targetType };
    _updateSelectionPositions(newSelection);
    setSelection(newSelection);
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

  const addRow = (options: AddRowOptions) => {
    const { groupId } = options;
    const group = mapState?.groups.find((g) => g.id === groupId);
    if (!group) return;

    const lastRowInGroup = group.rows?.[group.rows.length - 1];
    const isGroupVertical = group.orientation === "vertical";
    let rowOrientation: SpotRow["orientation"] = isGroupVertical
      ? "left"
      : "top";

    if (isGroupVertical && lastRowInGroup?.orientation === "left") {
      rowOrientation = "right";
    } else if (!isGroupVertical && lastRowInGroup?.orientation === "top") {
      rowOrientation = "bottom";
    }

    const newRow: SpotRow = {
      id: getUuid(),
      items: [],
      orientation: rowOrientation,
    } as SpotRow;

    let updatedGroup: SpotGroup | undefined;

    setMapState((prev) => {
      if (!prev) return undefined;
      return {
        ...prev,
        groups: prev.groups.map((group) => {
          if (group.id === groupId) {
            const _group = {
              ...group,
              rows: group.rows.concat(newRow),
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
        targetType: "row",
        id: newRow.id,
        row: newRow,
      },
      false,
    );

    events.dispatchEvent(
      {
        event: "update",
        targetType: "group",
        id: groupId,
        group: updatedGroup,
      },
      false,
    );

    return newRow;
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

  const updateRow = (rowId: string, row: Partial<SpotRow>) => {
    setMapState((prev) => {
      if (!prev) return undefined;
      let updatedRow: SpotRow | undefined;
      const newState = {
        ...prev,
        groups: prev.groups.map((group) => {
          return {
            ...group,
            rows: group.rows.map((r) => {
              if (r.id === rowId) {
                const _row = {
                  ...r,
                  ...row,
                };

                updatedRow = _row;

                return _row;
              }
              return r;
            }),
          };
        }),
      };

      events.dispatchEvent(
        {
          event: "update",
          targetType: "row",
          id: rowId,
          row: updatedRow,
        },
        false,
      );

      return newState;
    });
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

  const fixRowsOrientation = (group: SpotGroup) => {
    const isGroupVertical = group.orientation === "vertical";
    const newGroup = { ...group };
    if (!newGroup.rows[0]) return newGroup;
    let currentOrientation = newGroup.rows[0].orientation;

    if (
      isGroupVertical &&
      (currentOrientation === "top" || currentOrientation === "bottom")
    ) {
      currentOrientation = "left";
    } else if (
      !isGroupVertical &&
      (currentOrientation === "left" || currentOrientation === "right")
    ) {
      currentOrientation = "top";
    }

    newGroup.rows = newGroup.rows.map((row) => {
      let spotRow: SpotRow = row;
      spotRow = {
        ...spotRow,
        orientation: currentOrientation,
      };

      if (isGroupVertical) {
        currentOrientation = currentOrientation === "left" ? "right" : "left";
      } else {
        currentOrientation = currentOrientation === "top" ? "bottom" : "top";
      }

      return spotRow;
    });

    return newGroup;
  };

  const deleteRow = (options: DeleteRwOptions) => {
    const { groupId, rowId, fixRowsOrientation: fixOrientation } = options;
    let updatedGroup: SpotGroup | undefined;
    setMapState((prev) => {
      if (!prev) return undefined;
      return {
        ...prev,
        groups: prev.groups.map((group) => {
          if (group.id === groupId) {
            const _group = {
              ...group,
              rows: group.rows.filter((row) => row.id !== rowId),
            };

            updatedGroup =
              fixOrientation !== false ? fixRowsOrientation(_group) : _group;

            return updatedGroup;
          }
          return group;
        }),
      };
    });

    events.dispatchEvent(
      {
        event: "delete",
        targetType: "row",
        id: rowId,
      },
      false,
    );

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

  const deleteSpot = (options: DeleteSpotOptions) => {
    const { groupId, rowId, spotId } = options;
    let updatedGroup: SpotGroup | undefined;
    setMapState((prev) => {
      if (!prev) return undefined;
      return {
        ...prev,
        groups: prev.groups.map((group) => {
          if (group.id === groupId) {
            const _group = {
              ...group,
              rows: group.rows.map((row) => {
                if (row.id === rowId) {
                  return {
                    ...row,
                    items: row.items.filter((item) => item.id !== spotId),
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
        event: "delete",
        targetType: "spot",
        id: spotId,
      },
      false,
    );

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

  const deleteGroup = (options: DeleteGroupOptions) => {
    const { groupId } = options;
    setMapState((prev) => {
      if (!prev) return undefined;
      return {
        ...prev,
        groups: prev.groups.filter((group) => group.id !== groupId),
      };
    });

    events.dispatchEvent(
      {
        event: "delete",
        targetType: "group",
        id: groupId,
      },
      false,
    );
  };

  const deleteText = (options: DeleteTextOptions) => {
    const { id } = options;
    setMapState((prev) => {
      if (!prev) return undefined;
      return {
        ...prev,
        texts: prev.texts.filter((text) => text.id !== id),
      };
    });

    events.dispatchEvent(
      {
        event: "delete",
        targetType: "text",
        id,
      },
      false,
    );
  };

  const deleteIcon = (options: DeleteTextOptions) => {
    const { id } = options;
    setMapState((prev) => {
      if (!prev) return undefined;
      return {
        ...prev,
        icons: prev.icons.filter((icon) => icon.id !== id),
      };
    });

    events.dispatchEvent(
      {
        event: "delete",
        targetType: "icon",
        id,
      },
      false,
    );
  };

  const isItemSelected = (id: string | undefined) => {
    if (!id) return false;
    return !!selection[id];
  };

  const addText = (options: AddTextOptions) => {
    const newText: MapText = {
      id: getUuid(),
      ...options,
    } as MapText;

    setMapState((prev) => {
      if (!prev) return undefined;
      return {
        ...prev,
        texts: prev.texts.concat(newText),
      };
    });

    events.dispatchEvent(
      {
        event: "add",
        targetType: "text",
        id: newText.id,
        text: newText,
      },
      false,
    );

    return newText;
  };

  const addIcon = (options: AddIconOptions) => {
    const newIcon: MapIcon = {
      id: getUuid(),
      ...options,
    } as MapIcon;

    setMapState((prev) => {
      if (!prev) return undefined;
      return {
        ...prev,
        icons: prev.icons.concat(newIcon),
      };
    });

    events.dispatchEvent(
      {
        event: "add",
        targetType: "icon",
        id: newIcon.id,
        icon: newIcon,
      },
      false,
    );

    return newIcon;
  };

  const addGroup = (options: AddGroupOptions) => {
    const newGroup: SpotGroup = {
      id: getUuid(),
      rows: [
        {
          id: getUuid(),
          items: [
            {
              id: getUuid(),
            },
          ],
          orientation: options.orientation === "horizontal" ? "top" : "left",
        },
      ],
      ...options,
    } as SpotGroup;

    setMapState((prev) => {
      if (!prev) return undefined;
      return {
        ...prev,
        groups: prev.groups.concat(newGroup),
      };
    });

    events.dispatchEvent(
      {
        event: "add",
        targetType: "group",
        id: newGroup.id,
        group: newGroup,
      },
      false,
    );

    return newGroup;
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
        draggingGroup,
        guides: draggingGuides,
        selection,
        events,
        selectedMainTool,
        zoom,
        viewMode,
        areaSize,

        // Methods
        moveItem,
        startDraggingItem,
        endDraggingItem,
        updateSelection,
        clearSelection,
        addSpot,
        addRow,
        addText,
        addIcon,
        addGroup,
        updateItem,
        updateGroup,
        updateSpot,
        updateText,
        updateRow,
        updateIcon,
        getSpot,
        getItem,
        isItemSelected,
        updateItemPosition,
        setMainMouseTool: setSelectedMainTool,
        setZoom,
        deleteSpot,
        deleteRow,
        deleteGroup,
        deleteText,
        deleteIcon,
        setViewMode,
        setAreaSize: (width, height) => {
          setAreaSize({ width, height });
        },
      }}
    >
      <MapEditorSelectionTools />
      {children}
    </MapEditorContext.Provider>
  );
};
