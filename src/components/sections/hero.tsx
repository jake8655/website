import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const date = new Date();
  let age = date.getFullYear() - 2007;
  if (date.getMonth() < 4 || (date.getMonth() === 4 && date.getDate() < 25)) {
    age--;
  }

  return (
    <section className="fade-in flex animate-in flex-col-reverse items-center gap-12 duration-700 md:min-h-[40rem] md:flex-row md:items-start md:justify-between">
      <aside className="slide-in-from-left animate-in duration-700 ease-out">
        <h1 className="font-bold text-4xl leading-tight md:text-5xl lg:text-7xl">
          Hi there! I&apos;m <br />
          <span className="text-brand">Dominik Tóth</span>.
        </h1>
        <p className="text-balance pt-6 text-xl leading-normal">
          A {age} year old highschool{" "}
          <span className="text-brand">student</span>,{" "}
          <span className="text-brand">web developer</span>
          <br /> and <span className="text-brand">linux enjoyer</span> from
          Slovakia.
        </p>
      </aside>

      <Link
        href="/"
        className="slide-in-from-right shrink-0 animate-in duration-700 ease-out"
      >
        <Image
          src="/images/ken.png"
          alt="Ken Kaneki profile"
          width={144}
          height={144}
          loading="eager"
          className="h-36 w-36 rounded-full border-4 border-brand-dark shadow-brand-dark shadow-lg"
        />
      </Link>
    </section>
  );
}
