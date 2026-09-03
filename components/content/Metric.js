export default function Metric({ value, label }) {
  return (
    <div className="text-center md:text-left">
      <div className="font-display text-5xl md:text-7xl text-primary mb-2">{value}</div>
      <div className="font-body text-xs md:text-sm uppercase tracking-[0.2em] text-muted">{label}</div>
    </div>
  );
}
