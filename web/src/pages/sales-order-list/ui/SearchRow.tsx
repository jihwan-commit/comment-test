import { Controller, useForm } from "react-hook-form";

import { InputText, Td, Tr } from "@/shared/ui";

import { SALES_ORDER_COLUMNS } from "../config/columns";
import type { SearchValues } from "../model/listParams";

const COLUMN_BY_ID = new Map(SALES_ORDER_COLUMNS.map((c) => [c.id, c]));

type SearchRowProps = {
  columnIds: string[];
  values: SearchValues;
  onApply: (values: SearchValues) => void;
};

/** 헤더 바로 아래 검색 행 — Enter 로 적용 */
export function SearchRow({ columnIds, values, onApply }: SearchRowProps) {
  const { control, handleSubmit } = useForm<SearchValues>({ values });
  const submit = handleSubmit(onApply);
  const submitOnEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") void submit();
  };

  return (
    <Tr $disableHover $gray>
      {columnIds.map((id) => {
        const col = COLUMN_BY_ID.get(id);
        if (!col?.searchKey) return <Td key={id} />;
        return (
          <Td key={id} $edit>
            <Controller
              control={control}
              name={col.searchKey}
              render={({ field }) => (
                <InputText
                  value={field.value}
                  onValueChange={field.onChange}
                  onBlur={field.onBlur}
                  onKeyDown={submitOnEnter}
                  placeholder="검색"
                />
              )}
            />
          </Td>
        );
      })}
    </Tr>
  );
}
