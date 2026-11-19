import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export type SortDirection = "asc" | "desc";

export interface SortControl<T extends string> {
  orderBy?: T;
  orderDirection?: SortDirection;
  toggleSort: (key: T) => void;
  resetSort: () => void;
}

const ORDER_BY_KEY = "orderBy";
const ORDER_DIRECTION_KEY = "orderDirection";

/** URL 쿼리(orderBy·orderDirection)와 동기화되는 정렬 — desc → asc → 해제 순환 */
export function useSort<T extends string = string>(
  orderByValues: readonly T[]
): SortControl<T> {
  const [params, setParams] = useSearchParams();
  const rawBy = params.get(ORDER_BY_KEY);
  const orderBy = orderByValues.includes(rawBy as T) ? (rawBy as T) : undefined;
  const rawDir = params.get(ORDER_DIRECTION_KEY);
  const orderDirection =
    orderBy && (rawDir === "asc" || rawDir === "desc") ? rawDir : undefined;

  const toggleSort = useCallback(
    (key: T) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const by = next.get(ORDER_BY_KEY);
          const dir = next.get(ORDER_DIRECTION_KEY);
          if (by !== key) {
            next.set(ORDER_BY_KEY, key);
            next.set(ORDER_DIRECTION_KEY, "desc");
          } else if (dir === "desc") {
            next.set(ORDER_DIRECTION_KEY, "asc");
          } else {
            next.delete(ORDER_BY_KEY);
            next.delete(ORDER_DIRECTION_KEY);
          }
          return next;
        },
        { replace: true }
      );
    },
    [setParams]
  );

  const resetSort = useCallback(() => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete(ORDER_BY_KEY);
        next.delete(ORDER_DIRECTION_KEY);
        return next;
      },
      { replace: true }
    );
  }, [setParams]);

  return { orderBy, orderDirection, toggleSort, resetSort };
}
