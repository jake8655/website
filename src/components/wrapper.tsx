import { cn } from "@/lib/utils";

export default function Wrapper({
  children,
  size = "lg",
}: { children: React.ReactNode; size?: "sm" | "lg" }) {
  return (
    <div
      className={cn("px-8 md:mx-auto md:px-12", {
        "md:max-w-screen-xl": size === "lg",
        "md:max-w-screen-md": size === "sm",
      })}
    >
      {children}
    </div>
  );
}
