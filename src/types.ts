import { EventManager } from "@/helpers/event-manager";
import { FC } from "react";

export type Orientation = "top" | "bottom" | "left" | "right";
export type GroupOrientation = "horizontal" | "vertical";
export type SelectionTargetType = "group" | "spot" | "text" | "icon";
export type SelectionTargets = Record<string, SelectionTargetType>;

export interface EditorItemObject {
  id: string;
  type: SelectionTargetType;
  x: number;
  y: number;
}

export interface GetSpotReturn {
  spot: SpotItem;
  row: SpotRow;
  group: SpotGroup;
}

export interface DraggingGuides {
  x: number[];
  y: number[];
}

export interface ItemPosition {
  x: number;
  y: number;
}

export interface MapState {
  groups: SpotGroup[];
  texts: MapText[];
  icons: MapIcon[];
  gridSize: number;
  width: number;
  height: number;
}

export interface MapEditorOptions {
  isEditing?: boolean;
  showGrid?: boolean;
  value?: MapValue;
  areaWidth: number;
  areaHeight: number;
}

export interface AddSpotOptions {
  groupId: string;
  rowId?: string;
  afterSpotId?: string;
  beforeSpotId?: string;
  type: SpotType;
}

export interface UpdateSelectionOptions {
  appendSelection?: boolean;
  removeSelection?: boolean;
}

export interface MapEditorMethods {
  moveItem: (
    id: string,
    type: SelectionTargetType,
    position: ItemPosition,
    startPosition?: ItemPosition,
  ) => void;
  startDraggingItem: (id: string) => void;
  endDraggingItem: () => void;
  updateSelection: (
    id: string,
    targetType: SelectionTargetType,
    options?: UpdateSelectionOptions,
  ) => void;
  clearSelection: () => void;
  addSpot: (options: AddSpotOptions) => SpotItem;
  updateGroup: (groupId: string, group: Partial<SpotGroup>) => void;
  updateSpot: (spotId: string, spot: Partial<SpotItem>) => void;
  updateText: (textId: string, text: Partial<MapText>) => void;
  updateIcon: (iconId: string, icon: Partial<MapIcon>) => void;
  getSpot: (spotId: string) => GetSpotReturn | undefined;
  getItem: (id: string) => SelectionTarget | undefined;
  updateItem: (
    id: string,
    type: SelectionTargetType,
    property: string,
    value: unknown,
  ) => void;
  isItemSelected: (id: string | undefined) => boolean;
  updateItemPosition: (id: string) => void;
  setMainMouseTool: (tool: MainMouseTool) => void;
  setZoom: (zoom: number) => void;
}

export interface MapEditorState extends MapEditorOptions, MapEditorMethods {
  guides: DraggingGuides;
  draggingGroup: string | null;
  selection: SelectionTargets;
  events: EventManager;
  selectedMainTool: MainMouseTool;
  zoom: number;
}

export type SpotType = "Desk" | "Empty" | "Spot";
export enum SpotTypes {
  Desk = "Desk",
  Empty = "Empty",
  Spot = "Spot",
}

export interface SpotAttributes {
  orientation?: Orientation;
  color?: string;
  textColor?: string;
  type?: SpotType;
  paddingX?: number;
  paddingY?: number;
}

export interface SpotItem extends SpotAttributes {
  id: string;
  label?: string;
}

export interface SpotRow {
  id: string;
  orientation: Orientation;
  items: SpotItem[];
  paddingX?: number;
  paddingY?: number;
  color?: string;
  textColor?: string;
}

export interface SpotGroup {
  id: string;
  label?: string;
  rows: SpotRow[];
  paddingX?: number;
  paddingY?: number;
  x: number;
  y: number;
  orientation: GroupOrientation;
  rotation?: number;
  color?: string;
  textColor?: string;
  type?: string;
}

export interface MapText {
  id: string;
  x: number;
  y: number;
  text: string;
  textColor?: string;
  fontSize: number;
  fontFamily?: string;
  fontWeight?: string;
}

export interface MapIcon {
  id: string;
  x: number;
  y: number;
  icon: IconValue;
  color?: string;
  fontSize?: number;
}

type RequiredMapProps = "groups" | "texts" | "icons" | "width" | "height";

export type MapValue = Pick<MapState, RequiredMapProps> &
  Partial<Omit<MapState, RequiredMapProps>>;

export interface ToolBarControlsProps {
  value: unknown;
  onChange: (value: unknown) => void;
}
export type ToolBarControlFC = FC<ToolBarControlsProps> & {
  // nothing here yet
};

export interface IconDictionaryItem {
  icons: Record<string, string>;
  keys: string[];
}

export type IconDictionaries = Record<string, IconDictionaryItem>;

export interface IconValue {
  icon: string;
  set: string;
}

export type ItemPositions = Record<string, { x: number; y: number }>;

export type SelectionTarget =
  | MapText
  | MapIcon
  | SpotItem
  | SpotGroup
  | SpotRow;

export type MainMouseTool = "select" | "moveMap";
