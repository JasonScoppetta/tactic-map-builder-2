import { TextInput } from "@/components/controls/TextInput";
import { Button } from "@/components/primitives/Button";
import { useDebounce } from "@/hooks/useDebounce";
import React from "react";
import { DebouncedInputProps } from "./DebouncedInput.types";

export const DebouncedInput: React.FC<DebouncedInputProps> = ({
  delay = 0,
  onChangeValue,
  isClearable,
  ...rest
}) => {
  const [value, setValue] = React.useState(String(rest.value || ""));
  const [debouncedValue] = useDebounce(value, delay);

  React.useEffect(() => {
    onChangeValue?.(debouncedValue);
  }, [debouncedValue]);

  return (
    <TextInput
      {...rest}
      onChange={(e) => setValue(e.target.value)}
      value={rest.value || value}
      rightSlot={
        isClearable
          ? [
              ...(rest.rightSlot || []),
              <Button
                key={"clear-button"}
                size={"xs"}
                variant={"ghost"}
                icon={"X"}
                onClick={() => setValue("")}
                className={value ? "" : "hidden"}
              />,
            ]
          : undefined
      }
    />
  );
};
