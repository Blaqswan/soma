"use client";

import React from "react";
import { Edit3, ExternalLink } from "lucide-react";
import { StyleObject } from "./TypographyControls";

export interface TextSectionData {
  id: string;
  title?: {
    text: string;
    style?: StyleObject;
  };
  body?: {
    text: string;
    style?: StyleObject;
  };
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
  const titleText = section.title?.text;
  const bodyText = section.body?.text;
  const link = section.link;

  const isEmpty = !titleText && !bodyText;

  // Title Style Resolution
  const titleStyle = section.title?.style || {
    fontFamily: "Didot, 'Didot LT STD', Bodoni, Georgia, serif",
    fontSize: "16px",
    fontWeight: "bold",
    fontStyle: "normal",
    textAlign: "right",
    color: "",
  };

  // Body Style Resolution
  const bodyStyle = section.body?.style || {
    fontFamily: "Arial, sans-serif",
    fontSize: "12px",
    fontWeight: "normal",
    fontStyle: "normal",
    textAlign: "right",
    color: "",
  };

  // Default color fallbacks based on background presence
  const resolvedTitleColor = titleStyle.color || (hasBackground ? "#ffffff" : "");
  const resolvedBodyColor = bodyStyle.color || (hasBackground ? "#e4e4e7" : ""); // zinc-200/90

  const titleCSS: React.CSSProperties = {
    fontFamily: titleStyle.fontFamily,
    fontSize: titleStyle.fontSize,
    fontWeight: titleStyle.fontWeight,
    fontStyle: titleStyle.fontStyle,
    textAlign: titleStyle.textAlign,
    color: resolvedTitleColor || undefined,
  };

  const bodyCSS: React.CSSProperties = {
    fontFamily: bodyStyle.fontFamily,
    fontSize: bodyStyle.fontSize,
    fontWeight: bodyStyle.fontWeight,
    fontStyle: bodyStyle.fontStyle,
    textAlign: bodyStyle.textAlign,
    color: resolvedBodyColor || undefined,
  };

  // Align flex items based on the text alignment (default to right alignment for left sidebar)
  const alignment = titleStyle.textAlign || bodyStyle.textAlign || "right";
  const alignClass =
    alignment === "left"
      ? "items-start text-left"
      : alignment === "center"
      ? "items-center text-center"
      : "items-end text-right";

  return (
    <div
      onClick={onClick}
      className={`
        relative w-full flex flex-col group/section select-none cursor-pointer p-3.5 rounded-xl border border-transparent transition-all duration-300
        ${alignClass}
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
          Style
        </div>
      </div>

      {isEmpty ? (
        <span className="font-serif text-sm tracking-wider text-zinc-400 dark:text-zinc-500 uppercase font-semibold italic">
          [ Empty Section - Click to Edit ]
        </span>
      ) : (
        <>
          {titleText && (
            <h4
              style={titleCSS}
              className={`
                uppercase leading-tight mb-1 break-words w-full transition-all duration-300
                ${hasBackground && !titleStyle.color
                  ? "text-white drop-shadow-[0_1.5px_4px_rgba(0,0,0,0.8)]"
                  : !titleStyle.color ? "text-zinc-900 dark:text-zinc-100" : ""
                }
              `}
            >
              {titleText}
            </h4>
          )}
          {bodyText && (
            <p
              style={bodyCSS}
              className={`
                leading-relaxed break-words w-full transition-all duration-300
                ${hasBackground && !bodyStyle.color
                  ? "text-zinc-200/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
                  : !bodyStyle.color ? "text-zinc-655 dark:text-zinc-400" : ""
                }
              `}
            >
              {bodyText}
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
