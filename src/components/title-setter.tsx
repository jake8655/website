"use client";

import { usePathname } from "next/navigation";

export default function TitleSetter() {
  const path = usePathname();
  let title = path.split("/").slice(-1)[0]!;
  if (title === "") title = "Home";
  const capitilized = title.charAt(0).toUpperCase() + title.slice(1);

  return <title>{`Dominik Tóth • ${capitilized}`}</title>;
}
