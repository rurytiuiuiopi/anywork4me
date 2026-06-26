// Deterministic gradient artwork from a seed string — zero image assets, yet
// every provider gets a distinct, premium-looking visual. An optional emoji
// (their category) is layered on top for instant recognition.

function hueFromSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return h;
}

export function Thumb({
  seed,
  emoji,
  className = "",
  rounded = "rounded-2xl",
  emojiClassName = "text-3xl",
}: {
  seed: string;
  emoji?: string;
  className?: string;
  rounded?: string;
  emojiClassName?: string;
}) {
  const h = hueFromSeed(seed);
  const style = {
    backgroundImage: `linear-gradient(135deg, hsl(${h} 72% 56%), hsl(${(h + 42) % 360} 70% 44%))`,
  };
  return (
    <div
      style={style}
      className={`relative flex items-center justify-center overflow-hidden ${rounded} ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.35),transparent_55%)]" />
      {emoji && (
        <span className={`relative drop-shadow-sm ${emojiClassName}`}>{emoji}</span>
      )}
    </div>
  );
}
