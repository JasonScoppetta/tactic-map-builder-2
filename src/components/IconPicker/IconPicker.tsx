import { DebouncedInput } from "@/components/controls/DebouncedInput";
import { IconPickerIconButton } from "@/components/IconPicker/IconPickerIconButton";
import { Tabs, TabsList, TabsTrigger } from "@/components/primitives/tabs";
import { cn } from "@/helpers/cn";
import { useIconDictionaries } from "@/hooks/useIconDictionaries";
import { IconDictionaries } from "@/types";
import React from "react";
import Scrollbars, { positionValues } from "react-custom-scrollbars";
import { IconPickerProps } from "./IconPicker.types";
import { IconPickerContext, IconPickerProvider } from "./IconPicker.provider";
import { Dict } from "@/components/controls/types";

const classes = {
  IconPickerWrapper: "h-[320px]",
  IconPickerLoadingWrapper: "items-center justify-center",
  IconPickerGrid: "gap-2 pl-2 py-4 grid-cols-[1fr_1fr_1fr_1fr_1fr]",
  IconPickerSearchInputWrapper: "",
  Tabs: "w-full h-full flex flex-col",
  TabsList: "py-2 rounded-none border-b bg-muted",
  IconPickerSearchInput:
    "border-none border-b shadow-none bg-secondary rounded-none",
};

export const IconPicker: React.FC<IconPickerProps> = (props) => {
  const iconDictionaries = useIconDictionaries();

  if (!iconDictionaries) {
    return (
      <div
        className={cn(
          "flex",
          classes.IconPickerWrapper,
          classes.IconPickerLoadingWrapper,
        )}
      >
        {}
        Loading...
      </div>
    );
  }

  return <IconPickerInner iconDictionaries={iconDictionaries} {...props} />;
};

export const IconPickerInner: React.FC<
  IconPickerProps & { iconDictionaries: IconDictionaries }
> = ({ onSelect, initialIconSet, iconDictionaries }) => {
  const scrollBarsRef = React.useRef<Scrollbars | null>(null);
  const handleIconSelect = (iconName: string, iconSet: string) => {
    onSelect?.({ icon: iconName, set: iconSet });
  };

  const handleSearchValueChange = () => {
    scrollBarsRef.current?.scrollTop(0);
  };

  const iconPickerDictionaries = React.useMemo(() => {
    //const customIconsKeys = getObjectKeys({});
    return {
      ...iconDictionaries,
      custom: {
        icons: [] as never,
        keys: [] as never,
      },
    };
  }, []);

  return (
    <IconPickerProvider
      dictionaries={iconPickerDictionaries}
      onSearchValueChange={handleSearchValueChange}
      initialIconSet={initialIconSet}
    >
      <IconPickerContext.Consumer>
        {(state) => {
          if (!state) return null;

          const handleScrollChange = (values: positionValues) => {
            if (values.top >= 0.9 && state.page + 1 <= state.totalIconsPages) {
              state.setPage((page) => page + 1);
            }
          };

          return (
            <>
              <Tabs
                defaultValue="custom"
                value={state.iconSet}
                className={classes.Tabs}
                onValueChange={(value) => state.setIconSet(value as never)}
              >
                <TabsList className={classes.TabsList}>
                  <TabsTrigger value="custom">Own icons</TabsTrigger>
                  <TabsTrigger value="mdi">Mdi</TabsTrigger>
                  <TabsTrigger value="lucide">Lucide</TabsTrigger>
                </TabsList>
              </Tabs>
              <DebouncedInput
                className={classes.IconPickerSearchInputWrapper}
                wrapperClassName={classes.IconPickerSearchInput}
                onChangeValue={state.setSearchValue}
                placeholder={"Search icons"}
                hideEmptyMessages
                isClearable
              />
              <Scrollbars
                ref={scrollBarsRef}
                className={classes.IconPickerWrapper}
                onUpdate={handleScrollChange}
                style={{ height: undefined }}
              >
                <div className={cn("grid", classes.IconPickerGrid)}>
                  {state.availableIcons
                    ? state.availableIcons.map((iconName) => {
                        return (
                          <div key={iconName}>
                            <IconPickerIconButton
                              iconName={
                                (
                                  iconPickerDictionaries[
                                    state.iconSet as never
                                  ] as Dict
                                ).icons[iconName]
                              }
                              onClick={handleIconSelect.bind(
                                null,
                                iconName,
                                state.iconSet,
                              )}
                              icon={iconName}
                              iconSet={state.iconSet}
                            />
                          </div>
                        );
                      })
                    : undefined}
                </div>
              </Scrollbars>
            </>
          );
        }}
      </IconPickerContext.Consumer>
    </IconPickerProvider>
  );
};
