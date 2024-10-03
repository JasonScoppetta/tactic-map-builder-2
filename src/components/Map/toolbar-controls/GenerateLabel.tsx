import { FormControlWrapper } from "@/components/controls/FormControlWrapper";
import { HookFormNumberInput } from "@/components/controls/NumberInput";
import { HookFormSelectInput } from "@/components/controls/SelectInput";
import { HookFormTextInput } from "@/components/controls/TextInput";
import { useMapEditor } from "@/components/Map/providers/MapEditorProvider/context";
import { Button } from "@/components/primitives/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/primitives/popover";
import { SelectItem } from "@/components/primitives/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/primitives/toggle-group";
import { getObjectKeys } from "@/helpers/getObjectKeys";
import { ToolBarControlFC } from "@/types";
import { useFieldArray, useForm } from "react-hook-form";

interface PatternItem {
  type: "text" | "numbers" | "letters";
  value: string;
  depth: number;
}

export interface GenerateLabelsOptions {
  pattern: PatternItem[];
  amount: number;
}

interface GenerateLabelFormData {
  pattern: PatternItem[];
  direction: "top-bottom" | "right" | "left" | "bottom" | "top";
}

function generateLabels(options: GenerateLabelsOptions): string[] {
  // TODO: This function must be improved to stop generating when amount is reached
  const { pattern, amount } = options;
  const result: string[] = [];

  // Helper function to generate number parts
  const generateNumberParts = (depth: number): string[] => {
    const parts: string[] = [];
    for (let i = 1; i <= depth; i++) {
      parts.push(i.toString());
    }
    return parts;
  };

  // Helper function to generate letter parts
  const generateLetterParts = (depth: number): string[] => {
    const parts: string[] = [];
    for (let i = 0; i <= (depth || 26) - 1; i++) {
      parts.push(String.fromCharCode(65 + i)); // ASCII 'A' = 65, 'B' = 66, etc.
    }
    return parts;
  };

  // Iterate through each pattern item
  for (let i = 0; i < pattern.length; i++) {
    const { type, value, depth } = pattern[i];
    let parts: string[] = [];

    switch (type) {
      case "text":
        parts = [value]; // For text type, use the provided value directly
        break;
      case "numbers":
        parts = generateNumberParts(depth);
        break;
      case "letters":
        parts = generateLetterParts(depth);
        break;
      default:
        throw new Error(`Unsupported pattern type: ${type}`);
    }

    // Generate labels based on accumulated parts
    const currentResult: string[] = [];

    if (result.length === 0) {
      // Initial case: add all parts as individual labels
      parts.forEach((part) => {
        currentResult.push(part);
      });
    } else {
      // Combine current parts with existing results
      result.forEach((label) => {
        parts.forEach((part) => {
          currentResult.push(label + part);
        });
      });
    }

    // Update result with currentResult
    result.length = 0; // Clear result array
    result.push(...currentResult); // Add new labels to result
  }

  // Return only the required amount of labels
  return result.slice(0, amount);
}

