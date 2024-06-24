import { HookFormInputProps } from "@/components/controls/types";
import React from "react";
import { FormControlWrapperProps } from "../FormControlWrapper";
import { FieldValues } from "react-hook-form";

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  inputClassName?: string;
}

export type TextInputPropsWithFormControl = TextInputProps &
  FormControlWrapperProps;

export interface HookFormTextInputProps<T extends FieldValues>
  extends Omit<TextInputPropsWithFormControl, "form" | "name">,
    HookFormInputProps<T> {}
