import { ArrowRight, Download, Play, Video, VideoIcon } from "lucide-react";
import Link from "next/link";
import { XIcon } from "./x-icon";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative pt-40 sm:pt-48 pb-24 sm:pb-32">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 text-center">
        {/* Eyebrow pill */}
        <div className="animate-rise flex justify-center">
          <Link
            href="#security"
            className="group inline-flex items-center gap-2 rounded-full glaze-glass px-3.5 py-1.5 text-xs text-muted transition-colors hover:text-foreground"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-foreground">
              New
            </span>
            <span>ERC-4337 smart accounts, now native on macOS</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Headline */}
        <h1
          className="animate-rise [animation-delay:80ms] mt-7 text-balance text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl lg:text-[5.5rem]"
        >
          <span className="glaze-text-gradient">Your Favorite</span>
          <br />
          <span className="text-foreground">Desktop Wallet</span>
        </h1>

        {/* Subtext */}
        <p
          className="animate-rise [animation-delay:160ms] mx-auto mt-7 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
        >
          Manage, trade, and view your crypto
          without the friction of browser extensions. Execute transactions
          instantly with just your{" "}
          <span className="text-foreground font-medium">@username</span>.
        </p>

        {/* CTAs */}
        <div
          className="animate-rise [animation-delay:240ms] mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          id="download"
        >
          <Link
            href="#download"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90 active:scale-[0.98] sm:w-auto"
          >
            <Download className="size-4" />
            <span>Download for macOS</span>
          </Link>

          <Link
            href="https://x.com/GlazeWallet"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full glaze-glass px-6 py-3.5 text-sm font-medium text-foreground transition-colors hover:glaze-glass-strong sm:w-auto"
          >
            <Play className="size-4" />
            <span>Demo</span>
          </Link>
        </div>

        {/* Platform clarity */}
        <p className="animate-rise [animation-delay:300ms] mt-4 text-xs text-muted-2">
          macOS 14+ · Apple Silicon
        </p>

        {/* Trust line */}
        <div
          className="animate-rise [animation-delay:320ms] mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-2"
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-white/40" />
            No seed phrases
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-white/40" />
            Gasless transactions
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-white/40" />
            Built on CDP
          </span>
        </div>
      </div>

      {/* Hero visual: liquid-glass app window mockup */}
      <div className="animate-rise [animation-delay:400ms] mx-auto mt-20 max-w-5xl px-5 sm:px-8 backdrop-blur-md">
        <Image src="/hero-image.png" alt="GlazeWallet hero" width={1200} height={800} className="w-full h-auto rounded-2xl" />
      </div>
    </section>
  );
}

