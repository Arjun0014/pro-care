export function InkVeil({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none z-[1] ${className}`}
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(11,18,32,0) 0%, rgba(11,18,32,0.35) 60%, rgba(11,18,32,0.55) 100%)',
      }}
      aria-hidden="true"
    />
  );
}
