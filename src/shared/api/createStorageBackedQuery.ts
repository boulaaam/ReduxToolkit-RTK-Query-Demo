import type {
  BaseQueryFn,
  EndpointBuilder,
  FetchArgs,
  FetchBaseQueryError,
  QueryDefinition,
} from "@reduxjs/toolkit/query";

import { createStorageAdapter, isExpired, wrapValue } from "@/shared/api/storage/storageAdapters";
import type { CacheStrategy } from "@/shared/api/storage/storageAdapters";

export interface StorageConfig<Arg> {
  strategy:
    | CacheStrategy
    | ((options: { arg: Arg; getState: () => unknown }) => CacheStrategy);
  key: string | ((arg: Arg) => string);
  ttlMs?: number;
  purgeOnCacheRemoval?: boolean;
}

export interface StorageBackedQueryOptions<Result, Arg> {
  query: QueryDefinition<
    Result,
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    string,
    Result,
    string
  >["query"];
  providesTags?: QueryDefinition<
    Result,
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    string,
    Result,
    string
  >["providesTags"];
  keepUnusedDataFor?: number;
  storage: StorageConfig<Arg>;
}

type StandardBuilder = EndpointBuilder<
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  string,
  string
>;

export const buildStorageBackedQuery = <Result, Arg>(
  builder: StandardBuilder,
  options: StorageBackedQueryOptions<Result, Arg>,
): QueryDefinition<
  Result,
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  string,
  Result,
  string
> => {
  const { storage, ...rest } = options;

  const resolveKey = (arg: Arg) =>
    typeof storage.key === "function" ? storage.key(arg) : `${storage.key}:${JSON.stringify(arg)}`;

  return builder.query<Result, Arg>({
    ...rest,
    async onCacheEntryAdded(
      arg: Arg,
      lifecycleApi: {
        updateCachedData: (updater: (draft: Result | undefined) => void) => void;
        cacheEntryRemoved: Promise<void>;
        queryFulfilled: Promise<{ data: Result }>;
        getState: () => unknown;
        dispatch: (action: unknown) => unknown;
      },
    ) {
      const { updateCachedData, cacheEntryRemoved, queryFulfilled, getState } = lifecycleApi;
      const resolvedStrategy =
        typeof storage.strategy === "function"
          ? storage.strategy({ arg, getState })
          : storage.strategy;
      const storageAdapter = createStorageAdapter(resolvedStrategy);
      const cacheKey = resolveKey(arg);
      const cached = await storageAdapter.get<Result>(cacheKey);

      if (cached && !isExpired(cached, storage.ttlMs)) {
        updateCachedData(() => cached.value);
      }

      try {
        const result = await queryFulfilled;
        if (result?.data !== undefined) {
          await storageAdapter.set(cacheKey, wrapValue(result.data));
        }
      } catch (error) {
        if (!cached) {
          throw error;
        }
      }

      await cacheEntryRemoved;
      if (storage.purgeOnCacheRemoval) {
        await storageAdapter.remove(cacheKey);
      }
    },
  });
};
