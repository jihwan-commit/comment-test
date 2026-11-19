import type { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

type Column = { id: string; width: number | "auto" };

/** common Table 을 흉내 낸 최소 테이블 — 폭은 colgroup, 헤더 sticky */
export function Table({
  columns,
  children,
  showEmpty,
  emptyContent,
  className,
}: {
  columns: Column[];
  children: ReactNode;
  showEmpty?: boolean;
  emptyContent?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-auto rounded-lg border border-cool200 bg-white",
        className
      )}
    >
      <table className="w-full table-fixed border-separate border-spacing-0 text-[13px] leading-[1.4]">
        <colgroup>
          {columns.map((c) => (
            <col
              key={c.id}
              style={c.width === "auto" ? undefined : { width: c.width }}
            />
          ))}
        </colgroup>
        {children}
      </table>
      {showEmpty && (
        <div className="flex h-40 items-center justify-center text-cool400">
          {emptyContent ?? "내용 없음"}
        </div>
      )}
    </div>
  );
}

export function Th({
  className,
  $checkbox,
  $right,
  children,
  ...rest
}: ThHTMLAttributes<HTMLTableCellElement> & {
  $checkbox?: boolean;
  $right?: boolean;
}) {
  return (
    <th
      {...rest}
      className={cn(
        "sticky top-0 z-10 h-10 border-b border-cool200 bg-cool100 px-3 text-left font-semibold whitespace-nowrap text-cool800",
        $checkbox && "px-0 text-center",
        $right && "text-right",
        className
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  className,
  $checkbox,
  $right,
  $edit,
  children,
  ...rest
}: TdHTMLAttributes<HTMLTableCellElement> & {
  $checkbox?: boolean;
  $right?: boolean;
  $edit?: boolean;
}) {
  return (
    <td
      {...rest}
      className={cn(
        "h-10 border-b border-cool200 px-3 whitespace-nowrap",
        $checkbox && "px-0 text-center",
        $right && "text-right tabular-nums",
        $edit && "p-1",
        className
      )}
    >
      {children}
    </td>
  );
}

export function Tr({
  className,
  $blue,
  $yellow,
  $gray,
  $disableHover,
  children,
  ...rest
}: React.HTMLAttributes<HTMLTableRowElement> & {
  $blue?: boolean;
  $yellow?: boolean;
  $gray?: boolean;
  $disableHover?: boolean;
}) {
  return (
    <tr
      {...rest}
      className={cn(
        !$disableHover && "hover:bg-cool100",
        $blue && "bg-blue50",
        $yellow && "bg-lemon3",
        $gray && "bg-cool100",
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TruncatedText({
  text,
  className,
}: {
  text: string | null | undefined;
  className?: string;
}) {
  const value = text ?? "";
  return (
    <span className={cn("block truncate", className)} title={value}>
      {value || "-"}
    </span>
  );
}

/** 검색 행의 텍스트 입력 */
export function InputText({
  value,
  onValueChange,
  ...rest
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  value: string;
  onValueChange: (v: string) => void;
}) {
  return (
    <input
      {...rest}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="h-8 w-full rounded border border-cool300 bg-white px-2 text-[13px] outline-none focus:border-mainBlue"
    />
  );
}
