import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";

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
    <span className="flex justify-between gap-1">
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
  const cellsOf = (so: SalesOrder): Record<string, ReactNode> => ({
    checkbox: (
      <Td $checkbox>
        <Checkbox
          checked={checkbox.includes(so.id)}
          onChange={() => checkbox.toggle(so.id)}
          aria-label="행 선택"
        />
      </Td>
    ),
    team: (
      <Td>
        <TruncatedText text={so.teamName ?? "-"} />
      </Td>
    ),
    season: (
      <Td>
        <TruncatedText text={formatSeason(so.season, so.year)} />
      </Td>
    ),
    buyer: (
      <Td>
        <TruncatedText text={so.buyerName} />
      </Td>
    ),
    brand: (
      <Td>
        <TruncatedText text={so.brandName} />
      </Td>
    ),
    styleNumber: (
      <Td>
        <Link to={`/sales-orders/${so.id}`} className="underline">
          {so.styleNumber}
        </Link>
      </Td>
    ),
    styleDescription: (
      <Td>
        <TruncatedText className="max-w-[184px]" text={so.styleDescription} />
      </Td>
    ),
    gender: (
      <Td>
        <TruncatedText text={so.gender} />
      </Td>
    ),
    orderQty: (
      <Td $right>
        <TruncatedText text={formatNumber(so.orderQty)} />
      </Td>
    ),
    prodQty: (
      <Td $right>
        <TruncatedText text={formatNumber(so.prodQty)} />
      </Td>
    ),
    orderAmount: (
      <Td $right>
        <CurrencyAmount amount={so.orderAmount} />
      </Td>
    ),
    prodAmount: (
      <Td $right>
        <CurrencyAmount amount={so.prodAmount} />
      </Td>
    ),
    deliveryDate: (
      <Td>
        <TruncatedText
          text={so.deliveryDate ? formatDate(so.deliveryDate) : "-"}
        />
      </Td>
    ),
    sewingFactory: (
      <Td>
        <TruncatedText text={so.sewingFactoryName ?? ""} />
      </Td>
    ),
    sewingFactoryCountry: (
      <Td>
        <TruncatedText text={so.sewingFactoryCountry ?? ""} />
      </Td>
    ),
    createdAt: (
      <Td>
        <TruncatedText text={formatDateTime(so.createdAt)} />
      </Td>
    ),
  });

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
