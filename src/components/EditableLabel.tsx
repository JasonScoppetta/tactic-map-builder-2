import { useBooleanState } from "@/hooks/useBooleanState";
import { useGesture } from "@use-gesture/react";
import React from "react";

export interface EditableLabelProps {
  value: string;
  onChange: (value: string) => void;
}

export const EditableLabel: React.FC<EditableLabelProps> = ({
  value,
  onChange,
}) => {
  const isEditing = useBooleanState();
  const hasInputFocused = useBooleanState();
  const [startText, setStartText] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const bindEvents = useGesture(
    {
      onDoubleClick: () => {
        if (isEditing.state) return;
        isEditing.true();
        setStartText(value);
      },
    },
    {},
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      isEditing.false();
    }
    if (event.key === "Escape") {
      isEditing.false();
      onChange(startText);
    }
  };

  React.useEffect(() => {
    if (isEditing.state && inputRef.current && !hasInputFocused.state) {
      inputRef.current.focus();
      inputRef.current.select();
      hasInputFocused.true();
    }
  }, [isEditing.state, hasInputFocused.state, inputRef.current]);

  return (
    <div className={"flex-1 mr-4"} {...bindEvents()}>
      {isEditing.state ? (
        <>
          <input
            className={"text-[#000] px-2"}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            value={value}
            ref={inputRef}
          />
        </>
      ) : (
        value
      )}
    </div>
  );
};
