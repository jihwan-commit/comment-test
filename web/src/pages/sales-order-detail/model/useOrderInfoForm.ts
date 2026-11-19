import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useUpdateSalesOrder } from "@/features/update-sales-order";

import { useSalesOrderQuery } from "@/entities/sales-order";

import {
  type OrderInfoValues,
  orderInfoSchema,
  toFormValues,
  toPatch,
} from "./orderInfoSchema";

/** 상세 폼 — 보기/수정 토글, 서버 값으로 reset, 저장은 PATCH (geulim useOrderInfoForm 축소판) */
export function useOrderInfoForm(id: string) {
  const { data: detail, isError } = useSalesOrderQuery(id);
  const update = useUpdateSalesOrder(id);
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm<OrderInfoValues>({
    resolver: zodResolver(orderInfoSchema),
    defaultValues: detail ? toFormValues(detail) : undefined,
  });

  // 서버 값이 바뀌면(첫 로딩·저장 후) 폼을 그 값으로 — 편집 중엔 입력을 덮지 않는다
  const seeded = useRef<string | null>(null);
  useEffect(() => {
    if (!detail) return;
    if (seeded.current === detail.updatedAt) return;
    seeded.current = detail.updatedAt;
    if (!form.formState.isDirty || !isEditMode)
      form.reset(toFormValues(detail));
  }, [detail, form, isEditMode]);

  const reset = () => detail && form.reset(toFormValues(detail));

  const onSubmit = form.handleSubmit(async (values) => {
    await update.mutateAsync(toPatch(values));
    setIsEditMode(false);
  });

  const toggleEdit = (on: boolean) => {
    if (!on && form.formState.isDirty) {
      if (!window.confirm("저장하지 않은 변경이 있습니다. 나갈까요?")) return;
      reset();
    }
    setIsEditMode(on);
  };

  return {
    form,
    detail,
    isError,
    isEditMode,
    toggleEdit,
    isDirty: form.formState.isDirty,
    reset,
    onSubmit,
    isSaving: update.isPending,
  };
}
