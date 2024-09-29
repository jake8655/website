import Link from "next/link";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <Link href="/">
        <h1 className="font-bold text-4xl">About</h1>
      </Link>
      <p className="text-xl">
        I'm a software engineer and a designer. I'm currently working at
        <a
          className="text-brand-light"
          href="https://www.google.com"
          target="_blank"
          rel="noreferrer"
        >
          Google
        </a>
        . I'm also a member of the{" "}
        <a
          className="text-brand-light"
          href="https://www.w3.org/community/wicg/"
          target="_blank"
          rel="noreferrer"
        >
          Web Platform Incubator Community Group
        </a>
        .
      </p>
      <p className="text-xl">
        I'm also a member of the{" "}
        <a
          className="text-brand-light"
          href="https://www.w3.org/community/wicg/"
          target="_blank"
          rel="noreferrer"
        >
          Web Platform Incubator Community Group
        </a>
        .
      </p>
    </div>
  );
}
