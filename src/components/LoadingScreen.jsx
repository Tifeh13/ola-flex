export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <img src="/olaflex-logo.png" alt="OLAFLEX" className="h-24 w-auto mx-auto mb-4 animate-pulse" />
        <div className="inline-block w-6 h-6 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}
