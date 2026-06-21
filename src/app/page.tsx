import MagazineCanvas from "@/components/MagazineCanvas";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between border-b border-zinc-200/50 dark:border-zinc-800/50 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black tracking-tighter text-lg">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">SOMA</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Newsletter Designer</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
            Component 1
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
            Active
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12">
        {/* Left Info Panel */}
        <div className="w-full lg:w-5/12 flex flex-col gap-6 text-center lg:text-left">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">
              Magazine Canvas
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto lg:mx-0">
              A premium, high-fidelity canvas component optimized for designing print-quality covers.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-6 shadow-sm space-y-4 text-left">
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
              Canvas Specifications
            </h3>
            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
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
          <MagazineCanvas />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-zinc-400 dark:text-zinc-500 border-t border-zinc-200/50 dark:border-zinc-800/50 mt-auto">
        SOMA Editor • Powered by Next.js & Tailwind CSS
      </footer>
    </div>
  );
}
