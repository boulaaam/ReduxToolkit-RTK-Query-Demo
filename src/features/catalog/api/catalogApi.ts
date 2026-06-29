import type {
  BaseQueryFn,
  EndpointBuilder,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import type { RootState } from "@/app/store";
import { selectCatalogStorage } from "@/entities/preferences/model/selectors";
import { appApi } from "@/shared/api/appApi";
import { buildStorageBackedQuery } from "@/shared/api/createStorageBackedQuery";

export interface CatalogItem {
  id: string;
  name: string;
  price: number;
  category: string;
  inventory: number;
  description: string;
}

type CatalogEndpointBuilder = EndpointBuilder<
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  "Weather" | "Catalog" | "Tasks",
  "appApi"
>;

export const catalogApi = appApi.injectEndpoints({
  endpoints: (builder: CatalogEndpointBuilder) => ({
    listCatalog: buildStorageBackedQuery<CatalogItem[], void>(builder, {
      query: () => ({ url: "/catalog" }),
      storage: {
        strategy: ({ getState }) => selectCatalogStorage(getState() as RootState),
        key: "catalog",
        ttlMs: 1000 * 60 * 60,
      },
      providesTags: (result: CatalogItem[] | undefined) =>
        result
          ? ["Catalog", ...result.map((item: CatalogItem) => ({ type: "Catalog" as const, id: item.id }))]
          : ["Catalog"],
    }),
    getItem: buildStorageBackedQuery<CatalogItem, string>(builder, {
      query: (id: string) => ({
        url: `/catalog/${id}`,
      }),
      storage: {
        strategy: ({ getState }) => selectCatalogStorage(getState() as RootState),
        key: (id: string) => `catalog:${id}`,
        ttlMs: 1000 * 60 * 60 * 24,
      },
      providesTags: (_result: CatalogItem | undefined, _error: unknown, id: string) => [
        { type: "Catalog", id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useListCatalogQuery, useGetItemQuery } = catalogApi;
