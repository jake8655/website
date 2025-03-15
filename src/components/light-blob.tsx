import { cn } from "@/lib/utils";

export default function LightBlob({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed z-20 h-64 w-64 transform-gpu rounded-full bg-brand blur-[150px]",
        className,
      )}
    ></div>
  );
}
