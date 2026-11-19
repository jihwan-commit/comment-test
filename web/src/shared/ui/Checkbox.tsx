export function Checkbox({
  checked,
  onChange,
  "aria-label": ariaLabel,
}: {
  checked: boolean;
  onChange: () => void;
  "aria-label"?: string;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={ariaLabel}
      className="size-4 cursor-pointer accent-mainBlue"
    />
  );
}
