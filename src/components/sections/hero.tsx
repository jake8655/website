import Image from "next/image";
import Macbook from "../macbook";
import RevealOnScroll from "../reveal-on-scroll";

export default function Hero() {
  const date = new Date();
  let age = date.getFullYear() - 2007;
  if (date.getMonth() < 4 || (date.getMonth() === 4 && date.getDate() < 25)) {
    age--;
  }

  return (
    <section className="grid grid-cols-1 items-start gap-12 md:min-h-[40rem] md:grid-cols-2">
      <RevealOnScroll
        variants={{
          hidden: { x: "-50%", opacity: 0 },
          visible: { x: 0, opacity: 1 },
        }}
      >
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
      </RevealOnScroll>

      <RevealOnScroll
        outerClassName="h-full min-h-[250px] lg:min-h-0"
        className="h-full"
        variants={{
          hidden: { x: "50%", opacity: 0 },
          visible: { x: 0, opacity: 1 },
        }}
        transition={{ delay: 0.3 }}
        initial="visible"
      >
        <Macbook />
      </RevealOnScroll>
    </section>
  );
}
