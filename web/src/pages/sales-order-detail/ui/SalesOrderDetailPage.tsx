import { Link, useNavigate, useParams } from "react-router-dom";

import { CommentScope } from "@/widgets/commentable";

import { formatDateTime } from "@/shared/lib/date";
import { Badge, Button, EditToggle } from "@/shared/ui";

import { useOrderInfoForm } from "../model/useOrderInfoForm";
import { OrderInfoForm } from "./OrderInfoForm";
import { SizeSection } from "./SizeSection";

const STATUS_BADGE: Record<
  string,
  { text: string; color: "gray" | "blue" | "red" }
> = {
  DRAFT: { text: "임시저장", color: "gray" },
  COMPLETED: { text: "진행", color: "blue" },
  CLOSED: { text: "마감", color: "red" },
};

/** 오더 상세 — geulim SalesOrderDetailPage + OrderInfoTab 의 축소판(탭은 오더 정보 하나) */
export function SalesOrderDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    form,
    detail,
    isError,
    isEditMode,
    toggleEdit,
    isDirty,
    reset,
    onSubmit,
    isSaving,
  } = useOrderInfoForm(id);
  const badge = detail && STATUS_BADGE[detail.status];

  return (
    <div className="flex min-h-full flex-col bg-white pr-[380px] text-sm">
      <nav
        aria-label="브레드크럼"
        className="flex h-8 items-center gap-1 border-b border-cool200 px-5"
      >
        <button
          type="button"
          onClick={() =>
            window.history.length > 1
              ? navigate(-1)
              : navigate("/sales-orders", { replace: true })
          }
          aria-label="뒤로 가기"
          className="rounded-md px-1.5 text-cool700 hover:bg-cool100"
        >
          ‹
        </button>
        <ol className="flex items-center gap-1 text-xs leading-[1.4]">
          <li>
            <Link to="/sales-orders" className="text-cool500 hover:underline">
              오더 수주
            </Link>
          </li>
          <li aria-hidden className="text-cool500">
            /
          </li>
          <li aria-current="page" className="font-medium text-achromaticBlack">
            오더 상세
          </li>
        </ol>
      </nav>

      <nav
        aria-label="오더 상세 탭"
        className="flex gap-4 border-b border-cool200 px-6 pt-2.5"
      >
        <span className="border-b-2 border-achromaticBlack pb-2 text-[13px] leading-[1.4] font-bold text-achromaticBlack">
          오더 정보
        </span>
      </nav>

      <div className="flex items-center gap-2 px-6 pt-4">
        <h1 className="text-[15px] leading-[1.4] font-bold text-achromaticBlack">
          {detail
            ? [detail.styleNumber, detail.styleCode].filter(Boolean).join("-")
            : "오더 번호"}
        </h1>
        {badge && <Badge color={badge.color}>{badge.text}</Badge>}
      </div>

      {isError && (
        <div
          role="alert"
          className="m-6 rounded-lg border border-cool200 p-10 text-center text-cool600"
        >
          오더를 불러오지 못했습니다.
        </div>
      )}

      {detail && (
        <>
          <section className="flex flex-col gap-4 px-6 pt-4 pb-6">
            <div className="flex min-h-[41px] items-center justify-between border-b border-cool150 pb-2">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-cool800">오더 정보</h2>
                <span className="text-[13px] text-cool600">
                  수정일시 {formatDateTime(detail.updatedAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isEditMode && (
                  <>
                    <Button
                      variant="danger"
                      onClick={reset}
                      disabled={!isDirty}
                    >
                      초기화
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => void onSubmit()}
                      disabled={isSaving || !isDirty}
                    >
                      저장
                    </Button>
                  </>
                )}
                <EditToggle on={isEditMode} onChange={toggleEdit} />
              </div>
            </div>
            <CommentScope
              targetType="GEULIM_SALES_ORDER_DETAIL"
              targetIds={[detail.id]}
            >
              <OrderInfoForm
                control={form.control}
                disabled={!isEditMode}
                detail={detail}
              />
            </CommentScope>
          </section>
          <SizeSection salesOrderId={detail.id} sizes={detail.sizes} />
        </>
      )}
    </div>
  );
}
