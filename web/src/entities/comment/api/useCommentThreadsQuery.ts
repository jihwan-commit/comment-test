import { useQuery } from "@tanstack/react-query";

import { serviceApi } from "@/shared/api";

import type { CommentTargetType, CommentThread } from "../model/types";
import { commentKeys } from "./commentKeys";

const fetchByTargets = async (
  targetType: CommentTargetType,
  targetIds: string[]
) =>
  (
    await serviceApi.get<CommentThread[]>("/comments", {
      params: { targetType, targetIds: targetIds.join(",") },
    })
  ).data;

const fetchByContext = async (
  targetType: CommentTargetType,
  contextId: string
) =>
  (
    await serviceApi.get<CommentThread[]>("/comments", {
      params: { targetType, contextId },
    })
  ).data;

/** 화면에 보이는 행들의 스레드를 한 번에 */
export function useCommentThreadsQuery(
  targetType: CommentTargetType,
  targetIds: string[]
) {
  return useQuery({
    queryKey: commentKeys.byTargets(targetType, targetIds),
    queryFn: () => fetchByTargets(targetType, targetIds),
    enabled: targetIds.length > 0,
  });
}

/** 부모 기준 — 삭제된 자식 행의 스레드까지 포함 */
export function useCommentThreadsByContextQuery(
  targetType: CommentTargetType,
  contextId: string
) {
  return useQuery({
    queryKey: commentKeys.byContext(targetType, contextId),
    queryFn: () => fetchByContext(targetType, contextId),
    enabled: !!contextId,
  });
}
