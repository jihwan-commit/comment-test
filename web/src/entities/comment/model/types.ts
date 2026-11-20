/**
 * 댓글 앵커 — 화면 요소가 아니라 데이터(행·열)에 붙는다.
 * geulim 선택 3-B(화면별 분리): targetType 에 화면까지 넣는다.
 */
export type CommentTargetType =
  | "GEULIM_SALES_ORDER_LIST"
  | "GEULIM_SALES_ORDER_DETAIL"
  | "GEULIM_SO_SIZE"
  | "GEULIM_SALES_ORDER_LIST_SUMMARY";

export interface CommentAnchor {
  targetType: CommentTargetType;
  targetId: string;
  /** 열(DTO 키). '' = 행 전체 */
  fieldPath: string;
  /** 자식 행의 부모 PK — 행 삭제 뒤 고아 댓글 조회용 */
  contextId?: string | null;
}

export interface Comment {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string | null;
  body: string;
  valueSnapshot: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommentThread {
  id: string;
  targetType: CommentTargetType;
  targetId: string;
  fieldPath: string;
  contextId: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export const anchorKey = (a: Pick<CommentAnchor, "targetId" | "fieldPath">) =>
  `${a.targetId}:${a.fieldPath}`;
