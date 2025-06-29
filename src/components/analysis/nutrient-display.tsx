'use client';

type NutrientDisplayProps = {
  label: string;
  value?: number;
  unit: string;
};

export function NutrientDisplay({ label, value, unit }: NutrientDisplayProps) {
  if (value === undefined || value === null) return null;
  return (
    <div className="flex justify-between text-sm">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">
        {value.toFixed(1)} {unit}
      </p>
    </div>
  );
}
