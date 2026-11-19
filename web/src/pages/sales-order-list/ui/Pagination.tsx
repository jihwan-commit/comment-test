import { Button } from "@/shared/ui";

export function Pagination({
  page,
  lastPage,
  onChange,
}: {
  page: number;
  lastPage: number;
  onChange: (page: number) => void;
}) {
  const pages = Array.from({ length: lastPage }, (_, i) => i + 1).filter(
    (p) => Math.abs(p - page) <= 2 || p === 1 || p === lastPage
  );
  return (
    <nav className="flex items-center gap-1" aria-label="페이지">
      <Button
        variant="ghost"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        이전
      </Button>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center">
          {i > 0 && pages[i - 1]! < p - 1 && (
            <span className="px-1 text-cool400">…</span>
          )}
          <button
            type="button"
            aria-current={p === page ? "page" : undefined}
            onClick={() => onChange(p)}
            className={`size-8 rounded-md text-sm ${
              p === page
                ? "bg-mainBlue font-bold text-white"
                : "text-cool800 hover:bg-cool100"
            }`}
          >
            {p}
          </button>
        </span>
      ))}
      <Button
        variant="ghost"
        disabled={page >= lastPage}
        onClick={() => onChange(page + 1)}
      >
        다음
      </Button>
    </nav>
  );
}
