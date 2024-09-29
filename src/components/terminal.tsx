"use client";

import { env } from "@/env.mjs";
import { FileSystem, type ShellCommands } from "@/lib/file-system";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const PROMPT = `<span class="text-rose-300 font-semibold">dominik</span>@<span class="text-rose-300 font-semibold">website</span>:~$ `;
const DANGEROUSLY_COLORED_COMMANDS = ["neofetch", "help"];

type Command =
  | {
      text: string;
      output: string;
      ctrlc?: false;
      dangerouslyColored: boolean;
    }
  | { text: string; ctrlc: true }
  | { text: null; output: string; dangerouslyColored: true; ctrlc?: false }
  | null;

function getUptimeDaysFrom(date: Date) {
  return Math.floor((Date.now() - date.getTime()) / 1000 / 60 / 60 / 24);
}

export default function Terminal({
  className,
  pageCreationDate,
}: {
  className?: string;
  pageCreationDate: Date;
}) {
  const { data: serverFiles } = api.fs.getLocalFiles.useQuery();
  // Should never happen because api.fs.getLocalFiles is prefetched on the server
  if (!serverFiles) return null;

  const fileSystem = new FileSystem(serverFiles);
  const uptimeDays = getUptimeDaysFrom(pageCreationDate);
  const neofetch = `       <span class="text-emerald-300">/\\</span>         <span class="text-rose-300 font-semibold">dominik</span>@<span class="text-rose-300 font-semibold">website</span>
      <span class="text-emerald-300">/  \\</span>        <span class="text-blue-500 font-semibold">os</span>     arch btw
     <span class="text-emerald-300">/\\   \\</span>       <span class="text-blue-500 font-semibold">host</span>   your browser
    <span class="text-blue-500">/      \\      <span class="font-semibold">kernel</span></span> latest
   <span class="text-blue-500">/   ,,   \\     <span class="font-semibold">uptime</span></span> ${
     uptimeDays || 1
   } day${uptimeDays > 1 ? "s" : ""}
  <span class="text-blue-500">/   |  |  -\\    <span class="font-semibold">pkgs</span></span>   all of em`;

  return (
    <div
      className={cn(
        `fade-in slide-in-from-bottom before:-z-[1] relative my-32 h-[calc(100vh*2/3)] animate-in rounded-xl border-2 border-brand-dark bg-gray-900/95 p-10 shadow-glow duration-700 ease-out before:absolute before:inset-0 before:bg-[url(/wallpaper.gif)] before:content-["] hover:border-violet-400`,
        className,
      )}
    >
      <Shell neofetch={neofetch} fileSystem={fileSystem} />
    </div>
  );
}

