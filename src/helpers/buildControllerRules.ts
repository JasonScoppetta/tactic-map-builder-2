import { HookFormInputProps } from "@/components/controls/types";
import { FieldValues, Path, RegisterOptions } from "react-hook-form";

export function buildControllerRules<T extends FieldValues>(
  props: HookFormInputProps<T>,
  extraRules?: RegisterOptions<T, Path<T>>,
) {
  return {
    required: {
      value: !!props.isRequired,
      message: props.requiredErrorMessage || "This field is required",
    },
    minLength: props.minLength && {
      value: props.minLength,
      message: `Minimum length is ${props.minLength}`,
    },
    maxLength: props.maxLength && {
      value: props.maxLength,
      message: `Maximum length is ${props.maxLength}`,
    },
    ...(extraRules as unknown as object),
    ...props.rules,
  };
}
