import { useState } from 'react';

const DATE_OF_CREATION = new Date('2024-02-23');

const welcomeMessage = `       /\\         dominik@portfolio
      /  \\        os     Arch Linux
     /\\   \\       host   Your browser
    /      \\      kernel latest
   /   ,,   \\     uptime ${Math.floor(
     (Date.now() - DATE_OF_CREATION.getTime()) / 1000 / 60 / 60 / 24,
   )} days
  /   |  |  -\\    pkgs   all of em
 /_-''    ''-_\\   memory 703M / 15953M`;

const prompt = `dominik@portfolio:~$ `;

export default function Terminal({ className }: { className?: string }) {
  const [focus, setFocus] = useState(false);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<(string | null)[]>([]);
  const [commandHistoryIndex, setCommandHistoryIndex] = useState(0);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    switch (e.key) {
      case 'Enter':
        if (input.trim() === '') setCommandHistory([...commandHistory, null]);
        else setCommandHistory([...commandHistory, input.trim()]);

        setInput('');
        // +1 because we subtract 1 at history browsing immediately
        setCommandHistoryIndex(commandHistory.length);
        break;

      case 'Backspace':
        setInput(input.slice(0, -1));
        break;

      case 'c':
        if (e.ctrlKey) {
          setCommandHistory([...commandHistory, null]);
          setInput('');
          // +1 because we subtract 1 at history browsing immediately
          setCommandHistoryIndex(commandHistory.length);
          return;
        }
        break;

      case 'ArrowUp':
        if (commandHistory.every(c => c === null)) return;

        let newBackIndex = commandHistoryIndex - 1;
        if (newBackIndex < 0) newBackIndex = 0;
        while (newBackIndex >= 0 && commandHistory[newBackIndex] === null) {
          newBackIndex--;
        }

        setCommandHistoryIndex(newBackIndex);
        setInput(commandHistory[newBackIndex]!);
        break;

      case 'ArrowDown':
        if (commandHistory.every(c => c === null)) return;

        let newForwardIndex = commandHistoryIndex + 1;
        if (newForwardIndex > commandHistory.length - 1)
          newForwardIndex = commandHistory.length - 1;
        while (
          newForwardIndex < commandHistory.length - 1 &&
          commandHistory[newForwardIndex] === null
        ) {
          newForwardIndex++;
        }

        setCommandHistoryIndex(newForwardIndex);
        setInput(commandHistory[newForwardIndex]!);
        break;
    }

    if (e.key.length === 1) {
      setInput(input + e.key);
    }
  };

  return (
    <div
      className={`my-32 h-[calc(100vh*2/3)] rounded-xl border-2 border-primary-dark bg-gray-900/80 p-10 shadow-glow duration-700 ease-out animate-in fade-in slide-in-from-bottom ${className}`}>
      <div
        className='h-full space-y-5 overflow-y-scroll scrollbar-hide selection:bg-gray-800 focus:outline-none'
        tabIndex={0}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onKeyDown={handleKeyDown}>
        <pre>{welcomeMessage}</pre>
        <div>
          {commandHistory.map((command, i) => (
            <div key={i} className='flex'>
              <pre>{prompt}</pre>
              {command === '' ? <></> : <pre>{command}</pre>}
            </div>
          ))}

          <div className='flex'>
            <pre>{prompt}</pre>
            <pre>{input}</pre>
            {focus && (
              <span className='animate-blink text-primary-light'>
                &nbsp;&nbsp;
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
