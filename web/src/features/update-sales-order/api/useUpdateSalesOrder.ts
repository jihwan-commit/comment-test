import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type SalesOrder, salesOrderKeys } from "@/entities/sales-order";

import { serviceApi } from "@/shared/api";

export type SalesOrderPatch = Partial<
  Omit<SalesOrder, "id" | "createdAt" | "updatedAt">
>;

export function useUpdateSalesOrder(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: SalesOrderPatch) =>
      serviceApi
        .patch<SalesOrder>(`/sales-orders/${id}`, patch)
        .then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: salesOrderKeys.all }),
  });
}