export const GenerateLabel: ToolBarControlFC = () => {
  const editor = useMapEditor();
  const form = useForm<GenerateLabelFormData>({
    defaultValues: {
      pattern: [
        { type: "numbers", value: "", depth: 100 },
        { type: "text", value: "-", depth: 0 },
        { type: "letters", value: "", depth: 26 },
      ],
      direction: "right",
    },
  });

  const patternArray = useFieldArray({
    control: form.control,
    name: "pattern",
  });

  const handleSubmt = form.handleSubmit((data) => {
    const selectionKeys = getObjectKeys(editor?.selection || {});
    const selectedGroup = selectionKeys.find(
      (key) => editor?.selection[key] === "group",
    );
    if (!selectedGroup) return;
    const group = editor?.getItem(selectedGroup);
    if (!group) return;
    if (!("rows" in group)) return;

    const labels = generateLabels({ pattern: data.pattern, amount: 100 });

    if (data.direction === "right")
      group.rows.forEach((row) => {
        row.items.forEach((item) => {
          const label = labels.shift();
          if (!label) return;
          editor?.updateSpot(item.id, { label: label || "" });
        });
      });

    if (data.direction === "left")
      group.rows.forEach((row) => {
        [...row.items].reverse().forEach((item) => {
          const label = labels.shift();
          if (!label) return;
          editor?.updateSpot(item.id, { label: label || "" });
        });
      });

    if (data.direction === "bottom") {
      const maxItemsPerRow = group.rows.reduce(
        (max, row) => Math.max(max, row.items.length),
        0,
      );
      for (let i = 0; i < maxItemsPerRow; i++) {
        group.rows.forEach((row) => {
          const item = row.items[i];
          if (!item) return;
          const label = labels.shift();
          if (!label) return;
          editor?.updateSpot(item.id, { label: label || "" });
        });
      }
    }

    if (data.direction === "top") {
      const maxItemsPerRow = group.rows.reduce(
        (max, row) => Math.max(max, row.items.length),
        0,
      );
      for (let i = 0; i < maxItemsPerRow; i++) {
        [...group.rows].reverse().forEach((row) => {
          const item = row.items[i];
          if (!item) return;
          const label = labels.shift();
          if (!label) return;
          editor?.updateSpot(item.id, { label: label || "" });
        });
      }
    }

    /*if (data.direction === "top-bottom") {
              const maxItemsPerRow = group.rows.reduce(
                (max, row) => Math.max(max, row.items.length),
                0,
              );
              console.log(currentColumn, maxItemsPerRow);
              for (let i = 0; i < maxItemsPerRow; i++) {
                group.rows.forEach((row) => {
                  const item = row.items[i];
                  if (!item) return;
                  const label = labels.shift();
                  if (!label) return;
                  editor?.updateSpot(item.id, { label: label || "" });
                });
              }
            }*/
  });

  const direction = form.watch("direction");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className={"border border-input transition-none"}
        >
          Labels
        </Button>
      </PopoverTrigger>
      <PopoverContent className={"w-auto"}>
        <div>
          <div>
            <div className={"flex"}>
              <FormControlWrapper variant={"unstyled"} label={"Direction"}>
                <div>
                  <ToggleGroup
                    type={"single"}
                    value={direction}
                    onValueChange={(value) => {
                      if (direction === value) return;
                      form.setValue("direction", value as never);
                    }}
                  >
                    <ToggleGroupItem
                      icon={{ set: "lucide", icon: "MoveRight" }}
                      value={"right"}
                    >
                      To right
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      icon={{ set: "lucide", icon: "MoveLeft" }}
                      value={"left"}
                    >
                      To left
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      icon={{ set: "lucide", icon: "MoveUp" }}
                      value={"top"}
                    >
                      To top
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      icon={{ set: "lucide", icon: "MoveDown" }}
                      value={"bottom"}
                    >
                      To bottom
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      icon={{ set: "lucide", icon: "ArrowDownUp" }}
                      value={"top-bottom"}
                    >
                      Top to bottom
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </FormControlWrapper>
            </div>
            {patternArray.fields.map((field, index) => {
              const type = form.watch(`pattern.${index}.type`);
              return (
                <div key={field.id} className={"flex gap-4 items-center"}>
                  <div className={"flex-shrink-0"}>
                    <HookFormSelectInput
                      className={"w-36"}
                      form={form}
                      name={`pattern.${index}.type`}
                      label={"Type"}
                    >
                      <SelectItem value={"text"}>Text</SelectItem>
                      <SelectItem value={"numbers"}>Numbers</SelectItem>
                      <SelectItem value={"letters"}>Letters</SelectItem>
                    </HookFormSelectInput>
                  </div>
                  {type === "text" && (
                    <HookFormTextInput
                      label={"Free text"}
                      form={form}
                      name={`pattern.${index}.value`}
                      placeholder={"Free text"}
                    />
                  )}
                  {type === "numbers" && (
                    <HookFormNumberInput
                      label={"Max number"}
                      form={form}
                      name={`pattern.${index}.depth`}
                      min={0}
                    />
                  )}
                  {type === "letters" && (
                    <HookFormNumberInput
                      label={"Max letters"}
                      form={form}
                      name={`pattern.${index}.depth`}
                      min={0}
                      max={26}
                    />
                  )}
                  <Button
                    variant={"outline"}
                    icon={"Minus"}
                    onClick={() => {
                      patternArray.remove(index);
                    }}
                  />
                  <Button
                    variant={"outline"}
                    icon={"Plus"}
                    onClick={() => {
                      patternArray.insert(index + 1, {
                        type: "text",
                        value: "",
                        depth: 0,
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div className={"flex justify-end"}>
            <Button
              variant={"outline"}
              icon={"Plus"}
              onClick={() => {
                patternArray.append({ type: "text", value: "", depth: 0 });
              }}
            />
          </div>
          <Button onClick={handleSubmt}>Assign</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
