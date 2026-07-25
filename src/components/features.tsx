import { ArrowRight, Compass, Repeat2, TrendingUp } from "lucide-react";
import Image from "next/image";

const features = [
  {
    tag: "SWAP",
    icon: Repeat2,
    title: "Seamless, instant token exchanges.",
    desc: "Route through the best prices across DEXs in a single tap.",
    bullets: ["Auto-optimized routing", "0% swap fee on launch", "One-tap execution"],
    image: "/swap.png",
  },
  {
    tag: "TRADE",
    icon: TrendingUp,
    title: "High-performance market execution.",
    desc: "A pro-grade terminal with real-time order books and deep liquidity.",
    bullets: ["Limit & market orders", "Real-time order books", "Sub-second execution"],
    image: "/trading.png",
  },
  {
    tag: "DISCOVER",
    icon: Compass,
    title: "Find new tokens directly in the terminal.",
    desc: "Explore trending tokens and fresh launches without leaving the app.",
    bullets: ["Trending on Base", "Built-in token profiles", "One-click research"],
    image: "/trending.png",
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
  image,
  reverse,
}: {
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  bullets: string[];
  image: string;
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

      {/* Visual */}
      <div className={reverse ? "lg:order-1" : ""}>
        <div className="group relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-white/[0.03] blur-2xl opacity-60 transition-opacity group-hover:opacity-90" />
          <div className="relative overflow-hidden rounded-2xl glaze-glass-strong p-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-bg-soft">
              <Image
                src={image}
                alt={`${tag} mockup`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
