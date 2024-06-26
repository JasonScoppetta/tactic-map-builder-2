import { buildControllerRules } from "@/helpers/buildControllerRules";
import { buildErrorMessageForName } from "@/helpers/buildErrorMessageForName";
import { isValidNumber } from "@/helpers/isValidNumber";
import { HookFormNumberInputProps } from "./NumberInput.types";
import { NumberInput } from "./NumberInput";
import { FieldValues } from "react-hook-form";

export function HookFormNumberInput<T extends FieldValues>(
  props: HookFormNumberInputProps<T>,
) {
  const { form, name, rules, ...rest } = props;
  return (
    <NumberInput
      {...form.register(
        name,
        buildControllerRules({
          form,
          name,
          rules: {
            validate: (value) =>
              !value
                ? props.isRequired
                  ? "This field is required" || `${props.label} is required`
                  : undefined
                : isValidNumber(value)
                  ? undefined
                  : `${props.label} is invalid`,
            ...rules,
          },
          isRequired: props.isRequired,
        }),
      )}
      error={buildErrorMessageForName(form, name)}
      {...rest}
    />
  );
}
