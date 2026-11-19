import { useState } from "react";

import { useDeleteSalesOrders } from "@/features/delete-sales-order";

import { useSalesOrdersQuery } from "@/entities/sales-order";

import { useCheckbox } from "@/shared/lib/useCheckbox";

import { useListParams } from "../model/listParams";
import { ActionBar } from "./ActionBar";
import { Pagination } from "./Pagination";
import { SalesOrderTable } from "./SalesOrderTable";
import { StatusTabs } from "./StatusTabs";
import { SummarySection } from "./SummarySection";

const EMPTY: never[] = [];

/** 오더 수주 목록 — geulim SalesOrderListPage 의 축소판(상태 탭·요약·액션바·테이블·페이지) */
export function SalesOrderListPage() {
  const {
    status,
    setStatus,
    searchValues,
    applySearch,
    resetFilters,
    hasFilters,
    sort,
    pagination,
    query,
  } = useListParams();
  const { data, isError } = useSalesOrdersQuery(query);
  const [searchOpen, setSearchOpen] = useState(hasFilters);
  const [collapsed, setCollapsed] = useState(false);

  const checkbox = useCheckbox<string>(data?.salesOrders ?? EMPTY);
  const remove = useDeleteSalesOrders();
  const onDelete = () => {
    if (!window.confirm(`${checkbox.checkedItems.length}건을 삭제할까요?`))
      return;
    remove.mutate(checkbox.checkedItems, {
      onSuccess: () => checkbox.resetCheckbox(),
    });
  };

  return (
    <div className="flex min-h-full min-w-[1400px] flex-col gap-4 bg-white p-6">
      <StatusTabs
        status={status}
        onChange={setStatus}
        counts={{ 임시저장: data?.draftCount }}
      />
      <SummarySection
        totals={data}
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
      />
      <ActionBar
        totalCount={data?.totalCount}
        searchOpen={searchOpen}
        onToggleSearch={() => setSearchOpen((v) => !v)}
        hasFilters={hasFilters}
        onResetFilters={resetFilters}
        canDelete={checkbox.checkedItems.length > 0}
        onDelete={onDelete}
        deleting={remove.isPending}
      />
      {isError ? (
        <div
          role="alert"
          className="rounded-lg border border-cool200 p-10 text-center text-cool600"
        >
          목록을 불러오지 못했습니다.
        </div>
      ) : (
        <>
          <SalesOrderTable
            items={data?.salesOrders ?? []}
            sort={sort}
            searchOpen={searchOpen}
            search={searchValues}
            onApplySearch={applySearch}
            checkbox={checkbox}
            emptyContent={
              hasFilters && data ? (
                <span className="flex items-center gap-2 text-cool600">
                  검색 결과가 없습니다
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="font-semibold text-mainBlue"
                  >
                    초기화
                  </button>
                </span>
              ) : undefined
            }
          />
          <div className="flex justify-center">
            <Pagination
              page={pagination.page}
              lastPage={data?.totalPage ?? 1}
              onChange={pagination.setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
