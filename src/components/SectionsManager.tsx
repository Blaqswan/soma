"use client";

import React, { useState } from "react";
import { Plus, Trash2, Link2, Type, AlignLeft, HelpCircle, Settings } from "lucide-react";
import { TextSectionData } from "./TextSection";
import TypographyControls, { StyleObject } from "./TypographyControls";

interface SectionsManagerProps {
  sections: TextSectionData[];
  onAddSection: () => void;
  onUpdateSection: (id: string, updatedFields: Partial<TextSectionData>) => void;
  onRemoveSection: (id: string) => void;
}

const defaultTitleStyle: StyleObject = {
  fontFamily: "Didot, 'Didot LT STD', Bodoni, Georgia, serif",
  fontSize: "16px",
  fontWeight: "bold",
  fontStyle: "normal",
  textAlign: "right",
  color: "",
};

const defaultBodyStyle: StyleObject = {
  fontFamily: "Arial, sans-serif",
  fontSize: "12px",
  fontWeight: "normal",
  fontStyle: "normal",
  textAlign: "right",
  color: "",
};

export default function SectionsManager({
  sections,
  onAddSection,
  onUpdateSection,
  onRemoveSection,
}: SectionsManagerProps) {
  // Track collapsible typography panel per section: null | "title" | "body"
  const [activeStylePanel, setActiveStylePanel] = useState<Record<string, "title" | "body" | null>>({});

  const toggleStylePanel = (sectionId: string, type: "title" | "body") => {
    setActiveStylePanel((prev) => {
      const current = prev[sectionId];
      return {
        ...prev,
        [sectionId]: current === type ? null : type,
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-850">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            Sidebar Sections ({sections.length})
          </h4>
        </div>
        <button
          onClick={onAddSection}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Section
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-dashed border-zinc-200 dark:border-zinc-800/80">
          <HelpCircle className="w-8 h-8 text-zinc-400 dark:text-zinc-650 mb-2" />
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            No sections yet
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-505 max-w-[240px]">
            Add text sections to display custom highlights or articles in the left sidebar.
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
          {sections.map((section, index) => {
            const currentPanel = activeStylePanel[section.id] || null;

            return (
              <div
                key={section.id}
                className="p-4 bg-zinc-50 dark:bg-zinc-950/30 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl space-y-3 relative group shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200"
              >
                {/* Card Header & Delete Button */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider">
                    Section #{index + 1}
                  </span>
                  <button
                    onClick={() => onRemoveSection(section.id)}
                    title="Delete Section"
                    className="p-1.5 text-zinc-400 hover:text-rose-600 dark:text-zinc-550 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Input Fields & Typography Toggles */}
                <div className="space-y-3">
                  {/* Title Input & Styling Button */}
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <div className="absolute left-3 top-[11px] text-zinc-400 pointer-events-none">
                        <Type className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        placeholder="Section Title (Optional)"
                        value={section.title?.text || ""}
                        onChange={(e) =>
                          onUpdateSection(section.id, {
                            title: {
                              text: e.target.value,
                              style: section.title?.style,
                            },
                          })
                        }
                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <button
                      onClick={() => toggleStylePanel(section.id, "title")}
                      title="Title Typography Controls"
                      className={`
                        p-2 rounded-lg border transition-all flex items-center justify-center
                        ${currentPanel === "title"
                          ? "bg-indigo-55 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60 text-indigo-650 dark:text-indigo-400"
                          : "bg-white dark:bg-zinc-955 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        }
                      `}
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Body Input & Styling Button */}
                  <div className="flex gap-2 items-start">
                    <div className="relative flex-1">
                      <div className="absolute left-3 top-2.5 text-zinc-400 pointer-events-none">
                        <AlignLeft className="w-3.5 h-3.5" />
                      </div>
                      <textarea
                        placeholder="Section Body Content (Optional)"
                        value={section.body?.text || ""}
                        onChange={(e) =>
                          onUpdateSection(section.id, {
                            body: {
                              text: e.target.value,
                              style: section.body?.style,
                            },
                          })
                        }
                        rows={2}
                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                      />
                    </div>
                    <button
                      onClick={() => toggleStylePanel(section.id, "body")}
                      title="Body Typography Controls"
                      className={`
                        p-2 rounded-lg border transition-all flex items-center justify-center mt-0.5
                        ${currentPanel === "body"
                          ? "bg-indigo-55 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60 text-indigo-650 dark:text-indigo-400"
                          : "bg-white dark:bg-zinc-955 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        }
                      `}
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Link URL */}
                  <div className="relative">
                    <div className="absolute left-3 top-[11px] text-zinc-400 pointer-events-none">
                      <Link2 className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="url"
                      placeholder="https://example.com/link (Optional)"
                      value={section.link || ""}
                      onChange={(e) =>
                        onUpdateSection(section.id, { link: e.target.value })
                      }
                      className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Collapsible Typography Controls Panel */}
                {currentPanel && (
                  <div className="pt-2 mt-2 border-t border-zinc-150 dark:border-zinc-850 animate-in fade-in duration-200">
                    <TypographyControls
                      label={`${currentPanel === "title" ? "Title" : "Body"} Typography`}
                      style={
                        currentPanel === "title"
                          ? section.title?.style || defaultTitleStyle
                          : section.body?.style || defaultBodyStyle
                      }
                      onChange={(newStyle) => {
                        if (currentPanel === "title") {
                          onUpdateSection(section.id, {
                            title: {
                              text: section.title?.text || "",
                              style: newStyle,
                            },
                          });
                        } else {
                          onUpdateSection(section.id, {
                            body: {
                              text: section.body?.text || "",
                              style: newStyle,
                            },
                          });
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
