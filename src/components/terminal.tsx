"use client";

import { env } from "@/env";
import {
  type Directory,
  FileSystem,
  type ShellCommands,
} from "@/lib/file-system";
import { cn, dangerouslySanitizeHtml } from "@/lib/utils";
import terminalBackground from "@/wallpaper.png";
import { atom, useAtom } from "jotai";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BackgroundBeamsWithCollision } from "./ui/background-beams-with-collision";

const DANGEROUSLY_COLORED_COMMANDS = ["neofetch", "help"];

type Command = { prompt: string } & (
  | {
      text: string;
      output: string;
      ctrlc?: false;
      dangerouslyColored: boolean;
    }
  | { text: string; ctrlc: true }
  | { text: null; output: string; dangerouslyColored: true; ctrlc?: false }
);

const focusAtom = atom(false);

export default function Terminal({
  className,
  uptimeDays,
  serverFiles,
}: {
  className?: string;
  uptimeDays: number;
  serverFiles: Directory;
}) {
  const fileSystem = new FileSystem(serverFiles);

  const [focus, setFocus] = useAtom(focusAtom);

  return (
    <div
      className={cn(
        "fade-in slide-in-from-bottom relative my-32 h-[calc(100vh*2/3)] animate-in rounded-xl shadow-glow duration-700 ease-out",
        "bg-gray-900/95",
        // Gradient (outer) border on hover
        // https://www.30secondsofcode.org/css/s/nested-border-radius
        // rounded-15px because inner-radius(12px, rounded-xl) + distance(3px)
        "before:-z-[1] before:-inset-[3px] before:absolute before:animate-borderAngle before:rounded-[15px] before:bg-gradient-var before:from-gradient-purple before:via-gradient-blue before:to-gradient-green before:opacity-0 before:transition before:content-[''] hover:before:opacity-100",
        // Single-color (outer) border when not hovered
        // https://www.30secondsofcode.org/css/s/nested-border-radius
        // rounded-15px because inner-radius(12px, rounded-xl) + distance(3px)
        "after:-z-[2] after:-inset-[3px] after:absolute after:rounded-[15px] after:bg-gray-800 after:content-['']",
        focus && "before:opacity-100",
        className,
      )}
      onClick={() => setFocus(true)}
    >
      <BackgroundBeamsWithCollision className="rounded-xl p-10">
        {/* Background Image */}
        <Image
          src={terminalBackground}
          alt="Terminal wallpaper"
          fill
          className="-z-[1] absolute inset-0 rounded-[inherit] object-cover"
        />
        <Shell uptimeDays={uptimeDays} fileSystem={fileSystem} />
      </BackgroundBeamsWithCollision>
    </div>
  );
}

