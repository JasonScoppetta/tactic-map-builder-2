export type Orientation = "top" | "bottom" | "left" | "right";
export type GroupOrientation = "horizontal" | "vertical";

export interface DraggingGuides {
  x: number[];
  y: number[];
}

export interface GroupPosition {
  x: number;
  y: number;
}

export interface MapState {
  groups: SpotGroup[];
  gridSize: number;
  width: number;
  height: number;
}

export interface MapEditorOptions {
  isEditing?: boolean;
  showGrid?: boolean;
  value?: MapValue;
}

export interface AddSpotOptions {
  groupId: string;
  rowId?: string;
  afterSpotId?: string;
  beforeSpotId?: string;
  type: SpotType;
}

export interface MapEditorMethods {
  moveGroup: (id: string, position: GroupPosition) => void;
  startDraggingGroup: (id: string) => void;
  endDraggingGroup: () => void;
  selectGroup: (id: string, appendSelection?: boolean) => void;
  clearSelection: () => void;
  addSpot: (options: AddSpotOptions) => SpotItem;
  updateGroup: (groupId: string, group: Partial<SpotGroup>) => void;
}

export interface MapEditorState extends MapEditorOptions, MapEditorMethods {
  guides: DraggingGuides;
  draggingGroup: string | null;
  selectedGroups: Record<string, boolean>;
}

export type SpotType = "Desk" | "Empty";

export interface SpotItem {
  id: string;
  paddingX?: number;
  paddingY?: number;
  type: SpotType;
  label?: string;
  orientation?: Orientation;
  color?: string;
  textColor?: string;
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

type RequiredMapProps = "groups" | "width" | "height";

export type MapValue = Pick<MapState, RequiredMapProps> &
  Partial<Omit<MapState, RequiredMapProps>>;
