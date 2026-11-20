import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";

import { Commentable } from "@/widgets/commentable";

import type { SalesOrder } from "@/entities/sales-order";

import { formatDate, formatDateTime } from "@/shared/lib/date";
import {
  KRW_SYMBOL,
  formatNumber,
  formatSeason,
} from "@/shared/lib/formatters";
import type { CheckboxReturnType } from "@/shared/lib/useCheckbox";
import type { SortControl, SortDirection } from "@/shared/lib/useSort";
import { Checkbox, Table, Td, Th, Tr, TruncatedText } from "@/shared/ui";

import { type OrderBy, SALES_ORDER_COLUMNS } from "../config/columns";
import type { SearchValues } from "../model/listParams";
import { SearchRow } from "./SearchRow";

type SalesOrderTableProps = {
  items: SalesOrder[];
  sort: SortControl<OrderBy>;
  searchOpen: boolean;
  search: SearchValues;
  onApplySearch: (values: SearchValues) => void;
  checkbox: CheckboxReturnType<string>;
  emptyContent?: ReactNode;
};

const FILL_COLUMN_ID = "_fill";
const COLUMN_WIDTHS = [
  { id: "checkbox", width: 40 },
  ...SALES_ORDER_COLUMNS.map((c) => ({ id: c.id, width: c.width })),
  { id: FILL_COLUMN_ID, width: "auto" as const },
];
const COLUMN_BY_ID = new Map(SALES_ORDER_COLUMNS.map((c) => [c.id, c]));

function SortArrow({ direction }: { direction?: SortDirection }) {
  return (
    <span
      className={`shrink-0 text-[10px] text-mainBlue ${direction === "asc" ? "rotate-180" : ""}`}
      aria-hidden
    >
      ▼
    </span>
  );
}

/** 금액 — 기호는 왼쪽, 숫자는 오른쪽 */
function CurrencyAmount({ amount }: { amount: number }) {
  return (
    <span className="flex min-w-[88px] justify-between gap-1">
      <span>{KRW_SYMBOL}</span>
      <span>{formatNumber(amount)}</span>
    </span>
  );
}

