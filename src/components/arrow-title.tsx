import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ArrowTitle({
  text,
  className,
  id,
  priority,
}: {
  text: string;
  slideDirection: "bottom" | "top";
  className?: string;
  id?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("group flex gap-4 md:gap-12", className)} id={id}>
      <Image
        src="/images/arrow.svg"
        alt="Chevron arrows pointing down"
        width={50}
        height={50}
        priority={priority}
        className="group-hover:-translate-y-4 duration-500 ease-out"
      />
      <h2 className="text-balance text-center font-semibold text-3xl lg:text-5xl">
        {text}
      </h2>
      <Image
        src="/images/arrow.svg"
        alt="Chevron arrows pointing down"
        width={50}
        height={50}
        priority={priority}
        className="group-hover:-translate-y-4 duration-500 ease-out"
      />
    </div>
  );
}
