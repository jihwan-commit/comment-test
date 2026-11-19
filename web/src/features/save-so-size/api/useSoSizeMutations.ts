import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type SoSize, salesOrderKeys } from "@/entities/sales-order";

import { serviceApi } from "@/shared/api";

/** 사이즈 행 추가·삭제 — 상세(sizes 포함)를 다시 읽는다 */
export function useSoSizeMutations(salesOrderId: string) {
  const qc = useQueryClient();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: salesOrderKeys.detail(salesOrderId) });
  const create = useMutation({
    mutationFn: (body: { sizeName: string; isBasic?: boolean }) =>
      serviceApi
        .post<SoSize>("/so-size", { salesOrderId, ...body })
        .then((r) => r.data),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => serviceApi.delete(`/so-size/${id}`),
    onSuccess: invalidate,
  });
  return { create, remove };
}
