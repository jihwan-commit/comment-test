import { useMutation, useQueryClient } from "@tanstack/react-query";

import { serviceApi } from "@/shared/api";

import type { Comment, CommentAnchor, CommentThread } from "../model/types";
import { commentKeys } from "./commentKeys";

export interface CreateCommentInput extends CommentAnchor {
  authorId: string;
  authorName: string | null;
  body: string;
  valueSnapshot: string | null;
}

export function useCommentMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: commentKeys.all });

  const create = useMutation({
    mutationFn: (input: CreateCommentInput) =>
      serviceApi
        .post<{ thread: CommentThread; comment: Comment }>("/comments", input)
        .then((r) => r.data),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: string }) =>
      serviceApi
        .patch<Comment>(`/comments/${id}`, { body })
        .then((r) => r.data),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => serviceApi.delete(`/comments/${id}`),
    onSuccess: invalidate,
  });
  const resolve = useMutation({
    mutationFn: ({
      threadId,
      resolved,
    }: {
      threadId: string;
      resolved: boolean;
    }) =>
      serviceApi.patch<CommentThread>(
        `/comment-threads/${threadId}/${resolved ? "resolve" : "reopen"}`
      ),
    onSuccess: invalidate,
  });
  return { create, update, remove, resolve };
}
