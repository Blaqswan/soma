"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, Check, Eye, Code, Download } from "lucide-react";

interface HtmlExportProps {
  isOpen: boolean;
  onClose: () => void;
  htmlCode: string;
}

export default function HtmlExport({ isOpen, onClose, htmlCode }: HtmlExportProps) {
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  // Load view mode preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("soma_export_view");
    if (savedMode === "preview" || savedMode === "code") {
      setViewMode(savedMode);
    }
  }, []);

  // Update view mode and persist in localStorage
  const handleViewModeChange = (mode: "preview" | "code") => {
    setViewMode(mode);
    localStorage.setItem("soma_export_view", mode);
  };

  // Copy code to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Trigger browser download of generated HTML file
  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "soma-magazine-newsletter.html");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-4xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-150 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              Export Email Newsletter
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Copy inline-styled, client-compatible HTML or preview the final email design.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-350 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Panel toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-3 border-b border-zinc-150 dark:border-zinc-800/80 bg-white dark:bg-zinc-900">
          {/* View Toggles */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-950 border border-zinc-250/60 dark:border-zinc-800/80 rounded-xl p-1 w-fit">
            <button
              onClick={() => handleViewModeChange("preview")}
              className={`
                flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                ${viewMode === "preview"
                  ? "bg-white dark:bg-zinc-800 text-indigo-650 dark:text-indigo-400 shadow-xs"
                  : "text-zinc-450 hover:text-zinc-700 dark:text-zinc-505 dark:hover:text-zinc-350"
                }
              `}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview Layout
            </button>
            <button
              onClick={() => handleViewModeChange("code")}
              className={`
                flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                ${viewMode === "code"
                  ? "bg-white dark:bg-zinc-800 text-indigo-650 dark:text-indigo-400 shadow-xs"
                  : "text-zinc-450 hover:text-zinc-700 dark:text-zinc-505 dark:hover:text-zinc-350"
                }
              `}
            >
              <Code className="w-3.5 h-3.5" />
              HTML Code
            </button>
          </div>

          {/* Action buttons (Copy / Download) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 border border-zinc-200 dark:border-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-750 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Download HTML
            </button>

            <button
              onClick={handleCopy}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]
                ${copied
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }
              `}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied HTML!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy HTML Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 min-h-0 bg-zinc-100 dark:bg-zinc-950 p-6 flex items-center justify-center overflow-hidden">
          {viewMode === "preview" ? (
            /* Layout Preview using Iframe to sandbox CSS */
            <div className="w-full h-full max-w-[620px] bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-md overflow-hidden flex flex-col">
              <iframe
                srcDoc={htmlCode}
                title="Email Template Preview"
                className="w-full flex-1 border-none bg-white"
                sandbox="allow-popups allow-popups-to-escape-sandbox"
              />
            </div>
          ) : (
            /* Raw Code Editor Textarea */
            <div className="w-full h-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-md flex flex-col relative">
              {/* Fake editor chrome window controls */}
              <div className="flex items-center gap-1.5 px-4 py-2 border-b border-zinc-800 bg-zinc-950">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest ml-3 font-semibold font-mono">
                  magazine-newsletter.html
                </span>
              </div>
              <textarea
                value={htmlCode}
                readOnly
                className="w-full flex-1 p-6 bg-zinc-950 text-zinc-300 font-mono text-xs leading-relaxed border-none outline-none resize-none focus:ring-0 overflow-y-auto"
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
