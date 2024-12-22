"use server";

import { cookies } from "next/headers";

export const setGuiModeCookieAction = async (value: boolean) => {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "guiMode",
    value: value ? "true" : "false",
    maxAge: 60 * 60 * 24 * 365,
  });
};