function Shell({
  neofetch,
  fileSystem,
}: { neofetch: string; fileSystem: FileSystem }) {
  const [focus, setFocus] = useState(false);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<Command[]>([
    { output: neofetch, dangerouslyColored: true, text: null },
  ]);
  const filteredCommandHistory = useMemo(
    () =>
      commandHistory.filter(c => c && !c.ctrlc && c.text) as Exclude<
        Command,
        { text: null }
      >[],
    [commandHistory],
  );
  const [commandHistoryIndex, setCommandHistoryIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const debouncedNoLongerTyping = useDebouncedCallback(() => {
    setIsTyping(false);
  }, 200);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (env.NEXT_PUBLIC_AUTOFOCUS_TERMINAL) terminalRef.current?.focus();
  }, []);

  const commands: ShellCommands = {
    help: {
      output() {
        const availableCommands = Object.keys(commands).filter(
          c => c !== "catchAll",
        );
        const withDescriptions = availableCommands.map(c => {
          const command = commands[c];
          return `<span class="text-yellow-200">${c}</span>: ${command!.description}`;
        });
        withDescriptions.push(
          '<span class="text-yellow-200">clear</span>: clear the terminal screen',
        );

        return `<span class="font-semibold">Available commands</span>:\n${withDescriptions.join("\n")}`;
      },
      description: "list of available commands",
    },
    neofetch: {
      output() {
        return neofetch;
      },
      description: "a fast, highly customizable system info script",
    },
    catchAll: {
      output(args) {
        const command = args.split(" ")[0];
        return `Command not found: ${command}`;
      },
      description: "command not found",
    },
    ...fileSystem.createCommands(),
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsTyping(true);

    switch (true) {
      case e.key === "Escape":
        // Lose focus from the terminal
        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLElement) {
          activeElement.blur();
        }
        return debouncedNoLongerTyping();

      case e.key === "l" && e.ctrlKey:
        setCommandHistory([]);
        setInput("");
        setCursorPosition(-1);
        return debouncedNoLongerTyping();

      case e.key === "Enter" || (e.key === "m" && e.ctrlKey):
        if (input.trim() === "") setCommandHistory([...commandHistory, null]);
        else {
          if (input.trim() === "clear") {
            setCommandHistory([]);
          } else {
            const command =
              commands[input.trim().split(" ")[0]!] ?? commands.catchAll!;
            commandHistory.push({
              text: input.trim(),
              output: command.output(input.trim()),
              dangerouslyColored: DANGEROUSLY_COLORED_COMMANDS.includes(
                input.trim(),
              ),
            });
            setCommandHistory([...commandHistory]);
          }
        }

        setInput("");
        setCursorPosition(-1);

        const newFiltered = commandHistory.filter(c => c && !c.ctrlc);
        // -1 because we subtract 1 at history browsing immediately
        setCommandHistoryIndex(newFiltered.length - 1);

        return debouncedNoLongerTyping();

      case e.key === "Backspace" || (e.key === "h" && e.ctrlKey):
        if (cursorPosition === -1) return debouncedNoLongerTyping();
        setInput(
          input.slice(0, cursorPosition) + input.slice(cursorPosition + 1),
        );
        setCursorPosition(cursorPosition - 1);

        return debouncedNoLongerTyping();

      case e.key === "c" && e.ctrlKey:
        commandHistory.push({ text: `${input.trim()}^C`, ctrlc: true });
        setCommandHistory([...commandHistory]);
        setInput("");
        setCursorPosition(-1);

        // +1 because we subtract 1 at history browsing immediately
        const newFilteredCommands = commandHistory.filter(
          c => c && !c.ctrlc && c.text,
        );
        setCommandHistoryIndex(newFilteredCommands.length);

        return debouncedNoLongerTyping();

      case e.key === "ArrowUp":
        const newBackIndex = commandHistoryIndex - 1;
        if (newBackIndex < 0) {
          break;
        }

        setCommandHistoryIndex(newBackIndex);
        setCursorPosition(
          filteredCommandHistory[newBackIndex]!.text.length - 1,
        );
        setInput(filteredCommandHistory[newBackIndex]!.text);
        break;

      case e.key === "ArrowDown":
        const newForwardIndex = commandHistoryIndex + 1;
        if (newForwardIndex >= filteredCommandHistory.length) {
          break;
        }

        setCommandHistoryIndex(newForwardIndex);
        setCursorPosition(
          filteredCommandHistory[newForwardIndex]!.text.length - 1,
        );
        setInput(filteredCommandHistory[newForwardIndex]!.text);
        break;

      case e.key === "ArrowLeft":
        if (cursorPosition > -1) {
          setCursorPosition(cursorPosition - 1);
        }
        break;

      case e.key === "ArrowRight":
        if (cursorPosition < input.length - 1) {
          setCursorPosition(cursorPosition + 1);
        }
        break;
    }

    if (e.key.length === 1) {
      const newInput =
        input.slice(0, cursorPosition + 1) +
        e.key +
        input.slice(cursorPosition + 1);
      setCursorPosition(cursorPosition + 1);
      setInput(newInput);
    }

    debouncedNoLongerTyping();
  };

  return (
    <div
      className="scrollbar-hide h-full space-y-5 overflow-y-scroll selection:bg-gray-800 focus:outline-none"
      ref={terminalRef}
      tabIndex={0}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onKeyDown={handleKeyDown}
    >
      <CommandList
        commands={commandHistory}
        focus={focus}
        input={input}
        cursorPosition={cursorPosition}
        isTyping={isTyping}
      />
      <AutoScroll length={commandHistory.length} />
    </div>
  );
}

function AutoScroll({ length }: { length: number }) {
  const scrollDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (length === 0) return;

    scrollDivRef.current?.scrollIntoView();
  }, [length]);

  return <div ref={scrollDivRef}></div>;
}

function CommandList({
  commands,
  focus,
  input,
  cursorPosition,
  isTyping,
}: {
  commands: Command[];
  focus: boolean;
  input: string;
  cursorPosition: number;
  isTyping: boolean;
}) {
  return (
    <div className="space-y-1">
      {commands.map((command, i) => (
        <React.Fragment key={i}>
          {command?.text !== null && (
            <div className="flex">
              <pre dangerouslySetInnerHTML={{ __html: PROMPT }}></pre>
              {command && <pre>{command.text}</pre>}
            </div>
          )}
          {command && !command.ctrlc ? (
            command.dangerouslyColored ? (
              <pre dangerouslySetInnerHTML={{ __html: command.output }}></pre>
            ) : (
              <pre>{command.output}</pre>
            )
          ) : null}
        </React.Fragment>
      ))}

      <CurrentCommand
        input={input}
        cursorPosition={cursorPosition}
        focus={focus}
        isTyping={isTyping}
      />
    </div>
  );
}

function CurrentCommand({
  input,
  cursorPosition,
  focus,
  isTyping,
}: {
  input: string;
  cursorPosition: number;
  focus: boolean;
  isTyping: boolean;
}) {
  return (
    <div className="flex">
      <pre dangerouslySetInnerHTML={{ __html: PROMPT }}></pre>
      <div className="relative">
        <pre className="inline">{input.slice(0, cursorPosition + 1)}</pre>
        <BlinkingCursor
          focus={focus}
          className="absolute"
          isTyping={isTyping}
        />
        <pre
          className={`relative z-[10] inline ${
            focus && !isTyping
              ? "animate-blinkText"
              : focus && isTyping
                ? "text-gray-900"
                : ""
          }`}
        >
          {input.slice(cursorPosition + 1, cursorPosition + 2)}
        </pre>
        <pre className="inline">{input.slice(cursorPosition + 2)}</pre>
      </div>
    </div>
  );
}

function BlinkingCursor({
  focus,
  className,
  isTyping,
}: {
  focus: boolean;
  className?: string;
  isTyping: boolean;
}) {
  if (focus)
    return (
      <span
        className={cn(
          "inline",
          isTyping ? "bg-current" : "animate-blink",
          className,
        )}
      >
        &nbsp;&nbsp;
      </span>
    );

  return null;
}
