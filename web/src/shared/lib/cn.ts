/** 클래스명 조합 — falsy 제거 후 공백 결합 */
export const cn = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");
