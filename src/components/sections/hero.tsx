import Image from "next/image";
import Macbook from "../macbook";

export default function Hero() {
  const date = new Date();
  let age = date.getFullYear() - 2007;
  if (date.getMonth() < 4 || (date.getMonth() === 4 && date.getDate() < 25)) {
    age--;
  }

  return (
    <section className="fade-in grid animate-in grid-cols-1 items-start gap-12 duration-700 md:min-h-[40rem] md:grid-cols-2">
      <aside className="slide-in-from-left animate-in duration-700 ease-out">
        <h1 className="font-bold text-4xl leading-tight md:text-5xl lg:text-7xl">
          Hi there! I&apos;m <br />
          <span className="bg-gradient-to-bl from-brand to-blue-600 bg-clip-text text-transparent leading-normal">
            Dominik Tóth
          </span>
          .
        </h1>
        <p className="text-balance pt-6 text-xl leading-normal">
          A {age} year old highschool{" "}
          <span className="text-brand">student</span>,{" "}
          <span className="text-brand">web developer</span>,{" "}
          <span className="text-brand">linux</span> and{" "}
          <span className="text-brand">aviation</span> enthusiast from Slovakia.
          <Image
            src="/images/slovakia-flag.png"
            alt="Slovaki flag"
            className="ml-2 inline-block align-top"
            width={30}
            height={30}
          />
        </p>
      </aside>

      <aside className="h-full min-h-[250px] lg:min-h-0">
        <Macbook />
      </aside>
    </section>
  );
}
