"use client";

import React, { useEffect, useRef } from "react";

interface HeroHeaderProps {
  value: {
    text: string;
    link?: string;
  };
  onChange: (value: { text: string; link?: string }) => void;
  isEditingInline: boolean;
  setIsEditingInline: (editing: boolean) => void;
  hasBackground: boolean;
}

export default function HeroHeader({
  value,
  onChange,
  isEditingInline,
  setIsEditingInline,
  hasBackground,
}: HeroHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingInline && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingInline]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, text: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditingInline(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation(); // Avoid triggering cover background upload click
        setIsEditingInline(true);
      }}
      className={`
        absolute top-8 left-0 right-0 w-full min-h-[90px] flex items-center justify-center px-6 z-20 group transition-all duration-300 cursor-text
        ${!value.text && !isEditingInline 
          ? "border-2 border-dashed border-zinc-300 dark:border-zinc-700/60 hover:border-indigo-500/70 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/10" 
          : "hover:bg-black/5 dark:hover:bg-white/5 rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
        }
        ${isEditingInline ? "bg-zinc-100/85 dark:bg-zinc-900/85 backdrop-blur-sm rounded-xl border border-indigo-500/50 shadow-md" : ""}
      `}
    >
      {isEditingInline ? (
        <input
          ref={inputRef}
          type="text"
          value={value.text}
          onChange={handleTextChange}
          onBlur={() => setIsEditingInline(false)}
          onKeyDown={handleKeyDown}
          placeholder="Add Magazine Title"
          className="w-full text-center bg-transparent border-none outline-none font-serif text-3xl font-extrabold tracking-widest focus:ring-0 uppercase p-2 text-zinc-900 dark:text-zinc-100"
        />
      ) : (
        <div className="w-full text-center py-2">
          {value.text ? (
            <div className="relative group/title inline-block max-w-full">
              {value.link ? (
                <a
                  href={value.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`
                    font-serif text-3xl md:text-4xl font-extrabold tracking-widest uppercase break-words block hover:underline transition-all duration-300
                    ${hasBackground 
                      ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" 
                      : "text-zinc-950 dark:text-white"
                    }
                  `}
                >
                  {value.text}
                </a>
              ) : (
                <h2
                  className={`
                    font-serif text-3xl md:text-4xl font-extrabold tracking-widest uppercase break-words transition-all duration-300
                    ${hasBackground 
                      ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" 
                      : "text-zinc-950 dark:text-white"
                    }
                  `}
                >
                  {value.text}
                </h2>
              )}
            </div>
          ) : (
            <span className="font-serif text-sm tracking-wider text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors uppercase font-semibold">
              Add Magazine Title
            </span>
          )}
        </div>
      )}
    </div>
  );
}
