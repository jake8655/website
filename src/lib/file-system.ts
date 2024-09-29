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

interface Directory extends FileSystemNode {
  files: {
    [key: string]: File | Directory;
  };
}

function isFile(fs: FileSystemNode): fs is File {
  return (fs as File).content !== undefined;
}

// Assuming the root is /
const FILE_SYSTEM = {
  name: "root",
  _parent: "",
  files: {
    home: {
      name: "home",
      _parent: "/",
      files: {
        dominik: {
          name: "dominik",
          _parent: "/home",
          files: {
            projects: {
              name: "projects",
              _parent: "/home/dominik",
              files: {
                website: {
                  name: "website",
                  _parent: "/home/dominik/projects",
                  files: {
                    "README.md": {
                      name: "README.md",
                      _parent: "/home/dominik/projects/website",
                      content: "This is my website",
                    },
                  },
                },
              },
            },
          },
        },
        jake: {
          name: "jake",
          _parent: "/home",
          files: {},
        },
      },
    },
  },
} satisfies Directory;

export class FileSystem {
  private cwd: string = "/home/dominik";
  private readonly fs: Directory = FILE_SYSTEM;

  private pathToFs(path: string): Directory {
    if (path === "/") {
      return this.fs;
    }

    const parts = path.split("/").filter(Boolean);

    if (path.startsWith("/")) {
      let dir = this.fs;
      // console.log(dir, parts);
      for (const part of parts) {
        if (!dir.files[part]) {
          // console.log("error in pathToFs, starts with /");
          throw new Error(`no such file or directory: ${path}`);
        }
        if (isFile(dir.files[part])) {
          throw new Error(`not a directory: ${path}`);
        }

        dir = dir.files[part];
      }

      return dir;
    }

    let dir = this.pathToFs(this.cwd);
    for (const part of parts) {
      if (!dir.files[part]) {
        // console.log("error in pathToFs");
        throw new Error(`no such file or directory: ${path}`);
      }
      if (isFile(dir.files[part])) {
        throw new Error(`not a directory: ${path}`);
      }

      dir = dir.files[part];
    }

    return dir;
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

  private pwd() {
    return this.cwd;
  }

  private ls(path: string) {
    const pathAsFs = this.pathToFs(path);
    return Object.keys(pathAsFs.files);
  }

  private cd(dir: string) {
    if (dir.startsWith("/")) {
      if (this.pathExists(dir)) {
        this.cwd = dir;
        return "";
      }

      // console.log("error in cd, starts with /");
      throw new Error(`cd: no such file or directory: ${dir}`);
    }

    const parts = dir.split("/");
    let cwd = this.pathToFs(this.cwd);

    for (const part of parts) {
      if (!cwd.files[part]) {
        // console.log("error in cd");
        throw new Error(`cd: no such file or directory: ${dir}`);
      }
      if (isFile(cwd.files[part])) {
        throw new Error(`cd: not a directory: ${dir}`);
      }
      cwd = cwd.files[part];
    }

    this.cwd = this.fsToPath(cwd);
    return "";
  }

  private dedupeSlashes(str: string) {
    return str.replace(/\/+/g, "/");
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
        description: "Change directory",
      },
      ls: {
        output: (args: string) => {
          let path = args.trim().split(" ")[1] || this.cwd;
          path = this.dedupeSlashes(path);

          return this.ls(path).join("\n");
        },
        description: "List files",
      },
      pwd: {
        output: () => {
          return this.pwd();
        },
        description: "Print working directory",
      },
    };
  }
}
