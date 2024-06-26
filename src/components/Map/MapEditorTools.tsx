import { IconFromSet } from "@/components/IconFromSet";
import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { ColorPicker } from "@/components/Map/toolbar-controls/ColorPicker";
import { FontSize } from "@/components/Map/toolbar-controls/FontSize";
import { GapSelect } from "@/components/Map/toolbar-controls/GapSelect";
import { GenerateLabel } from "@/components/Map/toolbar-controls/GenerateLabel";
import { IconPicker } from "@/components/Map/toolbar-controls/IconPicker";
import { SpotType } from "@/components/Map/toolbar-controls/SpotType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/primitives/toggle-group";
import { MapEditorEventData } from "@/helpers/event-manager";
import { getItemLabel } from "@/helpers/getItemLabel";
import { getObjectKeys } from "@/helpers/getObjectKeys";
import { sanitizeDep } from "@/helpers/sanitizeDep";
import {
  IconValue,
  MainMouseTool,
  SelectionTarget,
  SelectionTargetType,
  ToolBarControlFC,
} from "@/types";
import React from "react";

type Tool =
  | "color"
  | "textColor"
  | "fontSize"
  | "fontFamily"
  | "icon"
  | "text"
  | "type"
  | "gap"
  | "spotGapX"
  | "spotGapY"
  | "generateLabel";

const toolsForType: Record<SelectionTargetType, Tool[]> = {
  spot: ["color", "textColor"],
  group: [
    "color",
    "textColor",
    "type",
    "gap",
    "spotGapX",
    "spotGapY",
    "generateLabel",
  ],
  text: ["textColor", "fontSize", "fontFamily"],
  icon: ["color", "icon", "fontSize"],
};

const ToolsToComponents: Record<
  Tool,
  {
    icon: IconValue;
    component: ToolBarControlFC;
  }
> = {
  color: {
    icon: { set: "lucide", icon: "PaintBucket" },
    component: ColorPicker,
  },
  textColor: {
    icon: { set: "lucide", icon: "Highlighter" },
    component: ColorPicker,
  },
  fontSize: {
    icon: { set: "lucide", icon: "Ruler" },
    component: FontSize,
  },
  icon: {
    icon: { set: "lucide", icon: "Image" },
    component: IconPicker,
  },
  type: {
    icon: { set: "lucide", icon: "Armchair" },
    component: SpotType,
  },
  gap: {
    icon: { set: "lucide", icon: "UnfoldVertical" },
    component: GapSelect,
  },
  spotGapX: {
    icon: { set: "lucide", icon: "MoveRight" },
    component: GapSelect,
  },
  spotGapY: {
    icon: { set: "lucide", icon: "MoveDown" },
    component: GapSelect,
  },
  generateLabel: {
    icon: { set: "lucide", icon: "Text" },
    component: GenerateLabel,
  },
};

export const MapEditorTools: React.FC = () => {
  const editor = useMapEditor();
  const selectionKeys = getObjectKeys(editor?.selection || {});
  const itemValues = React.useRef<Record<string, SelectionTarget>>({});
  const [values, setValues] = React.useState<Record<Tool, unknown>>();
  const [layers, setLayers] = React.useState<{ id: string; label: string }[]>(
    [],
  );
  const [selectedLayer, setSelectedLayer] = React.useState<string>("*");

  const allowedTools = React.useMemo(() => {
    if (!editor) return [];
    const _selectionKeys =
      selectedLayer === "*" ? selectionKeys : [selectedLayer];
    const tools = _selectionKeys.reduce<Tool[]>((acc, key) => {
      const type = editor.selection[key];
      return acc.concat(toolsForType[type]);
    }, []);

    return Array.from(new Set(tools));
  }, [selectionKeys, selectedLayer]);

  const handleChangeValue = (tool: Tool, value: unknown) => {
    const selection = editor?.selection;
    if (!selection) return;
    const _selectionKeys =
      selectedLayer === "*" ? selectionKeys : [selectedLayer];
    _selectionKeys.forEach((key) => {
      const type = selection[key];
      if (toolsForType[type]?.includes(tool))
        editor?.updateItem(key, type, tool, value);
    });
  };

  const effectDep = sanitizeDep({ selectionKeys, allowedTools });
  React.useEffect(() => {
    const updateValues = (event: MapEditorEventData) => {
      if (!event.id || !event.targetType || !event[event.targetType]) return;

      itemValues.current[event.id] = event[event.targetType]!;

      const values = allowedTools.reduce((acc, tool) => {
        return { ...acc, [tool]: event[event.targetType]![tool] };
      }, {});

      setValues(values);
    };

    const _layers: Record<string, string> = {};
    const values = allowedTools.reduce((acc, tool) => {
      const toolValue = selectionKeys.reduce((acc, key) => {
        const target = editor?.getItem(key);
        _layers[target?.id || ""] = getItemLabel(target) || "";
        if (!target) return acc;
        return target[tool] || acc;
      }, undefined);

      return { ...acc, [tool]: toolValue };
    }, {});

    setValues(values);
    setLayers(Object.entries(_layers).map(([id, label]) => ({ id, label })));

    if (
      selectedLayer !== "*" &&
      !layers.find((layer) => layer.id === selectedLayer)
    ) {
      setSelectedLayer("*");
    }

    selectionKeys.forEach((key) => {
      editor?.events.addListener(key, "update", updateValues);
    });

    return () => {
      selectionKeys.forEach((key) => {
        editor?.events.removeListener(key, "update", updateValues);
      });
    };
  }, [effectDep]);

  return (
    <div
      className={"w-full px-4 py-1 flex h-full items-center justify-between"}
    >
      <div className={"flex gap-4 items-center"}>
        <div>
          <ToggleGroup
            type={"single"}
            value={editor?.selectedMainTool}
            onValueChange={(value) =>
              !!value && editor?.setMainMouseTool(value as MainMouseTool)
            }
          >
            <ToggleGroupItem
              value={"select"}
              icon={{ set: "lucide", icon: "BoxSelect" }}
            />
            <ToggleGroupItem
              value={"moveMap"}
              icon={{ set: "lucide", icon: "Move" }}
            />
          </ToggleGroup>
        </div>
        <div className={"mx-4 border-l h-6"}></div>
        <div>
          <Select value={selectedLayer} onValueChange={setSelectedLayer}>
            <SelectTrigger className={"w-[140px]"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"*"}>All</SelectItem>
              {layers.map((layer) => (
                <SelectItem key={layer.id} value={layer.id}>
                  {layer.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {allowedTools.map((tool) => {
          if (!ToolsToComponents[tool]) return null;
          const ToolComponent = ToolsToComponents[tool].component;
          return (
            <div className={"flex gap-4 items-center"} key={tool}>
              <div>
                <IconFromSet icon={ToolsToComponents[tool].icon} size={6} />
              </div>
              <ToolComponent
                value={values?.[tool] || undefined}
                onChange={handleChangeValue.bind(null, tool)}
              />
            </div>
          );
        })}
      </div>
      <div></div>
      <div>C</div>
    </div>
  );
};
