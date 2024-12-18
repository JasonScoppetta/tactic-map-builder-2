import { buildControllerRules } from "@/helpers/buildControllerRules";
import { buildErrorMessageForName } from "@/helpers/buildErrorMessageForName";
import { FieldValues } from "react-hook-form";
import { HookFormTextInputProps } from "./TextInput.types";
import { TextInput } from "./TextInput";

export function HookFormTextInput<T extends FieldValues>(
  props: HookFormTextInputProps<T>,
) {
  const { form, name, rules, ...rest } = props;
  return (
    <TextInput
      {...form.register(
        name,
        buildControllerRules({
          form,
          name,
          rules,
          isRequired: props.isRequired,
          ...rest,
        }),
      )}
      error={buildErrorMessageForName(form, name)}
      {...rest}
    />
  );
}
