"use client";

import React, { useState, useEffect } from "react";
import { X, Save, FolderOpen, Trash2, Calendar, FileEdit, Clock, CheckCircle } from "lucide-react";
import { 
  SavedDesign, 
  DesignState, 
  getAllDesigns, 
  saveDesign, 
  updateDesign, 
  deleteDesign 
} from "@/lib/storageManager";

interface SaveLoadPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: DesignState;
  activeDesignId: string | null;
  designName: string;
  onDesignLoaded: (id: string, name: string, state: DesignState) => void;
  onDesignSaved: (id: string, name: string) => void;
  lastSavedText: string;
}

export default function SaveLoadPanel({
  isOpen,
  onClose,
  currentState,
  activeDesignId,
  designName,
  onDesignLoaded,
  onDesignSaved,
  lastSavedText,
}: SaveLoadPanelProps) {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [inputName, setInputName] = useState("");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Load designs when opening the panel
  useEffect(() => {
    if (isOpen) {
      setDesigns(getAllDesigns());
      setInputName(activeDesignId ? designName : "");
    }
  }, [isOpen, activeDesignId, designName]);

  const triggerFeedback = (message: string) => {
    setActionFeedback(message);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleSaveNew = () => {
    const trimmed = inputName.trim();
    if (!trimmed) return;
    
    const saved = saveDesign(trimmed, currentState);
    if (saved) {
      onDesignSaved(saved.id, saved.name);
      setDesigns(getAllDesigns());
      triggerFeedback(`Successfully saved "${saved.name}"`);
    }
  };

  const handleUpdateExisting = () => {
    if (!activeDesignId) return;
    const updated = updateDesign(activeDesignId, currentState);
    if (updated) {
      onDesignSaved(updated.id, updated.name);
      setDesigns(getAllDesigns());
      triggerFeedback(`Updated "${updated.name}"`);
    }
  };

  const handleLoad = (design: SavedDesign) => {
    onDesignLoaded(design.id, design.name, design.data);
    triggerFeedback(`Loaded "${design.name}"`);
    onClose();
  };

  const handleDelete = (id: string) => {
    const designToDelete = designs.find(d => d.id === id);
    if (!designToDelete) return;

    if (confirm(`Are you sure you want to delete "${designToDelete.name}"?`)) {
      deleteDesign(id);
      setDesigns(getAllDesigns());
      if (id === activeDesignId) {
        onDesignSaved("", ""); // Reset current active ID/name since it was deleted
      }
      triggerFeedback(`Deleted "${designToDelete.name}"`);
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown Date";
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-150 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              Manage Designs
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Save your current cover design or load and switch between existing templates.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-350 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert Pill */}
        {actionFeedback && (
          <div className="mx-6 mt-4 p-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-450 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            {actionFeedback}
          </div>
        )}

        {/* Modal Body: Split layout */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
          
          {/* Left Column: Save Settings */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Save Design
            </h4>

            {/* Current Loaded State info */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950/30 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl space-y-2">
              <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider">
                Current Workspace
              </div>
              <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <FileEdit className="w-4 h-4 text-indigo-500" />
                {activeDesignId ? designName : "New Unsaved Cover"}
              </div>
              
              {/* Last Saved details */}
              {lastSavedText && (
                <div className="text-[10px] text-zinc-500 dark:text-zinc-455 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {lastSavedText}
                </div>
              )}
            </div>

            {/* Save Form */}
            <div className="space-y-3 pt-2">
              <div>
                <label htmlFor="design-save-name" className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Design Name
                </label>
                <input
                  id="design-save-name"
                  type="text"
                  placeholder="Enter design name..."
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-2 pt-1">
                {activeDesignId && activeDesignId !== "autosave" && (
                  <button
                    onClick={handleUpdateExisting}
                    disabled={!inputName.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-98"
                  >
                    <Save className="w-4 h-4" />
                    Update Loaded Design
                  </button>
                )}
                
                <button
                  onClick={handleSaveNew}
                  disabled={!inputName.trim()}
                  className={`
                    w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-98
                    ${activeDesignId && activeDesignId !== "autosave"
                      ? "border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }
                  `}
                >
                  <Save className="w-4 h-4" />
                  Save as New Design
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Designs List */}
          <div className="md:col-span-3 space-y-4 flex flex-col min-h-[300px]">
            <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Saved Designs ({designs.length})
            </h4>

            {designs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 border border-dashed border-zinc-200 dark:border-zinc-800/80">
                <FolderOpen className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-2" />
                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  No saved designs
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-505 max-w-[200px]">
                  Saved templates will appear here, allowing you to reload them at any time.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[45vh]">
                {designs.map((design) => {
                  const isActive = design.id === activeDesignId;
                  const isAutosave = design.id === "autosave";

                  return (
                    <div
                      key={design.id}
                      className={`
                        p-3.5 border rounded-xl flex items-center justify-between gap-4 transition-all duration-200
                        ${isActive
                          ? "bg-indigo-50/45 dark:bg-indigo-950/10 border-indigo-200 dark:border-indigo-900/60 shadow-xs"
                          : isAutosave
                          ? "bg-amber-50/20 dark:bg-amber-950/5 border-amber-200/50 dark:border-amber-950/30"
                          : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700"
                        }
                      `}
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span 
                            title={design.name}
                            className={`
                              text-sm font-semibold truncate block max-w-[160px] sm:max-w-[200px]
                              ${isActive 
                                ? "text-indigo-700 dark:text-indigo-400" 
                                : isAutosave 
                                ? "text-amber-700 dark:text-amber-450 italic" 
                                : "text-zinc-800 dark:text-zinc-200"
                              }
                            `}
                          >
                            {design.name}
                          </span>
                          {isActive && (
                            <span className="inline-flex items-center px-1.5 py-0.2 bg-indigo-150 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-full text-[9px] font-bold uppercase tracking-wider">
                              Editing
                            </span>
                          )}
                          {isAutosave && (
                            <span className="inline-flex items-center px-1.5 py-0.2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-[9px] font-bold uppercase tracking-wider">
                              Autosave
                            </span>
                          )}
                        </div>
                        
                        {/* Dates row */}
                        <div className="flex items-center gap-2.5 text-[9px] text-zinc-400 dark:text-zinc-550 uppercase font-semibold">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-zinc-400" />
                            {formatDate(design.updatedAt)}
                          </span>
                        </div>
                      </div>

                      {/* Item Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleLoad(design)}
                          title="Load Design"
                          className="flex items-center gap-1 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-350 hover:text-zinc-900 dark:hover:text-zinc-150 rounded-lg text-xs font-bold transition-all"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                          Load
                        </button>
                        
                        {/* Prevent deleting autosave with confirmation or let it be deleted easily */}
                        <button
                          onClick={() => handleDelete(design.id)}
                          title="Delete Design"
                          className="p-1.5 text-zinc-400 hover:text-rose-600 dark:text-zinc-505 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
