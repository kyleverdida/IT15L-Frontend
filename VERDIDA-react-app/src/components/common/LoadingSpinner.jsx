export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-red-800/25 border-t-red-800" />
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  );
}
