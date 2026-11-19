import type { SalesOrderStatus } from "@/entities/sales-order";

export type TabStatus = "진행" | "임시저장" | "마감";

export const STATUS_PARAM: Record<TabStatus, SalesOrderStatus> = {
  진행: "COMPLETED",
  임시저장: "DRAFT",
  마감: "CLOSED",
};

export const STATUS_TABS: TabStatus[] = ["진행", "임시저장", "마감"];

export const TAB_STATUS_QUERY_KEY = "tabStatus";

export function statusFromParam(value: string | null): TabStatus {
  if (value === STATUS_PARAM["임시저장"]) return "임시저장";
  if (value === STATUS_PARAM["마감"]) return "마감";
  return "진행";
}
