import Macbook from "../macbook";

export default function Hero() {
  const date = new Date();
  let age = date.getFullYear() - 2007;
  if (date.getMonth() < 4 || (date.getMonth() === 4 && date.getDate() < 25)) {
    age--;
  }

  return (
    <section className="fade-in grid animate-in grid-cols-2 items-start gap-12 duration-700 md:min-h-[40rem]">
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
          <span className="text-brand">web developer</span>
          <br /> and <span className="text-brand">linux enjoyer</span> from
          Slovakia.
        </p>
      </aside>

      <aside className="h-full">
        <Macbook />
      </aside>
    </section>
  );
}