function Shell({
  uptimeDays,
  fileSystem,
}: {
  uptimeDays: number;
  fileSystem: FileSystem;
}) {
  const PROMPT = `<span class="text-rose-300 font-semibold">dominik</span>@<span class="text-rose-300 font-semibold">website</span>:${fileSystem.pwd()} $ `;

  const NEOFETCH = `        <span class="text-emerald-300">/\\</span>         <span class="text-rose-300 font-semibold">dominik</span>@<span class="text-rose-300 font-semibold">website</span>
       <span class="text-emerald-300">/  \\</span>        <span class="text-blue-500 font-semibold">os</span>     arch btw
      <span class="text-emerald-300">/\\   \\</span>       <span class="text-blue-500 font-semibold">host</span>   your browser
     <span class="text-blue-500">/      \\      <span class="font-semibold">kernel</span></span> latest
    <span class="text-blue-500">/   ,,   \\     <span class="font-semibold">uptime</span></span> ${
      uptimeDays || 1
    } day${uptimeDays > 1 ? "s" : ""}
   <span class="text-blue-500">/   |  |  -\\    <span class="font-semibold">pkgs</span></span>   all of em`;

  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<Command[]>([
    {
      output: NEOFETCH,
      dangerouslyColored: true,
      text: null,
      prompt: PROMPT,
    },
  ]);

  const [focus, setFocus] = useAtom(focusAtom);

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
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const timeoutId = typingTimeout.current;
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (env.NEXT_PUBLIC_AUTOFOCUS_TERMINAL) terminalRef.current?.focus();
  }, []);

  useEffect(() => {
    if (focus) terminalRef.current?.focus();
  }, [focus]);

  useEffect(() => {
    if (!terminalRef.current) return;
    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [commandHistory]);

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
        return NEOFETCH;
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

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    setIsTyping(true);
    typingTimeout.current = setTimeout(() => setIsTyping(false), 300);

    switch (true) {
      case e.key === "Escape":
        // Lose focus from the terminal
        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLElement) {
          activeElement.blur();
        }
        return;

      case e.key === "l" && e.ctrlKey:
        setCommandHistory([]);
        setInput("");
        setCursorPosition(-1);
        return;

      case e.key === "Enter" || (e.key === "m" && e.ctrlKey):
        if (input.trim() === "")
          setCommandHistory([
            ...commandHistory,
            {
              prompt: PROMPT,
              text: "",
              output: "",
              dangerouslyColored: false,
            },
          ]);
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
              prompt: PROMPT,
            });
            setCommandHistory([...commandHistory]);
          }
        }

        setInput("");
        setCursorPosition(-1);

        const newFiltered = commandHistory.filter(c => c && !c.ctrlc);
        // -1 because we subtract 1 at history browsing immediately
        setCommandHistoryIndex(newFiltered.length - 1);

        return;

      case e.key === "Backspace" || (e.key === "h" && e.ctrlKey):
        if (cursorPosition === -1) return;
        setInput(
          input.slice(0, cursorPosition) + input.slice(cursorPosition + 1),
        );
        setCursorPosition(cursorPosition - 1);

        return;

      case e.key === "c" && e.ctrlKey:
        commandHistory.push({
          text: `${input.trim()}^C`,
          ctrlc: true,
          prompt: PROMPT,
        });
        setCommandHistory([...commandHistory]);
        setInput("");
        setCursorPosition(-1);

        // +1 because we subtract 1 at history browsing immediately
        const newFilteredCommands = commandHistory.filter(
          c => c && !c.ctrlc && c.text,
        );
        setCommandHistoryIndex(newFilteredCommands.length);

        return;

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
  };

  return (
    <div
      className="scrollbar-hide h-full space-y-5 overflow-y-scroll focus:outline-none"
      ref={terminalRef}
      tabIndex={0}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onKeyDown={handleKeyDown}
    >
      <CommandList
        commands={commandHistory}
        input={input}
        cursorPosition={cursorPosition}
        isTyping={isTyping}
        prompt={PROMPT}
      />
    </div>
  );
}

function CommandList({
  commands,
  input,
  cursorPosition,
  isTyping,
  prompt,
}: {
  commands: Command[];
  input: string;
  cursorPosition: number;
  isTyping: boolean;
  prompt: string;
}) {
  return (
    <ul className="space-y-1">
      {commands.map((command, i) => (
        <React.Fragment key={i}>
          {command.text !== null && (
            <li className="flex">
              <pre
                dangerouslySetInnerHTML={dangerouslySanitizeHtml(
                  command.prompt,
                )}
              ></pre>
              <pre>{command.text}</pre>
            </li>
          )}
          {!command.ctrlc ? (
            <li>
              {command.dangerouslyColored ? (
                <pre
                  dangerouslySetInnerHTML={dangerouslySanitizeHtml(
                    command.output,
                  )}
                ></pre>
              ) : (
                <pre>{command.output}</pre>
              )}
            </li>
          ) : null}
        </React.Fragment>
      ))}

      <li>
        <CurrentCommand
          input={input}
          cursorPosition={cursorPosition}
          isTyping={isTyping}
          prompt={prompt}
        />
      </li>
    </ul>
  );
}

function CurrentCommand({
  input,
  cursorPosition,
  isTyping,
  prompt,
}: {
  input: string;
  cursorPosition: number;
  isTyping: boolean;
  prompt: string;
}) {
  const [focus] = useAtom(focusAtom);

  return (
    <div className="flex">
      <pre dangerouslySetInnerHTML={dangerouslySanitizeHtml(prompt)}></pre>
      <div className="relative">
        <pre className="inline">{input.slice(0, cursorPosition + 1)}</pre>
        <BlinkingCursor className="absolute" isTyping={isTyping} />
        <pre
          className={cn(
            "relative z-[10] inline",
            focus && (!isTyping ? "animate-blinkText" : "text-gray-900"),
          )}
        >
          {input.slice(cursorPosition + 1, cursorPosition + 2)}
        </pre>
        <pre className="inline">{input.slice(cursorPosition + 2)}</pre>
      </div>
    </div>
  );
}

function BlinkingCursor({
  className,
  isTyping,
}: {
  className?: string;
  isTyping: boolean;
}) {
  const [focus] = useAtom(focusAtom);

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
