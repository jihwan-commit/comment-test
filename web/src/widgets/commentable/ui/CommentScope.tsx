import { type ReactNode, useMemo } from "react";

import {
  type CommentTargetType,
  type CommentThread,
  anchorKey,
  useCommentThreadsByContextQuery,
  useCommentThreadsQuery,
} from "@/entities/comment";

import { CommentScopeContext } from "../model/CommentScopeContext";

type Props = {
  targetType: CommentTargetType;
  children: ReactNode;
} & (
  | { targetIds: string[]; contextId?: undefined }
  | { contextId: string; targetIds?: undefined }
);

const toMap = (threads: CommentThread[] | undefined) =>
  new Map((threads ?? []).map((t) => [anchorKey(t), t]));

/**
 * 한 화면(또는 섹션)의 댓글 스코프 — 보이는 행 id 들로 스레드를 한 번에 받아 Commentable 에 나눠준다.
 * contextId 를 주면 부모 기준으로 받아 삭제된 자식 행의 스레드도 포함된다.
 */
export function CommentScope(props: Props) {
  const { targetType, children } = props;
  const byTargets = useCommentThreadsQuery(targetType, props.targetIds ?? []);
  const byContext = useCommentThreadsByContextQuery(
    targetType,
    props.contextId ?? ""
  );
  const data = props.contextId ? byContext.data : byTargets.data;
  const value = useMemo(
    () => ({ targetType, threads: toMap(data), contextId: props.contextId }),
    [targetType, data, props.contextId]
  );
  return (
    <CommentScopeContext.Provider value={value}>
      {children}
    </CommentScopeContext.Provider>
  );
}
