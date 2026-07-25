import { AtSign, Fingerprint, Rocket } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: AtSign,
    title: "Choose Username",
    desc: "Claim your @username in seconds — no extensions, no seed phrases.",
    visual: <UsernameVisual />,
  },
  {
    n: "02",
    icon: Fingerprint,
    title: "Set Passcode or Touch ID",
    desc: "Secure it with a 6-digit PIN or Touch ID.",
    visual: <PasscodeVisual />,
  },
  {
    n: "03",
    icon: Rocket,
    title: "Start Trading",
    desc: "Your wallet is live. Swap, trade, and discover instantly.",
    visual: <DashboardVisual />,
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
          <p className="mx-auto mt-5 max-w-xl text-pretty text-muted">
            From download to your first trade in under a minute.
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
      <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
    </div>
  );
}

function UsernameVisual() {
  return (
    <div className="rounded-2xl border border-border bg-bg-soft/60 p-4">
      <div className="text-xs text-muted-2">Claim your handle</div>
      <div className="mt-3 flex items-center rounded-xl border border-border-strong bg-white/[0.03] px-3.5 py-3">
        <AtSign className="size-4 text-muted" />
        <span className="ml-2 text-sm font-medium text-foreground">satoshi</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-positive/15 px-2 py-1 text-[11px] font-medium text-positive">
          Available
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-2">
        <span>glaze.id/@satoshi</span>
        <span className="font-mono">3 of 20 left</span>
      </div>
      <div className="mt-4 h-9 rounded-xl bg-white/15" />
    </div>
  );
}

function PasscodeVisual() {
  return (
    <div className="rounded-2xl border border-border bg-bg-soft/60 p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-2">Enter passcode</div>
        <Fingerprint className="size-5 text-foreground" />
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {[true, true, true, false, false, false].map((filled, i) => (
          <span
            key={i}
            className={`size-3 rounded-full ${
              filled ? "bg-foreground" : "bg-white/15"
            }`}
          />
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <div
            key={d}
            className="flex items-center justify-center rounded-lg border border-border bg-white/[0.03] py-2 text-sm text-muted"
          >
            {d}
          </div>
        ))}
        <div className="flex items-center justify-center rounded-lg py-2 text-sm text-muted-2">
          ←
        </div>
        <div className="flex items-center justify-center rounded-lg border border-border bg-white/[0.03] py-2 text-sm text-muted">
          0
        </div>
        <div className="flex items-center justify-center rounded-lg py-2">
          <Fingerprint className="size-4 text-foreground" />
        </div>
      </div>
    </div>
  );
}

function DashboardVisual() {
  return (
    <div className="rounded-2xl border border-border bg-bg-soft/60 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-2">Wallet ready</div>
          <div className="mt-1 text-lg font-semibold text-foreground">
            $48,219.04
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md bg-positive/15 px-2 py-1 text-[11px] font-medium text-positive">
          <span className="size-1.5 rounded-full bg-positive" />
          Live
        </span>
      </div>
      <div className="mt-4 space-y-2">
        {[
          { n: "ETH", v: "$38,104" },
          { n: "USDC", v: "$6,210" },
        ].map((t) => (
          <div
            key={t.n}
            className="flex items-center gap-2.5 rounded-lg border border-border bg-white/[0.03] px-2.5 py-2"
          >
            <div className="size-6 rounded-full bg-white/10" />
            <span className="text-xs font-medium">{t.n}</span>
            <span className="ml-auto text-xs text-muted">{t.v}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <div className="h-8 flex-1 rounded-lg bg-white/15" />
        <div className="h-8 flex-1 rounded-lg border border-border bg-white/[0.03]" />
      </div>
    </div>
  );
}
