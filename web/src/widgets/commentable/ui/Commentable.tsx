import type { ReactNode } from "react";

import { anchorKey, useCommentPanelStore } from "@/entities/comment";

import { cn } from "@/shared/lib/cn";

import { useCommentScope } from "../model/CommentScopeContext";

type Props = {
  targetId: string;
  field: string;
  /** 패널 제목 — "품번" 등 열 이름 */
  label: string;
  /** 현재 값(표시 문자열). 스냅샷 비교·저장에 쓴다 */
  value: string | null | undefined;
  children: ReactNode;
  className?: string;
  /** 자식 뒤에 인라인으로 배지(자리를 차지). 기본은 셀 위에 겹쳐 띄워 좁은 열도 안 밀린다 */
  inline?: boolean;
  /** 겹침 모드에서 배지를 왼쪽에(오른쪽 정렬 숫자 셀) */
  badgeLeft?: boolean;
};

/**
 * 셀·필드를 댓글 대상으로 만든다. DOM 위치가 아니라 (targetType, targetId, field) 로 식별하므로
 * 정렬·필터로 자리가 바뀌어도 댓글은 데이터를 따라간다.
 * 말풍선은 hover 또는 댓글이 있을 때 보이고, 말풍선 클릭이 패널을 연다(링크·입력 클릭은 방해하지 않는다).
 */
export function Commentable({
  targetId,
  field,
  label,
  value,
  children,
  className,
  inline,
  badgeLeft,
}: Props) {
  const scope = useCommentScope();
  const thread = scope.threads.get(anchorKey({ targetId, fieldPath: field }));
  const open = useCommentPanelStore((s) => s.open);
  const active = useCommentPanelStore(
    (s) =>
      s.target?.targetType === scope.targetType &&
      s.target.targetId === targetId &&
      s.target.fieldPath === field
  );
  // 빈 값도 "" 로 스냅샷에 남긴다 — 나중에 값이 채워지면 "변경됨" 이 떠야 한다
  const current = value == null ? "" : String(value);
  const count = thread?.comments.length ?? 0;
  const changed =
    !!thread &&
    thread.comments.some(
      (c) => c.valueSnapshot !== null && c.valueSnapshot !== current
    );
  const resolved = !!thread?.resolvedAt;

  const onOpen = () =>
    open({
      targetType: scope.targetType,
      targetId,
      fieldPath: field,
      contextId: scope.contextId ?? null,
      label,
      currentValue: current,
    });

  return (
    <span
      className={cn(
        "group/c relative flex min-w-0 items-center gap-1",
        active && "rounded bg-blue50 ring-1 ring-mainBlue",
        className
      )}
      data-comment-target={scope.targetType}
      data-comment-id={targetId}
      data-comment-field={field}
    >
      <span className="min-w-0 flex-1">{children}</span>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${label} 댓글${count ? ` ${count}개` : ""}`}
        title={changed ? "댓글 작성 뒤 값이 바뀜" : undefined}
        className={cn(
          "inline-flex h-5 shrink-0 items-center gap-0.5 rounded px-1 text-[11px] leading-none",
          !inline && "absolute top-1/2 -translate-y-1/2 bg-white/90 shadow-sm",
          !inline && (badgeLeft ? "left-0" : "right-0"),
          count === 0 &&
            "invisible text-cool400 group-hover/c:visible hover:bg-cool150",
          count > 0 &&
            !resolved &&
            "bg-blue50 font-semibold text-mainBlue hover:bg-cool150",
          count > 0 &&
            resolved &&
            "bg-cool150 font-semibold text-cool500 line-through"
        )}
      >
        <span aria-hidden>💬</span>
        {count > 0 && <span>{count}</span>}
        {changed && (
          <span aria-hidden className="size-1.5 rounded-full bg-warning" />
        )}
      </button>
    </span>
  );
}
