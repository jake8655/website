import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const PROMPT = `<span class="text-rose-300 font-semibold">dominik</span>@<span class="text-rose-300 font-semibold">portfolio</span>:~$ `;

const COMMANDS: Record<
  'catchAll' | (string & NonNullable<unknown>),
  { output: (cmd: string) => string }
> = {
  hello: {
    output() {
      return 'Hello, World!';
    },
  },
  catchAll: {
    output(cmd: string) {
      return `Command not found: ${cmd}`;
    },
  },
};

type Command =
  | {
      text: string;
      output: string;
      ctrlc?: false;
    }
  | { text: string; ctrlc: true }
  | null;

export default function Terminal({
  className,
  date,
}: {
  className?: string;
  date: Date;
}) {
  const welcomeMessage = `       <span class="text-emerald-300">/\\</span>         <span class="text-rose-300 font-semibold">dominik</span>@<span class="text-rose-300 font-semibold">portfolio</span>
      <span class="text-emerald-300">/  \\</span>        <span class="text-blue-500 font-semibold">os</span>     Arch Linux
     <span class="text-emerald-300">/\\   \\</span>       <span class="text-blue-500 font-semibold">host</span>   Your browser
    <span class="text-blue-500">/      \\      <span class="font-semibold">kernel</span></span> latest
   <span class="text-blue-500">/   ,,   \\     <span class="font-semibold">uptime</span></span> ${
     Math.floor((Date.now() - date.getTime()) / 1000 / 60 / 60 / 24) || 1
   } day(s)
  <span class="text-blue-500">/   |  |  -\\    <span class="font-semibold">pkgs</span></span>   all of em
 <span class="text-blue-500">/_-''    ''-_\\   <span class="font-semibold">memory</span></span> 703M / 15953M`;

  return (
    <div
      className={`my-32 h-[calc(100vh*2/3)] rounded-xl border-2 border-primary-dark bg-gray-900/80 p-10 shadow-glow duration-700 ease-out animate-in fade-in slide-in-from-bottom ${className}`}>
      <Shell welcomeMessage={welcomeMessage} />
    </div>
  );
}

function Shell({ welcomeMessage }: { welcomeMessage: string }) {
  const [focus, setFocus] = useState(false);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<Command[]>([]);
  const filteredCommandHistory = useMemo(
    () => commandHistory.filter(c => c && !c.ctrlc),
    [commandHistory],
  );
  const [commandHistoryIndex, setCommandHistoryIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const debouncedSetIsTyping = useDebouncedCallback(() => {
    setIsTyping(false);
  }, 200);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsTyping(true);

    switch (true) {
      case e.key === 'Enter' || (e.key === 'm' && e.ctrlKey):
        if (input.trim() === '') setCommandHistory([...commandHistory, null]);
        else {
          const command = COMMANDS[input.trim()] ?? COMMANDS.catchAll;
          commandHistory.push({
            text: input.trim(),
            output: command.output(input.trim()),
          });
          setCommandHistory([...commandHistory]);
        }

        setInput('');
        setCursorPosition(-1);

        const newFiltered = commandHistory.filter(c => c && !c.ctrlc);
        // +1 because we subtract 1 at history browsing immediately
        setCommandHistoryIndex(newFiltered.length);

        return debouncedSetIsTyping();

      case e.key === 'Backspace' || (e.key === 'h' && e.ctrlKey):
        if (cursorPosition === -1) return debouncedSetIsTyping();
        setInput(
          input.slice(0, cursorPosition) + input.slice(cursorPosition + 1),
        );
        setCursorPosition(cursorPosition - 1);

        return debouncedSetIsTyping();

      case e.key === 'c' && e.ctrlKey:
        commandHistory.push({ text: `${input.trim()}^C`, ctrlc: true });
        setCommandHistory([...commandHistory]);
        setInput('');
        setCursorPosition(-1);

        // +1 because we subtract 1 at history browsing immediately
        const newFilteredCommands = commandHistory.filter(c => c && !c.ctrlc);
        setCommandHistoryIndex(newFilteredCommands.length);

        return debouncedSetIsTyping();

      case e.key === 'ArrowUp':
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

      case e.key === 'ArrowDown':
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

      case e.key === 'ArrowLeft':
        if (cursorPosition > -1) {
          setCursorPosition(cursorPosition - 1);
        }
        break;

      case e.key === 'ArrowRight':
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

    debouncedSetIsTyping();
  };

  return (
    <div
      className='h-full space-y-5 overflow-y-scroll scrollbar-hide selection:bg-gray-800 focus:outline-none'
      tabIndex={0}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onKeyDown={handleKeyDown}>
      <pre dangerouslySetInnerHTML={{ __html: welcomeMessage }}></pre>
      <TerminalCommands
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

function TerminalCommands({
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
    <div className='space-y-1'>
      {commands.map((command, i) => (
        <React.Fragment key={i}>
          <div className='flex'>
            <pre dangerouslySetInnerHTML={{ __html: PROMPT }}></pre>
            {command ? <pre>{command.text}</pre> : null}
          </div>
          {command && !command?.ctrlc ? <pre>{command.output}</pre> : null}
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
    <div className='flex'>
      <pre dangerouslySetInnerHTML={{ __html: PROMPT }}></pre>
      <div className='relative'>
        <pre className='inline'>{input.slice(0, cursorPosition + 1)}</pre>
        <BlinkingCursor
          focus={focus}
          className='absolute'
          isTyping={isTyping}
        />
        <pre
          className={`relative z-[10] inline ${focus && !isTyping ? 'animate-blinkText' : focus && isTyping ? 'text-gray-900' : ''}`}>
          {input.slice(cursorPosition + 1, cursorPosition + 2)}
        </pre>
        <pre className='inline'>{input.slice(cursorPosition + 2)}</pre>
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
        className={`inline ${isTyping ? 'bg-current' : 'animate-blink'} ${className}`}>
        &nbsp;&nbsp;
      </span>
    );

  return null;
}