export function SalesOrderTable({
  items,
  sort,
  searchOpen,
  search,
  onApplySearch,
  checkbox,
  emptyContent,
}: SalesOrderTableProps) {
  /** 셀 하나 — 값은 Commentable 로 감싸 (행 id, 열 키) 에 댓글이 붙는다. 오른쪽 정렬 셀은 배지가 숫자 왼쪽에 */
  const cell = (
    so: SalesOrder,
    field: string,
    label: string,
    value: string | null,
    node: ReactNode,
    right = false
  ) => (
    <Td $right={right}>
      <Commentable
        targetId={so.id}
        field={field}
        label={label}
        value={value}
        badgeLeft={right}
        className={right ? "justify-end" : ""}
      >
        {node}
      </Commentable>
    </Td>
  );

  const cellsOf = (so: SalesOrder): Record<string, ReactNode> => {
    const season = formatSeason(so.season, so.year);
    const delivery = so.deliveryDate ? formatDate(so.deliveryDate) : "-";
    const created = formatDateTime(so.createdAt);
    return {
      checkbox: (
        <Td $checkbox>
          <Checkbox
            checked={checkbox.includes(so.id)}
            onChange={() => checkbox.toggle(so.id)}
            aria-label="행 선택"
          />
        </Td>
      ),
      team: cell(
        so,
        "teamName",
        "담당 팀",
        so.teamName,
        <TruncatedText text={so.teamName ?? "-"} />
      ),
      season: cell(
        so,
        "season",
        "시즌",
        season,
        <TruncatedText text={season} />
      ),
      buyer: cell(
        so,
        "buyerName",
        "바이어",
        so.buyerName,
        <TruncatedText text={so.buyerName} />
      ),
      brand: cell(
        so,
        "brandName",
        "브랜드",
        so.brandName,
        <TruncatedText text={so.brandName} />
      ),
      styleNumber: cell(
        so,
        "styleNumber",
        "품번",
        so.styleNumber,
        <Link to={`/sales-orders/${so.id}`} className="underline">
          {so.styleNumber}
        </Link>
      ),
      styleDescription: cell(
        so,
        "styleDescription",
        "스타일 상세",
        so.styleDescription,
        <TruncatedText className="max-w-[160px]" text={so.styleDescription} />
      ),
      gender: cell(
        so,
        "gender",
        "성별",
        so.gender,
        <TruncatedText text={so.gender} />
      ),
      orderQty: cell(
        so,
        "orderQty",
        "오더수량",
        String(so.orderQty),
        <TruncatedText text={formatNumber(so.orderQty)} />,
        true
      ),
      prodQty: cell(
        so,
        "prodQty",
        "지시수량",
        String(so.prodQty),
        <TruncatedText text={formatNumber(so.prodQty)} />,
        true
      ),
      orderAmount: cell(
        so,
        "orderAmount",
        "오더금액",
        String(so.orderAmount),
        <CurrencyAmount amount={so.orderAmount} />,
        true
      ),
      prodAmount: cell(
        so,
        "prodAmount",
        "지시금액",
        String(so.prodAmount),
        <CurrencyAmount amount={so.prodAmount} />,
        true
      ),
      deliveryDate: cell(
        so,
        "deliveryDate",
        "납기",
        so.deliveryDate,
        <TruncatedText text={delivery} />
      ),
      sewingFactory: cell(
        so,
        "sewingFactoryName",
        "봉제처",
        so.sewingFactoryName,
        <TruncatedText text={so.sewingFactoryName ?? ""} />
      ),
      sewingFactoryCountry: cell(
        so,
        "sewingFactoryCountry",
        "생산국",
        so.sewingFactoryCountry,
        <TruncatedText text={so.sewingFactoryCountry ?? ""} />
      ),
      createdAt: cell(
        so,
        "createdAt",
        "생성일",
        created,
        <TruncatedText text={created} />
      ),
    };
  };

  return (
    <Table
      columns={COLUMN_WIDTHS}
      showEmpty={items.length === 0}
      emptyContent={emptyContent}
    >
      <thead>
        <Tr $disableHover>
          {COLUMN_WIDTHS.map(({ id }) => {
            if (id === "checkbox")
              return (
                <Th key={id} $checkbox>
                  <Checkbox
                    checked={checkbox.allChecked}
                    onChange={checkbox.toggleAll}
                    aria-label="전체 선택"
                  />
                </Th>
              );
            const col = COLUMN_BY_ID.get(id);
            if (!col) return <Th key={id} />;
            const active = col.sortKey != null && sort.orderBy === col.sortKey;
            return (
              <Th
                key={id}
                $right={col.align === "right"}
                onClick={
                  col.sortKey ? () => sort.toggleSort(col.sortKey!) : undefined
                }
                className={
                  col.sortKey
                    ? `cursor-pointer select-none ${active ? "text-mainBlue" : ""}`
                    : undefined
                }
              >
                <span className="flex w-full min-w-0 items-center justify-between gap-1">
                  <span className="truncate">{col.label}</span>
                  {active && <SortArrow direction={sort.orderDirection} />}
                </span>
              </Th>
            );
          })}
        </Tr>
      </thead>
      <tbody>
        {searchOpen && (
          <SearchRow
            columnIds={COLUMN_WIDTHS.map((c) => c.id)}
            values={search}
            onApply={onApplySearch}
          />
        )}
        {items.map((so) => {
          const cells = cellsOf(so);
          return (
            <Tr key={so.id} $blue={checkbox.includes(so.id)}>
              {COLUMN_WIDTHS.map(({ id }) => (
                <Fragment key={id}>{cells[id] ?? <Td />}</Fragment>
              ))}
            </Tr>
          );
        })}
      </tbody>
    </Table>
  );
}
