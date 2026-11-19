import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { serviceApi } from "@/shared/api";

import type { SalesOrdersQuery, SalesOrdersResponse } from "../model/types";
import { salesOrderKeys } from "./salesOrderKeys";

const clean = (params: SalesOrdersQuery) =>
  Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
  );

export const fetchSalesOrders = async (params: SalesOrdersQuery) =>
  (
    await serviceApi.get<SalesOrdersResponse>("/sales-orders", {
      params: clean(params),
    })
  ).data;

export function useSalesOrdersQuery(params: SalesOrdersQuery) {
  return useQuery({
    queryKey: salesOrderKeys.list(params),
    queryFn: () => fetchSalesOrders(params),
    placeholderData: keepPreviousData,
  });
}
