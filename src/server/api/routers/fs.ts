import fs from "node:fs/promises";

import type { Directory } from "@/lib/file-system";
import { createTRPCRouter } from "@/server/api/trpc";
import { publicProcedure } from "../trpc";

async function readAllChildren(path: string, parent: string) {
  const files = await fs.readdir(path);
  const children: Directory["files"] = {};

  for (const file of files) {
    const filePath = `${path}/${file}`;
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      children[file] = {
        name: file,
        _parent: parent,
        files: await readAllChildren(filePath, `${parent}${file}/`),
      };
    } else {
      children[file] = {
        name: file,
        _parent: parent,
        content: await fs.readFile(filePath, "utf-8"),
      };
    }
  }

  return children;
}

export const fsRouter = createTRPCRouter({
  getLocalFiles: publicProcedure.query(async (): Promise<Directory> => {
    const rootPath = `${process.cwd()}/terminal-fs`;
    const root = await readAllChildren(rootPath, "/");

    return {
      name: "root",
      _parent: "",
      files: root,
    };
  }),
});
