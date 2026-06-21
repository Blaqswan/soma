"use client";

import React from "react";
import { Edit3, ExternalLink } from "lucide-react";

export interface TextSectionData {
  id: string;
  title?: string;
  body?: string;
  link?: string;
}

interface TextSectionProps {
  section: TextSectionData;
  onClick: (e: React.MouseEvent) => void;
  hasBackground: boolean;
}

export default function TextSection({
  section,
  onClick,
  hasBackground,
}: TextSectionProps) {
  const { title, body, link } = section;

  // Placeholder when both title and body are empty
  const isEmpty = !title && !body;

  return (
    <div
      onClick={onClick}
      className={`
        relative w-full flex flex-col items-end text-right group/section select-none cursor-pointer p-3.5 rounded-xl border border-transparent transition-all duration-300
        ${hasBackground
          ? "hover:bg-black/20 hover:border-white/10"
          : "hover:bg-zinc-100/70 dark:hover:bg-zinc-800/40 hover:border-zinc-200/50 dark:hover:border-zinc-800/50"
        }
      `}
    >
      {/* Edit icon overlay shown on hover */}
      <div className="absolute top-2 left-2 opacity-0 group-hover/section:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
        <div className={`
          flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md
          ${hasBackground
            ? "bg-zinc-900/80 text-white border border-white/10"
            : "bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800"
          }
        `}>
          <Edit3 className="w-2.5 h-2.5" />
          Edit
        </div>
      </div>

      {isEmpty ? (
        <span className="font-serif text-sm tracking-wider text-zinc-400 dark:text-zinc-500 uppercase font-semibold italic">
          [ Empty Section - Click to Edit ]
        </span>
      ) : (
        <>
          {title && (
            <h4
              className={`
                font-serif text-base md:text-lg font-bold tracking-wide uppercase leading-tight mb-1 break-words w-full
                ${hasBackground
                  ? "text-white drop-shadow-[0_1.5px_4px_rgba(0,0,0,0.8)]"
                  : "text-zinc-900 dark:text-zinc-100"
                }
              `}
            >
              {title}
            </h4>
          )}
          {body && (
            <p
              className={`
                font-sans text-xs md:text-sm font-normal leading-relaxed break-words w-full
                ${hasBackground
                  ? "text-zinc-100/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
                  : "text-zinc-600 dark:text-zinc-400"
                }
              `}
            >
              {body}
            </p>
          )}
          {link && (
            <div className={`
              flex items-center gap-1 mt-1.5 text-[10px] font-semibold uppercase tracking-wider
              ${hasBackground
                ? "text-zinc-200 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]"
                : "text-indigo-600 dark:text-indigo-400 hover:underline"
              }
            `}>
              <span>More Info</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
