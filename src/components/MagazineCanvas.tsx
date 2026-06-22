"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, ImageIcon, Trash2, RefreshCw, X, Settings } from "lucide-react";
import HeroHeader from "./HeroHeader";
import TextSection, { TextSectionData } from "./TextSection";
import SectionsManager from "./SectionsManager";
import TypographyControls, { StyleObject } from "./TypographyControls";

export interface MagazineCanvasProps {
  backgroundImage: string | null;
  setBackgroundImage: (img: string | null) => void;
  heroHeader: {
    text: string;
    link?: string;
    style?: StyleObject;
  };
  setHeroHeader: React.Dispatch<
    React.SetStateAction<{
      text: string;
      link?: string;
      style?: StyleObject;
    }>
  >;
  sections: TextSectionData[];
  setSections: React.Dispatch<React.SetStateAction<TextSectionData[]>>;
}

const defaultHeaderStyle: StyleObject = {
  fontFamily: "Didot, 'Didot LT STD', Bodoni, Georgia, serif",
  fontSize: "48px",
  fontWeight: "bold",
  fontStyle: "normal",
  textAlign: "center",
  color: "",
};

// Changed default text alignment from right to left
const defaultTitleStyle: StyleObject = {
  fontFamily: "Didot, 'Didot LT STD', Bodoni, Georgia, serif",
  fontSize: "16px",
  fontWeight: "bold",
  fontStyle: "normal",
  textAlign: "left",
  color: "",
};

// Changed default text alignment from right to left
const defaultBodyStyle: StyleObject = {
  fontFamily: "Arial, sans-serif",
  fontSize: "12px",
  fontWeight: "normal",
  fontStyle: "normal",
  textAlign: "left",
  color: "",
};

