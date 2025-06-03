import Image from "next/image";
import Link from "next/link";
import { cn, navigationSections } from "@/lib/utils";
import {
  ContactButton,
  SectionLink,
  SignOutButton,
} from "./navbar-anim-components";
import Wrapper from "./wrapper";

export function AdminNavbar() {
  return (
    <>
      {/* Empty div to move navbar lower so the sticky positioning triggers later */}
      <div className="h-16 w-full"></div>
      <nav className="sticky top-8 z-50">
        <Wrapper size="sm">
          <ul
            role="navigation"
            aria-label="Main navigation"
            className="flex items-center justify-between rounded-xl border-2 border-brand bg-blue-700/30 px-2 py-3 font-semibold text-sm backdrop-blur-lg md:p-4 md:text-xl md:backdrop-blur-xl"
          >
            <li>
              <Image
                src="/images/memoji.png"
                width={50}
                height={50}
                className="h-8 w-8 md:h-12 md:w-12"
                alt="Dominik Tóth"
                priority
              />
            </li>
            <li className="mx-2 ml-auto md:mx-4 md:ml-auto">
              <Link
                className="relative transition-colors hover:text-brand"
                role="menuitem"
                href="/"
              >
                Homepage
              </Link>
            </li>
            <li className="mx-2 md:mx-4">
              <Link
                className="relative transition-colors hover:text-brand"
                role="menuitem"
                href="/admin"
              >
                Dashboard
              </Link>
            </li>
            <li className="mx-2 md:mx-4">
              <SignOutButton />
            </li>
          </ul>
        </Wrapper>
      </nav>
    </>
  );
}

export default function Navbar() {
  return (
    <>
      {/* Empty div to move navbar lower so the sticky positioning triggers later */}
      <div className="h-16 w-full"></div>
      <nav className="sticky top-8 z-50">
        <Wrapper size="sm">
          <ul
            role="navigation"
            aria-label="Main navigation"
            className="flex items-center justify-between rounded-xl border-2 border-brand bg-blue-700/30 px-2 py-3 font-semibold text-sm backdrop-blur-lg md:p-4 md:text-xl md:backdrop-blur-xl"
          >
            <li>
              <Link href="/">
                <Image
                  src="/images/memoji.png"
                  width={50}
                  height={50}
                  quality={90}
                  sizes="50px"
                  className="h-8 w-8 md:h-12 md:w-12"
                  alt="Dominik Tóth"
                  priority
                />
              </Link>
            </li>
            {navigationSections.map((section, idx) => (
              <li
                key={idx}
                className={cn("mx-2 md:mx-4", {
                  "ml-auto md:ml-auto": idx === 0,
                })}
              >
                <SectionLink title={section.title} idx={idx} />
              </li>
            ))}
            <li className="mx-2 md:mx-4">
              <ContactButton />
            </li>
          </ul>
        </Wrapper>
      </nav>
    </>
  );
}
