import { cn } from "@/shared/lib/cn";

export function Badge({
  color = "gray",
  children,
}: {
  color?: "gray" | "blue" | "red";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded px-1.5 text-xs font-semibold",
        color === "gray" && "bg-cool150 text-cool700",
        color === "blue" && "bg-blue50 text-mainBlue",
        color === "red" && "bg-red-50 text-lampRed"
      )}
    >
      {children}
    </span>
  );
}
