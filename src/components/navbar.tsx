import { Download, VideoIcon } from "lucide-react";
import Link from "next/link";
import { GlazeLogo, GlazeWordmark } from "./glaze-logo";
import { XIcon } from "./x-icon";

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-2xl px-5 sm:px-8 backdrop-blur-md">
        <nav className="mt-4 flex items-center justify-between rounded-full glaze-glass-strong px-4 py-3 sm:px-5">
          {/* Left: logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label="GlazeWallet home"
          >
            <span className="relative">
              <GlazeLogo size={32} className="relative" />
            </span>
            <GlazeWordmark className="text-[15px] sm:text-base" />
          </Link>

          {/* Right: download button */}
            <Link
              href="https://www.glaze.app/go?path=store%2Fc734575e-1b6c-4c9b-8a3a-980d73086f7e"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90 active:scale-[0.98] sm:px-5"
            >
              <Download className="relative size-4" />
              <span className="relative hidden sm:inline">Install</span>
              <span className="relative sm:hidden">Install</span>
            </Link>
        </nav>
      </div>
    </header>
  );
}
