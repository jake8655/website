import { cn } from "@/lib/utils";

export default function Wrapper({
  children,
  size = "lg",
  className,
}: {
  children: React.ReactNode;
  size?: "sm" | "lg";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-8 md:mx-auto md:px-12",
        {
          "md:max-w-(--breakpoint-xl)": size === "lg",
          "md:max-w-(--breakpoint-md)": size === "sm",
        },
        className,
      )}
    >
      {children}
    </div>
  );
}
