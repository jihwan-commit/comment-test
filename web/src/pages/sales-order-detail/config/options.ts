import type { Option } from "@/shared/ui";

export const SEASON_ITEMS: Option[] = [
  { value: "SS", text: "SS" },
  { value: "FW", text: "FW" },
];
export const GENDER_ITEMS: Option[] = ["남성", "여성", "공용"].map((v) => ({
  value: v,
  text: v,
}));
export const CATEGORY_ITEMS: Option[] = ["상의", "하의", "아우터"].map((v) => ({
  value: v,
  text: v,
}));
export const ORDER_TYPE_ITEMS: Option[] = [
  { value: "CMT", text: "CMT" },
  { value: "FULL_PACKAGE", text: "Full Package" },
];
export const CURRENCY_ITEMS: Option[] = [
  { value: "USD", text: "$ USD" },
  { value: "KRW", text: "₩ KRW" },
];
export const UNIT_ITEMS: Option[] = [
  { value: "pcs", text: "pcs" },
  { value: "set", text: "set" },
];
export const SAMPLE_TYPE_ITEMS: Option[] = ["PP", "수납", "QC"].map((v) => ({
  value: v,
  text: v,
}));
