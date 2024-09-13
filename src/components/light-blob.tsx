import { cn } from "@/lib/utils";

export default function LightBlob({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "-z-10 fixed h-64 w-64 rounded-full bg-brand blur-[150px]",
        className,
      )}
    ></div>
  );
}