export default function MagazineCanvas({
  backgroundImage,
  setBackgroundImage,
  heroHeader,
  setHeroHeader,
  sections,
  setSections,
}: MagazineCanvasProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local UI-only States
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [showHeaderStyle, setShowHeaderStyle] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  
  // Tab within the Section Editor Modal: "content" | "titleStyle" | "bodyStyle"
  const [modalTab, setModalTab] = useState<"content" | "titleStyle" | "bodyStyle">("content");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      loadImage(files[0]);
    }
  };

  const loadImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, WebP, etc.).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setBackgroundImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      loadImage(files[0]);
    }
  };

  const handleCanvasClick = () => {
    if (!backgroundImage) {
      fileInputRef.current?.click();
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBackgroundImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Section manager handlers
  const handleAddSection = () => {
    const newSection: TextSectionData = {
      id: Date.now().toString(),
      title: {
        text: "New Headline",
        style: { ...defaultTitleStyle },
      },
      body: {
        text: "Brief description of the story goes here.",
        style: { ...defaultBodyStyle },
      },
      link: "",
    };
    setSections([...sections, newSection]);
    openSectionEditor(newSection.id);
  };

  const handleUpdateSection = (id: string, updatedFields: Partial<TextSectionData>) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, ...updatedFields } : s)));
  };

  const handleRemoveSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
    if (editingSectionId === id) {
      setEditingSectionId(null);
    }
  };

  const openSectionEditor = (id: string) => {
    setEditingSectionId(id);
    setModalTab("content");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 py-8">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Control panel if image is uploaded */}
      {backgroundImage && (
        <div className="flex items-center gap-3 mb-6 px-4 py-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-full shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Replace Background
          </button>
          <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-800" />
          <button
            onClick={removeImage}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-450 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove Image
          </button>
        </div>
      )}

      {/* Magazine Canvas Container with 8.5x11 aspect ratio */}
      <div className="w-full max-w-[480px] sm:max-w-[520px] md:max-w-[560px] lg:max-w-[600px] xl:max-w-[640px] px-2 flex justify-center">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleCanvasClick}
          style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className={`
            relative w-full aspect-[8.5/11] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)] 
            transition-all duration-500 ease-out overflow-hidden cursor-pointer select-none
            ${!backgroundImage ? "bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900/40 dark:to-zinc-950/40 border-2 border-dashed" : "border border-zinc-200 dark:border-zinc-800"}
            ${isDragging 
              ? "border-indigo-500 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 scale-[1.02] shadow-[0_25px_60px_rgba(99,102,241,0.2)]" 
              : "border-zinc-300 dark:border-zinc-800 hover:scale-[1.01] hover:border-zinc-400 dark:hover:border-zinc-700"}
          `}
        >
          {/* Inner border glow for premium styling */}
          <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />

          {/* Hero Header component overlays on top */}
          <HeroHeader
            value={heroHeader}
            onChange={setHeroHeader}
            isEditingInline={isEditingInline}
            setIsEditingInline={setIsEditingInline}
            hasBackground={!!backgroundImage}
          />

          {/* Left Sidebar Region for Text Sections (starts at top: 50% midpoint, double gap spacer) */}
          <div 
            onClick={(e) => e.stopPropagation()} // Don't trigger background image upload
            className="absolute left-4 sm:left-6 top-[50%] bottom-6 w-[180px] sm:w-[220px] md:w-[260px] flex flex-col justify-start gap-6 sm:gap-8 z-20 overflow-y-auto pointer-events-auto pr-1"
          >
            {sections.map((section) => (
              <TextSection
                key={section.id}
                section={section}
                hasBackground={!!backgroundImage}
                onClick={(e) => {
                  e.stopPropagation();
                  openSectionEditor(section.id);
                }}
              />
            ))}
          </div>

          {/* Canvas content when no image is uploaded */}
          {!backgroundImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center pt-28">
              <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-md border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-500 dark:text-zinc-400 transition-transform group-hover:scale-110">
                <Upload className="w-6 h-6 animate-pulse text-indigo-500 dark:text-indigo-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200">
                Upload Cover Background
              </h3>
              <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                Drag and drop your image here, or <span className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">browse</span> to upload.
              </p>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 dark:text-zinc-500 px-3 py-1 rounded bg-zinc-200/50 dark:bg-zinc-800/50">
                8.5" x 11" Portrait Ratio
              </div>
            </div>
          )}

          {/* Interactive hover overlay when image IS uploaded */}
          {backgroundImage && (
            <div className="absolute inset-0 bg-black/45 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pt-28">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-zinc-900/95 rounded-full shadow-lg text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                <ImageIcon className="w-4 h-4 text-indigo-500" />
                Change Cover Image
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor Panel below the canvas */}
      <div className="w-full max-w-[480px] sm:max-w-[520px] md:max-w-[560px] lg:max-w-[600px] xl:max-w-[640px] mt-8 px-2 space-y-6">
        {/* Card 1: Header Cover Editor */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-md transition-all duration-300">
          <div className="flex items-center gap-2 mb-4 border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              Header Cover Editor
            </h4>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="header-text" className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Headline Text
              </label>
              <input
                id="header-text"
                type="text"
                placeholder="Enter magazine title..."
                value={heroHeader.text}
                onChange={(e) => setHeroHeader({ ...heroHeader, text: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor="header-link" className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Headline Link (Optional)
              </label>
              <input
                id="header-link"
                type="url"
                placeholder="https://example.com"
                value={heroHeader.link || ""}
                onChange={(e) => setHeroHeader({ ...heroHeader, link: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Typography expander button */}
            <button
              onClick={() => setShowHeaderStyle(!showHeaderStyle)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-semibold transition-all mt-2"
            >
              <Settings className="w-3.5 h-3.5" />
              {showHeaderStyle ? "Hide Typography Style" : "Headline Typography Style"}
            </button>

            {/* Typography Editor Panel */}
            {showHeaderStyle && (
              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 animate-in fade-in duration-200">
                <TypographyControls
                  style={heroHeader.style || defaultHeaderStyle}
                  onChange={(newStyle) => setHeroHeader({ ...heroHeader, style: newStyle })}
                />
              </div>
            )}
            
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 italic mt-2">
              Tip: You can also click directly on the canvas title to edit it inline.
            </p>
          </div>
        </div>

        {/* Card 2: Sidebar Sections Manager */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-md transition-all duration-300">
          <SectionsManager
            sections={sections}
            onAddSection={handleAddSection}
            onUpdateSection={handleUpdateSection}
            onRemoveSection={handleRemoveSection}
          />
        </div>
      </div>

      {/* Modal Editor for Text Section */}
      {editingSectionId && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setEditingSectionId(null)}
        >
          <div 
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/60 mb-4">
              <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                Edit Sidebar Section
              </h3>
              <button
                onClick={() => setEditingSectionId(null)}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs: Content vs styles */}
            <div className="flex border-b border-zinc-100 dark:border-zinc-800/60 mb-4 text-[10px] font-bold uppercase tracking-wider">
              <button
                onClick={() => setModalTab("content")}
                className={`flex-1 pb-2 border-b-2 text-center transition-colors ${
                  modalTab === "content"
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-650 dark:hover:text-zinc-350"
                }`}
              >
                Content
              </button>
              <button
                onClick={() => setModalTab("titleStyle")}
                className={`flex-1 pb-2 border-b-2 text-center transition-colors ${
                  modalTab === "titleStyle"
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-650 dark:hover:text-zinc-350"
                }`}
              >
                Title Style
              </button>
              <button
                onClick={() => setModalTab("bodyStyle")}
                className={`flex-1 pb-2 border-b-2 text-center transition-colors ${
                  modalTab === "bodyStyle"
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-zinc-400 dark:text-zinc-500 hover:text-zinc-655 dark:hover:text-zinc-350"
                }`}
              >
                Body Style
              </button>
            </div>

            {/* Modal Body & Tab Contents */}
            {(() => {
              const section = sections.find((s) => s.id === editingSectionId);
              if (!section) return null;
              
              return (
                <div className="space-y-4">
                  {modalTab === "content" && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div>
                        <label htmlFor="modal-section-title" className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                          Section Title
                        </label>
                        <input
                          id="modal-section-title"
                          type="text"
                          placeholder="Section Title (Optional)"
                          value={section.title?.text || ""}
                          onChange={(e) => handleUpdateSection(section.id, { 
                            title: { text: e.target.value, style: section.title?.style } 
                          })}
                          className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>

                      <div>
                        <label htmlFor="modal-section-body" className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                          Body Content
                        </label>
                        <textarea
                          id="modal-section-body"
                          placeholder="Section Body Content (Optional)"
                          value={section.body?.text || ""}
                          onChange={(e) => handleUpdateSection(section.id, { 
                            body: { text: e.target.value, style: section.body?.style } 
                          })}
                          rows={3}
                          className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="modal-section-link" className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                          Link URL (Optional)
                        </label>
                        <input
                          id="modal-section-link"
                          type="url"
                          placeholder="https://example.com/link"
                          value={section.link || ""}
                          onChange={(e) => handleUpdateSection(section.id, { link: e.target.value })}
                          className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-955 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {modalTab === "titleStyle" && (
                    <div className="animate-in fade-in duration-150">
                      <TypographyControls
                        style={section.title?.style || defaultTitleStyle}
                        onChange={(newStyle) => handleUpdateSection(section.id, {
                          title: { text: section.title?.text || "", style: newStyle }
                        })}
                      />
                    </div>
                  )}

                  {modalTab === "bodyStyle" && (
                    <div className="animate-in fade-in duration-150">
                      <TypographyControls
                        style={section.body?.style || defaultBodyStyle}
                        onChange={(newStyle) => handleUpdateSection(section.id, {
                          body: { text: section.body?.text || "", style: newStyle }
                        })}
                      />
                    </div>
                  )}

                  {/* Modal Footer Controls */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 mt-4">
                    <button
                      onClick={() => {
                        handleRemoveSection(section.id);
                        setEditingSectionId(null);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-955/20 dark:hover:bg-rose-955/40 text-rose-600 dark:text-rose-455 text-xs font-bold rounded-xl transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Section
                    </button>
                    <button
                      onClick={() => setEditingSectionId(null)}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      Save & Close
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
