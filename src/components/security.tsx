import { Boxes, Fingerprint, Layers, ShieldCheck } from "lucide-react";

export function Security() {
  return (
    <section id="security" className="relative hidden md:block py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-2">
            Architecture
          </p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            <span className="glaze-text-gradient">Built on robust</span>{" "}
            <span className="glaze-text-gradient">infrastructure.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-muted">
            Programmable accounts, sponsored gas, and strict local key isolation.
          </p>
        </div>

        {/* Bento grid */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-6 sm:gap-5">
          {/* Smart Accounts — large */}
          <BentoCard
            className="sm:col-span-4 lg:row-span-2"
            icon={Layers}
            tag="ERC-4337"
            title="Smart Accounts"
            desc="Powered by the Coinbase Developer Platform (CDP) using ERC-4337 programmable wallets."
          >
            <SmartAccountsVisual />
          </BentoCard>

          {/* Gasless UX */}
          <BentoCard
            className="sm:col-span-2"
            icon={ShieldCheck}
            tag="Paymasters"
            title="Gasless UX"
            desc="Sponsored transactions via custom paymasters — never hold ETH to trade again."
          >
            <GaslessVisual />
          </BentoCard>

          {/* macOS Isolation */}
          <BentoCard
            className="sm:col-span-2"
            icon={Fingerprint}
            tag="Local-first"
            title="macOS Isolation"
            desc="Keys never leave your Mac — strictly isolated within the macOS sandbox."
          >
            <IsolationVisual />
          </BentoCard>

          {/* Batching — wide */}
          <BentoCard
            className="sm:col-span-6"
            icon={Boxes}
            tag="UserOperation"
            title="Batching"
            desc="Execute multiple calls in a single signed, gasless transaction."
          >
            <BatchingVisual />
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  icon: Icon,
  tag,
  title,
  desc,
  className = "",
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  title: string;
  desc: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-3xl glaze-glass p-6 transition-colors hover:glaze-glass-strong sm:p-7 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/10 text-foreground">
          <Icon className="size-5" />
        </span>
        <span className="rounded-full border border-border bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-muted-2">
          {tag}
        </span>
      </div>

      <h3 className="mt-5 text-xl font-semibold tracking-tight sm:text-2xl">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{desc}</p>

      {children && <div className="mt-6 flex-1">{children}</div>}
    </div>
  );
}

function SmartAccountsVisual() {
  return (
    <div className="relative h-full min-h-40">
      <img
        src="/config.png"
        alt="Smart Accounts configuration"
        className="h-full w-full rounded-2xl border border-border object-cover"
      />
    </div>
  );
}

function GaslessVisual() {
  return (
    <div className="rounded-2xl border border-border bg-bg-soft/60 p-4">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-2">Gas cost</span>
        <span className="text-muted line-through">$0.42</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted-2">Sponsored</span>
        <span className="font-medium text-positive">$0.00</span>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-full bg-white/20" />
      </div>
      <div className="mt-2 text-[11px] text-muted-2">Paymaster · sponsored</div>
    </div>
  );
}

function IsolationVisual() {
  return (
    <div className="rounded-2xl border border-border bg-bg-soft/60 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-2">
        <Fingerprint className="size-4 text-foreground" />
        macOS Secure Enclave
      </div>
      <div className="mt-3 space-y-2">
        {["Key generation", "Signing", "Biometric unlock"].map((x, i) => (
          <div
            key={x}
            className="flex items-center gap-2 rounded-lg border border-border bg-white/[0.03] px-3 py-2 text-xs"
          >
            <span className="size-1.5 rounded-full bg-positive" />
            <span className="text-foreground/90">{x}</span>
            <span className="ml-auto font-mono text-[10px] text-muted-2">
              {i === 0 ? "on-device" : i === 1 ? "local" : "Touch ID"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BatchingVisual() {
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
      {/* Calls */}
      <div className="space-y-2">
        {["approve(USDC)", "swap(ETH→USDC)", "transfer(@alice)"].map((c, i) => (
          <div
            key={c}
            className="flex items-center gap-2 rounded-lg border border-border bg-white/[0.03] px-3 py-2.5 text-xs"
          >
            <span className="font-mono text-[10px] text-muted-2">{i + 1}</span>
            <span className="font-mono text-foreground/90">{c}</span>
          </div>
        ))}
      </div>

      {/* Arrow */}
      <div className="hidden items-center justify-center sm:flex">
        <span className="inline-flex size-9 items-center justify-center rounded-full border border-border-strong bg-white/10 text-foreground">
          <Boxes className="size-4" />
        </span>
      </div>

      {/* Result */}
      <div className="rounded-2xl border border-border-strong bg-white/[0.05] p-4">
        <div className="text-xs text-muted-2">Single UserOperation</div>
        <div className="mt-1.5 font-mono text-sm text-foreground">
          handleOps([userOp], …)
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px]">
          <span className="text-muted-2">Signed once</span>
          <span className="text-positive">✓ Gasless</span>
        </div>
      </div>
    </div>
  );
}
