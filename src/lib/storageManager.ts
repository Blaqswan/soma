import { HeroHeaderData } from "@/lib/htmlGenerator";
import { TextSectionData } from "@/lib/htmlGenerator";

export interface DesignState {
  backgroundImage: string | null;
  heroHeader: HeroHeaderData;
  sections: TextSectionData[];
}

export interface SavedDesign {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  data: DesignState;
}

const STORAGE_KEY = "soma_designs";

// SSR helper to safely inspect localStorage
const isBrowser = typeof window !== "undefined";

export function getAllDesigns(): SavedDesign[] {
  if (!isBrowser) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedDesign[];
    // Sort designs by update timestamp descending
    return parsed.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch (err) {
    console.error("Failed to parse SOMA designs from localStorage:", err);
    return [];
  }
}

export function loadDesign(id: string): SavedDesign | null {
  const designs = getAllDesigns();
  return designs.find((d) => d.id === id) || null;
}

export function saveDesign(name: string, state: DesignState): SavedDesign | null {
  if (!isBrowser) return null;
  
  const designs = getAllDesigns();
  const timeStr = new Date().toISOString();
  
  const newDesign: SavedDesign = {
    id: Date.now().toString(),
    name: name.trim() || "Untitled Design",
    createdAt: timeStr,
    updatedAt: timeStr,
    data: {
      backgroundImage: state.backgroundImage,
      heroHeader: JSON.parse(JSON.stringify(state.heroHeader)),
      sections: JSON.parse(JSON.stringify(state.sections)),
    },
  };

  // Push design to storage
  designs.push(newDesign);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
    return newDesign;
  } catch (err) {
    console.error("Failed to save SOMA design to localStorage:", err);
    return null;
  }
}

export function updateDesign(id: string, state: DesignState): SavedDesign | null {
  if (!isBrowser) return null;

  const designs = getAllDesigns();
  const designIndex = designs.findIndex((d) => d.id === id);
  if (designIndex === -1) return null;

  const current = designs[designIndex];
  const updatedDesign: SavedDesign = {
    ...current,
    updatedAt: new Date().toISOString(),
    data: {
      backgroundImage: state.backgroundImage,
      heroHeader: JSON.parse(JSON.stringify(state.heroHeader)),
      sections: JSON.parse(JSON.stringify(state.sections)),
    },
  };

  designs[designIndex] = updatedDesign;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
    return updatedDesign;
  } catch (err) {
    console.error("Failed to update SOMA design in localStorage:", err);
    return null;
  }
}

export function deleteDesign(id: string): void {
  if (!isBrowser) return;

  const designs = getAllDesigns();
  const filtered = designs.filter((d) => d.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("Failed to delete SOMA design from localStorage:", err);
  }
}

// Special handler for auto-saving drafts (creates or updates slot "autosave")
export function autoSaveDraft(state: DesignState): SavedDesign | null {
  if (!isBrowser) return null;

  const designs = getAllDesigns();
  const autoSaveIndex = designs.findIndex((d) => d.id === "autosave");
  const timeStr = new Date().toISOString();

  const draftData: DesignState = {
    backgroundImage: state.backgroundImage,
    heroHeader: JSON.parse(JSON.stringify(state.heroHeader)),
    sections: JSON.parse(JSON.stringify(state.sections)),
  };

  if (autoSaveIndex === -1) {
    // Create new autosave slot
    const newDraft: SavedDesign = {
      id: "autosave",
      name: "Auto-saved Draft",
      createdAt: timeStr,
      updatedAt: timeStr,
      data: draftData,
    };
    designs.push(newDraft);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
      return newDraft;
    } catch (err) {
      console.error("Failed to write SOMA auto-save draft:", err);
      return null;
    }
  } else {
    // Update existing autosave slot
    const current = designs[autoSaveIndex];
    const updatedDraft: SavedDesign = {
      ...current,
      updatedAt: timeStr,
      data: draftData,
    };
    designs[autoSaveIndex] = updatedDraft;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
      return updatedDraft;
    } catch (err) {
      console.error("Failed to update SOMA auto-save draft:", err);
      return null;
    }
  }
}
