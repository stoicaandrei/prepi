// src/utils/trpc.ts
import { CreateTRPCNext, createTRPCNext } from "@trpc/next";
import { httpBatchLink, loggerLink } from "@trpc/client";
import {
  inferRouterInputs,
  inferRouterOutputs,
  inferProcedureOutput,
} from "@trpc/server";
import type { AppRouter } from "@prepi/api";
import { transformer } from "@prepi/api/transformer";
import { NextPageContext } from "next";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const trpc: CreateTRPCNext<AppRouter, NextPageContext, null> =
  createTRPCNext<AppRouter>({
    config() {
      return {
        transformer,
        links: [
          loggerLink({
            enabled: (opts) =>
              process.env.NODE_ENV === "development" ||
              (opts.direction === "down" && opts.result instanceof Error),
          }),
          httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
          }),
        ],
      };
    },
    ssr: false,
  });

/**
 * Inference helpers for input types
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;

// Utility type to infer the data type of any query
export type InferQueryOutput<
  TRouteKey extends keyof AppRouter["_def"]["procedures"],
> = inferProcedureOutput<AppRouter["_def"]["procedures"][TRouteKey]>;

// Utility type to extract the data type from a query result
export type ExtractQueryData<TQuery> = TQuery extends { data: infer TData }
  ? TData
  : never;

// Combine both utilities for ease of use
export type QueryData<TRouteKey extends keyof AppRouter["_def"]["procedures"]> =
  ExtractQueryData<InferQueryOutput<TRouteKey>>;
