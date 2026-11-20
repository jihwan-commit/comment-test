import { createContext, useContext } from "react";

import type { CommentTargetType, CommentThread } from "@/entities/comment";

export interface CommentScopeValue {
  targetType: CommentTargetType;
  /** anchorKey(targetId:fieldPath) → 스레드 */
  threads: ReadonlyMap<string, CommentThread>;
  contextId?: string;
}

export const CommentScopeContext = createContext<CommentScopeValue | null>(
  null
);

export function useCommentScope(): CommentScopeValue {
  const v = useContext(CommentScopeContext);
  if (!v) throw new Error("Commentable 은 CommentScope 안에서만 쓴다");
  return v;
}
