"use client";

import { useEffect, type ReactNode } from "react";

interface ModalProps {
  /** Content inside the modal panel. */
  children: ReactNode;
  /** Called when the user presses ESC or clicks the backdrop. */
  onClose: () => void;
}

/**
 * Modal dialog with backdrop, ESC-to-close, and click-outside-to-close.
 * Uses fixed positioning (no portal needed).
 */
export function Modal({ children, onClose }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="panel-card w-full max-w-lg p-6 rise-in"
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}