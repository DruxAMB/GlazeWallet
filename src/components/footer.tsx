import { Download } from "lucide-react";
import Link from "next/link";
import { GlazeLogo, GlazeWordmark } from "./glaze-logo";
import { XIcon } from "./x-icon";

export function Footer() {
  return (
    <footer className="relative mt-12 border-t border-border">
      {/* Final CTA */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative my-20 overflow-hidden rounded-3xl glaze-glass-strong p-10 text-center sm:p-16">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/[0.06] blur-[120px]" />
          <div className="relative">
            <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              <span className="glaze-text-gradient">What will you trade?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-pretty text-muted">
              Install GlazeWallet and trade from your Mac in under a minute.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="https://www.glaze.app/go?path=store%2Fc734575e-1b6c-4c9b-8a3a-980d73086f7e"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90 active:scale-[0.98] sm:w-auto"
              >
                <Download className="size-4" />
                <span>Install for macOS</span>
              </Link>
              <Link
                href="https://x.com/GlazeWallet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full glaze-glass px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:glaze-glass-strong sm:w-auto"
              >
                <XIcon className="size-4" />
                Follow @GlazeWallet
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-2">
              macOS 14+ · Apple Silicon
            </p>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-6 border-t border-border py-8 sm:flex-row">
          <Link href="/" className="flex items-center gap-2.5">
            <GlazeLogo size={28} />
            <GlazeWordmark className="text-sm" />
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
            <Link href="#features" className="transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#security" className="transition-colors hover:text-foreground">
              Security
            </Link>
            <Link href="#faq" className="transition-colors hover:text-foreground">
              FAQ
            </Link>
            <Link
              href="https://x.com/GlazeWallet"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              @GlazeWallet
            </Link>
          </nav>

          <p className="text-xs text-muted-2">
            © {new Date().getFullYear()} GlazeWallet. Built for macOS.
          </p>
        </div>
      </div>
    </footer>
  );
}
