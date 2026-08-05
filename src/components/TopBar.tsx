import type { ReactNode } from "react";

/**
 * Sticky header with OD logo, context label, and a right slot for actions.
 */
export function TopBar({
  context,
  right,
}: {
  context: string;
  right?: ReactNode;
}) {
  return (
    <header className="border-b border-[#2A3240] bg-[#14181F]/95 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-amber text-ink2 flex items-center justify-center font-mono font-bold text-sm rotate-[-4deg]">
            OD
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold tracking-tight text-[15px] text-[#EDEFF3]">
              OPS<span className="text-amber">/</span>DESK
            </div>
            <div className="text-[10px] font-mono tracking-widest text-muted uppercase">
              {context}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">{right}</div>
      </div>
    </header>
  );
}