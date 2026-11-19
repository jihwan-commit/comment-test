import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

import { cn } from "@/shared/lib/cn";

const base =
  "w-full rounded-lg border bg-white px-3 text-sm text-achromaticBlack outline-none placeholder:text-cool400 focus:border-mainBlue disabled:bg-cool100 disabled:text-cool500";

export function Input({
  red,
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { red?: boolean }) {
  return (
    <input
      {...rest}
      className={cn(
        base,
        "h-9",
        red ? "border-lampRed" : "border-cool300",
        className
      )}
    />
  );
}

export function Textarea({
  red,
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { red?: boolean }) {
  return (
    <textarea
      {...rest}
      className={cn(
        base,
        "min-h-[72px] resize-y py-2",
        red ? "border-lampRed" : "border-cool300",
        className
      )}
    />
  );
}

export type Option = { value: string; text: string };

export function Select({
  items,
  placeholder = "선택",
  red,
  className,
  value,
  ...rest
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, "value"> & {
  items: Option[];
  placeholder?: string;
  red?: boolean;
  value: string;
}) {
  return (
    <select
      {...rest}
      value={value}
      className={cn(
        base,
        "h-9 appearance-none",
        red ? "border-lampRed" : "border-cool300",
        className
      )}
    >
      <option value="">{placeholder}</option>
      {items.map((i) => (
        <option key={i.value} value={i.value}>
          {i.text}
        </option>
      ))}
    </select>
  );
}

/** View / Edit 토글 */
export function EditToggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (on: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="inline-flex h-7 items-center rounded-full border border-cool300 bg-cool100 p-0.5 text-xs font-semibold"
    >
      <span
        className={cn(
          "rounded-full px-2.5 py-0.5",
          !on && "bg-white text-achromaticBlack shadow-sm",
          on && "text-cool500"
        )}
      >
        View
      </span>
      <span
        className={cn(
          "rounded-full px-2.5 py-0.5",
          on && "bg-mainBlue text-white",
          !on && "text-cool500"
        )}
      >
        Edit
      </span>
    </button>
  );
}
