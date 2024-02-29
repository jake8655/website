import { useEffect, useMemo, useRef, useState } from 'react';

const prompt = `<span class="text-rose-300 font-semibold">dominik</span>@<span class="text-rose-300 font-semibold">portfolio</span>:~$ `;

type Command =
  | {
      text: string;
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
    () => commandHistory.filter(c => c !== null && !c.ctrlc),
    [commandHistory],
  );
  const [commandHistoryIndex, setCommandHistoryIndex] = useState(0);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    switch (true) {
      case e.key === 'Enter' || (e.key === 'm' && e.ctrlKey):
        if (input.trim() === '') setCommandHistory([...commandHistory, null]);
        else {
          commandHistory.push({ text: input.trim() });
          setCommandHistory([...commandHistory]);
        }

        setInput('');

        const newFiltered = commandHistory.filter(c => c !== null && !c.ctrlc);
        // +1 because we subtract 1 at history browsing immediately
        setCommandHistoryIndex(newFiltered.length);
        return;

      case e.key === 'Backspace' || (e.key === 'h' && e.ctrlKey):
        setInput(input.slice(0, -1));
        return;

      case e.key === 'c' && e.ctrlKey:
        commandHistory.push({ text: `${input.trim()}^C`, ctrlc: true });
        setCommandHistory([...commandHistory]);
        setInput('');

        // +1 because we subtract 1 at history browsing immediately
        const newFilteredCommands = commandHistory.filter(
          c => c !== null && !c.ctrlc,
        );
        setCommandHistoryIndex(newFilteredCommands.length);
        return;

      case e.key === 'ArrowUp':
        const newBackIndex = commandHistoryIndex - 1;
        if (newBackIndex < 0) {
          return;
        }

        setCommandHistoryIndex(newBackIndex);
        setInput(filteredCommandHistory[newBackIndex]!.text);
        break;

      case e.key === 'ArrowDown':
        const newForwardIndex = commandHistoryIndex + 1;
        if (newForwardIndex >= filteredCommandHistory.length) {
          return;
        }

        setCommandHistoryIndex(newForwardIndex);
        setInput(filteredCommandHistory[newForwardIndex]!.text);
        break;
    }

    if (e.key.length === 1) {
      setInput(input + e.key);
    }
  };
  return (
    <div
      className='h-full space-y-5 overflow-y-scroll scrollbar-hide selection:bg-gray-800 focus:outline-none'
      tabIndex={0}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onKeyDown={handleKeyDown}>
      <pre dangerouslySetInnerHTML={{ __html: welcomeMessage }}></pre>
      <TerminalCommands commands={commandHistory} focus={focus} input={input} />
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
}: {
  commands: Command[];
  focus: boolean;
  input: string;
}) {
  return (
    <div className='space-y-1'>
      {commands.map((command, i) => (
        <div key={i} className='flex'>
          <pre dangerouslySetInnerHTML={{ __html: prompt }}></pre>
          {command !== null ? <pre>{command.text}</pre> : null}
        </div>
      ))}

      <div className='flex'>
        <pre dangerouslySetInnerHTML={{ __html: prompt }}></pre>
        <pre>{input}</pre>
        <BlinkingCursor focus={focus} />
      </div>
    </div>
  );
}

function BlinkingCursor({ focus }: { focus: boolean }) {
  if (focus)
    return (
      <span className='animate-blink text-primary-light'>&nbsp;&nbsp;</span>
    );

  return null;
}
