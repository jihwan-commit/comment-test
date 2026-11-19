import { z } from "zod";

import type { SalesOrderDetail } from "@/entities/sales-order";

const numberField = z
  .number({ message: "숫자를 입력하세요" })
  .min(0, "0 이상을 입력하세요");

/** geulim orderInfoSchema 의 축소판 — 마스터 id 대신 문자열 값 */
export const orderInfoSchema = z.object({
  styleNumber: z.string().min(1, "본 오더 품번을 입력하세요"),
  styleCode: z.string(),
  styleDescription: z.string().max(255, "최대 255자까지 입력할 수 있습니다"),
  season: z.string().min(1, "시즌을 선택하세요"),
  year: z.string().regex(/^\d{2}$/, "연도 2자리를 입력하세요"),
  brandName: z.string().min(1, "브랜드를 입력하세요"),
  buyerName: z.string(),
  teamName: z.string(),
  gender: z.string().min(1, "성별을 선택하세요"),
  designer: z.string().min(1, "디자이너를 입력하세요"),
  orderType: z.string().min(1, "오더 유형을 선택하세요"),
  sewingFactoryName: z.string(),
  sewingFactoryCountry: z.string(),
  category: z.string(),
  sampleType: z.string(),
  deliveryDate: z.string(),
  currency: z.string().min(1, "거래 통화를 선택하세요"),
  unit: z.string().min(1, "거래 단위를 선택하세요"),
  orderQty: numberField,
  prodQty: numberField,
  orderAmount: numberField,
  prodAmount: numberField,
  remark: z.string().max(500, "최대 500자까지 입력할 수 있습니다"),
});

export type OrderInfoValues = z.infer<typeof orderInfoSchema>;

export function toFormValues(d: SalesOrderDetail): OrderInfoValues {
  return {
    styleNumber: d.styleNumber,
    styleCode: d.styleCode ?? "",
    styleDescription: d.styleDescription ?? "",
    season: d.season,
    year: String(d.year).slice(-2),
    brandName: d.brandName,
    buyerName: d.buyerName,
    teamName: d.teamName ?? "",
    gender: d.gender ?? "",
    designer: d.designer ?? "",
    orderType: d.orderType ?? "",
    sewingFactoryName: d.sewingFactoryName ?? "",
    sewingFactoryCountry: d.sewingFactoryCountry ?? "",
    category: d.category ?? "",
    sampleType: d.sampleType ?? "",
    deliveryDate: d.deliveryDate ?? "",
    currency: d.currency,
    unit: d.unit,
    orderQty: d.orderQty,
    prodQty: d.prodQty,
    orderAmount: d.orderAmount,
    prodAmount: d.prodAmount,
    remark: d.remark ?? "",
  };
}

/** 폼 값 → PATCH 바디. 빈 문자열은 null 로 */
export function toPatch(v: OrderInfoValues) {
  const nullable = (s: string) => (s.trim() === "" ? null : s.trim());
  return {
    styleNumber: v.styleNumber.trim(),
    styleCode: nullable(v.styleCode),
    styleDescription: nullable(v.styleDescription),
    season: v.season,
    year: 2000 + Number(v.year),
    brandName: v.brandName.trim(),
    buyerName: v.buyerName.trim(),
    teamName: nullable(v.teamName),
    gender: nullable(v.gender),
    designer: nullable(v.designer),
    orderType: (v.orderType || null) as SalesOrderDetail["orderType"],
    sewingFactoryName: nullable(v.sewingFactoryName),
    sewingFactoryCountry: nullable(v.sewingFactoryCountry),
    category: nullable(v.category),
    sampleType: nullable(v.sampleType),
    deliveryDate: nullable(v.deliveryDate),
    currency: v.currency,
    unit: v.unit,
    orderQty: v.orderQty,
    prodQty: v.prodQty,
    orderAmount: v.orderAmount,
    prodAmount: v.prodAmount,
    remark: nullable(v.remark),
  };
}
