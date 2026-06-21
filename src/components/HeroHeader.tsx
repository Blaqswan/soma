"use client";

import React, { useEffect, useRef } from "react";
import { StyleObject } from "./TypographyControls";

interface HeroHeaderProps {
  value: {
    text: string;
    link?: string;
    style?: StyleObject;
  };
  onChange: (value: { text: string; link?: string; style?: StyleObject }) => void;
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

  // Default header style fallbacks
  const style = value.style || {
    fontFamily: "Didot, 'Didot LT STD', Bodoni, Georgia, serif",
    fontSize: "32px",
    fontWeight: "bold",
    fontStyle: "normal",
    textAlign: "center",
    color: "",
  };

  // If a custom color is not set, fallback to high-contrast white on background, or theme default
  const resolvedColor = style.color || (hasBackground ? "#ffffff" : "");

  const inlineStyles: React.CSSProperties = {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    textAlign: style.textAlign,
    color: resolvedColor || undefined,
  };

  // Map text alignment to flex justification for centering/aligning inline layouts
  const justifyClass =
    style.textAlign === "left"
      ? "justify-start text-left"
      : style.textAlign === "right"
      ? "justify-end text-right"
      : "justify-center text-center";

  return (
    <div
      onClick={(e) => {
        e.stopPropagation(); // Avoid triggering cover background upload click
        setIsEditingInline(true);
      }}
      className={`
        absolute top-8 left-0 right-0 w-full min-h-[90px] flex items-center px-6 z-20 group transition-all duration-300 cursor-text
        ${justifyClass}
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
          style={inlineStyles}
          className="w-full bg-transparent border-none outline-none focus:ring-0 uppercase p-2 tracking-widest"
        />
      ) : (
        <div className={`w-full py-2 ${justifyClass} flex`}>
          {value.text ? (
            <div className="relative group/title inline-block max-w-full">
              {value.link ? (
                <a
                  href={value.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={inlineStyles}
                  className={`
                    uppercase break-words block hover:underline transition-all duration-300 tracking-widest
                    ${hasBackground && !style.color
                      ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" 
                      : !style.color ? "text-zinc-950 dark:text-white" : ""
                    }
                  `}
                >
                  {value.text}
                </a>
              ) : (
                <h2
                  style={inlineStyles}
                  className={`
                    uppercase break-words transition-all duration-300 tracking-widest
                    ${hasBackground && !style.color
                      ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" 
                      : !style.color ? "text-zinc-950 dark:text-white" : ""
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
