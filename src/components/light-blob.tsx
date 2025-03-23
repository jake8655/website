import { cn } from "@/lib/utils";

export default function LightBlob({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed z-20 h-64 w-64 rounded-full bg-brand blur-[150px]",
        className,
      )}
      style={{
        transform: "translateZ(0)",
      }}
    ></div>
  );
}
