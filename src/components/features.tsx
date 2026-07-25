import { ArrowRight, Compass, Repeat2, TrendingUp } from "lucide-react";

const features = [
  {
    tag: "SWAP",
    icon: Repeat2,
    title: "Seamless, instant token exchanges.",
    desc: "Route through the best prices across DEXs in a single tap.",
    bullets: ["Auto-optimized routing", "0% swap fee on launch", "One-tap execution"],
    visual: <SwapVisual />,
  },
  {
    tag: "TRADE",
    icon: TrendingUp,
    title: "High-performance market execution.",
    desc: "A pro-grade terminal with real-time order books and deep liquidity.",
    bullets: ["Limit & market orders", "Real-time order books", "Sub-second execution"],
    visual: <TradeVisual />,
  },
  {
    tag: "DISCOVER",
    icon: Compass,
    title: "Find new tokens directly in the terminal.",
    desc: "Explore trending tokens and fresh launches without leaving the app.",
    bullets: ["Trending on Base", "Built-in token profiles", "One-click research"],
    visual: <DiscoverVisual />,
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-2">
            Capabilities
          </p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            <span className="glaze-text-gradient">Everything you need.</span>{" "}
            <span className="glaze-text-gradient">Nothing you don&apos;t.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-muted">
            A focused toolkit for the modern on-chain trader.
          </p>
        </div>

        {/* Zig-zag rows */}
        <div className="mt-20 flex flex-col gap-24 sm:gap-32">
          {features.map((f, i) => (
            <FeatureRow key={f.tag} {...f} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureRow({
  tag,
  icon: Icon,
  title,
  desc,
  bullets,
  visual,
  reverse,
}: {
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  bullets: string[];
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Copy */}
      <div className={reverse ? "lg:order-2" : ""}>
        <div className="inline-flex items-center gap-2 rounded-full glaze-glass px-3 py-1.5 text-xs font-medium text-foreground">
          <Icon className="size-3.5" />
          {tag}
        </div>
        <h3 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="glaze-text-gradient">{title}</span>
        </h3>
        <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted">
          {desc}
        </p>
        <ul className="mt-6 space-y-2.5">
          {bullets.map((b) => (
            <li key={b} className="flex items-center gap-2.5 text-sm text-foreground/90">
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-white/10 text-foreground">
                <ArrowRight className="size-3" />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Visual placeholder */}
      <div className={reverse ? "lg:order-1" : ""}>
        <div className="group relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-white/[0.03] blur-2xl opacity-60 transition-opacity group-hover:opacity-90" />
          <div className="relative overflow-hidden rounded-2xl glaze-glass-strong p-2">
            {/* Placeholder label for future high-fidelity mockups */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-bg-soft">
              {visual}
              <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-bg/70 px-2 py-1 font-mono text-[10px] text-muted-2 backdrop-blur">
                mockup · {tag.toLowerCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SwapVisual() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
      <div className="w-full max-w-xs space-y-2">
        <div className="flex items-center justify-between rounded-xl border border-border bg-white/[0.03] px-4 py-3">
          <span className="flex items-center gap-2 text-sm">
            <span className="size-6 rounded-full bg-white/10" />
            ETH
          </span>
          <span className="font-mono text-sm text-muted">1.5</span>
        </div>
        <div className="flex justify-center">
          <span className="inline-flex size-7 items-center justify-center rounded-full border border-border-strong bg-bg text-foreground">
            <Repeat2 className="size-3.5" />
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-border-strong bg-white/[0.06] px-4 py-3">
          <span className="flex items-center gap-2 text-sm">
            <span className="size-6 rounded-full bg-white/10" />
            USDC
          </span>
          <span className="font-mono text-sm">5,742.18</span>
        </div>
        <div className="mt-2 h-9 rounded-xl bg-white/15" />
      </div>
    </div>
  );
}

function TradeVisual() {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center justify-between text-xs text-muted-2">
        <span>ETH/USDC</span>
        <span className="text-positive">+3.2%</span>
      </div>
      {/* Fake candlestick chart */}
      <div className="mt-3 flex flex-1 items-end gap-1.5">
        {[40, 55, 48, 62, 50, 70, 65, 80, 72, 88, 76, 92].map((h, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-sm bg-white/20"
              style={{ height: `${h}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 text-center text-[10px] text-muted-2">
        {["1m", "5m", "1H", "1D"].map((t, i) => (
          <div
            key={t}
            className={`rounded-md py-1 ${
              i === 2 ? "bg-white/10 text-foreground" : "bg-white/[0.03]"
            }`}
          >
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

function DiscoverVisual() {
  return (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="text-xs text-muted-2">Trending on Base</div>
      {[
        { n: "DEGEN", v: "+18.4%" },
        { n: "HIGHER", v: "+12.1%" },
        { n: "BRETT", v: "+9.7%" },
        { n: "FCAST", v: "+6.3%" },
      ].map((t) => (
        <div
          key={t.n}
          className="flex items-center gap-3 rounded-lg border border-border bg-white/[0.03] px-3 py-2.5"
        >
          <div className="size-7 rounded-full bg-white/10" />
          <div className="flex-1">
            <div className="text-sm font-medium">{t.n}</div>
            <div className="text-[11px] text-muted-2">Base · 0x4a…f21c</div>
          </div>
          <span className="text-xs font-medium text-positive">{t.v}</span>
        </div>
      ))}
    </div>
  );
}
