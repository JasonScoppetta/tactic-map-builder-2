import { splitObject } from "@/helpers/splitObject";
import {
  FormControlWrapperForwardedProps,
  FormControlWrapperProps,
} from "./FormControlWrapper.types";

export function splitFormControlWrapperProps<T extends FormControlWrapperProps>(
  props: T,
) {
  return splitObject(props, FormControlWrapperForwardedProps);
}
