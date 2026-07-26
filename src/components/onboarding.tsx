import Image from "next/image";
import { AtSign, Fingerprint, Rocket } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: AtSign,
    title: "Choose Username",
    desc: "Claim your @username in seconds — no extensions, no seed phrases.",
    visual: (
      <div className="relative rounded-2xl border border-border overflow-hidden">
        <Image
          src="/username.png"
          alt="Choose your username"
          width={400}
          height={300}
          className="w-full"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
    ),
  },
  {
    n: "02",
    icon: Fingerprint,
    title: "Set Passcode or Touch ID",
    desc: "Secure it with a 6-digit PIN or Touch ID.",
    visual: (
      <div className="relative rounded-2xl border border-border overflow-hidden">
        <Image
          src="/passcode.png"
          alt="Set passcode or Touch ID"
          width={400}
          height={300}
          className="w-full"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
    ),
  },
  {
    n: "03",
    icon: Rocket,
    title: "Start Trading",
    desc: "Your wallet is live. Swap, trade, and discover instantly.",
    visual: (
      <div className="relative rounded-2xl border border-border overflow-hidden">
        <Image
          src="/wallet.png"
          alt="Wallet ready to trade"
          width={400}
          height={300}
          className="w-full"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
    ),
  },
];

export function Onboarding() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-2">
            Onboarding
          </p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            <span className="glaze-text-gradient">Zero Seed Phrases.</span>{" "}
            <span className="glaze-text-gradient">Zero Friction.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-muted text-sm md:text-base">
            From installation to your first trade in under a minute.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.n} className="relative">
              {/* Connector */}
              {i < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-full hidden h-12 w-px -translate-x-1/2 bg-gradient-to-b from-border-strong to-transparent lg:block"
                />
              )}
              <StepCard {...step} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  n,
  icon: Icon,
  title,
  desc,
  visual,
}: {
  n: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  visual: React.ReactNode;
}) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl glaze-glass p-6 transition-colors hover:glaze-glass-strong">
      <div className="flex items-center justify-between">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/10 text-foreground">
          <Icon className="size-5" />
        </span>
        <span className="font-mono text-xs text-muted-2">{n}</span>
      </div>

      {/* Visual */}
      <div className="mt-6 flex-1">{visual}</div>

      <h3 className="mt-6 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted">{desc}</p>
    </div>
  );
}

