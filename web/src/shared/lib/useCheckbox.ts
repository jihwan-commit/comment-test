import { useCallback, useEffect, useMemo, useState } from "react";

export interface CheckboxReturnType<T extends string> {
  checkedItems: T[];
  includes: (id: T) => boolean;
  toggle: (id: T) => void;
  toggleAll: () => void;
  allChecked: boolean;
  resetCheckbox: () => void;
}

/** 목록 행 선택 — items 가 바뀌면(페이지 이동·필터) 목록에 없는 선택은 버린다 */
export function useCheckbox<T extends string>(
  items: ReadonlyArray<{ id: T }>
): CheckboxReturnType<T> {
  const [checked, setChecked] = useState<T[]>([]);
  const ids = useMemo(() => items.map((i) => i.id), [items]);

  useEffect(() => {
    // 같은 내용이면 같은 배열을 돌려줘야 한다 — 매번 새 배열을 만들면 렌더 루프
    setChecked((prev) =>
      prev.some((id) => !ids.includes(id))
        ? prev.filter((id) => ids.includes(id))
        : prev
    );
  }, [ids]);

  const includes = useCallback((id: T) => checked.includes(id), [checked]);
  const toggle = useCallback(
    (id: T) =>
      setChecked((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      ),
    []
  );
  const allChecked = ids.length > 0 && ids.every((id) => checked.includes(id));
  const toggleAll = useCallback(
    () => setChecked(allChecked ? [] : [...ids]),
    [allChecked, ids]
  );
  const resetCheckbox = useCallback(() => setChecked([]), []);

  return {
    checkedItems: checked,
    includes,
    toggle,
    toggleAll,
    allChecked,
    resetCheckbox,
  };
}
