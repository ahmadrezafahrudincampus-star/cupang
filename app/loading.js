export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-surface-container-high border-t-primary rounded-full animate-spin"></div>
        <div className="h-4 w-32 bg-surface-container-highest rounded animate-pulse"></div>
      </div>
    </div>
  );
}
