import { cn } from "@/helpers/cn";
import { mergeRefs } from "@/helpers/mergeRef";
import React from "react";
import {
  FormControlWrapperContext,
  FormControlWrapperProvider,
} from "./FormControlWrapperProvider";
import { FormControlWrapperProps } from "./FormControlWrapper.types";
import { disabledCssClasses, formControlWrapperVariants } from "./defines";
import { FormControlLabel } from "./FormControlLabel";
import { FormControlWrapperContent } from "./FormControlWrapperContent";

export const FormControlWrapper = React.forwardRef<
  HTMLDivElement,
  FormControlWrapperProps
>((props, ref) => {
  const {
    children,
    wrapperClassName,
    className,
    enableSlotsInputFocus = false,
    enableWrapperInputFocus = false,
    hideEmptyMessages = false,
    ...rest
  } = props;
  const containerRef = React.useRef<HTMLDivElement>(null);

  const forwardFocusElement = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    containerRef?.current?.querySelector("input")?.focus();

    return false;
  };

  return (
    <FormControlWrapperProvider {...rest}>
      <FormControlWrapperContext.Consumer>
        {(state) => {
          const charactersCounter = state?.charactersCounter || 0;
          return (
            <div
              className={cn("flex w-full flex-col gap-2 relative", className)}
              ref={mergeRefs([ref, containerRef])}
              onClick={(event) => {
                if (
                  enableWrapperInputFocus &&
                  containerRef.current?.contains(event.target as HTMLElement)
                ) {
                  forwardFocusElement(event);
                }
              }}
            >
              {rest.label && (
                <FormControlLabel
                  isRequired={rest.isRequired}
                  isOptional={rest.isOptional}
                >
                  {rest.label}
                </FormControlLabel>
              )}
              {rest.description && (
                <div className={"text-md text-muted-foreground"}>
                  {rest.description}
                </div>
              )}
              <div
                className={cn(
                  "py-1",
                  formControlWrapperVariants({ variant: rest.variant }),
                  disabledCssClasses,
                  wrapperClassName,
                )}
              >
                <FormControlWrapperContent
                  {...rest}
                  enableSlotsInputFocus={enableSlotsInputFocus}
                  slotFocusHandler={(e) => {
                    if (enableSlotsInputFocus) {
                      forwardFocusElement(e);
                    }
                  }}
                >
                  {children}
                </FormControlWrapperContent>
              </div>
              {rest.showCounter && (
                <div className={"text-xs text-muted-foreground text-right"}>
                  {rest.minLength && (
                    <>
                      {(!rest.maxLength ||
                        charactersCounter <= rest.minLength) && (
                        <span>
                          {charactersCounter} of {rest.minLength} characters
                          minimum
                        </span>
                      )}
                    </>
                  )}
                  {rest.maxLength &&
                    (!rest.minLength || charactersCounter > rest.minLength) && (
                      <span>
                        {charactersCounter} of {rest.maxLength} characters
                        maximum
                      </span>
                    )}
                </div>
              )}
              {rest.helperText && (
                <div className={"text-xs text-muted-foreground"}>
                  {rest.helperText}
                </div>
              )}
              {(!hideEmptyMessages || !!rest.error) && (
                <div
                  className={cn(
                    "text-xs text-semantic-error-foreground",
                    !hideEmptyMessages && "min-h-4",
                  )}
                >
                  {rest.error}
                </div>
              )}
              {rest.success && (
                <div
                  className={
                    "bottom-0 mb-[-20px] text-xs text-semantic-success-foreground"
                  }
                >
                  {rest.success}
                </div>
              )}
            </div>
          );
        }}
      </FormControlWrapperContext.Consumer>
    </FormControlWrapperProvider>
  );
});

FormControlWrapper.displayName = "FormControlWrapper";
