import { useState } from "react";

import { useSoSizeMutations } from "@/features/save-so-size";

import type { SoSize } from "@/entities/sales-order";

import { Badge, Button, Input, Table, Td, Th, Tr } from "@/shared/ui";

/**
 * 사이즈 — 행이 동적으로 추가·삭제되는 테이블(댓글 엣지케이스 1번).
 * 저장 버튼 없이 추가·삭제 즉시 서버 반영.
 */
export function SizeSection({
  salesOrderId,
  sizes,
}: {
  salesOrderId: string;
  sizes: SoSize[];
}) {
  const { create, remove } = useSoSizeMutations(salesOrderId);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const add = () => {
    const sizeName = name.trim();
    if (!sizeName) return;
    if (sizes.some((s) => s.sizeName === sizeName)) {
      setError("이미 있는 사이즈입니다");
      return;
    }
    setError(null);
    create.mutate({ sizeName }, { onSuccess: () => setName("") });
  };

  return (
    <section className="flex flex-col gap-3 px-6 pb-6">
      <div className="flex min-h-[41px] items-center justify-between border-b border-cool150 pb-2">
        <h2 className="text-base font-bold text-cool800">사이즈</h2>
        <div className="flex items-center gap-2">
          <Input
            className="w-28"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="예: XL"
            aria-label="사이즈명"
          />
          <Button
            variant="primary"
            onClick={add}
            disabled={!name.trim() || create.isPending}
          >
            추가
          </Button>
        </div>
      </div>
      {error && <p className="text-xs text-lampRed">{error}</p>}
      <Table
        columns={[
          { id: "order", width: 56 },
          { id: "name", width: 160 },
          { id: "basic", width: 96 },
          { id: "fill", width: "auto" },
          { id: "action", width: 80 },
        ]}
        showEmpty={sizes.length === 0}
      >
        <thead>
          <Tr $disableHover>
            <Th>순서</Th>
            <Th>사이즈</Th>
            <Th>기본</Th>
            <Th />
            <Th />
          </Tr>
        </thead>
        <tbody>
          {sizes.map((s) => (
            <Tr key={s.id} data-size-id={s.id}>
              <Td>{s.sortOrder}</Td>
              <Td>{s.sizeName}</Td>
              <Td>{s.isBasic && <Badge color="blue">기본</Badge>}</Td>
              <Td />
              <Td>
                <button
                  type="button"
                  onClick={() =>
                    window.confirm(`${s.sizeName} 사이즈를 삭제할까요?`) &&
                    remove.mutate(s.id)
                  }
                  disabled={remove.isPending}
                  className="text-xs font-semibold text-lampRed hover:underline"
                >
                  삭제
                </button>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </section>
  );
}
