import { create } from "zustand";

import type { CommentAnchor } from "./types";

export interface PanelTarget extends CommentAnchor {
  /** 패널 제목용 — "품번 · MNL-001" */
  label: string;
  /** 현재 셀 값(문자열) — 스냅샷과 비교해 "변경됨" 판정 */
  currentValue: string | null;
}

interface CommentPanelState {
  target: PanelTarget | null;
  open: (target: PanelTarget) => void;
  close: () => void;
}

export const useCommentPanelStore = create<CommentPanelState>((set) => ({
  target: null,
  open: (target) => set({ target }),
  close: () => set({ target: null }),
}));
