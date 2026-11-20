import type { ReactNode } from "react";
import type { Control } from "react-hook-form";

import { Commentable } from "@/widgets/commentable";

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

const str = (v: string | number | null | undefined) =>
  v === null || v === undefined ? null : String(v);

/** 필드 하나를 댓글 대상으로 — 값은 서버 저장값(detail) 기준이라 편집 중 입력과 무관하게 스냅샷 비교가 된다 */
function C({
  id,
  field,
  label,
  value,
  children,
}: {
  id: string;
  field: string;
  label: string;
  value: string | null;
  children: ReactNode;
}) {
  return (
    <Commentable
      targetId={id}
      field={field}
      label={label}
      value={value}
      inline
      className="items-start [&>button]:mt-2"
    >
      {children}
    </Commentable>
  );
}

function Column({
  bordered,
  children,
}: {
  bordered?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex flex-1 flex-col gap-3 ${bordered ? "border-l border-cool150 pl-6" : ""}`}
    >
      {children}
    </div>
  );
}

/** geulim OrderInfoForm 의 3열 배치 — 스케치 이미지·마스터 연동 없이 값만. 필드마다 댓글(서버 저장값 기준 스냅샷) */
export function OrderInfoForm({ control, disabled, detail }: Props) {
  return (
    <div className="flex gap-6">
      {/* part1 — 기본 정보 */}
      <Column>
        <C
          id={detail.id}
          field="styleNumber"
          label="본오더 품번"
          value={[detail.styleNumber, detail.styleCode]
            .filter(Boolean)
            .join("-")}
        >
          <FormStyleNumber
            control={control}
            name="styleNumber"
            codeName="styleCode"
            label="본오더 품번"
            required
            disabled={disabled}
          />
        </C>
        <C
          id={detail.id}
          field="styleDescription"
          label="스타일 상세"
          value={str(detail.styleDescription)}
        >
          <FormTextarea
            control={control}
            name="styleDescription"
            label="스타일 상세"
            disabled={disabled}
          />
        </C>
        <C
          id={detail.id}
          field="season"
          label="시즌"
          value={`${detail.season} ${String(detail.year).slice(-2)}`}
        >
          <SeasonField
            control={control}
            seasonName="season"
            yearName="year"
            items={SEASON_ITEMS}
            disabled={disabled}
          />
        </C>
        <C
          id={detail.id}
          field="brandName"
          label="브랜드"
          value={detail.brandName}
        >
          <FormText
            control={control}
            name="brandName"
            label="브랜드"
            required
            disabled={disabled}
          />
        </C>
        <C
          id={detail.id}
          field="buyerName"
          label="바이어"
          value={detail.buyerName}
        >
          <FormText
            control={control}
            name="buyerName"
            label="바이어"
            disabled
          />
        </C>
        <C
          id={detail.id}
          field="teamName"
          label="담당 팀"
          value={str(detail.teamName)}
        >
          <FormText
            control={control}
            name="teamName"
            label="담당 팀"
            disabled={disabled}
          />
        </C>
        <C
          id={detail.id}
          field="gender"
          label="성별"
          value={str(detail.gender)}
        >
          <FormSelect
            control={control}
            name="gender"
            label="성별"
            required
            disabled={disabled}
            items={GENDER_ITEMS}
          />
        </C>
        <C
          id={detail.id}
          field="designer"
          label="디자이너"
          value={str(detail.designer)}
        >
          <FormText
            control={control}
            name="designer"
            label="디자이너"
            required
            disabled={disabled}
          />
        </C>
      </Column>

      {/* part3 — 제품·봉제 */}
      <Column bordered>
        <C
          id={detail.id}
          field="orderType"
          label="오더 유형"
          value={str(detail.orderType)}
        >
          <FormSelect
            control={control}
            name="orderType"
            label="오더 유형"
            required
            disabled={disabled}
            items={ORDER_TYPE_ITEMS}
          />
        </C>
        <C
          id={detail.id}
          field="sewingFactoryName"
          label="봉제처"
          value={str(detail.sewingFactoryName)}
        >
          <FormText
            control={control}
            name="sewingFactoryName"
            label="봉제처"
            disabled={disabled}
          />
        </C>
        <C
          id={detail.id}
          field="sewingFactoryCountry"
          label="생산국"
          value={str(detail.sewingFactoryCountry)}
        >
          <FormText
            control={control}
            name="sewingFactoryCountry"
            label="생산국"
            disabled={disabled}
          />
        </C>
        <C
          id={detail.id}
          field="category"
          label="카테고리"
          value={str(detail.category)}
        >
          <FormSelect
            control={control}
            name="category"
            label="카테고리"
            disabled={disabled}
            items={CATEGORY_ITEMS}
          />
        </C>
        <C
          id={detail.id}
          field="sampleType"
          label="샘플 종류"
          value={str(detail.sampleType)}
        >
          <FormSelect
            control={control}
            name="sampleType"
            label="샘플 종류"
            disabled={disabled}
            items={SAMPLE_TYPE_ITEMS}
          />
        </C>
        <C
          id={detail.id}
          field="deliveryDate"
          label="납기"
          value={str(detail.deliveryDate)}
        >
          <FormText
            control={control}
            name="deliveryDate"
            label="납기"
            type="date"
            disabled={disabled}
          />
        </C>
      </Column>

      {/* part2 — 생성/거래/비고 */}
      <Column bordered>
        <ReadonlyRow label="등록일자">
          {formatDate(detail.createdAt)}
        </ReadonlyRow>
        <ReadonlyRow label="수정일자">
          {formatDate(detail.updatedAt)}
        </ReadonlyRow>
        <C
          id={detail.id}
          field="currency"
          label="거래 통화"
          value={detail.currency}
        >
          <FormSelect
            control={control}
            name="currency"
            label="거래 통화"
            required
            disabled={disabled}
            items={CURRENCY_ITEMS}
          />
        </C>
        <C id={detail.id} field="unit" label="거래 단위" value={detail.unit}>
          <FormSelect
            control={control}
            name="unit"
            label="거래 단위"
            required
            disabled={disabled}
            items={UNIT_ITEMS}
          />
        </C>
        <C
          id={detail.id}
          field="orderQty"
          label="오더수량"
          value={str(detail.orderQty)}
        >
          <FormText
            control={control}
            name="orderQty"
            label="오더수량"
            type="number"
            disabled={disabled}
          />
        </C>
        <C
          id={detail.id}
          field="prodQty"
          label="지시수량"
          value={str(detail.prodQty)}
        >
          <FormText
            control={control}
            name="prodQty"
            label="지시수량"
            type="number"
            disabled={disabled}
          />
        </C>
        <C
          id={detail.id}
          field="orderAmount"
          label="오더금액"
          value={str(detail.orderAmount)}
        >
          <FormText
            control={control}
            name="orderAmount"
            label="오더금액"
            type="number"
            disabled={disabled}
          />
        </C>
        <C
          id={detail.id}
          field="prodAmount"
          label="지시금액"
          value={str(detail.prodAmount)}
        >
          <FormText
            control={control}
            name="prodAmount"
            label="지시금액"
            type="number"
            disabled={disabled}
          />
        </C>
        <C
          id={detail.id}
          field="remark"
          label="비고"
          value={str(detail.remark)}
        >
          <FormTextarea
            control={control}
            name="remark"
            label="비고"
            disabled={disabled}
          />
        </C>
      </Column>
    </div>
  );
}
