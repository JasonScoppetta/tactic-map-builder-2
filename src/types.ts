export type Orientation = "top" | "bottom";

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

export interface MapEditorMethods {
  moveGroup: (id: string, position: GroupPosition) => void;
  startDraggingGroup: (id: string) => void;
  endDraggingGroup: () => void;
  selectGroup: (id: string, appendSelection?: boolean) => void;
  clearSelection: () => void;
}

export interface MapEditorState extends MapEditorOptions, MapEditorMethods {
  guides: DraggingGuides;
  draggingGroup: string | null;
  selectedGroups: Record<string, boolean>;
}

export interface SpotItem {
  id: string;
  paddingX?: number;
  paddingY?: number;
}

export interface SpotRow {
  id: string;
  orientation: Orientation;
  items: SpotItem[];
  paddingX?: number;
  paddingY?: number;
}

export interface SpotGroup {
  id: string;
  rows: SpotRow[];
  paddingX?: number;
  paddingY?: number;
  x: number;
  y: number;
}

type RequiredMapProps = "groups" | "width" | "height";

export type MapValue = Pick<MapState, RequiredMapProps> &
  Partial<Omit<MapState, RequiredMapProps>>;
