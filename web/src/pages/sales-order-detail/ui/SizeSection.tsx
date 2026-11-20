import { useState } from "react";

import {
  CommentScope,
  Commentable,
  useCommentScope,
} from "@/widgets/commentable";

import { useSoSizeMutations } from "@/features/save-so-size";

import { useCommentPanelStore } from "@/entities/comment";
import type { SoSize } from "@/entities/sales-order";

import { Badge, Button, Input, Table, Td, Th, Tr } from "@/shared/ui";

/**
 * 사이즈 — 행이 동적으로 추가·삭제되는 테이블(댓글 엣지케이스 1번, geulim 선택 B).
 * 스코프를 부모(수주) 기준으로 잡아 삭제된 행의 스레드도 같이 받고, 아래 "삭제된 행의 댓글" 로 연다.
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
    <CommentScope targetType="GEULIM_SO_SIZE" contextId={salesOrderId}>
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
            { id: "name", width: 200 },
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
                <Td>
                  <Commentable
                    targetId={s.id}
                    field="sizeName"
                    label={`사이즈 · ${s.sizeName}`}
                    value={s.sizeName}
                    inline
                  >
                    {s.sizeName}
                  </Commentable>
                </Td>
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
        <OrphanSizeComments currentIds={sizes.map((s) => s.id)} />
      </section>
    </CommentScope>
  );
}

/** 지금 목록에 없는(삭제된) 사이즈 행의 댓글 — 접힌 목록으로 열람 */
function OrphanSizeComments({ currentIds }: { currentIds: string[] }) {
  const scope = useCommentScope();
  const open = useCommentPanelStore((s) => s.open);
  const [expanded, setExpanded] = useState(false);
  const orphans = [...scope.threads.values()].filter(
    (t) => !currentIds.includes(t.targetId) && t.comments.length > 0
  );
  if (orphans.length === 0) return null;
  return (
    <div
      className="rounded-lg border border-dashed border-cool300 px-3 py-2 text-[13px]"
      data-orphan-comments
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="font-semibold text-cool700 hover:underline"
      >
        삭제된 행의 댓글 {orphans.length}건 {expanded ? "접기" : "보기"}
      </button>
      {expanded && (
        <ul className="mt-2 flex flex-col gap-1">
          {orphans.map((t) => {
            const last = t.comments[t.comments.length - 1]!;
            return (
              <li key={t.id} className="flex items-center gap-2 text-cool600">
                <span className="rounded bg-cool150 px-1.5 py-0.5 text-xs text-cool700">
                  삭제된 사이즈
                  {last.valueSnapshot ? ` · ${last.valueSnapshot}` : ""}
                </span>
                <span className="truncate">{last.body}</span>
                <button
                  type="button"
                  className="ml-auto shrink-0 text-mainBlue hover:underline"
                  onClick={() =>
                    open({
                      targetType: scope.targetType,
                      targetId: t.targetId,
                      fieldPath: t.fieldPath,
                      contextId: scope.contextId ?? null,
                      label: `삭제된 사이즈${last.valueSnapshot ? ` · ${last.valueSnapshot}` : ""}`,
                      currentValue: null,
                    })
                  }
                >
                  열기 ({t.comments.length})
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
