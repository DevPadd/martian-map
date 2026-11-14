type MapStatusProps = {
  status: string;
};

export default function MapStatus({ status }: MapStatusProps) {
  return (
    <div className="absolute bottom-4 left-4 z-10 border border-red-500/40 bg-black/80 px-4 py-2 text-xs text-red-500">
      <p>{status}</p>
    </div>
  );
}
