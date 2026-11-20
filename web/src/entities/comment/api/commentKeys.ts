import type { CommentTargetType } from "../model/types";

export const commentKeys = {
  all: ["comments"] as const,
  byTargets: (targetType: CommentTargetType, targetIds: string[]) =>
    [...commentKeys.all, "targets", targetType, [...targetIds].sort()] as const,
  byContext: (targetType: CommentTargetType, contextId: string) =>
    [...commentKeys.all, "context", targetType, contextId] as const,
};
