"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, ImageIcon, Trash2, RefreshCw } from "lucide-react";
import HeroHeader from "./HeroHeader";

export default function MagazineCanvas() {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Component 2 State: Hero Header
  const [heroHeader, setHeroHeader] = useState<{ text: string; link?: string }>({
    text: "",
  });
  const [isEditingInline, setIsEditingInline] = useState(false);

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
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
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
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pt-28">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-zinc-900/95 rounded-full shadow-lg text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                <ImageIcon className="w-4 h-4 text-indigo-500" />
                Change Cover Image
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor Panel below the canvas */}
      <div className="w-full max-w-[480px] sm:max-w-[520px] md:max-w-[560px] lg:max-w-[600px] xl:max-w-[640px] mt-8 px-2">
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
            
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 italic">
              Tip: You can also click directly on the canvas title to edit it inline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
