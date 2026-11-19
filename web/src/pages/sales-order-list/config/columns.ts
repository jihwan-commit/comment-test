import type { SalesOrdersQuery } from "@/entities/sales-order";

export type SearchKey = keyof Pick<
  SalesOrdersQuery,
  | "teamName"
  | "season"
  | "buyerName"
  | "brandName"
  | "styleNumber"
  | "styleDescription"
  | "gender"
  | "sewingFactoryName"
  | "sewingFactoryCountry"
>;

export type OrderBy =
  | "styleNumber"
  | "buyerName"
  | "brandName"
  | "orderQty"
  | "prodQty"
  | "orderAmount"
  | "prodAmount"
  | "deliveryDate"
  | "createdAt";

export const ORDER_BY_VALUES: readonly OrderBy[] = [
  "styleNumber",
  "buyerName",
  "brandName",
  "orderQty",
  "prodQty",
  "orderAmount",
  "prodAmount",
  "deliveryDate",
  "createdAt",
];

export type SalesOrderColumn = {
  id: string;
  label: string;
  width: number;
  sortKey?: OrderBy;
  searchKey?: SearchKey;
  align?: "right";
};

/** geulim SALES_ORDER_COLUMNS 의 라벨·폭을 그대로 */
export const SALES_ORDER_COLUMNS: SalesOrderColumn[] = [
  { id: "team", label: "담당 팀", width: 120, searchKey: "teamName" },
  { id: "season", label: "시즌", width: 64, searchKey: "season" },
  {
    id: "buyer",
    label: "바이어",
    width: 120,
    sortKey: "buyerName",
    searchKey: "buyerName",
  },
  {
    id: "brand",
    label: "브랜드",
    width: 120,
    sortKey: "brandName",
    searchKey: "brandName",
  },
  {
    id: "styleNumber",
    label: "품번",
    width: 160,
    sortKey: "styleNumber",
    searchKey: "styleNumber",
  },
  {
    id: "styleDescription",
    label: "스타일 상세",
    width: 200,
    searchKey: "styleDescription",
  },
  { id: "gender", label: "성별", width: 80, searchKey: "gender" },
  {
    id: "orderQty",
    label: "오더수량",
    width: 104,
    sortKey: "orderQty",
    align: "right",
  },
  {
    id: "prodQty",
    label: "지시수량",
    width: 104,
    sortKey: "prodQty",
    align: "right",
  },
  {
    id: "orderAmount",
    label: "오더금액",
    width: 120,
    sortKey: "orderAmount",
    align: "right",
  },
  {
    id: "prodAmount",
    label: "지시금액",
    width: 120,
    sortKey: "prodAmount",
    align: "right",
  },
  { id: "deliveryDate", label: "납기", width: 96, sortKey: "deliveryDate" },
  {
    id: "sewingFactory",
    label: "봉제처",
    width: 160,
    searchKey: "sewingFactoryName",
  },
  {
    id: "sewingFactoryCountry",
    label: "생산국",
    width: 96,
    searchKey: "sewingFactoryCountry",
  },
  { id: "createdAt", label: "생성일", width: 120, sortKey: "createdAt" },
];
