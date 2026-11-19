import type { SalesOrdersResponse } from "@/entities/sales-order";

import { formatAmount, formatNumber } from "@/shared/lib/formatters";

type SummarySectionProps = {
  totals: SalesOrdersResponse | undefined;
  collapsed: boolean;
  onToggle: () => void;
};

/**
 * 요약 카드 — 검색 조건에 걸린 전체 기준 합계(건수·수량·금액).
 * 조건을 바꾸면 값이 통째로 바뀐다 → 댓글 엣지케이스 2번의 대상.
 */
export function SummarySection({
  totals,
  collapsed,
  onToggle,
}: SummarySectionProps) {
  const empty = !totals || totals.totalCount === 0;
  const show = (v: number | undefined) =>
    empty || v === undefined ? "-" : formatNumber(v);
  const showAmount = (v: number | undefined) =>
    empty || v === undefined ? "-" : formatAmount(v);
  const cells = [
    {
      id: "totalCount",
      label: "건수",
      value: show(totals?.totalCount),
      unit: "건",
    },
    {
      id: "totalBuyerQuantity",
      label: "바이어",
      value: show(totals?.totalBuyerQuantity),
      unit: "개사",
    },
    {
      id: "totalOrderQuantity",
      label: "오더수량",
      value: show(totals?.totalOrderQuantity),
      unit: "pcs",
    },
    {
      id: "totalProdQuantity",
      label: "지시수량",
      value: show(totals?.totalProdQuantity),
      unit: "pcs",
    },
    {
      id: "totalOrderAmount",
      label: "오더금액",
      value: showAmount(totals?.totalOrderAmount),
      unit: "",
    },
    {
      id: "totalProdAmount",
      label: "지시금액",
      value: showAmount(totals?.totalProdAmount),
      unit: "",
    },
  ];

  return (
    <section
      className={`rounded-xl border border-cool200 bg-white px-4 ${collapsed ? "py-2" : "py-4"}`}
    >
      <div className="flex h-8 items-center gap-2">
        <h2 className="text-base leading-[1.4] font-bold text-achromaticBlack">
          요약
        </h2>
        <span className="text-[13px] leading-[1.4] text-cool700">
          검색 조건에 걸린 전체 기준
        </span>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!collapsed}
          className="ml-auto rounded-md p-1.5 text-cool700 hover:bg-cool100"
        >
          {collapsed ? "펼치기" : "접기"}
        </button>
      </div>
      {!collapsed && (
        <div className="mt-2 grid grid-cols-6 gap-4 px-2">
          {cells.map((c) => (
            <div
              key={c.id}
              className="rounded-lg bg-cool100 px-4 py-3"
              data-summary-cell={c.id}
            >
              <div className="text-sm text-cool800">{c.label}</div>
              <div className="mt-1 text-base font-bold whitespace-nowrap text-achromaticBlack">
                {c.value}
                {c.unit && (
                  <span className="ml-1 text-[13px] font-normal text-cool700">
                    {c.unit}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
