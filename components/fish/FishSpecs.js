export default function FishSpecs({ fish }) {
  const specs = [
    { label: 'Species', value: fish.species },
    { label: 'Type', value: fish.type },
    { label: 'Gender', value: fish.gender },
    { label: 'Color', value: fish.color },
    { label: 'Pattern', value: fish.pattern },
    { label: 'Size', value: fish.size },
    { label: 'Grade', value: fish.grade },
    { label: 'Bloodline', value: fish.bloodline },
    { label: 'Origin', value: fish.origin }
  ].filter(spec => spec.value);

  return (
    <div className="border border-white/[0.08] bg-surface-container-lowest p-6">
      <h3 className="font-display text-xl text-primary mb-6">Specifications</h3>
      <div className="flex flex-col">
        {specs.map((spec, index) => (
          <div 
            key={spec.label} 
            className={`grid grid-cols-3 py-3 ${index !== specs.length - 1 ? 'border-b border-white/[0.08]' : ''}`}
          >
            <span className="col-span-1 font-body text-xs uppercase tracking-wider text-muted flex items-center">
              {spec.label}
            </span>
            <span className="col-span-2 font-body text-on-surface">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
