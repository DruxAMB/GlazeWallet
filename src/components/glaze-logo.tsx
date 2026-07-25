import Image from "next/image";

export function GlazeLogo({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/app-icon.png"
      alt="GlazeWallet logo"
      width={size}
      height={size}
      priority
      className={`rounded-[28%] ${className}`}
    />
  );
}

export function GlazeWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-semibold tracking-tight ${className}`}>
      Glaze<span className="text-muted">Wallet</span>
    </span>
  );
}
