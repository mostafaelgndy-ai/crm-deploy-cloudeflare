import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "amber" | "panel" | "red" | "panel-amber" | "panel-red" | "panel-slate";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  amber: "btn bg-amber text-ink2 hover:brightness-105",
  red: "btn bg-red text-white hover:brightness-110",
  panel: "btn bg-[#212938] border border-[#2A3240] text-[#EDEFF3]",
  "panel-amber": "btn bg-[#212938] border border-[#2A3240] hover:border-amber hover:text-amber text-[#EDEFF3]",
  "panel-red": "btn bg-[#212938] border border-[#2A3240] hover:border-red hover:text-red text-[#EDEFF3]",
  "panel-slate": "btn bg-[#212938] border border-[#2A3240] hover:border-slate2 text-[#EDEFF3]",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

/**
 * Styled button with variants matching the prototype's button styles.
 */
export function Button({
  variant = "panel",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}