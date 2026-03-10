export function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="border border-border p-4">
      <p className="text-lg font-medium text-primary">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
