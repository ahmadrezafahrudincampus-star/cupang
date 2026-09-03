import clsx from 'clsx';

export default function FishStatus({ status }) {
  const s = status?.toLowerCase() || 'available';
  
  const colors = {
    available: { dot: 'bg-green-500', text: 'text-primary' },
    reserved: { dot: 'bg-amber-500', text: 'text-amber-500' },
    sold: { dot: 'bg-red-500', text: 'text-muted' }
  };

  const style = colors[s] || colors.available;

  return (
    <div className="flex items-center gap-2 font-body text-xs uppercase tracking-wider">
      <span className={clsx("w-1.5 h-1.5 rounded-full", style.dot)} />
      <span className={style.text}>{s}</span>
    </div>
  );
}
