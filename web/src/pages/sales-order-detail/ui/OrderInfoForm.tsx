import type { Control } from "react-hook-form";

import type { SalesOrderDetail } from "@/entities/sales-order";

import { formatDate } from "@/shared/lib/date";

import {
  CATEGORY_ITEMS,
  CURRENCY_ITEMS,
  GENDER_ITEMS,
  ORDER_TYPE_ITEMS,
  SAMPLE_TYPE_ITEMS,
  SEASON_ITEMS,
  UNIT_ITEMS,
} from "../config/options";
import type { OrderInfoValues } from "../model/orderInfoSchema";
import {
  FormSelect,
  FormStyleNumber,
  FormText,
  FormTextarea,
  ReadonlyRow,
  SeasonField,
} from "./fields";

type Props = {
  control: Control<OrderInfoValues>;
  disabled: boolean;
  detail: SalesOrderDetail;
};

function Column({
  bordered,
  children,
}: {
  bordered?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-1 flex-col gap-3 ${bordered ? "border-l border-cool150 pl-6" : ""}`}
    >
      {children}
    </div>
  );
}

/** geulim OrderInfoForm 의 3열 배치 — 스케치 이미지·마스터 연동 없이 값만 */
export function OrderInfoForm({ control, disabled, detail }: Props) {
  return (
    <div className="flex gap-6">
      {/* part1 — 기본 정보 */}
      <Column>
        <FormStyleNumber
          control={control}
          name="styleNumber"
          codeName="styleCode"
          label="본오더 품번"
          required
          disabled={disabled}
        />
        <FormTextarea
          control={control}
          name="styleDescription"
          label="스타일 상세"
          disabled={disabled}
        />
        <SeasonField
          control={control}
          seasonName="season"
          yearName="year"
          items={SEASON_ITEMS}
          disabled={disabled}
        />
        <FormText
          control={control}
          name="brandName"
          label="브랜드"
          required
          disabled={disabled}
        />
        {/* 바이어 — geulim 은 브랜드에서 자동 파생(수정 불가) */}
        <FormText control={control} name="buyerName" label="바이어" disabled />
        <FormText
          control={control}
          name="teamName"
          label="담당 팀"
          disabled={disabled}
        />
        <FormSelect
          control={control}
          name="gender"
          label="성별"
          required
          disabled={disabled}
          items={GENDER_ITEMS}
        />
        <FormText
          control={control}
          name="designer"
          label="디자이너"
          required
          disabled={disabled}
        />
      </Column>

      {/* part3 — 제품·봉제 */}
      <Column bordered>
        <FormSelect
          control={control}
          name="orderType"
          label="오더 유형"
          required
          disabled={disabled}
          items={ORDER_TYPE_ITEMS}
        />
        <FormText
          control={control}
          name="sewingFactoryName"
          label="봉제처"
          disabled={disabled}
        />
        <FormText
          control={control}
          name="sewingFactoryCountry"
          label="생산국"
          disabled={disabled}
        />
        <FormSelect
          control={control}
          name="category"
          label="카테고리"
          disabled={disabled}
          items={CATEGORY_ITEMS}
        />
        <FormSelect
          control={control}
          name="sampleType"
          label="샘플 종류"
          disabled={disabled}
          items={SAMPLE_TYPE_ITEMS}
        />
        <FormText
          control={control}
          name="deliveryDate"
          label="납기"
          type="date"
          disabled={disabled}
        />
      </Column>

      {/* part2 — 생성/거래/비고 */}
      <Column bordered>
        <ReadonlyRow label="등록일자">
          {formatDate(detail.createdAt)}
        </ReadonlyRow>
        <ReadonlyRow label="수정일자">
          {formatDate(detail.updatedAt)}
        </ReadonlyRow>
        <FormSelect
          control={control}
          name="currency"
          label="거래 통화"
          required
          disabled={disabled}
          items={CURRENCY_ITEMS}
        />
        <FormSelect
          control={control}
          name="unit"
          label="거래 단위"
          required
          disabled={disabled}
          items={UNIT_ITEMS}
        />
        <FormText
          control={control}
          name="orderQty"
          label="오더수량"
          type="number"
          disabled={disabled}
        />
        <FormText
          control={control}
          name="prodQty"
          label="지시수량"
          type="number"
          disabled={disabled}
        />
        <FormText
          control={control}
          name="orderAmount"
          label="오더금액"
          type="number"
          disabled={disabled}
        />
        <FormText
          control={control}
          name="prodAmount"
          label="지시금액"
          type="number"
          disabled={disabled}
        />
        <FormTextarea
          control={control}
          name="remark"
          label="비고"
          disabled={disabled}
        />
      </Column>
    </div>
  );
}
