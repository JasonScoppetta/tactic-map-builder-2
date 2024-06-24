import { Dict } from "@/components/controls/types";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export function buildErrorMessageForName<T extends FieldValues>(
  form: UseFormReturn<T>,
  name: Path<T>,
) {
  const errorNames = name.split(".");

  const error = errorNames.reduce(
    (errorPath, namePath) => errorPath?.[namePath],
    form.formState.errors as Dict,
  );

  return error?.message;
}
