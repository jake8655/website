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
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [commandHistoryIndex, setCommandHistoryIndex] = useState<number>(0);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    switch (e.key) {
      case 'Enter':
        setInput('');
        setCommandHistory([...commandHistory, input.trim()]);
        setCommandHistoryIndex(commandHistory.length + 1);
        break;

      case 'Backspace':
        setInput(input.slice(0, -1));
        break;

      case 'c':
        if (e.ctrlKey) {
          setInput('');
          setCommandHistory([...commandHistory, '']);
          setCommandHistoryIndex(commandHistory.length + 1);
          return;
        }
        break;

      case 'ArrowUp':
        console.log(commandHistory, commandHistoryIndex);

        if (commandHistory.every(c => c === '')) return;

        if (commandHistoryIndex > 0) {
          let i: number;
          for (i = commandHistoryIndex; commandHistory[i] === ''; i--) {
            if (i === 1) {
              break;
            }
          }

          setCommandHistoryIndex(i - 1);
          setInput(commandHistory[i - 1]!);
        }
        break;

      case 'ArrowDown':
        console.log(commandHistory, commandHistoryIndex);

        if (commandHistory.every(c => c === '')) return;

        if (commandHistoryIndex < commandHistory.length - 1) {
          let i: number;
          for (i = commandHistoryIndex; commandHistory[i] === ''; i++) {
            if (i === commandHistory.length - 1) {
              break;
            }
          }

          setCommandHistoryIndex(i + 1);
          setInput(commandHistory[i + 1]!);
        }
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
