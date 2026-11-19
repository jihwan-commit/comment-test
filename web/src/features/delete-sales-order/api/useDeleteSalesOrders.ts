import { useMutation, useQueryClient } from "@tanstack/react-query";

import { salesOrderKeys } from "@/entities/sales-order";

import { serviceApi } from "@/shared/api";

export function useDeleteSalesOrders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) =>
      serviceApi.delete("/sales-orders", { params: { ids: ids.join(",") } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: salesOrderKeys.all }),
  });
}
