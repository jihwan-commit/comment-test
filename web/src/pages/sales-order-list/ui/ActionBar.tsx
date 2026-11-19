import { Button } from "@/shared/ui";

type ActionBarProps = {
  totalCount: number | undefined;
  searchOpen: boolean;
  onToggleSearch: () => void;
  hasFilters: boolean;
  onResetFilters: () => void;
  canDelete: boolean;
  onDelete: () => void;
  deleting?: boolean;
};

export function ActionBar({
  totalCount,
  searchOpen,
  onToggleSearch,
  hasFilters,
  onResetFilters,
  canDelete,
  onDelete,
  deleting,
}: ActionBarProps) {
  return (
    <div className="flex h-10 items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-cool800">
        <span className="font-semibold text-achromaticBlack">
          총{" "}
          {totalCount === undefined ? "-" : totalCount.toLocaleString("ko-KR")}
          건
        </span>
        {hasFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="font-semibold text-mainBlue"
          >
            검색 초기화
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={searchOpen ? "primary" : "secondary"}
          onClick={onToggleSearch}
          aria-pressed={searchOpen}
        >
          검색
        </Button>
        <Button
          variant="danger"
          disabled={!canDelete || deleting}
          onClick={onDelete}
        >
          삭제
        </Button>
      </div>
    </div>
  );
}
