"use server";

import { getUserIp, redis } from "./get-project-like-count";

// TODO: add ability to remove like from project
export const likeProjectAction = async (projectId: string) => {
  const ip = await getUserIp();

  // Hash the IP and turn it into a hex string
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(ip),
  );
  const hash = Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  const isNew = await redis.set(["deduplicate", hash, projectId].join(":"), {
    nx: true,
  });

  if (!isNew) return { success: false };

  await redis.incr(["likes", "projects", projectId].join(":"));

  // TODO: show a little thank you toast/message when the like is successful
  return { success: true };
};
