import { useSyncExternalStore } from "react";

/** 로그인 없는 시연 — 작성자는 브라우저에 저장한 이름/ID */
const KEY = "comment-test:author";
type Author = { id: string; name: string };

const listeners = new Set<() => void>();
let cached: Author | null = null;

function read(): Author {
  if (cached) return cached;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return (cached = JSON.parse(raw) as Author);
  } catch {
    /* 저장소 접근 불가 — 새로 만든다 */
  }
  const fresh = { id: crypto.randomUUID(), name: "" };
  try {
    localStorage.setItem(KEY, JSON.stringify(fresh));
  } catch {
    /* ignore */
  }
  return (cached = fresh);
}

export function setAuthorName(name: string) {
  const next = { ...read(), name };
  cached = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useCurrentAuthor(): Author {
  return useSyncExternalStore(subscribe, read, read);
}
