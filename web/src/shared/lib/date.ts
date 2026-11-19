const pad = (n: number) => String(n).padStart(2, "0");

/** "2026.08.08" */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

/** "2026.08.08 11:20" */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return `${formatDate(value)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
