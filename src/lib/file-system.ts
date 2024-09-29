export type ShellCommands = Record<
  string,
  {
    output: (args: string) => string;
    description: string;
  }
>;

interface FileSystemNode {
  name: string;
  _parent: string;
}

interface File extends FileSystemNode {
  content: string;
}

export interface Directory extends FileSystemNode {
  files: {
    [key: string]: File | Directory;
  };
}

function isFile(fs: FileSystemNode): fs is File {
  return (fs as File).content !== undefined;
}

export class FileSystem {
  private cwd: string = "/home/dominik";

  constructor(private readonly fs: Directory) {}

  private pathToFs(path: string): Directory | File {
    if (path === "/") {
      return this.fs;
    }

    path = this.replaceTilde(path);
    const parts = path.split("/").filter(Boolean);
    const startsWithSlash = path.startsWith("/");

    let file: Directory | File = startsWithSlash
      ? this.fs
      : this.pathToFs(this.cwd);
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]!;

      if (isFile(file) && i < parts.length - 1) {
        throw new Error(`not a directory: ${path}`);
      }

      if (!isFile(file)) {
        if (!file.files[part]) {
          throw new Error(`no such file or directory: ${path}`);
        }
        file = file.files[part];
      }
    }

    return file;
  }

  private fsToPath(fs: FileSystemNode) {
    const paths: string[] = [];

    let dir = fs;
    while (dir._parent !== "") {
      paths.unshift(dir.name);
      dir = this.pathToFs(dir._parent);
    }

    return `/${paths.join("/")}`;
  }

  private pathExists(path: string) {
    try {
      this.pathToFs(path);
      return true;
    } catch {
      return false;
    }
  }

  private dedupeSlashes(str: string) {
    return str.replace(/\/+/g, "/");
  }

  private replaceTilde(str: string) {
    return str.replace("~", "/home/dominik");
  }

  private pwd() {
    return this.replaceTilde(this.cwd);
  }

  private ls(path: string) {
    const pathAsFs = this.pathToFs(path);
    return Object.keys(isFile(pathAsFs) ? pathAsFs : pathAsFs.files).sort();
  }

  private cd(dir: string) {
    if (dir.startsWith("/") || dir.startsWith("~")) {
      if (this.pathExists(dir)) {
        if (isFile(this.pathToFs(dir))) {
          throw new Error(`cd: not a directory: ${dir}`);
        }

        this.cwd = dir;
        return "";
      }

      throw new Error(`cd: no such file or directory: ${dir}`);
    }

    const parts = dir.split("/");
    let cwd = this.pathToFs(this.cwd);

    for (const part of parts) {
      if (part === "..") {
        cwd = this.pathToFs(cwd._parent);
        continue;
      }
      if (!isFile(cwd)) {
        if (!cwd.files[part]) {
          throw new Error(`cd: no such file or directory: ${dir}`);
        }
        if (isFile(cwd.files[part])) {
          throw new Error(`cd: not a directory: ${dir}`);
        }
        cwd = cwd.files[part];
      }
    }

    this.cwd = this.fsToPath(cwd);
    return "";
  }

  private cat(path: string) {
    const pathAsFs = this.pathToFs(path);
    if (isFile(pathAsFs)) {
      return pathAsFs.content;
    }
    throw new Error(`cat: is a directory: ${this.replaceTilde(path)}`);
  }

  public createCommands(): ShellCommands {
    return {
      cd: {
        output: (args: string) => {
          let destination = args.trim().split(" ")[1] || "/home/dominik";
          destination = this.dedupeSlashes(destination);

          try {
            this.cd(destination);
            return "";
          } catch (e) {
            if (e instanceof Error) {
              return e.message;
            }
            return "";
          }
        },
        description: "change working directory",
      },
      ls: {
        output: (args: string) => {
          let path = args.trim().split(" ")[1] || this.cwd;
          path = this.dedupeSlashes(path);

          try {
            return this.ls(path).join("\n");
          } catch (e) {
            if (e instanceof Error) {
              return e.message;
            }
            return "";
          }
        },
        description: "list directory contents",
      },
      pwd: {
        output: () => {
          return this.pwd();
        },
        description: "print name of current/working directory",
      },
      cat: {
        output: (args: string) => {
          let path = args.trim().split(" ")[1];
          if (!path) {
            return "cat: missing file";
          }

          path = this.dedupeSlashes(path);

          try {
            return this.cat(path);
          } catch (e) {
            if (e instanceof Error) {
              return e.message;
            }
            return "";
          }
        },
        description: "concatenate files and print on the standard output",
      },
    };
  }
}
