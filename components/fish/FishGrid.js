import FishCard from './FishCard';

export default function FishGrid({ fish = [], emptyMessage = "No fish found." }) {
  if (!fish || fish.length === 0) {
    return (
      <div className="py-20 text-center border border-dashed border-white/[0.08] bg-surface-container-lowest">
        <p className="font-body text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
      {fish.map((item) => (
        <FishCard key={item.id || item.slug} fish={item} />
      ))}
    </div>
  );
}
