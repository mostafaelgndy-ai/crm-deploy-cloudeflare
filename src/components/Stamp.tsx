/**
 * Status stamp badge — rotated, bordered, mono font.
 * The color is passed via the `color` prop and applied via inline style.
 */
export function Stamp({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  return (
    <span className="stamp shrink-0" style={{ color }}>
      {label}
    </span>
  );
}