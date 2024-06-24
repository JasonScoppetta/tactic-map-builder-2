import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { ColorPicker } from "@/components/Map/toolbar-controls/ColorPicker";
import { FontSize } from "@/components/Map/toolbar-controls/FontSize";
import { MapEditorEventData } from "@/helpers/event-manager";
import { getObjectKeys } from "@/helpers/getObjectKeys";
import { sanitizeDep } from "@/helpers/sanitizeDep";
import {
  SelectionTarget,
  SelectionTargetType,
  ToolBarControlFC,
} from "@/types";
import React from "react";

type Tool = "color" | "textColor" | "fontSize" | "fontFamily" | "icon" | "text";

const toolsForType: Record<SelectionTargetType, Tool[]> = {
  spot: ["color", "textColor"],
  group: ["color", "textColor"],
  text: ["textColor", "fontSize", "fontFamily"],
  icon: ["color", "icon"],
};

const ToolsToComponents: Record<Tool, ToolBarControlFC> = {
  color: ColorPicker,
  textColor: ColorPicker,
  fontSize: FontSize,
};

export const MapEditorTools: React.FC = () => {
  const editor = useMapEditor();
  const selectionKeys = getObjectKeys(editor?.selection || {});
  const itemValues = React.useRef<Record<string, SelectionTarget>>({});
  const [values, setValues] = React.useState<Record<Tool, unknown>>();

  const allowedTools = React.useMemo(() => {
    if (!editor) return [];
    const tools = selectionKeys.reduce<Tool[]>((acc, key) => {
      const type = editor.selection[key];
      return acc.concat(toolsForType[type]);
    }, []);

    return Array.from(new Set(tools));
  }, [selectionKeys]);

  const handleChangeValue = (tool: Tool, value: unknown) => {
    const selection = editor?.selection;
    if (!selection) return;
    selectionKeys.forEach((key) => {
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

      console.log(values);
      setValues(values);
    };

    const values = allowedTools.reduce((acc, tool) => {
      const toolValue = selectionKeys.reduce((acc, key) => {
        const target = editor?.getItem(key);
        if (!target) return acc;
        return target[tool] || acc;
      }, undefined);

      return { ...acc, [tool]: toolValue };
    }, {});

    setValues(values);

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
      <div className={"flex gap-4"}>
        {allowedTools.map((tool) => {
          const ToolComponent = ToolsToComponents[tool];
          if (!ToolComponent) return null;
          return (
            <ToolComponent
              value={values?.[tool] || undefined}
              onChange={handleChangeValue.bind(null, tool)}
              key={tool}
            />
          );
        })}
      </div>
      <div></div>
      <div>C</div>
    </div>
  );
};
