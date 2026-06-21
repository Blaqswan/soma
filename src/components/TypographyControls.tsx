"use client";

import React from "react";
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight, Palette } from "lucide-react";

export interface StyleObject {
  fontFamily: string;
  fontSize: string;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  textAlign: "left" | "center" | "right";
  color: string;
}

interface TypographyControlsProps {
  style: StyleObject;
  onChange: (style: StyleObject) => void;
  label?: string;
}

const FONTS = [
  { name: "Didot (Serif)", value: "Didot, 'Didot LT STD', Bodoni, Georgia, serif" },
  { name: "Bodoni (Serif)", value: "'Bodoni MT', Didot, Georgia, serif" },
  { name: "Georgia (Serif)", value: "Georgia, serif" },
  { name: "Helvetica (Sans)", value: "Helvetica, Arial, sans-serif" },
  { name: "Arial (Sans)", value: "Arial, sans-serif" },
];

const FONT_SIZES = [
  "12px", "14px", "16px", "20px", "24px", "28px", "32px", "40px", "48px", "56px", "64px", "72px"
];

const COLOR_PRESETS = [
  { name: "Dark", value: "#000000" },
  { name: "Light", value: "#ffffff" },
  { name: "Gray", value: "#4b5563" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Amber", value: "#d97706" },
  { name: "Emerald", value: "#059669" },
  { name: "Rose", value: "#e11d48" },
];

export default function TypographyControls({
  style,
  onChange,
  label,
}: TypographyControlsProps) {
  const updateStyle = (fields: Partial<StyleObject>) => {
    onChange({ ...style, ...fields });
  };

  return (
    <div className="space-y-4 p-3 bg-zinc-55/50 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl">
      {label && (
        <h5 className="text-[11px] font-bold text-zinc-400 dark:text-zinc-505 uppercase tracking-wider mb-1">
          {label}
        </h5>
      )}

      {/* Font Family & Size Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Font Family */}
        <div>
          <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase mb-1">
            Font Family
          </label>
          <select
            value={style.fontFamily}
            onChange={(e) => updateStyle({ fontFamily: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
          >
            {FONTS.map((font) => (
              <option key={font.value} value={font.value}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase mb-1">
            Font Size
          </label>
          <select
            value={style.fontSize}
            onChange={(e) => updateStyle({ fontSize: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
          >
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alignment, Weight, Style Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Alignment Toggles */}
        <div>
          <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase mb-1">
            Alignment
          </label>
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-lg p-0.5">
            {(["left", "center", "right"] as const).map((align) => {
              const Icon =
                align === "left"
                  ? AlignLeft
                  : align === "center"
                  ? AlignCenter
                  : AlignRight;
              const isActive = style.textAlign === align;
              return (
                <button
                  key={align}
                  onClick={() => updateStyle({ textAlign: align })}
                  title={`Align ${align}`}
                  className={`
                    p-1.5 rounded-md transition-all
                    ${isActive
                      ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                      : "text-zinc-450 hover:text-zinc-700 dark:text-zinc-505 dark:hover:text-zinc-350"
                    }
                  `}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Styling Toggles (Bold/Italic) */}
        <div>
          <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase mb-1">
            Styling
          </label>
          <div className="flex items-center gap-1">
            {/* Bold */}
            <button
              onClick={() =>
                updateStyle({
                  fontWeight: style.fontWeight === "bold" ? "normal" : "bold",
                })
              }
              title="Bold"
              className={`
                p-1.5 border border-zinc-200/50 dark:border-zinc-800/50 rounded-lg transition-all
                ${style.fontWeight === "bold"
                  ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-bold"
                  : "bg-white dark:bg-zinc-950 text-zinc-450 hover:text-zinc-700 dark:text-zinc-505 dark:hover:text-zinc-350"
                }
              `}
            >
              <Bold className="w-3.5 h-3.5" />
            </button>

            {/* Italic */}
            <button
              onClick={() =>
                updateStyle({
                  fontStyle: style.fontStyle === "italic" ? "normal" : "italic",
                })
              }
              title="Italic"
              className={`
                p-1.5 border border-zinc-200/50 dark:border-zinc-800/50 rounded-lg transition-all
                ${style.fontStyle === "italic"
                  ? "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 italic"
                  : "bg-white dark:bg-zinc-950 text-zinc-450 hover:text-zinc-700 dark:text-zinc-505 dark:hover:text-zinc-350"
                }
              `}
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Color Section */}
      <div>
        <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase mb-1.5">
          Text Color
        </label>
        <div className="flex items-center gap-2">
          {/* Swatches */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {COLOR_PRESETS.map((preset) => {
              const isSelected = style.color.toLowerCase() === preset.value.toLowerCase();
              return (
                <button
                  key={preset.value}
                  onClick={() => updateStyle({ color: preset.value })}
                  title={preset.name}
                  className={`
                    w-5.5 h-5.5 rounded-full border transition-all hover:scale-110 relative flex items-center justify-center
                    ${isSelected 
                      ? "border-indigo-600 dark:border-indigo-400 scale-105 shadow-sm" 
                      : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400"
                    }
                  `}
                  style={{ backgroundColor: preset.value }}
                >
                  {isSelected && (
                    <span 
                      className={`
                        w-1.5 h-1.5 rounded-full 
                        ${preset.value === "#ffffff" ? "bg-black" : "bg-white"}
                      `}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="w-[1px] h-6 bg-zinc-200 dark:bg-zinc-800 mx-0.5" />

          {/* Native Color Picker Trigger */}
          <div className="relative w-7 h-7 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 transition-colors flex items-center justify-center group/picker cursor-pointer overflow-hidden">
            <Palette className="w-3.5 h-3.5 text-zinc-500 group-hover/picker:text-indigo-500 transition-colors pointer-events-none" />
            <input
              type="color"
              value={style.color}
              onChange={(e) => updateStyle({ color: e.target.value })}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Custom Color"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
