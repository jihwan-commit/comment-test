import type { SalesOrdersQuery } from "../model/types";

export const salesOrderKeys = {
  all: ["sales-orders"] as const,
  lists: () => [...salesOrderKeys.all, "list"] as const,
  list: (params: SalesOrdersQuery) =>
    [...salesOrderKeys.lists(), params] as const,
  details: () => [...salesOrderKeys.all, "detail"] as const,
  detail: (id: string) => [...salesOrderKeys.details(), id] as const,
};
