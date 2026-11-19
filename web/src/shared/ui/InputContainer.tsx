import type { ReactNode } from "react";

/** common InputContainer 흉내 — 왼쪽 라벨(고정폭) + 오른쪽 내용. 필수는 빨간 별표 */
export function InputContainer({
  title,
  required,
  titleWidth = 84,
  content,
}: {
  title: string;
  required?: boolean;
  titleWidth?: number;
  content: ReactNode;
}) {
  return (
    <div className="flex min-h-9 items-start gap-2">
      <div
        className="flex h-9 shrink-0 items-center text-[13px] leading-[1.4] text-cool700"
        style={{ width: titleWidth }}
      >
        {title}
        {required && <span className="ml-0.5 text-lampRed">*</span>}
      </div>
      <div className="min-w-0 flex-1">{content}</div>
    </div>
  );
}

export function ViewText({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-9 items-center px-3 text-sm text-achromaticBlack">
      {children}
    </div>
  );
}
