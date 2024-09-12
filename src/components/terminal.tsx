import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const PROMPT = `<span class="text-rose-300 font-semibold">dominik</span>@<span class="text-rose-300 font-semibold">website</span>:~$ `;

// const FILE_SYSTEM = {
//   home: {
//     dominik: {
//       projects: {
//         portfolio: {
//           "README.md": "This is my portfolio",
//         },
//       },
//     },
//   },
// };
//
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
  date,
}: {
  className?: string;
  date: Date;
}) {
  const uptimeDays = getUptimeDaysFrom(date);
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
      className={`before:content-["] relative my-32 h-[calc(100vh*2/3)] rounded-xl border-2 border-brand-dark bg-gray-900/95 p-10 shadow-glow duration-700 ease-out animate-in fade-in slide-in-from-bottom before:absolute before:inset-0 before:-z-[1] before:bg-[url(/wallpaper.gif)] hover:border-violet-400 ${className}`}>
      <Shell neofetch={neofetch} />
    </div>
  );
}

function Shell({ neofetch }: { neofetch: string }) {
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

  const commands: Record<
    "catchAll" | (string & NonNullable<unknown>),
    { output: (args: string) => string }
  > = {
    hello: {
      output() {
        return "Hello, World!";
      },
    },
    neofetch: {
      output() {
        return neofetch;
      },
    },
    catchAll: {
      output(args) {
        const command = args.split(" ")[0];
        return `Command not found: ${command}`;
      },
    },
      output(cmd: string) {
      },
    },
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsTyping(true);

    switch (true) {
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
            const command = commands[input.trim()] ?? commands.catchAll;
            commandHistory.push({
              text: input.trim(),
              output: command.output(input.trim()),
              dangerouslyColored: input.trim() === "neofetch",
            });
            setCommandHistory([...commandHistory]);
          }
        }

        setInput("");
        setCursorPosition(-1);

        const newFiltered = commandHistory.filter(c => c && !c.ctrlc);
        // +1 because we subtract 1 at history browsing immediately
        setCommandHistoryIndex(newFiltered.length);

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
      className="h-full space-y-5 overflow-y-scroll scrollbar-hide selection:bg-gray-800 focus:outline-none"
      tabIndex={0}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onKeyDown={handleKeyDown}>
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
          }`}>
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
        className={`inline ${
          isTyping ? "bg-current" : "animate-blink"
        } ${className}`}>
        &nbsp;
      </span>
    );

  return null;
}
