import Link from "next/link";
import type { ReactNode } from "react";

interface StubCardProps {
  /** Strip color (status color or amber/red for projects). */
  stripColor: string;
  /** If true, the card is greyed out and non-clickable. */
  closed?: boolean;
  /** If provided and not closed, the card links to this href. */
  href?: string;
  /** Card content (inside the paper area). */
  children: ReactNode;
}

/**
 * Reusable ticket-stub style card wrapper.
 * Renders the colored strip, dashed divider, and content area.
 * When `closed` is true, the card is non-clickable and greyed out.
 */
export function StubCard({ stripColor, closed = false, href, children }: StubCardProps) {
  const clickable = !closed && !!href;
  const className = `stub-card ${closed ? "closed-card" : ""} group ${clickable ? "cursor-pointer" : "cursor-not-allowed"} rise-in`;

  const inner = (
    <>
      <div className="stub-strip" style={{ background: stripColor }} />
      <div className="stub-divider" />
      <div className="flex-1 p-5 text-ink2 min-w-0">{children}</div>
    </>
  );

  if (clickable && href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return <div className={className}>{inner}</div>;
}