import { useEffect, useState } from "react";

import {
  type Comment,
  setAuthorName,
  useCommentMutations,
  useCommentPanelStore,
  useCommentThreadsQuery,
  useCurrentAuthor,
} from "@/entities/comment";

import { formatDateTime } from "@/shared/lib/date";
import { Button, Input, Textarea } from "@/shared/ui";

/** 우측 고정 패널 — 선택된 셀의 스레드. App 에 한 번만 마운트 */
export function CommentPanel() {
  const target = useCommentPanelStore((s) => s.target);
  const close = useCommentPanelStore((s) => s.close);
  const author = useCurrentAuthor();
  const { create, update, remove, resolve } = useCommentMutations();
  const query = useCommentThreadsQuery(
    target?.targetType ?? "GEULIM_SALES_ORDER_LIST",
    target ? [target.targetId] : []
  );
  const thread = query.data?.find(
    (t) => t.fieldPath === (target?.fieldPath ?? "")
  );
  const [body, setBody] = useState("");
  const [editing, setEditing] = useState<{ id: string; body: string } | null>(
    null
  );
  const [nameDraft, setNameDraft] = useState(author.name);

  useEffect(() => {
    setBody("");
    setEditing(null);
  }, [target?.targetType, target?.targetId, target?.fieldPath]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  if (!target) return null;

  const submit = () => {
    const text = body.trim();
    if (!text) return;
    if (!author.name) {
      setAuthorName(nameDraft.trim() || "익명");
    }
    create.mutate(
      {
        targetType: target.targetType,
        targetId: target.targetId,
        fieldPath: target.fieldPath,
        contextId: target.contextId ?? null,
        authorId: author.id,
        authorName: author.name || nameDraft.trim() || "익명",
        body: text,
        valueSnapshot: target.currentValue,
      },
      { onSuccess: () => setBody("") }
    );
  };

  const isChanged = (c: Comment) =>
    c.valueSnapshot !== null && c.valueSnapshot !== target.currentValue;

  return (
    <aside
      role="dialog"
      aria-label="댓글"
      className="fixed inset-y-0 right-0 z-50 flex w-[380px] flex-col border-l border-cool200 bg-white shadow-xl"
    >
      <header className="flex items-start justify-between gap-2 border-b border-cool200 px-4 py-3">
        <div className="min-w-0">
          <div className="text-[13px] font-bold text-achromaticBlack">
            {target.label}
          </div>
          <div
            className="truncate text-xs text-cool600"
            title={target.currentValue ?? ""}
          >
            현재 값:{" "}
            {target.currentValue === null || target.currentValue === ""
              ? "-"
              : target.currentValue}
          </div>
          <div className="mt-0.5 truncate font-mono text-[10px] text-cool400">
            {target.targetType} · {target.targetId.slice(0, 8)}… ·{" "}
            {target.fieldPath || "(행 전체)"}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {thread && (
            <Button
              variant="ghost"
              onClick={() =>
                resolve.mutate({
                  threadId: thread.id,
                  resolved: !thread.resolvedAt,
                })
              }
              disabled={resolve.isPending}
            >
              {thread.resolvedAt ? "다시 열기" : "해결"}
            </Button>
          )}
          <Button variant="ghost" onClick={close} aria-label="닫기">
            ✕
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {thread?.resolvedAt && (
          <div className="mb-3 rounded-md bg-cool100 px-3 py-2 text-xs text-cool600">
            해결됨 · {formatDateTime(thread.resolvedAt)}
          </div>
        )}
        {!thread || thread.comments.length === 0 ? (
          <p className="py-6 text-center text-sm text-cool400">
            댓글이 없습니다
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {thread.comments.map((c) => (
              <li
                key={c.id}
                className="rounded-lg border border-cool200 p-3"
                data-comment-id={c.id}
              >
                <div className="flex items-center justify-between text-xs text-cool600">
                  <span className="font-semibold text-achromaticBlack">
                    {c.authorName ?? "익명"}
                  </span>
                  <span>{formatDateTime(c.createdAt)}</span>
                </div>
                {editing?.id === c.id ? (
                  <div className="mt-2 flex flex-col gap-2">
                    <Textarea
                      value={editing.body}
                      onChange={(e) =>
                        setEditing({ id: c.id, body: e.target.value })
                      }
                      aria-label="댓글 수정"
                    />
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" onClick={() => setEditing(null)}>
                        취소
                      </Button>
                      <Button
                        variant="primary"
                        disabled={!editing.body.trim() || update.isPending}
                        onClick={() =>
                          update.mutate(
                            { id: c.id, body: editing.body.trim() },
                            { onSuccess: () => setEditing(null) }
                          )
                        }
                      >
                        저장
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1.5 text-sm whitespace-pre-wrap text-achromaticBlack">
                    {c.body}
                  </p>
                )}
                {c.valueSnapshot !== null && (
                  <div
                    className={`mt-2 rounded px-2 py-1 text-xs ${
                      isChanged(c)
                        ? "bg-orange-50 text-warningDark"
                        : "bg-cool100 text-cool600"
                    }`}
                  >
                    {isChanged(c) ? "변경됨 · " : ""}작성 당시 값:{" "}
                    {c.valueSnapshot === "" ? "-" : c.valueSnapshot}
                  </div>
                )}
                {c.authorId === author.id && editing?.id !== c.id && (
                  <div className="mt-2 flex justify-end gap-2 text-xs">
                    <button
                      type="button"
                      className="text-cool600 hover:underline"
                      onClick={() => setEditing({ id: c.id, body: c.body })}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="text-lampRed hover:underline"
                      onClick={() =>
                        window.confirm("댓글을 삭제할까요?") &&
                        remove.mutate(c.id)
                      }
                    >
                      삭제
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className="flex flex-col gap-2 border-t border-cool200 px-4 py-3">
        {!author.name && (
          <Input
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            placeholder="작성자 이름 (처음 한 번)"
            aria-label="작성자 이름"
          />
        )}
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
          }}
          placeholder="댓글 입력 (⌘/Ctrl+Enter 로 등록)"
          aria-label="댓글 입력"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-cool500">
            {author.name ? `${author.name} 으로 작성` : ""}
          </span>
          <Button
            variant="primary"
            onClick={submit}
            disabled={!body.trim() || create.isPending}
          >
            등록
          </Button>
        </div>
      </footer>
    </aside>
  );
}
