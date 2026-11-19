import { useQuery } from "@tanstack/react-query";

import { serviceApi } from "@/shared/api";

import type { SalesOrderDetail } from "../model/types";
import { salesOrderKeys } from "./salesOrderKeys";

export const fetchSalesOrder = async (id: string) =>
  (await serviceApi.get<SalesOrderDetail>(`/sales-orders/${id}`)).data;

export function useSalesOrderQuery(id: string | undefined) {
  return useQuery({
    queryKey: salesOrderKeys.detail(id ?? ""),
    queryFn: () => fetchSalesOrder(id!),
    enabled: !!id,
  });
}
