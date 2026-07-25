export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Base */}
      <div className="absolute inset-0 bg-bg" />

      {/* Grid */}
      <div className="absolute inset-0 glaze-grid-bg glaze-radial-fade opacity-50" />

      {/* Subtle white glow top center */}
      <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-white/[0.04] blur-[140px] animate-pulse-glow" />

      {/* Soft gray glow left */}
      <div className="absolute top-1/3 -left-40 h-[500px] w-[500px] rounded-full bg-white/[0.02] blur-[150px] animate-float" />

      {/* Soft gray glow right */}
      <div className="absolute top-1/2 -right-40 h-[500px] w-[500px] rounded-full bg-white/[0.02] blur-[150px] animate-float [animation-delay:-3s]" />

      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-bg to-transparent" />

      {/* Top vignette */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bg/80 to-transparent" />
    </div>
  );
}
