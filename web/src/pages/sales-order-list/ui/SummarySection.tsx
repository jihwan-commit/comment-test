import { CommentScope, Commentable } from "@/widgets/commentable";

import type { SalesOrdersResponse } from "@/entities/sales-order";

import { formatAmount, formatNumber } from "@/shared/lib/formatters";

type SummarySectionProps = {
  totals: SalesOrdersResponse | undefined;
  /** 스냅샷에 같이 남길 조회 조건 설명 */
  conditionLabel: string;
  collapsed: boolean;
  onToggle: () => void;
};

/** 집계 카드는 대응하는 DB 행이 없다 — 화면 고정 id 에 붙이고(2-A) 값과 조회 조건을 스냅샷으로 남긴다 */
const SUMMARY_TARGET_ID = "sales-order-list";

/**
 * 요약 카드 — 검색 조건에 걸린 전체 기준 합계(건수·수량·금액).
 * 조건을 바꾸면 값이 통째로 바뀐다 → 댓글 엣지케이스 2번의 대상.
 */
export function SummarySection({
  totals,
  conditionLabel,
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
        <CommentScope
          targetType="GEULIM_SALES_ORDER_LIST_SUMMARY"
          targetIds={[SUMMARY_TARGET_ID]}
        >
          <div className="mt-2 grid grid-cols-6 gap-4 px-2">
            {cells.map((c) => (
              <div
                key={c.id}
                className="rounded-lg bg-cool100 px-4 py-3"
                data-summary-cell={c.id}
              >
                <div className="text-sm text-cool800">{c.label}</div>
                <Commentable
                  targetId={SUMMARY_TARGET_ID}
                  field={c.id}
                  label={`요약 · ${c.label}`}
                  value={
                    totals
                      ? `${c.value}${c.unit ? " " + c.unit : ""} (${conditionLabel})`
                      : null
                  }
                  inline
                >
                  <div className="mt-1 text-base font-bold whitespace-nowrap text-achromaticBlack">
                    {c.value}
                    {c.unit && (
                      <span className="ml-1 text-[13px] font-normal text-cool700">
                        {c.unit}
                      </span>
                    )}
                  </div>
                </Commentable>
              </div>
            ))}
          </div>
        </CommentScope>
      )}
    </section>
  );
}
