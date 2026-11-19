export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  return value.toLocaleString("ko-KR");
}

export const KRW_SYMBOL = "₩";

/** "₩ 999,999,000" — 요약 카드용 한 줄 문자열 */
export function formatAmount(value: number): string {
  return `${KRW_SYMBOL} ${value.toLocaleString("ko-KR")}`;
}

/** "SS" + 2026 → "SS 26" */
export function formatSeason(season: string | null, year: number): string {
  if (!season) return "-";
  return `${season} ${String(year).slice(-2)}`;
}
