import { EventManager } from "@/helpers/event-manager";

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

export interface MapEditorMethods {
  moveItem: (
    id: string,
    type: SelectionTargetType,
    position: ItemPosition,
  ) => void;
  startDraggingItem: (id: string) => void;
  endDraggingItem: () => void;
  updateSelection: (
    id: string,
    targetType: SelectionTargetType,
    appendSelection?: boolean,
  ) => void;
  clearSelection: () => void;
  addSpot: (options: AddSpotOptions) => SpotItem;
  updateGroup: (groupId: string, group: Partial<SpotGroup>) => void;
  updateSpot: (spotId: string, spot: Partial<SpotItem>) => void;
  getSpot: (spotId: string) => GetSpotReturn | undefined;
}

export interface MapEditorState extends MapEditorOptions, MapEditorMethods {
  guides: DraggingGuides;
  draggingGroup: string | null;
  selection: SelectionTargets;
  events: EventManager;
}

export type SpotType = "Desk" | "Empty";

export interface SpotAttributes {
  orientation?: Orientation;
  color?: string;
  textColor?: string;
  type: SpotType;
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
}

export interface MapText {
  id: string;
  x: number;
  y: number;
  text: string;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
}

type RequiredMapProps = "groups" | "texts" | "width" | "height";

export type MapValue = Pick<MapState, RequiredMapProps> &
  Partial<Omit<MapState, RequiredMapProps>>;
