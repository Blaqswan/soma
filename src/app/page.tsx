"use client";

import React, { useState, useEffect } from "react";
import MagazineCanvas from "@/components/MagazineCanvas";
import { TextSectionData } from "@/components/TextSection";
import { StyleObject } from "@/components/TypographyControls";
import HtmlExport from "@/components/HtmlExport";
import SaveLoadPanel from "@/components/SaveLoadPanel";
import { generateHtml } from "@/lib/htmlGenerator";
import { autoSaveDraft, updateDesign, DesignState, SavedDesign } from "@/lib/storageManager";
import { FileCode, Save, Sparkles, FolderOpen } from "lucide-react";

export default function Home() {
  // LIFTED STATES from MagazineCanvas
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const [heroHeader, setHeroHeader] = useState<{
    text: string;
    link?: string;
    style?: StyleObject;
  }>({
    text: "SOMA",
    style: {
      fontFamily: "Didot, 'Didot LT STD', Bodoni, Georgia, serif",
      fontSize: "48px",
      fontWeight: "bold",
      fontStyle: "normal",
      textAlign: "center",
      color: "",
    },
  });

  const [sections, setSections] = useState<TextSectionData[]>([
    {
      id: "1",
      title: {
        text: "Inside This Issue",
        style: {
          fontFamily: "Didot, 'Didot LT STD', Bodoni, Georgia, serif",
          fontSize: "16px",
          fontWeight: "bold",
          fontStyle: "normal",
          textAlign: "right",
          color: "",
        },
      },
      body: {
        text: "Discover the latest trends in digital design and architecture.",
        style: {
          fontFamily: "Arial, sans-serif",
          fontSize: "12px",
          fontWeight: "normal",
          fontStyle: "normal",
          textAlign: "right",
          color: "",
        },
      },
      link: "https://example.com/trends",
    },
    {
      id: "2",
      title: {
        text: "Special Feature",
        style: {
          fontFamily: "Didot, 'Didot LT STD', Bodoni, Georgia, serif",
          fontSize: "16px",
          fontWeight: "bold",
          fontStyle: "normal",
          textAlign: "right",
          color: "",
        },
      },
      body: {
        text: "An exclusive interview with the pioneers of minimal typography.",
        style: {
          fontFamily: "Arial, sans-serif",
          fontSize: "12px",
          fontWeight: "normal",
          fontStyle: "normal",
          textAlign: "right",
          color: "",
        },
      },
      link: "https://example.com/interview",
    },
  ]);

  // Export Dialog States
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [htmlCode, setHtmlCode] = useState("");

  // Save/Load States
  const [activeDesignId, setActiveDesignId] = useState<string | null>(null);
  const [designName, setDesignName] = useState("Untitled Design");
  const [isSaveLoadOpen, setIsSaveLoadOpen] = useState(false);
  const [lastSavedText, setLastSavedText] = useState("");

  // Auto-save logic (runs every 30 seconds if page is dirty)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentState: DesignState = {
        backgroundImage,
        heroHeader,
        sections,
      };

      if (activeDesignId && activeDesignId !== "autosave") {
        // Auto-save to currently loaded slot
        const updated = updateDesign(activeDesignId, currentState);
        if (updated) {
          const time = new Date().toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          setLastSavedText(`Auto-saved at ${time}`);
        }
      } else {
        // New workspace draft: Auto-save to special "Auto-saved Draft" slot
        const drafted = autoSaveDraft(currentState);
        if (drafted) {
          const time = new Date().toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          setLastSavedText(`Draft auto-saved at ${time}`);
        }
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [backgroundImage, heroHeader, sections, activeDesignId]);

  const handleExport = () => {
    const generated = generateHtml({ heroHeader, sections, backgroundImage });
    setHtmlCode(generated);
    setIsExportOpen(true);
  };

  const handleDesignLoaded = (id: string, name: string, state: DesignState) => {
    setActiveDesignId(id);
    setDesignName(name);
    setBackgroundImage(state.backgroundImage);
    setHeroHeader(state.heroHeader);
    setSections(state.sections);

    const time = new Date().toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLastSavedText(`Loaded at ${time}`);
  };

  const handleDesignSaved = (id: string, name: string) => {
    if (id === "") {
      setActiveDesignId(null);
      setDesignName("Untitled Design");
    } else {
      setActiveDesignId(id);
      setDesignName(name);
    }

    const time = new Date().toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLastSavedText(`Saved at ${time}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-955 text-zinc-900 dark:text-zinc-50 selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black tracking-tighter text-lg">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              SOMA
              {activeDesignId && (
                <>
                  <span className="text-zinc-300 dark:text-zinc-700 font-normal select-none">&bull;</span>
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 capitalize max-w-[120px] sm:max-w-[200px] truncate" title={designName}>
                    {designName}
                  </span>
                </>
              )}
            </h1>
            <p className="text-xs text-zinc-505 dark:text-zinc-400">Newsletter Designer</p>
          </div>
        </div>

        {/* Toolbar controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Indicators */}
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
              Component 1
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
              Active
            </span>
          </div>
          
          {/* Editor Action Buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSaveLoadOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-zinc-200 dark:border-zinc-800/60 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-650 hover:text-zinc-850 dark:text-zinc-350 dark:hover:text-zinc-150 rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all"
            >
              <FolderOpen className="w-3.5 h-3.5 text-indigo-500" />
              Save & Load
            </button>
            <button 
              onClick={() => alert("Publish Cover feature is coming soon!")}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-zinc-200 dark:border-zinc-800/60 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-650 hover:text-zinc-850 dark:text-zinc-350 dark:hover:text-zinc-150 rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Publish
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileCode className="w-3.5 h-3.5" />
              Export HTML
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12">
        {/* Left Info Panel */}
        <div className="w-full lg:w-5/12 flex flex-col gap-6 text-center lg:text-left">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-55 dark:to-zinc-400 bg-clip-text text-transparent">
              Magazine Canvas
            </h2>
            <p className="text-lg text-zinc-650 dark:text-zinc-400 max-w-lg mx-auto lg:mx-0">
              A premium, high-fidelity canvas component optimized for designing print-quality covers.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-6 shadow-sm space-y-4 text-left">
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
              Canvas Specifications
            </h3>
            <ul className="space-y-3 text-sm text-zinc-650 dark:text-zinc-400">
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Aspect Ratio: <strong>8.5" × 11"</strong> (Letter Portrait)</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Drag & Drop background image loading</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Fully responsive and device-adapted design</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Clean, empty-state UI helper</span>
              </li>
            </ul>
          </div>

          <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
            Click on the canvas on the right to select a local cover photo or drag-and-drop a file directly.
          </div>
        </div>

        {/* Right Canvas Panel */}
        <div className="w-full lg:w-7/12 flex items-center justify-center">
          <MagazineCanvas
            backgroundImage={backgroundImage}
            setBackgroundImage={setBackgroundImage}
            heroHeader={heroHeader}
            setHeroHeader={setHeroHeader}
            sections={sections}
            setSections={setSections}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-zinc-400 dark:text-zinc-550 border-t border-zinc-200/50 dark:border-zinc-800/50 mt-auto">
        SOMA Editor • Powered by Next.js & Tailwind CSS
      </footer>

      {/* Export Dialog overlay */}
      <HtmlExport
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        htmlCode={htmlCode}
      />

      {/* Save/Load Dialog overlay */}
      <SaveLoadPanel
        isOpen={isSaveLoadOpen}
        onClose={() => setIsSaveLoadOpen(false)}
        currentState={{ backgroundImage, heroHeader, sections }}
        activeDesignId={activeDesignId}
        designName={designName}
        onDesignLoaded={handleDesignLoaded}
        onDesignSaved={handleDesignSaved}
        lastSavedText={lastSavedText}
      />
    </div>
  );
}
