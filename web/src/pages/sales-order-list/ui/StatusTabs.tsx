import type { ReactNode } from "react";

import { formatNumber } from "@/shared/lib/formatters";

import { STATUS_TABS, type TabStatus } from "../config/statusTabs";

type StatusTabsProps = {
  status: TabStatus;
  onChange: (status: TabStatus) => void;
  counts?: Partial<Record<TabStatus, number | undefined>>;
  trailing?: ReactNode;
};

/** 상태 탭 — 밑줄 없이 선택 탭만 진하게, 건수는 14px 로 뒤에 */
export function StatusTabs({
  status,
  onChange,
  counts,
  trailing,
}: StatusTabsProps) {
  return (
    <div className="flex h-10 items-center justify-between border-b border-cool200">
      <div className="flex items-center gap-3">
        {STATUS_TABS.map((tab) => {
          const count = counts?.[tab];
          return (
            <button
              key={tab}
              type="button"
              aria-current={status === tab ? "page" : undefined}
              onClick={() => onChange(tab)}
              className={`text-base leading-[1.4] font-bold ${
                status === tab ? "text-achromaticBlack" : "text-cool400"
              }`}
            >
              {tab}
              {count !== undefined && (
                <span className="ml-1 text-sm">({formatNumber(count)})</span>
              )}
            </button>
          );
        })}
      </div>
      {trailing}
    </div>
  );
}
