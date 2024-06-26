import { useStandardApiHandler } from "@/hooks/useStandardApiHandler";
import { IconDictionaries } from "@/types";
import React from "react";

const StoreIconDictionariesName = "DashboardIconDictionaries" as const;

export const useIconDictionaries = () => {
  const [iconDictionaries, setIconDictionaries] = React.useState<
    IconDictionaries | undefined
  >(window[StoreIconDictionariesName as never] as never);

  const { wrapApiRequest } = useStandardApiHandler();

  const loadDictionaries = wrapApiRequest(async () => {
    const iconsBaseUrl =
      import.meta.env.MODE === "development" ? "" : import.meta.env.BASE_URL;
    const dictionariesRequest = await fetch(
      // eslint-disable-next-line
      iconsBaseUrl + "/icons/icon-dictionaries.json",
    );

    const dictionaries = (await dictionariesRequest.json()) as IconDictionaries;

    (window[StoreIconDictionariesName as never] as unknown) = dictionaries;
    setIconDictionaries(dictionaries);
  });

  const hasDictionary = iconDictionaries !== undefined;

  React.useEffect(() => {
    if (iconDictionaries !== undefined) return;

    loadDictionaries().then();
  }, [hasDictionary]);

  return iconDictionaries;
};
