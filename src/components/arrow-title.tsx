import Image from "next/image";

export default function ArrowTitle({ title }: { title: string }) {
  return (
    <div className="fade-in slide-in-from-top grid animate-in place-items-center duration-700 ease-out">
      <div className="group flex gap-12">
        <Image
          src="/images/arrow.svg"
          alt="Chevron arrows pointing down"
          width={50}
          height={50}
          loading="eager"
          className="repeat-[2] group-hover:-translate-y-4 animate-bounce duration-500 ease-out"
        />
        <h2 className="font-semibold text-4xl lg:text-5xl">{title}</h2>
        <Image
          src="/images/arrow.svg"
          alt="Chevron arrows pointing down"
          width={50}
          height={50}
          loading="eager"
          className="repeat-[2] group-hover:-translate-y-4 animate-bounce duration-500 ease-out"
        />
      </div>
    </div>
  );
}
