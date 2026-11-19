import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const PAGE_KEY = "page";

export function usePagination(take = 20) {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get(PAGE_KEY)) || 1);
  const setPage = useCallback(
    (next: number) =>
      setParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          if (next <= 1) p.delete(PAGE_KEY);
          else p.set(PAGE_KEY, String(next));
          return p;
        },
        { replace: true }
      ),
    [setParams]
  );
  return { page, take, setPage };
}
