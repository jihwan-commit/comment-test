import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import type { SalesOrdersQuery } from "@/entities/sales-order";

import { usePagination } from "@/shared/lib/usePagination";
import { useSort } from "@/shared/lib/useSort";

import {
  ORDER_BY_VALUES,
  SALES_ORDER_COLUMNS,
  type SearchKey,
} from "../config/columns";
import {
  STATUS_PARAM,
  TAB_STATUS_QUERY_KEY,
  type TabStatus,
  statusFromParam,
} from "../config/statusTabs";

export type SearchValues = Record<SearchKey, string>;

const SEARCH_KEYS = SALES_ORDER_COLUMNS.flatMap((c) =>
  c.searchKey ? [c.searchKey] : []
);
const EMPTY_SEARCH = Object.fromEntries(
  SEARCH_KEYS.map((k) => [k, ""])
) as SearchValues;

/** 목록 화면 상태 전부를 URL 쿼리로 — 탭·검색·정렬·페이지. geulim listParams 의 축소판 */
export function useListParams() {
  const [params, setParams] = useSearchParams();
  const status = statusFromParam(params.get(TAB_STATUS_QUERY_KEY));
  const sort = useSort(ORDER_BY_VALUES);
  const pagination = usePagination(20);

  const searchValues = useMemo(
    () =>
      Object.fromEntries(
        SEARCH_KEYS.map((k) => [k, params.get(k) ?? ""])
      ) as SearchValues,
    [params]
  );
  const hasFilters = SEARCH_KEYS.some((k) => !!params.get(k));

  const setStatus = useCallback(
    (next: TabStatus) =>
      setParams((prev) => {
        const p = new URLSearchParams(prev);
        p.set(TAB_STATUS_QUERY_KEY, STATUS_PARAM[next]);
        p.delete("page");
        return p;
      }),
    [setParams]
  );

  const applySearch = useCallback(
    (values: SearchValues) =>
      setParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          for (const k of SEARCH_KEYS) {
            const v = values[k]?.trim();
            if (v) p.set(k, v);
            else p.delete(k);
          }
          p.delete("page");
          return p;
        },
        { replace: true }
      ),
    [setParams]
  );

  const resetFilters = useCallback(
    () => applySearch(EMPTY_SEARCH),
    [applySearch]
  );

  const query: SalesOrdersQuery = {
    status: STATUS_PARAM[status],
    ...searchValues,
    orderBy: sort.orderBy,
    orderDirection: sort.orderDirection,
    page: pagination.page,
    take: pagination.take,
  };

  return {
    status,
    setStatus,
    searchValues,
    applySearch,
    resetFilters,
    hasFilters,
    sort,
    pagination,
    query,
  };
}
